const { app, BrowserWindow, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');

let mainWindow;

function createWindow () {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
        },
    });
    mainWindow.loadFile('index.html');

    mainWindow.on('closed', function () {
        mainWindow = null;
    });


    // Let autoUpdater check for updates, it will start downloading it automatically
    autoUpdater.checkForUpdates();

    // Catch the update-available event
    autoUpdater.addListener('update-available', (info) => {
        mainWindow.webContents.send('update-available');
    });

    // Catch the update-not-available event
    autoUpdater.addListener('update-not-available', (info) => {
        mainWindow.webContents.send('update-not-available');
    });

    // Catch the download-progress events
    autoUpdater.addListener('download-progress', (info) => {
        mainWindow.webContents.send('prog-made');
    });

    // Catch the update-downloaded event
    autoUpdater.addListener('update-downloaded', (info) => {
        mainWindow.webContents.send('update-downloaded');
    });

    // Catch the error events
    autoUpdater.addListener('error', (error) => {
        mainWindow.webContents.send('error', error.toString());
    });

    ipcMain.on('quitAndInstall', (event, arg) => {
        autoUpdater.quitAndInstall();
    });
}

app.on('ready', () => {
    createWindow();
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});

ipcMain.on('app_version', (event) => {
    event.sender.send('app_version', { version: app.getVersion() });
});

/*autoUpdater.on('update-available', () => {
    mainWindow.webContents.send('update_available');
});

autoUpdater.on('update-downloaded', () => {
    mainWindow.webContents.send('update_downloaded');
});*/


ipcMain.on('open_dev', () => {
    mainWindow.openDevTools();
});