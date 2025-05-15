// Scaffold Verification Tests
// Usage: Run in NodeJS in the project root (node tests/scaffold.test.js)

const fs = require('fs');
const path = require('path');

function log(pass, message) {
  const symbol = pass ? '✔️' : '❌';
  console.log(`${symbol} ${message}`);
}

function exists(p) {
  return fs.existsSync(p);
}

function dirList(dir) {
  try { return fs.readdirSync(dir); } catch { return []; }
}

function checkFileStructure() {
  // 1. Directory & File Structure
  const dirs = [
    'data', 'data/cells', 'src', 'ui', 'ui/styles', 'core', 'utils', 'events',
    'events/bindings', 'state', 'assets'
  ];
  let allDirs = true;
  dirs.forEach(d => {
    const res = exists(d) && fs.lstatSync(d).isDirectory();
    log(res, `Directory exists: ${d}`);
    if (!res) allDirs = false;
  });

  // 2. Root Files
  const rootFiles = ['index.html', 'main.js', 'style.css'];
  rootFiles.forEach(f => log(exists(f), `Root file exists: ${f}`));

  // 3. File checks per directory
  const filesToCheck = {
    'src': ['app.js', 'tabs.js', 'sidebar.js', 'preview.js', 'router.js'],
    'ui': [
      'createTab.js', 'createSidebar.js', 'createMainPanel.js', 
      'createFolderTree.js', 'createCellEmbed.js', 'createCellEditor.js'
    ],
    'ui/styles': [
      'tab.css', 'sidebar.css', 'panel.css', 'cell.css', 'embed.css'
    ],
    'core': [
      'markdownParser.js', 'fileSystem.js', 'liveSync.js', 
      'cellLinks.js', 'pathUtils.js'
    ],
    'utils': ['dom.js', 'debounce.js', 'id.js'],
    'events': ['handlers.js'],
    'events/bindings': ['tabEvents.js', 'sidebarEvents.js', 'editorEvents.js'],
    'state': ['globalState.js', 'cellRegistry.js', 'syncQueue.js'],
  };
  let allFiles = true;
  for (const [dir, files] of Object.entries(filesToCheck)) {
    files.forEach(file => {
      const p = path.join(dir, file);
      const res = exists(p);
      log(res, `File exists: ${p}`);
      if (!res) allFiles = false;
    });
  }
  return allDirs && allFiles;
}

function checkHTMLStructure() {
  const html = fs.readFileSync('index.html', 'utf8');
  let ok = true;
  // Check for critical containers
  [
    'id="sidebar"',
    'id="tab-bar"',
    'id="main-panel"',
    '<script type="module" src="main.js"></script>'
  ].forEach(snippet => {
    const res = html.includes(snippet);
    log(res, `index.html contains: ${snippet}`);
    if (!res) ok = false;
  });
  // Check for CSS imports
  [
    'style.css',
    'ui/styles/tab.css',
    'ui/styles/sidebar.css',
    'ui/styles/panel.css',
    'ui/styles/cell.css',
    'ui/styles/embed.css'
  ].forEach(css => {
    const res = html.includes(css);
    log(res, `index.html imports CSS: ${css}`);
    if (!res) ok = false;
  });
  return ok;
}

function checkComponentExports() {
  const uiFiles = [
    'ui/createTab.js', 'ui/createSidebar.js', 'ui/createMainPanel.js', 
    'ui/createFolderTree.js', 'ui/createCellEmbed.js', 'ui/createCellEditor.js'
  ];
  let ok = true;
  uiFiles.forEach(f => {
    const text = fs.readFileSync(f, 'utf8');
    const match = text.match(/export function (\w+)/);
    log(!!match, `${f} exports a function`);
    if (!match) ok = false;
  });
  return ok;
}

function checkPlaceholders() {
  const coreFiles = [
    'core/markdownParser.js', 'core/fileSystem.js', 'core/liveSync.js', 
    'core/cellLinks.js', 'core/pathUtils.js'
  ];
  let ok = true;
  coreFiles.forEach(f => {
    const text = fs.readFileSync(f, 'utf8');
    const res = /Placeholder/.test(text);
    log(res, `${f} contains placeholder comment`);
    if (!res) ok = false;
  });
  return ok;
}

function checkEmptyDirs() {
  const dataCells = dirList('data/cells');
  log(dataCells.length === 0, 'data/cells is empty');
  const assets = dirList('assets');
  log(assets.length === 0, 'assets is empty');
}

function runAll() {
  console.log('=== Directory & File Structure ===');
  const structureOK = checkFileStructure();
  console.log('=== HTML Structure ===');
  const htmlOK = checkHTMLStructure();
  console.log('=== UI Component Exports ===');
  const uiOK = checkComponentExports();
  console.log('=== Core Placeholders ===');
  const coreOK = checkPlaceholders();
  console.log('=== Empty Data/Assets Dirs ===');
  checkEmptyDirs();
  const allOK = structureOK && htmlOK && uiOK && coreOK;
  console.log(allOK ? '\n🎉 All scaffold checks passed.' : '\n⚠️  Some checks failed.');
  process.exit(allOK ? 0 : 1);
}

if (require.main === module) runAll();
