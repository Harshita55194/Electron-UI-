import { app, BrowserWindow } from 'electron';
import * as path from 'path';

function createWindow(): void {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        backgroundColor: '#f0f0f0',
        title: 'Health Pay - NHA Claim Processor',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    win.loadFile('index.html');
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
