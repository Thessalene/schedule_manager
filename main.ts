import {app, BrowserWindow, ipcMain, screen} from 'electron';
import * as path from 'path';
import { createConnection, getConnectionManager } from 'typeorm';
import * as url from 'url';
import { Authentification } from './src/app/core/models/auth.schema.js';
const log = require('electron-log');
app.disableHardwareAcceleration()

// detect serve mode
const args = process.argv.slice(1);
let serve: boolean = args.some(val => val === '--serve');

let authRepo = null


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow: Electron.BrowserWindow | null;

const isDevMode = process.execPath.match(/[\\/]electron/);

//if (isDevMode) enableLiveReload();

const createWindow = async () => {
  var connection = null
  try {
    connection = await createConnection({
      name: "database_connection",
      type: 'sqlite',
      synchronize: true,
      logging: true,
      logger: 'simple-console',
      database: './dist/assets/data/database.sqlite',
      entities: [ Authentification ],
    });
  } catch (e) {
    log.warn('[EXCEPTION WHILE TERMINATING APPLICATION CONTEXT]', e);
    console.log('[EXCEPTION WHILE TERMINATING APPLICATION CONTEXT]', e);
     // If AlreadyHasActiveConnectionError occurs, return already existing connection
     if (e.name === "AlreadyHasActiveConnectionError") {
      const existentConn = getConnectionManager().get("database_connection");
      connection = existentConn;
   }
  }

  const authRepo = connection.getRepository(Authentification);

  const electronScreen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;
  // Create the browser window.
  mainWindow = new BrowserWindow({
    x: 0,
    y: 0,
    width: size.width,
    height: size.height,
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: (serve) ? true : false,
      contextIsolation: false,  // false if you want to run 2e2 test with Spectron
      plugins: true,
      backgroundThrottling: false,
      nativeWindowOpen: false,
      webSecurity: false
    },
  });
  require("@electron/remote").require("@electron/remote/main").enable(mainWindow.webContents);

  // and load the index.html of the app.
  if (serve) {
    //win.webContents.openDevTools();

    require('electron-reload')(__dirname, {
      electron: require(`${__dirname}/node_modules/electron`)
    });
    mainWindow.loadURL('http://localhost:4200');

  } else {
    mainWindow.loadURL(url.format({
      pathname: path.join(__dirname, 'dist/index.html'),
      protocol: 'file:',
      slashes: true
    }));
  }

  // Open the DevTools.
  if (isDevMode) {
    mainWindow.webContents.openDevTools();
  }


  // -------------------------- AUTHENTIFICATION --------------------------
  ipcMain.on('get-all-auth', async (event: any) => {
    try {
      event.returnValue = await authRepo.find();

    } catch (err) {
      throw err;
    }
  });

  ipcMain.on('get-auth-by-identifiant', async (event: any, _identifiant: string) => {
    try {
      event.returnValue = await authRepo.findOne({ where: { identifiant: _identifiant } });

    } catch (err) {
      throw err;
    }
  });

  ipcMain.on('add-authentification', async (event: any, _authentification : Authentification) => {
    try {
      const item = await authRepo.create(_authentification);
      await authRepo.save(item);
      event.returnValue = await authRepo.find();
    } catch (err) {
      throw err;
    }
  });
  
  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
  return mainWindow
}


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

