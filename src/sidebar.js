// Integrates with fileSystem and liveSync; handles sidebar rendering and UI events

import buildTree from '../core/treeBuilder.js';
import createSidebar from '../ui/createSidebar.js';
import bindSidebarEvents from '../events/bindings/sidebarEvents.js';
import cellRegistry from '../state/cellRegistry.js';

function renderSidebar() {
  const sidebarRoot = document.getElementById('sidebar');
  sidebarRoot.innerHTML = '';
  const treeData = buildTree();
  const sidebarEl = createSidebar(treeData, {
    onNodeSelect: (path, type) => {
      if (type === 'cell') {
        cellRegistry.openCell(path);
        // TODO: trigger tab open/render
      }
    },
    onSidebarUpdate: renderSidebar
  });
  sidebarRoot.appendChild(sidebarEl);
  bindSidebarEvents(sidebarEl, {
    onNodeSelect: (path, type) => {
      if (type === 'cell') {
        cellRegistry.openCell(path);
        // TODO: trigger tab open/render
      }
    },
    onSidebarUpdate: renderSidebar
  });
}
export function initSidebar() {
  renderSidebar();
}
