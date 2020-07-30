const {app, dialog, BrowserWindow, Menu, MenuItem ,shell} = require('electron');
const mainProcess = require('./main');

const template = [
  {
    label:'File',
    submenu:[
      {
        label: 'New File',
        accelerator:'CommandOrControl+N',
        click(){
          mainProcess.createWindow();
        }
      },



      {
        label: 'Open File',
        accelerator:'CommandOrControl+O',
        click(item, focusedWindow){
          mainProcess.getFileFromUser(focusedWindow);
        }
      },



      {
        label: 'Save File',
        accelerator:'CommandOrControl+S',
        click(item, focusedWindow){
          if (!focusedWindow){
            return dialog.showErrorBox('Error.', 'There is nothing to save.');
          }
          return dialog.showErrorBox('No Can Do', 'Save is not yet implemented. :(');

        }
      },



      {
        label: 'Export LaTeX',
        accelerator:'CommandOrControl+T',
        click(item, focusedWindow){
          focusedWindow.generateLatex();
          mainProcess.exportLatex(focusedWindow, focusedWindow.latexedOutput);        }
      },
    ]
  },








  {
    label: 'Edit',
    submenu: [
      {
        label: 'Undo',
        accelerator: 'CommandOrControl+Z',
        role: 'undo',
      },
      {
        label: 'Redo',
        accelerator: 'Shift+CommandOrControl+Z',
        role: 'redo',
      },
      {type: 'separator'},
      {
        label: 'Cut',
        accelerator: 'CommandOrControl+X',
        role: 'cut',
      },
      {
        label: 'Copy',
        accelerator: 'CommandOrControl+C',
        role: 'copy',
      },
      {
        label: 'Paste',
        accelerator: 'CommandOrControl+V',
        role: 'paste',
      },
      {
        label: 'Select All',
        accelerator: 'CommandOrControl+A',
        role: 'selectall',
      },
    ],
  },
  {
    label:'Window',
    submenu: [
      {
        label:'Minimize',
        accelerator: 'CommandOrControl+M',
        role: 'minimize',
      },
      {
        label:'Close',
        accelerator: 'CommandOrControl+W',
        role: 'close',
      },
    ],
  },
];


if (process.platform ==='darwin'){
  const name = 'TestGen3K';
  template.unshift({
    label:name,
    submenu: [
      {
        label:`About ${name}`,
        role: 'about'
      },
      {type: 'separator'},
      {
        label:'Hide',
        accelerator: "Command+H",
        role:'hide',
      },
      {
        label:'Hide Others',
        accelerator: "Command+Alt+H",
        role:'hideothers',
      },
      {
        label:'Show All',
        role:'showall',
      },
      {type: 'separator'},
      {
        label:`Quit ${name}`,
        accelerator: "Command+Q",
        click(){app.quit();},
      },

    ],

  });

  const windowMenu  = template.find(item => item.label === 'Window');
  windowMenu.role = 'window';
  windowMenu.submenu.push(
    {type: 'separator'},
    {
      label: 'Bring All to Front',
      role: 'front',
    }
  );
}


module.exports = Menu.buildFromTemplate(template);
