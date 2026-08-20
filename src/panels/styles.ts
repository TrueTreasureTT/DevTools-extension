export function stylesFor(element: Element) { const s = getComputedStyle(element); return Object.fromEntries([...s].map(k => [k, s.getPropertyValue(k)])); }
