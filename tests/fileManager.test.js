import fileSystem from '../core/fileSystem.js';
import liveSync from '../core/liveSync.js';
import buildTree from '../core/treeBuilder.js';
import cellRegistry from '../state/cellRegistry.js';
import globalState from '../state/globalState.js';

function logResult(desc, pass) {
  console.log(`${pass ? '✔' : '✘'} ${desc}`);
}

function assert(cond, desc) {
  logResult(desc, !!cond);
  if (!cond) throw new Error('Test failed: ' + desc);
}

async function testFileSystemCRUD() {
  // Create root folder
  assert(fileSystem.create('folder', '/foo'), "Create folder /foo");
  assert(fileSystem.create('folder', '/foo/bar'), "Create folder /foo/bar");
  assert(fileSystem.create('cell', '/foo/bar/baz.md', '# Hello'), "Create cell /foo/bar/baz.md");
  let node = fileSystem.read('/foo/bar/baz.md');
  assert(node && node.content === '# Hello', "Read cell content");
  // Update content
  assert(fileSystem.update('/foo/bar/baz.md', {content: 'Updated'}), "Update cell content");
  node = fileSystem.read('/foo/bar/baz.md');
  assert(node.content === 'Updated', "Content updated");
  // Rename
  assert(fileSystem.update('/foo/bar/baz.md', {newName: 'qux.md'}), "Rename cell");
  node = fileSystem.read('/foo/bar/qux.md');
  assert(node && node.content === 'Updated', "Renamed cell found");
  // Move
  assert(fileSystem.create('folder', '/target'), "Create /target");
  assert(fileSystem.move('/foo/bar/qux.md', '/target/qux.md'), "Move cell to /target");
  node = fileSystem.read('/target/qux.md');
  assert(node && node.content === 'Updated', "Moved cell found");
  // Delete
  assert(fileSystem.delete('/target/qux.md'), "Delete cell");
  try { fileSystem.read('/target/qux.md'); assert(false, "Deleted cell should not be found"); } catch {}
}

async function testTreeBuilder() {
  fileSystem.create('cell', '/treeTest.md');
  let tree = buildTree();
  assert(Array.isArray(tree), "Tree is array");
  assert(tree.find(n => n.name === 'treeTest.md'), "Tree includes created cell");
}

async function testLiveSync() {
  let called = 0;
  const unsub = liveSync.subscribe(() => called++);
  fileSystem.create('cell', '/syncTest.md');
  assert(called > 0, "liveSync notified on create");
  unsub();
  let called2 = called;
  fileSystem.create('cell', '/syncTest2.md');
  assert(called === called2, "liveSync unsub works");
}

async function testCellRegistryAndState() {
  cellRegistry.openCell('/testcell.md');
  assert(cellRegistry.selectedCell === '/testcell.md', "Selected cell updated");
  assert(cellRegistry.openCells.find(c => c.path === '/testcell.md'), "OpenCells includes new cell");
  cellRegistry.closeCell('/testcell.md');
  assert(!cellRegistry.openCells.find(c => c.path === '/testcell.md'), "CloseCell removes cell");

  globalState.expandFolder('/foo');
  assert(globalState.isExpanded('/foo'), "Folder expanded");
  globalState.collapseFolder('/foo');
  assert(!globalState.isExpanded('/foo'), "Folder collapsed");
}

async function testEdgeCases() {
  // Duplicate create
  try { fileSystem.create('folder', '/foo'); assert(false, "Duplicate create fails"); } catch {}
  // Rename to existing
  fileSystem.create('cell', '/foo/exist.md');
  fileSystem.create('cell', '/foo/rename.md');
  try { fileSystem.update('/foo/rename.md', {newName: 'exist.md'}); assert(false, "Rename to existing fails"); } catch {}
  // Delete folder removes children
  fileSystem.create('cell', '/foo/bar/toDelete.md');
  fileSystem.delete('/foo/bar');
  try { fileSystem.read('/foo/bar/toDelete.md'); assert(false, "Deleted folder children gone"); } catch {}
}

async function runAll() {
  console.log('--- File Manager Module Test Suite ---');
  await testFileSystemCRUD();
  await testTreeBuilder();
  await testLiveSync();
  await testCellRegistryAndState();
  await testEdgeCases();
  console.log('All tests completed.');
}

runAll();
