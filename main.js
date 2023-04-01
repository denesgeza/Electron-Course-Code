// Modules
const { app, BrowserWindow, ipcMain } = require("electron");
const windowStateKeeper = require("electron-window-state");
const readItem = require('./readItem')
const appMenu = require('./menu')

// Create a global reference to window object to avoid being garbage collected
let mainWindow;

// Listen for new item request
ipcMain.on("new-item", (e, itemUrl) => {
  // Get new item and send back to renderer
  readItem(itemUrl, (item) => {
    e.sender.send("new-item-success", item);
  });
});

// Create a new window when the app is ready
function createWindow() {
  let state = windowStateKeeper({
    defaultWidth: 500,
    defaultHeight: 650,
  });

  mainWindow = new BrowserWindow({
    x: state.x,
    y: state.y,
    width: state.width,
    height: state.height,
    minWidth: 350,
    maxWidth: 650,
    minHeight: 300,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // Create main app menu
  appMenu(mainWindow.webContents);

  // Load main.html into the BrowserWindow
  mainWindow.loadFile("renderer/main.html");

  // Manage new window state
  state.manage(mainWindow);

  // Open DevTools - Remove for Production
  // mainWindow.webContents.openDevTools();

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.on("ready", createWindow);

// Listen for window being closed
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// If there are no windows create one
app.on("activate", () => {
  if (mainWindow === null) createWindow();
});
