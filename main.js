const { app, BrowserWindow, shell, ipcMain, dialog } = require("electron");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const { spawn } = require("node:child_process");
let browserProcess = null;

ipcMain.handle("sats:pick-files", async () => {
  const result = await dialog.showOpenDialog({ properties: ["openFile", "multiSelections"] });
  if (result.canceled) return [];
  return Promise.all(result.filePaths.map(async filePath => {
    const stat = await fs.stat(filePath);
    return { name: path.basename(filePath), path: filePath, size: stat.size, isDirectory: stat.isDirectory() };
  }));
});

ipcMain.handle("sats:open-home-folder", async () => {
  const error = await shell.openPath(os.homedir());
  return error || "OK";
});

ipcMain.handle("sats:save-text", async (_event, { suggestedName, content }) => {
  if (typeof content !== "string" || content.length > 2_000_000) {
    throw new Error("Conteúdo inválido ou maior que 2 MB.");
  }
  const result = await dialog.showSaveDialog({ defaultPath: path.basename(suggestedName || "arquivo.txt") });
  if (result.canceled || !result.filePath) return { canceled: true };
  await fs.writeFile(result.filePath, content, "utf8");
  return { canceled: false, path: result.filePath };
});

ipcMain.handle("sats:launch-browser", async () => {
  // Launch the separate SATS Browser project if it has been cloned beside stas-os.
  const browserDir = path.resolve(__dirname, "..", "sats-browser");
  const browserPackage = path.join(browserDir, "package.json");
  try {
    await fs.access(browserPackage);
    if (browserProcess && !browserProcess.killed) return { ok: true, message: "SATS Browser já está aberto." };
    browserProcess = spawn("npm", ["start"], { cwd: browserDir, detached: true, stdio: "ignore" });
    browserProcess.unref();
    return { ok: true, message: "SATS Browser iniciado." };
  } catch {
    return { ok: false, message: "Não encontrei ~/sats-browser. Clone o projeto SATS Browser ao lado da pasta stas-os para integrar os dois aplicativos." };
  }
});

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 800,
    minHeight: 560,
    title: "SATS OS",
    backgroundColor: "#050505",
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  win.loadFile(path.join(__dirname, "index.html"));

  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https://") || url.startsWith("http://")) {
      shell.openExternal(url);
    }
    return { action: "deny" };
  });
}

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
