# Terminal commands to scaffold the project structure

mkdir data
mkdir data/cells
mkdir src
mkdir ui
mkdir ui/styles
mkdir core
mkdir utils
mkdir events
mkdir events/bindings
mkdir state
mkdir assets

touch index.html
touch main.js
touch style.css

touch src/app.js
touch src/tabs.js
touch src/sidebar.js
touch src/preview.js
touch src/router.js

touch ui/createTab.js
touch ui/createSidebar.js
touch ui/createMainPanel.js
touch ui/createFolderTree.js
touch ui/createCellEmbed.js
touch ui/createCellEditor.js

touch ui/styles/tab.css
touch ui/styles/sidebar.css
touch ui/styles/panel.css
touch ui/styles/cell.css
touch ui/styles/embed.css

touch core/markdownParser.js
touch core/fileSystem.js
touch core/liveSync.js
touch core/cellLinks.js
touch core/pathUtils.js

touch utils/dom.js
touch utils/debounce.js
touch utils/id.js

touch events/handlers.js
touch events/bindings/tabEvents.js
touch events/bindings/sidebarEvents.js
touch events/bindings/editorEvents.js

touch state/globalState.js
touch state/cellRegistry.js
touch state/syncQueue.js

# assets/ and data/cells/ remain empty for now
