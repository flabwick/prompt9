import { initSidebar } from './sidebar.js';
import { initTabs } from './tabs.js';
import { routeTo } from './router.js';

export function bootApp() {
  initSidebar();
  initTabs();
  routeTo('default');
}
