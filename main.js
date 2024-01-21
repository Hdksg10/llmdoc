const { app, BrowserWindow, ipcMain, dialog, Menu } = require('electron/main')
const path = require('node:path')
const fs = require('node:fs')
const mammoth = require('mammoth');
const spawn = require('child_process');

let mainWindow = null
let docxPath = null
let pythonPath = null
let llmPath = null

function runBookmark(fpath, docx) {
  // read bookmark's code
  const data = fs.readFileSync(fpath, 'utf8')
  let bookmark = JSON.parse(data)
  let code = bookmark.code
  console.log(code)

  // write to a temp python script
  const scriptPath = path.join(__dirname, '~temp.py')
  const templatePath = path.join(__dirname, 'scripts/template.py')
  const template = fs.readFileSync(templatePath, 'utf8')
  let fullCode = code + template
  fs.writeFileSync(scriptPath, fullCode)
  // run the script
  // save the output to the same directory as the docx file
  const outputDir = path.dirname(docx)
  const output = path.join(outputDir, 'output.docx')
  const cmdArgs = [scriptPath, docx, output]
  const child = spawn.spawn(pythonPath, cmdArgs)
  child.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });
  child.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
    dialog.showMessageBoxSync(mainWindow, {
      type: 'info',
      title: 'Error',
      message: `错误的Python代码: ${data}`,
    });
  });
  child.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
    fs.unlinkSync(scriptPath)
  });
}

function generateCode(prompt, llmPath, callback){
  const llmScript = path.join(__dirname, 'scripts/llm.py')
  const cmdArgs = [llmScript, prompt]
  const child = spawn.spawn(llmPath, cmdArgs)
  let generate_code = ""
  let output = ""
  child.stdout.on('data', (data) => {
    output += data.toString()
  });
  child.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
    dialog.showMessageBoxSync(mainWindow, {
      type: 'info',
      title: 'Error',
      message: `生成代码时产生错误: ${data}`,
    });
  });
  child.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
    console.log(output)
    const functionRegex = /```python([\s\S]*?)```/;
    const match = output.match(functionRegex);
    generate_code = match[1]
    console.log(generate_code)
    setTimeout(() => {
      callback(generate_code)
      }, 4000);
    
  });

}

async function handleGetText(_, text) {
    console.log('get text...')
    const child = new BrowserWindow({ 
      parent: mainWindow, 
      modal: true, 
      show: false, 
      width: 400, 
      height: 300,
      webPreferences: {
        preload: path.join(__dirname, 'preload_loading.js'),
      }
      })
    child.loadFile('loading.html')
    child.once('ready-to-show', () => {
      let wid = child.id
      child.webContents.send('loading-info', {"wid": wid})
      child.show()
      generateCode(text, llmPath, (code) => {
        child.webContents.send('loading-done', code)
      })
    })
    child.on('close', () => {
      mainWindow.webContents.send('reload_all_bookmarks', handleLoadAllBookmarks())
    });
    return 'Hello from main process'
    }

function handleCloseWindow(_, wid) {
  console.log('close window...')
  let child = BrowserWindow.fromId(wid)
  child.close()
}
function handleRunBookmarkMenu(_, bm) {
  console.log('running bookmark menu...')
  console.log(bm)
  const menuTemplate = [
    {
      label: "套用",
      click: () => {runBookmark(bm.path, docxPath)},
    },
    {
      label: "编辑",
      click: () => {handleEditBookmark(_, bm.path, {"name": bm.name, "code": bm.code})},
    },
  ]
  const menu = Menu.buildFromTemplate(menuTemplate)
  menu.popup()
}

function handleRunBookmark(_, fpath) {
    console.log('running bookmark...')
    console.log(fpath)
    runBookmark(fpath, docxPath)
}    

function handleLoadAllBookmarks() {
    console.log('loading all bookmarks...')
    dir = path.join(__dirname, 'bookmarks')
    let bookmarks = []
    const files = fs.readdirSync(dir)
    files.forEach(file => {
      const filePath = path.join(dir, file)
      if (path.extname(filePath) === '.json') {
        const data = fs.readFileSync(filePath, 'utf8')
        let bookmark = JSON.parse(data)
        bookmark["path"] = filePath
        bookmarks.push(bookmark)
      }
      })
    // 
    console.log(bookmarks)
    return bookmarks
  }

// bookmark operations
function handleLoadBookmark(_, fpath) {
    console.log('loading bookmark...')
    const data = fs.readFileSync(fpath, 'utf8')
    let bookmark = JSON.parse(data)
    bookmark["path"] = fpath
    return bookmark
  }  

function handleSaveBookmark(_, bm) {
    console.log('saving bookmark...')
    let dir = path.join(__dirname, 'bookmarks')
    let fpath = path.join(dir, bm.name + '.json')
    let bookmark = {"name": bm.name, "code": bm.code}
    const data = JSON.stringify(bookmark)
    fs.writeFileSync(fpath, data)
}  
function handleEditBookmarkInner(_, fpath, info, win){
  new_bookmark = info
  console.log(new_bookmark)
  console.log(fpath)
  const data = JSON.stringify(new_bookmark)
  fs.writeFileSync(fpath, data)
  let child = BrowserWindow.fromId(win)
  child.close()
}
function handleEditBookmark(_, fpath, bm) {
    console.log('editing bookmark...')
    console.log(bm)
    let bookmark = {"name": bm.name, "code": bm.code, "path": fpath}
    const child = new BrowserWindow({ 
      parent: mainWindow, 
      modal: true, 
      show: false, 
      width: 300, 
      height: 500,
      webPreferences: {
        preload: path.join(__dirname, 'preload_bookmark.js'),
      }})
    bookmark["win"] = child.id
    child.loadFile('bookmark.html')
    child.once('ready-to-show', () => {
      child.webContents.send('bookmark-info', bookmark)
      child.show()
      child.on('close', () => {
        console.log("close")
      })
    })

}

function openFile() {
  console.log('open file...')
    const files = dialog.showOpenDialogSync(mainWindow, {
      filters: [
        { name: 'Word Documents', extensions: ['docx'] }
      ],
      properties: ['openFile']
    });
  
    if (files && files.length > 0) {
      const filePath = files[0];
      readDocxFile(filePath);
    }
  }
  
// Read and display .docx file content
function readDocxFile(filePath) {
    docxPath = filePath;
    mammoth.convertToHtml({path: filePath})
      .then((result) => {
        console.log(result.value);
        mainWindow.webContents.send('display-docx-content', result.value);
      })
      .catch((error) => {
        console.error(error);
      });
    
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
  mainWindow = win
}

app.whenReady().then(() => {
  // load config
  let config = fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8')
  config = JSON.parse(config)
  pythonPath = config.pythonPath
  llmPath = config.llmPath
  ipcMain.handle('get_text', handleGetText)
  ipcMain.handle('load_all_bookmarks', handleLoadAllBookmarks)
  ipcMain.handle('load_bookmark', handleLoadBookmark)
  ipcMain.handle('save_bookmark', handleSaveBookmark)
  ipcMain.handle('edit_bookmark', handleEditBookmark)
  ipcMain.handle('edit-bookmark-inner', handleEditBookmarkInner)
  ipcMain.handle('run_bookmark', handleRunBookmark)
  ipcMain.on('bookmark_menu', handleRunBookmarkMenu)
  createWindow()
  ipcMain.on('open-file', openFile);
  ipcMain.on('close-window', handleCloseWindow);

  app.on('activate', () => {
    // if (BrowserWindow.getAllWindows().length === 0) {
    //   createWindow()
    // }
  })

})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})