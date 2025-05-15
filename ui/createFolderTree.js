// Renders recursive folder/file structure, handles DnD, expand/collapse, inline controls

import globalState from '../state/globalState.js';

export default function createFolderTree(treeData, {onNodeSelect}) {
  function makeNode(node) {
    const el = document.createElement('div');
    el.className = 'tree-node';
    el.dataset.path = node.path;
    el.dataset.type = node.type;
    el.draggable = true;
    if (node.type === 'folder') {
      el.classList.add('tree-folder');
      const expander = document.createElement('span');
      expander.className = 'tree-expander';
      expander.textContent = globalState.isExpanded(node.path) ? '▼' : '▶';
      expander.onclick = e => {
        e.stopPropagation();
        globalState.isExpanded(node.path)
          ? globalState.collapseFolder(node.path)
          : globalState.expandFolder(node.path);
        // Dispatch custom event to re-render sidebar
        window.dispatchEvent(new CustomEvent('sidebar-expand-toggle'));
      };
      el.appendChild(expander);
    }
    const label = document.createElement('span');
    label.className = 'tree-label';
    label.textContent = node.name;
    label.onclick = e => { e.stopPropagation(); onNodeSelect && onNodeSelect(node.path, node.type); };
    el.appendChild(label);
    // Recursively add children if expanded
    if (node.type === 'folder' && node.children && globalState.isExpanded(node.path)) {
      const childWrap = document.createElement('div');
      childWrap.className = 'tree-children';
      node.children.forEach(child => {
        childWrap.appendChild(makeNode(child));
      });
      el.appendChild(childWrap);
    }
    return el;
  }

  const root = document.createElement('div');
  root.className = 'folder-tree';
  treeData.forEach(node => root.appendChild(makeNode(node)));
  // Listen to expand/collapse and re-render as needed
  window.addEventListener('sidebar-expand-toggle', () => {
    const newTree = createFolderTree(treeData, {onNodeSelect});
    root.replaceWith(newTree);
  }, {once: true});
  return root;
}
