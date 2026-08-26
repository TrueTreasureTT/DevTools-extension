export type DomNode = { tag: string; id?: string; className?: string; text?: string; index: number };

export function renderDomTree(nodes: DomNode[], selectedIndex: number | null, onSelect: (index: number) => void): HTMLElement {
  const root = document.createElement('div');
  root.className = 'dom-tree';
  nodes.forEach((node) => {
    const row = document.createElement('button');
    row.type = 'button';
    row.className = node.index === selectedIndex ? 'dom-node selected' : 'dom-node';
    const id = node.id ? `#${node.id}` : '';
    const classes = node.className ? `.${String(node.className).trim().split(/\s+/).filter(Boolean).join('.')}` : '';
    row.textContent = `<${node.tag}${id}${classes}>${node.text ? ` ${node.text}` : ''}`;
    row.addEventListener('click', () => onSelect(node.index));
    root.appendChild(row);
  });
  return root;
}
