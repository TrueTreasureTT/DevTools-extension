import { onMessage } from "./messaging";

type ElementInfo = { tag: string; id: string; className: string; text: string };
function collect(): Record<string, unknown> {
  const elements: ElementInfo[] = [...document.querySelectorAll("*")].slice(0, 1000).map((el) => ({
    tag: el.tagName.toLowerCase(), id: el.id,
    className: typeof el.className === "string" ? el.className : "",
    text: (el.textContent || "").trim().slice(0, 160)
  }));
  const stylesheets = [...document.styleSheets].map((sheet) => sheet.href || "inline stylesheet");
  const scripts = [...document.scripts].map((script) => script.src || "inline script");
  const links = [...document.querySelectorAll<HTMLLinkElement>("link[href]")].map((link) => link.href);
  const images = [...document.images].slice(0, 200).map((image) => ({ src: image.currentSrc || image.src, alt: image.alt }));
  return {
    title: document.title, url: location.href, readyState: document.readyState,
    htmlLength: document.documentElement.outerHTML.length, elements, stylesheets, scripts, links, images,
    viewport: { width: innerWidth, height: innerHeight, devicePixelRatio },
    security: {
      https: location.protocol === "https:",
      mixedContent: location.protocol === "https:" && [...document.querySelectorAll("img,script,iframe,link")].some((el) => {
        const src = (el as HTMLImageElement).src || (el as HTMLLinkElement).href || "";
        return src.startsWith("http://");
      })
    }
  };
}
onMessage(async (message) => message.type === "collect" ? collect() : null);
