import { onMessage } from "./messaging";
chrome.runtime.onInstalled.addListener(() => chrome.storage.local.set({ installed: true }));
chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.id) return;
  await chrome.windows.create({ url: chrome.runtime.getURL(`ui/devtools.html?tabId=${tab.id}`), type: "popup", width: 1200, height: 800 });
});
onMessage(async (message) => {
  if (message.type === "active-tab") return (await chrome.tabs.query({ active: true, currentWindow: true }))[0];
  if (message.type === "page-info") return chrome.tabs.sendMessage(Number(message.payload), { type: "collect" });
  return null;
});
