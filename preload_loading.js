const { contextBridge, ipcRenderer } = require('electron')
contextBridge.exposeInMainWorld('loading', {
    get_info: (callback) => ipcRenderer.on('loading-info', (_event, info) => callback(info)),
    loading_done: (callback) => ipcRenderer.on('loading-done', (_event, code) => callback(code)),
    // 除函数之外，我们也可以暴露变量
    // window object
    close_window: (wid) => ipcRenderer.send('close-window', wid),
    save_bookmark: (bm) => ipcRenderer.invoke('save_bookmark',bm),
})