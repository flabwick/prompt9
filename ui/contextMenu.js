// Reusable context menu UI for file/folder actions

export function createContextMenu(actions) {
  const menu = document.createElement('div');
  menu.className = 'context-menu';
  menu.style.position = 'absolute';
  actions.forEach(({label, onClick}) => {
    const item = document.createElement('div');
    item.className = 'context-menu-item';
    item.textContent = label;
    item.tabIndex = 0;
    item.onclick = e => { e.stopPropagation(); onClick(); menu.remove(); };
    menu.appendChild(item);
  });
  document.body.appendChild(menu);
  // Simple auto-destroy on click elsewhere
  setTimeout(() => {
    function close(e) { menu.remove(); document.removeEventListener('mousedown', close); }
    document.addEventListener('mousedown', close);
  }, 0);
  return menu;
}
