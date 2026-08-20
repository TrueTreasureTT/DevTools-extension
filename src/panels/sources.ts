export function sourceList(doc: Document) { return { scripts: [...doc.scripts].map(s => s.src || "inline"), styles: [...doc.styleSheets].map(s => s.href || "inline") }; }
