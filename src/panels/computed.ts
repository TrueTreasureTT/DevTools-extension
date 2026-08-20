export function computedStyle(element: Element) { const s = getComputedStyle(element); return [...s].map(property => ({ property, value: s.getPropertyValue(property) })); }
