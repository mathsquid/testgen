const {app, BrowserWindow, dialog} = require('electron');
const fs = require('fs');
const windows = new Set();

let mainWindow = null;

app.on('ready', () => {createWindow();});

app.on('window-all-closed', () => {
  if (process.platform === 'darwin') {return false;}
});

app.on('activate', (event, hasVisibleWindows) =>{
  if (!hasVisibleWindows) {createWindow();}
});


app.on('will-finish-launching', () =>{
  app.on('open-file', (event, file) => {
    const win = createWindow();
      win.once('ready-to-show', () => {
        openFile(win, file);
      });
  });
});



const createWindow = exports.createWindow = () => {
  let x, y;

  const currentWindow = BrowserWindow.getFocusedWindow();
  if (currentWindow) {
    const [currentWindowX, currentWindowY] = currentWindow.getPosition();
    x = currentWindowX + 50;
    y = currentWindowY + 50;
  }

  let newWindow = new BrowserWindow({
    x,y,
    webPreferences:{
      nodeIntegration: true,
      enableRemoteModule: true
    }
  });
  newWindow.loadFile('index.html');
  newWindow.webContents.openDevTools();
  newWindow.setSize(1280,850);

  newWindow.on('closed', () => {
    newWindow = null;
  });

  windows.add(newWindow);
  return newWindow;
}


const getFileFromUser = exports.getFileFromUser = (targetWindow) => {
  const files = dialog.showOpenDialogSync(targetWindow, {
    properties: ['openFile']
    // need to add filters in here eventually
  });
  if (files) {openFile(targetWindow, files[0]);}
};


const openFile = exports.openFile = (targetWindow, file) => {
  const content = fs.readFileSync(file).toString();
  app.addRecentDocument(file);
  targetWindow.setRepresentedFilename(file);
  targetWindow.webContents.send('file-opened', file, content);

  console.log(file);
};


const exportLatex = exports.exportLatex = (targetWindow, content) => {
  const file = dialog.showSaveDialogSync(targetWindow, {
    title: 'Export Latex',
    defaultPath: app.getPath('desktop'),
    buttonLabel: 'Export',
    filters:[
      {name: 'Latex Files', extensions: ['.tex']}
    ]
  });
  if (!file) return ;
  fs.writeFileSync(file, content);
};
