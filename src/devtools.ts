import { send } from "./messaging";

type PageData = { title?: string; url?: string; elements?: { tag: string; id: string; className: string; text: string }[]; [key: string]: unknown };
const tabId = Number(new URLSearchParams(location.search).get("tabId"));
const output = document.querySelector<HTMLPreElement>("#output");
const tree = document.querySelector<HTMLElement>("#element-tree");
let page: PageData = {};

async function refresh() {
  if (!tabId || !output || !tree) return;
  try {
    page = await send<PageData>("page-info", tabId);
    output.textContent = JSON.stringify(page, null, 2);
    const elements = page.elements || [];
    tree.replaceChildren(...elements.map((item, index) => {
      const node = document.createElement("button");
      node.className = "tree-node";
      node.textContent = `${"  ".repeat(Math.min(index, 8))}<${item.tag}${item.id ? `#${item.id}` : ""}${item.className ? `.${item.className.split(/\s+/).filter(Boolean).join(".")}` : ""}>`;
      node.onclick = () => { output.textContent = JSON.stringify(item, null, 2); };
      return node;
    }));
  } catch (error) { output!.textContent = `Unable to inspect this page: ${String(error)}`; }
}

document.querySelectorAll<HTMLButtonElement>("#main-tabs button").forEach((button) => button.onclick = () => {
  const panel = button.dataset.panel || "";
  output!.textContent = JSON.stringify(panel === "security" ? securityView(page) : page[panel] ?? page, null, 2);
});
document.querySelectorAll<HTMLButtonElement>("#sub-tabs button").forEach((button) => button.onclick = () => {
  const name = button.dataset.sub || "";
  output!.textContent = JSON.stringify(name === "computed" ? computedView() : name === "layout" ? layoutView() : name === "styles" ? stylesView() : eventsView(), null, 2);
});
document.querySelector("#hov")?.addEventListener("click", () => output!.textContent = "Pseudo-state controls are available for authorized pages through the inspector connection.");
document.querySelector("#cls")?.addEventListener("click", () => output!.textContent = "Class editor ready. Select an inspected element to edit its class list.");
document.querySelector("#add")?.addEventListener("click", () => output!.textContent = "Add CSS rule: select an element, then add a property/value pair.");
document.querySelector("#color")?.addEventListener("click", () => output!.textContent = "Color editor ready.");
function stylesView() { return { stylesheets: page.stylesheets, note: "Stylesheet URLs are shown when exposed by the page." }; }
function computedView() { return { note: "Computed styles are populated when an element is selected." }; }
function layoutView() { return { viewport: page.viewport, note: "Select an element for box-model data." }; }
function eventsView() { return { note: "Event listener inspection requires a selected element and supported browser APIs." }; }
function securityView(data: PageData) { return { https: (data.security as any)?.https ?? false, mixedContent: (data.security as any)?.mixedContent ?? false, warning: "Potential secrets are reported by pattern only; secret values are never displayed." }; }
void refresh();
