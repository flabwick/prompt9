// Builds a tree structure for the sidebar UI from the fileSystem

import fileSystem from './fileSystem.js';

function buildTree() {
  const root = fileSystem.listTree('/');
  return root && root.children ? root.children : [];
}

export default buildTree;
