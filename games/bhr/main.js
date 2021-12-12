const { app, BrowserWindow, Menu } = require('electron');

app.on('ready', function () {
    const win = new BrowserWindow({ title: "Black Hat Rider Offline Editor", icon: __dirname + '/icon.ico', useContentSize: true });

    const mainMenu = Menu.buildFromTemplate([
        {
            label: "File",
            submenu: [
                {
                    label: "New",
                    click() {
                        win.webContents.executeJavaScript("Game.newRide(\"-18 1i 18 1i\")")
                    }
                },
                {
                    label: "Load",
                    click() {
                        win.webContents.executeJavaScript(`document.getElementById(\"canvas_rider\").style.display = \"none\";
                        document.getElementById(\"track_menu\").style.display = \"block\";
                        document.getElementById(\"trackcode\").focus();`)
                    }
                },
                {
                    label: "Save",
                    click() {
                        win.webContents.executeJavaScript("Game.saveRide()")
                    }
                },
                {
                    label: "Exit",
                    click() {
                        app.quit()
                    }
                }
            ]
        },
        {
            label: "Race",
            submenu: [
                {
                    label: "Save Ghost",
                    click() {
                        win.webContents.executeJavaScript(`Game.saveGhost()`)
                    }
                },
                {
                    label: "Load Ghost",
                    click() {
                        win.webContents.executeJavaScript(`document.getElementById(\"canvas_rider\").style.display = \"none\";
                        document.getElementById(\"track_menu\").style.display = \"block\";
                        document.getElementById(\"trackcode\").value = \"GHOST: \";
                        document.getElementById(\"trackcode\").focus();`)
                    }
                },
                {
                    label: "Clear",
                    click() {
                        app.quit()
                    }
                }
            ]
        },
        {
            label: "Debug",
            submenu: [
                {
                    label: "Toggle DevTools",
                    click() {
                        win.toggleDevTools();
                    }
                },
                {
                    label: "Restart",
                    click() {
                        app.relaunch();
                        app.quit();
                    }
                }
            ]
        }
    ]);
    
    win.setMenu(mainMenu)
    win.loadFile('index.html')

    win.on('closed', function () {
        app.quit();
        process.exit();
    });
});

app.on('window-all-closed', function () {
    if(process.platform !== 'win32') {
        app.quit();
        process.exit();
    }
});