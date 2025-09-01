const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 700,
    autoHideMenuBar: true,
    menuBarVisible: false,
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

// Handle launch browser request
ipcMain.on('launch-browser', (event, data) => {
  const pythonScript = path.join(__dirname, '..', 'automation', 'browser_automation.py');
  const pythonProcess = spawn('python', [pythonScript, data.username, data.browserType]);

  pythonProcess.stdout.on('data', (data) => {
    event.reply('browser-status', { type: 'info', message: data.toString() });
  });

  pythonProcess.stderr.on('data', (data) => {
    event.reply('browser-status', { type: 'error', message: data.toString() });
  });

  pythonProcess.on('close', (code) => {
    event.reply('browser-status', { 
      type: code === 0 ? 'success' : 'error',
      message: `Process exited with code ${code}`
    });
  });
});

// Handle scrape books request
ipcMain.on('scrape-books', (event) => {
  console.log('Received scrape-books event');
  const pythonScript = path.join(__dirname, '..', 'automation', 'bs_scraper.py');
  console.log('Running script:', pythonScript);
  
  try {
    const pythonProcess = spawn('python', [pythonScript]);
    console.log('Python process started');

    pythonProcess.stdout.on('data', (data) => {
      console.log('Python output:', data.toString());
      event.reply('scrape-status', { type: 'info', message: data.toString() });
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error('Python error:', data.toString());
      event.reply('scrape-status', { type: 'error', message: data.toString() });
    });

    pythonProcess.on('close', (code) => {
      console.log('Python process exited with code:', code);
      event.reply('scrape-status', { 
        type: code === 0 ? 'success' : 'error',
        message: `Process exited with code ${code}`
      });
    });
  } catch (error) {
    console.error('Error spawning Python process:', error);
  }
});
