const { contextBridge, ipcRenderer} = require('electron')
contextBridge.exposeInMainWorld('bookmark', {
    get_info: (callback) => ipcRenderer.on('bookmark-info', (_event, info) => callback(info)),
    edit_bookmark: (fpath, info, win) => ipcRenderer.invoke('edit-bookmark-inner', fpath, info, win),
    run_bookmark: (fpath) => ipcRenderer.invoke('run_bookmark', fpath),
    // 除函数之外，我们也可以暴露变量
    // window object
})