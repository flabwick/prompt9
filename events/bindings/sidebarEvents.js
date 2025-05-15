// Sidebar node selection, DnD, context menu actions, calls fileSystem, updates sidebar

import fileSystem from '../../core/fileSystem.js';
import {createContextMenu} from '../../ui/contextMenu.js';

function bindSidebarEvents(sidebarEl, {onNodeSelect, onSidebarUpdate}) {
  sidebarEl.addEventListener('click', e => {
    const nodeEl = e.target.closest('[data-path]');
    if (nodeEl && nodeEl.dataset.path) {
      onNodeSelect && onNodeSelect(nodeEl.dataset.path, nodeEl.dataset.type);
    }
  });

  sidebarEl.addEventListener('contextmenu', e => {
    e.preventDefault();
    const nodeEl = e.target.closest('[data-path]');
    if (!nodeEl) return;
    const path = nodeEl.dataset.path;
    const type = nodeEl.dataset.type;
    const menu = createContextMenu([
      ...(type === 'folder' ? [
        {label: 'New Cell', onClick: () => {
          const name = prompt('Cell name?');
          if (name) fileSystem.create('cell', path + '/' + name, '');
        }},
        {label: 'New Folder', onClick: () => {
          const name = prompt('Folder name?');
          if (name) fileSystem.create('folder', path + '/' + name);
        }}
      ] : []),
      {label: 'Rename', onClick: () => {
        const newName = prompt('Rename to?', path.split('/').pop());
        if (newName) fileSystem.update(path, {newName});
      }},
      {label: 'Delete', onClick: () => {
        if (confirm('Delete?')) fileSystem.delete(path);
      }}
    ]);
    menu.style.left = e.pageX + 'px';
    menu.style.top = e.pageY + 'px';
  });

  // Simple drag-and-drop logic (drag cell/folder to folder)
  let dragPath = null;
  sidebarEl.addEventListener('dragstart', e => {
    const nodeEl = e.target.closest('[data-path]');
    if (nodeEl) dragPath = nodeEl.dataset.path;
  });
  sidebarEl.addEventListener('dragover', e => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  });
  sidebarEl.addEventListener('drop', e => {
    const nodeEl = e.target.closest('[data-path]');
    if (nodeEl && dragPath && nodeEl.dataset.type === 'folder') {
      const destPath = nodeEl.dataset.path + '/' + dragPath.split('/').pop();
      if (dragPath !== destPath) {
        try { fileSystem.move(dragPath, destPath); } catch {}
      }
    }
    dragPath = null;
  });

  // Listen to global cells-changed for sidebar update
  window.addEventListener('cells-changed', () => onSidebarUpdate && onSidebarUpdate());
}

export default bindSidebarEvents;
