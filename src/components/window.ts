export function makeWindow(root: HTMLElement) { root.classList.add("devtools-window"); return { minimize: () => root.setAttribute("hidden", ""), restore: () => root.removeAttribute("hidden") }; }
