const { app, BrowserWindow, ipcMain } = require('electron/main')
const path = require('node:path')

async function handleGetText(_, text) {
    console.log(text)
    console.log('getting text...')
    return 'Hello from main process'
    }

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
        preload: path.join(__dirname, 'preload.js')
      }
  })

  win.loadFile('index.html')
}

app.whenReady().then(() => {
  ipcMain.handle('get_text', handleGetText)
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })

  
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})