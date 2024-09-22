const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    readSettings: () => ipcRenderer.invoke('read-settings'),
    writeSettings: (data) => ipcRenderer.invoke('write-settings', data),
    runScript: (script) => ipcRenderer.invoke('run-script', script),
    clearSetting: (key) => ipcRenderer.invoke('clear-setting', key),
    updateSetting: (key, newValue) => ipcRenderer.invoke('update-setting', key, newValue)
});
