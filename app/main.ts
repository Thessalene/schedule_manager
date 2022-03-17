import { app, BrowserWindow, screen, ipcMain } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import * as url from 'url';
import { createConnection, getConnectionManager } from 'typeorm'
import { Authentification } from '../src/app/core/models/auth.schema';

const log = require('electron-log');

let win: BrowserWindow = null;
let authRepo = null
const args = process.argv.slice(1),
  serve = args.some(val => val === '--serve');

app.disableHardwareAcceleration()

async function createWindow(): Promise<BrowserWindow> {

  console.log("DIRNAME : " + __dirname)
  var connection = null
  try {
     connection = await createConnection({
      name: "connection",
      type: 'sqlite',
      synchronize: false,
      logging: 'all',
      logger: 'advanced-console',
      // TODO if dev src else dist
      database: './dist/assets/data/database.sqlite',
      entities: [Authentification],
    
      // migrations: [
      //   "../src/migration/*{.ts,.js}"
      // ],
      // cli: {
      //   migrationsDir: "../src/migration"
      // },
      // migrationsRun: true,
    })
    log.info("DATABASE CONNECTION OK")
  } catch (e) {
    log.warn('[EXCEPTION WHILE TERMINATING APPLICATION CONTEXT]', e);
    console.log('[EXCEPTION WHILE TERMINATING APPLICATION CONTEXT]', e);
     // If AlreadyHasActiveConnectionError occurs, return already existing connection
     if (e.name === "AlreadyHasActiveConnectionError") {
      const existentConn = getConnectionManager().get("connection");
      connection = existentConn;
   }
  }

  try {
    await connection.query('PRAGMA foreign_keys=OFF');
    await connection.synchronize();
    await connection.query('PRAGMA foreign_keys=ON');
 
    authRepo = connection.getRepository(Authentification);
  } catch (e){
    console.log("EXCEPTION : ", e)
    log.warn("EXCEPTION : ", e.json)
  }

  const electronScreen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  win = new BrowserWindow({
    x: 0,
    y: 0,
    width: size.width,
    height: size.height,
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: (serve) ? true : false,
      contextIsolation: false,  // false if you want to run e2e test with Spectron
    },
  });


  if (serve) {
    win.webContents.openDevTools();
    require('electron-reload')(__dirname, {
      electron: require(path.join(__dirname, '/../node_modules/electron'))
    });
    win.loadURL('http://localhost:4200');
  } else {
    // Path when running electron executable
    let pathIndex = './index.html';

    if (fs.existsSync(path.join(__dirname, '../dist/index.html'))) {
       // Path when running electron in local folder
      pathIndex = '../dist/index.html';
    }

    win.loadURL(url.format({
      pathname: path.join(__dirname, pathIndex),
      protocol: 'file:',
      slashes: true
    }));
  }

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

  
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

  ipcMain.on('add-authentification', async (event: any, _authentification : typeof Authentification) => {
    try {
      const item = await authRepo.create(_authentification);
      await authRepo.save(item);
      event.returnValue = await authRepo.find();
    } catch (err) {
      throw err;
    }
  });


  return win;
}

try {
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
  app.on('ready', () => setTimeout(createWindow, 400));

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
    if (win === null) {
      createWindow();
    }
  });

} catch (e) {
  // Catch Error
  // throw e;
}
