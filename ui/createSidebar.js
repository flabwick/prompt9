// Renders sidebar with folder tree, accepts tree data and action callbacks

import createFolderTree from './createFolderTree.js';

export default function createSidebar(treeData, {onNodeSelect, onSidebarUpdate}) {
  const el = document.createElement('div');
  el.className = 'sidebar-view';
  const tree = createFolderTree(treeData, {onNodeSelect});
  el.appendChild(tree);
  return el;
}
