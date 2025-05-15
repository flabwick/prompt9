export function createTab({ label, id, active }) {
  const tab = document.createElement('div');
  tab.className = `tab${active ? ' tab-active' : ''}`;
  tab.id = id;
  tab.textContent = label;
  return tab;
}
