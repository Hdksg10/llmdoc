const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('text_input', {
  get_text: (text) => ipcRenderer.invoke('get_text', text),
  load_all_bookmarks: () => ipcRenderer.invoke('load_all_bookmarks'),
  load_bookmark: (path) => ipcRenderer.invoke('load_bookmark', path),
  save_bookmark: (path) => ipcRenderer.invoke('save_bookmark', path),
  load_docx: (path) => ipcRenderer.invoke('load_docx', path),
  save_docx: (path) => ipcRenderer.invoke('save_docx', path),
  // 除函数之外，我们也可以暴露变量
})