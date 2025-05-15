// Unique id generator for files/folders

let lastId = Date.now();
export function uniqueId() {
  return 'id-' + (++lastId).toString(36) + '-' + Math.random().toString(36).slice(2,6);
}
