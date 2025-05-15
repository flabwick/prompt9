// Listens for cells-changed events and allows UI to subscribe to changes

const listeners = new Set();

function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
function notifyAll() {
  for (const fn of listeners) fn();
}
window.addEventListener('cells-changed', notifyAll);

const liveSync = {
  subscribe,
  unsubscribe: fn => listeners.delete(fn)
};
export default liveSync;
