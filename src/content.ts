import { onMessage } from "./messaging";

type ElementInfo = { index: number; tag: string; id: string; className: string; text: string; style: Record<string, string>; rect: DOMRect; events: string[] };
let selected: Element | null = null;

function info(el: Element, index: number): ElementInfo {
  const html = el as HTMLElement;
  const computed = getComputedStyle(el);
  const style: Record<string, string> = {};
  for (const name of ["display","position","width","height","margin","padding","color","background-color","font-size","font-family","border","box-sizing","overflow"]) style[name] = computed.getPropertyValue(name);
  return { index, tag: el.tagName.toLowerCase(), id: html.id || "", className: typeof html.className === "string" ? html.className : "", text: (html.textContent || "").trim().slice(0, 160), style, rect: el.getBoundingClientRect(), events: [] };
}

function collect() {
  const all = [...document.querySelectorAll("*")].slice(0, 1500);
  return {
    title: document.title,
    url: location.href,
    readyState: document.readyState,
    html: document.documentElement.outerHTML,
    htmlLength: document.documentElement.outerHTML.length,
    elements: all.map((el, index) => info(el, index)),
    stylesheets: [...document.styleSheets].map(s => ({ href: s.href || "inline", rules: readRules(s) })),
    scripts: [...document.scripts].map(s => s.src || "inline script"),
    links: [...document.querySelectorAll<HTMLLinkElement>("link[href]")].map(l => l.href),
    images: [...document.images].slice(0, 200).map(i => ({ src: i.currentSrc || i.src, alt: i.alt })),
    viewport: { width: innerWidth, height: innerHeight, devicePixelRatio },
    security: { https: location.protocol === "https:", mixedContent: hasMixedContent() }
  };
}
function readRules(sheet: CSSStyleSheet) {
  try { return [...sheet.cssRules].slice(0, 500).map(r => r.cssText); } catch { return ["Stylesheet rules are not readable from this context."]; }
}
function hasMixedContent() { return location.protocol === "https:" && [...document.querySelectorAll("img,script,iframe,link,video,audio")].some(el => ((el as HTMLImageElement).src || (el as HTMLLinkElement).href || "").startsWith("http://")); }
function selectElement(index: number) { selected = document.querySelectorAll("*").item(index) || null; return selected ? info(selected, index) : null; }
function computed() { if (!selected) return null; const s = getComputedStyle(selected); const out: Record<string,string> = {}; for (let i=0;i<s.length;i++) { const p=s.item(i); out[p]=s.getPropertyValue(p); } return out; }
function box() { if (!selected) return null; const r=selected.getBoundingClientRect(); const s=getComputedStyle(selected); return { content:{width:r.width,height:r.height}, margin:{top:s.marginTop,right:s.marginRight,bottom:s.marginBottom,left:s.marginLeft}, padding:{top:s.paddingTop,right:s.paddingRight,bottom:s.paddingBottom,left:s.paddingLeft}, border:{top:s.borderTopWidth,right:s.borderRightWidth,bottom:s.borderBottomWidth,left:s.borderLeftWidth} }; }
function setHover(on: boolean) { if (!selected) return; selected.classList.toggle("__devtoolsub_hover", on); }
function addClass(name: string) { if (selected && /^[A-Za-z_][\w-]*$/.test(name)) selected.classList.add(name); }
function addStyle(property: string, value: string) { if (selected && /^[a-z-]+$/i.test(property)) (selected as HTMLElement).style.setProperty(property, value); }

onMessage(async message => {
  if (message.type === "collect") return collect();
  if (message.type === "select") return selectElement(Number(message.payload));
  if (message.type === "computed") return computed();
  if (message.type === "layout") return box();
  if (message.type === "hover") { setHover(Boolean(message.payload)); return true; }
  if (message.type === "add-class") { addClass(String(message.payload)); return true; }
  if (message.type === "add-style") { const p=message.payload as {property:string,value:string}; addStyle(p.property,p.value); return true; }
  return null;
});
const style = document.createElement("style"); style.textContent=".__devtoolsub_hover{outline:2px solid #1a73e8!important;outline-offset:2px!important}"; document.documentElement.append(style);
