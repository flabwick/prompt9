// All filesystem operations for cells and folders (CRUD, move, list)
// Emits "cells-changed" event on window after every op

const CELL_ROOT = '/data/cells';

// In-memory emulation of filesystem for the frontend (replace with real backend or FS in production)
let cellsFS = {};

// ---- Helper functions ----
function pathSplit(path) {
  return path.replace(/^\/|\/$/g, '').split('/').filter(Boolean);
}
function getNode(path, root = cellsFS) {
  if (path === '/' || !path) return root;
  const segs = pathSplit(path);
  let node = root;
  for (const seg of segs) {
    if (!node.children || !(seg in node.children)) return null;
    node = node.children[seg];
  }
  return node;
}
function ensureParentFolder(path, root = cellsFS) {
  const segs = pathSplit(path);
  if (segs.length < 2) return root;
  let node = root;
  for (let i = 0; i < segs.length - 1; ++i) {
    if (!node.children) node.children = {};
    if (!node.children[segs[i]]) node.children[segs[i]] = {type: 'folder', name: segs[i], children: {}};
    node = node.children[segs[i]];
  }
  return node;
}
function emitCellsChanged() {
  window.dispatchEvent(new CustomEvent('cells-changed'));
}

// ---- API ----
const fileSystem = {
  // List directory tree recursively
  listTree(path = '/') {
    const node = getNode(path);
    if (!node) return null;
    function recurse(n, p) {
      let obj = {
        path: p,
        name: n.name || '',
        type: n.type || 'folder',
        ...(n.type === 'cell' ? {content: n.content || ''} : {})
      };
      if (n.children) {
        obj.children = Object.keys(n.children).map(child => recurse(n.children[child], p + '/' + child));
      }
      return obj;
    }
    return recurse(node, path === '/' ? '' : path);
  },

  // Create file/folder
  create(type, path, content = '') {
    if (type !== 'cell' && type !== 'folder') throw new Error('Invalid type');
    const parent = ensureParentFolder(path);
    const segs = pathSplit(path);
    const name = segs[segs.length - 1];
    if (!parent.children) parent.children = {};
    if (parent.children[name]) throw new Error('Node exists');
    parent.children[name] = type === 'folder'
      ? {type: 'folder', name, children: {}}
      : {type: 'cell', name, content};
    emitCellsChanged();
    return true;
  },

  // Read file/folder
  read(path) {
    const node = getNode(path);
    if (!node) throw new Error('Not found');
    return node;
  },

  // Update cell content or rename node
  update(path, {content, newName}) {
    const segs = pathSplit(path);
    const name = segs.pop();
    const parentPath = '/' + segs.join('/');
    const parent = getNode(parentPath);
    if (!parent || !parent.children || !parent.children[name]) throw new Error('Not found');
    const node = parent.children[name];
    if (content !== undefined && node.type === 'cell') {
      node.content = content;
    }
    if (newName && newName !== name) {
      if (parent.children[newName]) throw new Error('Target name exists');
      node.name = newName;
      parent.children[newName] = node;
      delete parent.children[name];
    }
    emitCellsChanged();
    return true;
  },

  // Delete file/folder
  delete(path) {
    const segs = pathSplit(path);
    const name = segs.pop();
    const parentPath = '/' + segs.join('/');
    const parent = getNode(parentPath);
    if (!parent || !parent.children || !parent.children[name]) throw new Error('Not found');
    delete parent.children[name];
    emitCellsChanged();
    return true;
  },

  // Move (or rename) node
  move(srcPath, destPath) {
    const srcSegs = pathSplit(srcPath);
    const srcName = srcSegs.pop();
    const srcParentPath = '/' + srcSegs.join('/');
    const srcParent = getNode(srcParentPath);
    if (!srcParent || !srcParent.children || !srcParent.children[srcName]) throw new Error('Not found');
    const node = srcParent.children[srcName];

    const destParent = ensureParentFolder(destPath);
    const destSegs = pathSplit(destPath);
    const destName = destSegs[destSegs.length - 1];
    if (!destParent.children) destParent.children = {};
    if (destParent.children[destName]) throw new Error('Target exists');
    node.name = destName;
    destParent.children[destName] = node;
    delete srcParent.children[srcName];
    emitCellsChanged();
    return true;
  }
};

window.fileSystem = fileSystem; // For debugging/devtools
export default fileSystem;
