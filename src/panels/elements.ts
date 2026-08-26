export type ElementSnapshot = {
  tag: string;
  id?: string;
  className?: string;
  text?: string;
  index: number;
};

export function renderElements(nodes: ElementSnapshot[], host: HTMLElement, onSelect: (index: number) => void): void {
  host.replaceChildren();
  const tree = document.createElement('div');
  tree.className = 'elements-tree';
  nodes.forEach((node) => {
    const item = document.createElement('button');
    item.type = 'button';
    item.className = 'element-row';
    item.textContent = `<${node.tag}${node.id ? ` id=\"${node.id}\"` : ''}${node.className ? ` class=\"${node.className}\"` : ''}>`;
    item.title = node.text || '';
    item.addEventListener('click', () => onSelect(node.index));
    tree.appendChild(item);
  });
  host.appendChild(tree);
}
