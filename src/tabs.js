import { createTab } from '../ui/createTab.js';

export function initTabs() {
  const tabBar = document.getElementById('tab-bar');
  tabBar.innerHTML = '';
  tabBar.appendChild(createTab({ label: 'Welcome', id: 'tab-welcome', active: true }));
}
