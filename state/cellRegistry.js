// Tracks loaded cells and folders, open/selected state

const cellRegistry = {
  openCells: [],     // [{path, tabId}]
  selectedCell: null,

  openCell(path) {
    if (!this.openCells.find(c => c.path === path)) {
      const tabId = path;
      this.openCells.push({path, tabId});
    }
    this.selectedCell = path;
  },

  closeCell(path) {
    this.openCells = this.openCells.filter(c => c.path !== path);
    if (this.selectedCell === path) {
      this.selectedCell = this.openCells.length ? this.openCells[this.openCells.length-1].path : null;
    }
  },

  selectCell(path) {
    this.selectedCell = path;
  }
};
export default cellRegistry;
