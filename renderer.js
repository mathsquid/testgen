const {remote, ipcRenderer} = require('electron');
const mainProcess = remote.require('./main.js');
const pb = require('./problems.js');

const path = require('path');
const math = require('math.js');



let filePath = null;
let originalContent = '';
let latexedOutput = '';
let headerText = `\\documentclass{article}
    \\pagestyle{empty}
    \\setlength{\\textwidth}{6.5in} \\setlength{\\textheight}{9.5in}
    \\setlength{\\topmargin}{0in} \\setlength{\\headheight}{0in}
    \\setlength{\\headsep}{0in} \\setlength{\\oddsidemargin}{0in}
    \\setlength{\\evensidemargin}{0in} \\setlength{\\marginparwidth}{0in}
    \\setlength{\\marginparsep}{0in} \\setlength{\\footskip}{0.17in}
    \\vfuzz2pt
    \\hfuzz2pt
    \\parindent=0in
    \\begin{document}
    MATH 1634 \\hfill Final Exam A \\hfill Name: \\rule{2in}{.01in}

    Fall 2020
    \\vspace{2mm}\\hrule
    \\begin{enumerate}%------------------------------------------------------------------------------\n`


const currentWindow = remote.getCurrentWindow();

const newFileButton  = document.querySelector('#new-file');;
const openFileButton = document.querySelector('#open-file');
const saveFileButton = document.querySelector('#save-file');
const latexButton = document.querySelector('#export-latex');
const newProblemButton = document.querySelector('#new-problem');
const duplicateProblemButton = document.querySelector('#duplicate-problem');
const deleteProblemButton = document.querySelector('#delete-problem');
const refreshPreviewButton = document.querySelector('#refresh-preview');
var variableTable = document.querySelector("#variableTable");
var detailTable = document.querySelector("#detailTable");
var masterTable = document.querySelector("#masterTable");
var problemNumber = document.querySelector("#problemNumber");
var problemDescription = document.querySelector('#problemDescription');
var problemText = document.querySelector('#problemText');
var questionText = document.querySelector('#questionText');
var problemPPreview = document.querySelector("#problemPPreview");


let pip = []; // pip is the list of problems
var selectedProblemNumber = null;

const updateUserInterface = (isEdited) => {
  let title = 'TestGen3K';
  if (filePath) {title = `${path.basename(filePath)} - ${title}`;}
  if (isEdited) {title = `${title} (Edited)`;}
  currentWindow.setTitle(title);
  currentWindow.setDocumentEdited((isEdited));
  saveFileButton.disabled = !isEdited;
  latexButton.disabled = pip.length > 0 ? 0 : 1;
}


// const renderFile = (file, content) => {
//   filePath = file;
//   originalContent = content;
//   updateUserInterface(false);
// }


buildVariableTable();


detailTable.addEventListener('keyup', () => {
  updateUserInterface(JSON.stringify(pip) != originalContent);
});




newFileButton.addEventListener('click', () => {
  mainProcess.createWindow();
  console.log("newFileButton Pressed");
});

newProblemButton.addEventListener('click', () => {
  a = new pb.Problem;
  if (pip.length==0) {pip.push(new pb.Problem);
    console.log("NEWPROBLEM");}
    pip.push(a);
    updateMasterTable();
  });

  duplicateProblemButton.addEventListener('click', () => {
    if (selectedProblemNumber>0){
      console.log("selected problem " + selectedProblemNumber);
      a = pb.cloneProblem(pip[selectedProblemNumber]);
      a.problemNumber = pip.length;
      pip.push(a);
      updateMasterTable();
    }
  });

  deleteProblemButton.addEventListener('click', () => {
    if(selectedProblemNumber>0){
      pip.splice(selectedProblemNumber, 1);
      selectedProblemNumber = null;
      updateMasterTable();
      console.log("selected problem " + selectedProblemNumber);
    }
  });


  saveFileButton.addEventListener('click', () => {
    pip.shift();
    pip.unshift(headerText);
    console.log(pip);
    mainProcess.saveTestFile(currentWindow, filePath,JSON.stringify(pip));
    // mainProcess.saveTestFile(currentWindow, filePath,JSON.stringify(pip.slice(1,pip.length)));
  });




  refreshPreviewButton.addEventListener('click', () => {
    console.log(selectedProblemNumber);
    pip[selectedProblemNumber].compileProblem();
    problemPPreview.value = pip[selectedProblemNumber].processedQuestionText;
    updateVariableTable();
    //ADD IN refresh answers and variables

  });




  latexButton.addEventListener('click', () =>{
    generateLatex();
    mainProcess.exportLatex(currentWindow, latexedOutput);
  });


  function generateLatex(){
//    latexedOutput = '';

    headerText = `\\documentclass{article}
    \\pagestyle{empty}
    \\setlength{\\textwidth}{6.5in} \\setlength{\\textheight}{9.5in}
    \\setlength{\\topmargin}{0in} \\setlength{\\headheight}{0in}
    \\setlength{\\headsep}{0in} \\setlength{\\oddsidemargin}{0in}
    \\setlength{\\evensidemargin}{0in} \\setlength{\\marginparwidth}{0in}
    \\setlength{\\marginparsep}{0in} \\setlength{\\footskip}{0.17in}
    \\vfuzz2pt
    \\hfuzz2pt
    \\parindent=0in
    \\begin{document}
    MATH 1634 \\hfill Final Exam A \\hfill Name: \\rule{2in}{.01in}

    Fall 2020
    \\vspace{2mm}\\hrule
    \\begin{enumerate}%------------------------------------------------------------------------------\n`

    latexedOutput = headerText;

    for (var i=1; i<pip.length; i++){
      console.log("problem"+ i);
      latexedOutput = latexedOutput + "\n% Problem " + i + "------------------------------------------\n";
      latexedOutput = latexedOutput + "\\item \n";

      latexedOutput = latexedOutput + "\\hrule\\begin{minipage}{\\linewidth}\n";
      pip[i].compileProblem();
      latexedOutput = latexedOutput + pip[i].processedQuestionText;
      latexedOutput = latexedOutput + "\n\n";
      latexedOutput = latexedOutput + "\\end{minipage}";
      latexedOutput = latexedOutput + "\\vspace{"+ pip[i].linesOfWorkSpace +"em}";
    }

    latexedOutput = latexedOutput +"\\end{enumerate}\\end{document}";

  }





  linesOfWorkSpace.addEventListener('keyup', ()=>{
    pip[selectedProblemNumber].linesOfWorkSpace = linesOfWorkSpace.value;
  });

  problemDescription.addEventListener('keyup', () => {
    pip[selectedProblemNumber].problemDescription = problemDescription.value;
    masterTable.rows[selectedProblemNumber].cells[1].innerText = problemDescription.value;
  });

  questionText.addEventListener('keyup', () => {
    pip[selectedProblemNumber].questionText = questionText.value;
  });


  openFileButton.addEventListener('click', () => {
    if (currentWindow.isDocumentEdited()){
      const result = remote.dialog.showMessageBoxSync(currentWindow, {
        type: 'warning',
        title: 'Unsaved changes will be overwritten.',
        message: 'Opening a new file will overwrite the current file.',
        buttons: [
          'Proceed',
          'Cancel',
        ],
        defaultId: 1,
        cancelId: 0,
      });
      if (result === 1) {return};
    }
    mainProcess.getFileFromUser(currentWindow);
  });

  ipcRenderer.on('file-opened', (event, file, content) => {
    pip=[];
    filePath = file;
    const aa =  pb.Problem();
    originalContent = content;
    console.log("FILE OPENED: \n" + file);
    console.log(content);
    console.log("piplengthis " + pip.length);
    pip = JSON.parse(content);
    headerText = pip[0];
    pip.shift();
    pip.forEach(e => {Object.setPrototypeOf(e, pb.Problem.prototype); console.log("X")});
    pip.unshift(aa); // insert a dummy problem as problem 0 to make the indexing
    // start at 1, and to make the probelm number match the
    // row index of masterTable
    // convert the objects to Problems.

    updateMasterTable();
    updateUserInterface();

    // console.log(pip);
    //
    // console.log(pip[0]);
    //
    // pip[0].problemDescription = "PIPPISQUEAK!";
    // pip[0].generateTestProblem();
    // console.log(pip[0]);
    //



  });



  function updateMasterTable(){
    // delete the existing rows.
    for (var i=masterTable.rows.length-1; i>0; i--){
      // console.log("deleting row "+i);
      masterTable.deleteRow(i);
    }
    // populate the rows from the list of problems.
    for (var i=1; i<pip.length; i++){
      r = masterTable.insertRow(i); // CHECK HERE IF ERROR ABOUT r
      c1 = masterTable.rows[i].insertCell();
      c2 = masterTable.rows[i].insertCell();
      c1.innerText = i;
      c2.innerText = pip[i].problemDescription;
    }
    // make the rows selectable.
    highlight_row();
  }


  function updateDetailTable(){
    problemDescription.value = pip[selectedProblemNumber].problemDescription;
    problemNumber.value = selectedProblemNumber;
    questionText.value = pip[selectedProblemNumber].questionText;
    pip[selectedProblemNumber].compileProblem();
    problemPPreview.value = pip[selectedProblemNumber].processedQuestionText;
    linesOfWorkSpace.value = pip[selectedProblemNumber].linesOfWorkSpace;
    problemDescription.disabled = false;
    questionText.disabled = false;
    linesOfWorkSpace.disabled = false;

    updateVariableTable();


  }




  function updateIthVariableFROMTable(i) {
    var vv = pip[selectedProblemNumber].variables[i];
    variableTable.rows[i+1].cells(0).children[0].value
    vv.type                = variableTable.rows[i+1].cells(0).children[0].value;
    vv.decimalPlaces       = variableTable.rows[i+1].cells(1).children[0].value;
    vv.identifierCharacter = variableTable.rows[i+1].cells(2).children[0].value;
    vv.maximum             = variableTable.rows[i+1].cells(3).children[0].value;
    vv.nonzero             = variableTable.rows[i+1].cells(4).children[0].value;
    vv.value               = variableTable.rows[i+1].cells(5).children[0].value;
  }



//--------------------------------
//--------------------------------
//--------------------------------
//--------------------------------
//--------------------------------


  function buildVariableTable(){
    for (var i=variableTable.rows.length-1; i>0; i--){
      // console.log("deleting row "+i);
      variableTable.deleteRow(i);
    }

    for (let i=0; i<5; i++){
      let r = variableTable.insertRow();
      for (let j=0; j<7; j++){
        let c = r.insertCell();
        let ii = document.createElement("input");
        ii.setAttribute("size","5");
        c.appendChild(ii);
        ii.addEventListener('keyup', ()=>{
          console.log("==>"+ i);
          //          pip[selectedProblemNumber].variables[i].type = "DAVID";
          switch (j) {
            case 0: pip[selectedProblemNumber].variables[i].identifierCharacter = ii.value;
            break;
            case 1: pip[selectedProblemNumber].variables[i].type = ii.value;
            break;
            case 2: pip[selectedProblemNumber].variables[i].minimum = Number(ii.value);
            break;
            case 3: pip[selectedProblemNumber].variables[i].maximum = Number(ii.value);
            break;
            case 4: pip[selectedProblemNumber].variables[i].nonzero = ii.value;
            break;
            case 5: pip[selectedProblemNumber].variables[i].decimalPlaces = Number(ii.value);
            break;
            case 6: pip[selectedProblemNumber].variables[i].value = Number(ii.value);
            break;
            default:

          }
        });
      }
    }
  }



  function updateVariableTable(){
    for (var i=0; i<5; i++){
      variableTable.rows[i+1].cells[0].children[0].value= pip[selectedProblemNumber].variables[i].identifierCharacter;
      variableTable.rows[i+1].cells[1].children[0].value= pip[selectedProblemNumber].variables[i].type;
      variableTable.rows[i+1].cells[2].children[0].value= pip[selectedProblemNumber].variables[i].minimum;
      variableTable.rows[i+1].cells[3].children[0].value= pip[selectedProblemNumber].variables[i].maximum;
      variableTable.rows[i+1].cells[4].children[0].value= pip[selectedProblemNumber].variables[i].nonzero;
      variableTable.rows[i+1].cells[5].children[0].value= pip[selectedProblemNumber].variables[i].decimalPlaces;
      variableTable.rows[i+1].cells[6].children[0].value= pip[selectedProblemNumber].variables[i].value;

    }
  }





  function updateVariableTable2(){
    for (var i=variableTable.rows.length-1; i>0; i--){
      // console.log("deleting row "+i);
      variableTable.deleteRow(i);
    }

    for (var i=0; i<5; i++){
      r = variableTable.insertRow();
      var vv = pip[selectedProblemNumber].variables[i];
      c1 = r.insertCell();
      c1.innerHTML = "<input size=5 value = \""+vv["identifierCharacter"]+"\" id = \""+'pojpoj'+"\"></input>";
      // c1.innerHTML = "<input size = 5></input>"
      c1 = r.insertCell();
      c1.innerHTML = "<input size=5 value = \""+vv["type"]+"\"id = \""+'pojpoj'+"\"></input>";
      c1 = r.insertCell();
      c1.innerHTML = "<input size=5 value = \""+vv["minimum"]+"\"id = \""+'pojpoj'+"\"></input>";
      c1 = r.insertCell();
      c1.innerHTML = "<input size=5 value = \""+vv["maximum"]+"\"id = \""+'pojpoj'+"\"></input>";
      c1 = r.insertCell();
      c1.innerHTML = "<input size=5 value = \""+vv["nonzero"]+"\"id = \""+'pojpoj'+"\"></input>";
      c1 = r.insertCell();
      c1.innerHTML = "<input size=5 value = \""+vv["decimalPlaces"]+"\"id = \""+'pojpoj'+"\"></input>";
      c1 = r.insertCell();
      c1.innerHTML = "<input size=5 value = \""+vv["value"]+"\"id = \""+'pojpoj'+"\"></input>";
    }
  }





  highlight_row();
  function highlight_row() {
    var table = document.getElementById('masterTable');
    var cells = table.getElementsByTagName('td');

    for (var i = 0; i < cells.length; i++) {
      // Take each cell
      var cell = cells[i];
      // do something on onclick event for cell
      cell.onclick = function () {

        // Get the row id where the cell exists
        var rowId = this.parentNode.rowIndex;

        var rowsNotSelected = table.getElementsByTagName('tr');
        for (var row = 0; row < rowsNotSelected.length; row++) {
          rowsNotSelected[row].style.backgroundColor = "";
          rowsNotSelected[row].classList.remove('selected');
        }
        var rowSelected = table.getElementsByTagName('tr')[rowId];
        deleteProblemButton.disabled = selectedProblemNumber > 0 ? 0 : 1;

        selectedProblemNumber = rowId;
        deleteProblemButton.disabled = selectedProblemNumber > 0 ? 0 : 1;
        duplicateProblemButton.disabled = selectedProblemNumber > 0 ? 0 : 1;
        refreshPreviewButton.disabled = selectedProblemNumber > 0 ? 0 : 1;

        // console.log("Selected Problem is "+selectedProblemNumber);
        rowSelected.className += " selected";
        updateDetailTable();
      }
    }
  }
