// Bridge seguro para futuras funções nativas do SATS OS.
// Não exponha APIs Node diretamente à interface.
const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("satsDesktop", {
  isDesktop: true,
  platform: process.platform
});
