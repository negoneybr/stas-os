// Bridge seguro para futuras funções nativas do SATS OS.
// Não exponha APIs Node diretamente à interface.
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("satsDesktop", {
  isDesktop: true,
  platform: process.platform,
  pickFiles: () => ipcRenderer.invoke("sats:pick-files"),
  importTextFile: () => ipcRenderer.invoke("sats:import-text"),
  openHomeFolder: () => ipcRenderer.invoke("sats:open-home-folder"),
  saveTextFile: (suggestedName, content) => ipcRenderer.invoke("sats:save-text", { suggestedName, content }),
  launchBrowser: () => ipcRenderer.invoke("sats:launch-browser")
});
