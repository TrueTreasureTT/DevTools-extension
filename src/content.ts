import { onMessage, send } from "./messaging";
function collect() {
  const elements = [...document.querySelectorAll("*")].slice(0, 500).map((el) => ({ tag: el.tagName.toLowerCase(), id: el.id, className: el.className, text: (el.textContent || "").trim().slice(0, 120) }));
  return { title: document.title, url: location.href, htmlLength: document.documentElement.outerHTML.length, elements, stylesheets: [...document.styleSheets].map(s => s.href || "inline") };
}
onMessage(async (message) => {
  if (message.type === "collect") return collect();
  if (message.type === "selected-element") return null;
  return null;
});
void send;
