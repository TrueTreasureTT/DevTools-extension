export function editRule(element: HTMLElement, property: string, value: string) { element.style.setProperty(property, value); }
export function removeRule(element: HTMLElement, property: string) { element.style.removeProperty(property); }
