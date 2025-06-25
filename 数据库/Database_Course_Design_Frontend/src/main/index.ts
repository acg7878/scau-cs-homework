import { app, shell, BrowserWindow } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

function createWindow(): void {
  // Create the browser window.
  // 创建浏览器窗口
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: false, // 禁用上下文隔离
      webSecurity: false
    }
  })

  if (is.dev) {
    mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
      callback({
        responseHeaders: {
          ...details.responseHeaders,
          'Content-Security-Policy': [
            "default-src 'self'; connect-src 'self' http://localhost:5555; style-src 'self' 'unsafe-inline'; img-src 'self' data:; script-src 'self' 'unsafe-eval';"
          ]
        }
      })
    })
  }

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // 基于 electron-vite CLI 的渲染进程热模块替换（HMR）。
  // Load the remote URL for development or the local html file for production.
  // 在开发环境加载远程 URL，在生产环境加载本地 HTML 文件。
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// 当 Electron 完成初始化并准备好创建浏览器窗口时调用此方法。
// Some APIs can only be used after this event occurs.
// 一些 API 只能在此事件触发后使用。
app.whenReady().then(() => {
  // Set app user model id for windows
  // 为 Windows 设置应用程序用户模型 ID
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // 在开发环境下默认通过 F12 打开或关闭开发者工具，
  // 在生产环境下忽略 CommandOrControl + R 快捷键。
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    // 在 macOS 上，当点击 Dock 图标且没有其他窗口打开时，
    // 通常会重新创建一个窗口。
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
// 当所有窗口关闭时退出应用程序，macOS 除外。
// 在 macOS 上，应用程序和菜单栏通常会保持活动状态，直到用户显式退出（Cmd + Q）。
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
// 在此文件中可以包含应用程序主进程的其他代码。
// 你也可以将它们放在单独的文件中并在这里引入。
