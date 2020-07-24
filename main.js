const {app, BrowserWindow, dialog} = require('electron');
const fs = require('fs');


let mainWindow = null;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    webPreferences:{
      nodeIntegration: true,
      enableRemoteModule: true
    }
  });
  mainWindow.loadFile('index.html');
  mainWindow.webContents.openDevTools();
  mainWindow.setSize(1280,800);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});



const getFileFromUser = exports.getFileFromUser = () => {
  const files = dialog.showOpenDialogSync(mainWindow, {
    properties: ['openFile']
  });
  if (files) {openFile(files[0]);}
};


const openFile = (file) => {
  const content = fs.readFileSync(file).toString();
  mainWindow.webContents.send('file-opened', file, content);
};
