const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('text_input', {
  get_text: (text) => ipcRenderer.invoke('get_text', text),

  // 除函数之外，我们也可以暴露变量
})
contextBridge.exposeInMainWorld('bookmark', {
  load_all_bookmarks: () => ipcRenderer.invoke('load_all_bookmarks'),
  reload_all_bookmarks: (callback) => ipcRenderer.on('reload_all_bookmarks', (_event, bookmarks) => callback(bookmarks)),
  load_bookmark: (fpath) => ipcRenderer.invoke('load_bookmark', fpath),
  edit_bookmark: (fpath, bm) => ipcRenderer.invoke('edit_bookmark', fpath, bm),
  run_bookmark: (fpath) => ipcRenderer.invoke('run_bookmark', fpath),
  bookmark_menu: (bm) =>ipcRenderer.send("bookmark_menu", bm), 
  // 除函数之外，我们也可以暴露变量
})
contextBridge.exposeInMainWorld('docx', {
  open_file: () => ipcRenderer.send('open-file'),
  disply_docx_content: (callback) => ipcRenderer.on('display-docx-content', (_event, content) => callback(content)),
  // save_file
})
