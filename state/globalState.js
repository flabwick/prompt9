// Tracks current sidebar view, selected cell, expanded folders

const globalState = {
  sidebarView: 'cells',
  expandedFolders: new Set(),
  setSidebarView(view) { this.sidebarView = view; },
  expandFolder(path) { this.expandedFolders.add(path); },
  collapseFolder(path) { this.expandedFolders.delete(path); },
  isExpanded(path) { return this.expandedFolders.has(path); }
};
export default globalState;
