export type Source = { url: string; kind: string };
export function sourcesFromDocument(doc: Document): Source[] {
  return [
    ...[...doc.scripts].map(s => ({ url: s.src || "inline", kind: "script" })),
    ...[...doc.styleSheets].map(s => ({ url: s.href || "inline", kind: "stylesheet" })),
    { url: location.href, kind: "document" }
  ];
}
