import { send } from "./messaging";
export async function inspectTab(tabId: number) { return send("page-info", tabId); }
export function getTabId() { return Number(new URLSearchParams(location.search).get("tabId")); }
async function boot() {
  const output = document.querySelector<HTMLPreElement>("#output");
  const tree = document.querySelector<HTMLElement>("#element-tree");
  if (!output || !tree) return;
  try {
    const data = await inspectTab(getTabId());
    output.textContent = JSON.stringify(data, null, 2);
    const items = Array.isArray((data as { elements?: unknown[] }).elements) ? (data as { elements: { tag: string; id: string; className: string }[] }).elements : [];
    tree.replaceChildren(...items.map(item => { const el = document.createElement("div"); el.textContent = `<${item.tag}${item.id ? `#${item.id}` : ""}${item.className ? `.${String(item.className).split(/\s+/).filter(Boolean).join(".")}` : ""}>`; return el; }));
  } catch (error) { output.textContent = `Unable to inspect this page: ${String(error)}`; }
}
if (typeof document !== "undefined") void boot();
