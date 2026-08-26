import { onMessage } from "./messaging";

type NetEntry = { url: string; method: string; status: number; type: string; time: number; error?: string };
const network = new Map<number, NetEntry[]>();
const CONTEXT_MENU_ID = "inspect-with-devtoolsub";

function addNetwork(tabId: number, entry: NetEntry) {
  const entries = network.get(tabId) ?? [];
  entries.push(entry);
  if (entries.length > 500) entries.shift();
  network.set(tabId, entries);
}

chrome.webRequest.onCompleted.addListener(
  d => addNetwork(d.tabId, { url: d.url, method: d.method, status: d.statusCode, type: d.type, time: Date.now() }),
  { urls: ["http://*/*", "https://*/*"] }
);
chrome.webRequest.onErrorOccurred.addListener(
  d => addNetwork(d.tabId, { url: d.url, method: d.method, status: 0, type: d.type, time: Date.now(), error: d.error }),
  { urls: ["http://*/*", "https://*/*"] }
);

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ installed: true, version: chrome.runtime.getManifest().version });
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: CONTEXT_MENU_ID,
      title: "Inspect with DevToolsUB",
      contexts: ["all"]
    });
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId !== CONTEXT_MENU_ID || !tab?.id) return;

  // The content script remembers the element that received the context-menu event.
  const selected = await page(tab.id, { type: "context-select" });
  await chrome.storage.local.set({
    contextSelection: selected,
    contextTabId: tab.id
  });

  await chrome.windows.create({
    url: chrome.runtime.getURL(`dist/ui/devtools.html?tabId=${tab.id}`),
    type: "popup",
    width: 1400,
    height: 900,
    focused: true
  });
});

chrome.action.onClicked.addListener(async tab => {
  if (!tab.id) return;
  await chrome.windows.create({
    url: chrome.runtime.getURL(`dist/ui/devtools.html?tabId=${tab.id}`),
    type: "popup",
    width: 1400,
    height: 900,
    focused: true
  });
});

async function page(tabId: number, message: unknown) {
  try {
    return await chrome.tabs.sendMessage(tabId, message);
  } catch {
    try {
      await chrome.scripting.executeScript({ target: { tabId }, files: ["dist/content.js"] });
      return await chrome.tabs.sendMessage(tabId, message);
    } catch (error) {
      return { error: String(error) };
    }
  }
}

async function hookConsole(tabId: number) {
  try {
    await chrome.scripting.executeScript({
      target: { tabId },
      world: "MAIN",
      func: () => {
        const w = window as any;
        if (w.__DEVTOOLSUB_HOOKED) return;
        w.__DEVTOOLSUB_HOOKED = true;
        w.__DEVTOOLSUB_CONSOLE = [];
        for (const level of ["log", "info", "warn", "error", "debug"]) {
          const original = (console as any)[level];
          (console as any)[level] = (...args: any[]) => {
            w.__DEVTOOLSUB_CONSOLE.push({ level, args: args.map(x => { try { return typeof x === "string" ? x : JSON.parse(JSON.stringify(x)); } catch { return String(x); } }), time: Date.now() });
            if (w.__DEVTOOLSUB_CONSOLE.length > 300) w.__DEVTOOLSUB_CONSOLE.shift();
            original.apply(console, args);
          };
        }
      }
    });
    return true;
  } catch { return false; }
}

async function readConsole(tabId: number) {
  try {
    const result = await chrome.scripting.executeScript({ target: { tabId }, world: "MAIN", func: () => (window as any).__DEVTOOLSUB_CONSOLE ?? [] });
    return result[0]?.result ?? [];
  } catch (error) { return [{ level: "error", args: [String(error)] }]; }
}

onMessage(async message => {
  if (message.type === "active-tab") return (await chrome.tabs.query({ active: true, currentWindow: true }))[0];
  if (message.type === "page-info") return page(Number(message.payload), { type: "collect" });
  if (message.type === "inspect") return page(Number(message.tabId), { type: "select", payload: Number(message.index) });
  if (message.type === "context-selection") return (await chrome.storage.local.get("contextSelection")).contextSelection ?? null;
  if (message.type === "computed") return page(Number(message.tabId), { type: "computed" });
  if (message.type === "layout") return page(Number(message.tabId), { type: "layout" });
  if (message.type === "hover") return page(Number(message.tabId), { type: "hover", payload: Boolean(message.enabled) });
  if (message.type === "add-class") return page(Number(message.tabId), { type: "add-class", payload: String(message.name) });
  if (message.type === "add-style") return page(Number(message.tabId), { type: "add-style", payload: message.payload });
  if (message.type === "network") return network.get(Number(message.tabId)) ?? [];
  if (message.type === "console-install") return hookConsole(Number(message.tabId));
  if (message.type === "console-read") return readConsole(Number(message.tabId));
  return null;
});
