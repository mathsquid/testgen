const {remote, ipcRenderer} = require('electron');
const mainProcess = remote.require('./main.js');
const pb = require('./problems.js');

const currentWindow = remote.getCurrentWindow();

const newFileButton  = document.querySelector('#new-file');;
const openFileButton = document.querySelector('#open-file');
const newProblemButton = document.querySelector('#new-problem');
const duplicateProblemButton = document.querySelector('#duplicate-problem');
var masterTable = document.querySelector("#masterTable");
var detailTable = document.querySelector("#detailTable");
var problemNumber = document.querySelector("#problemNumber");
var problemDescription = document.querySelector('#problemDescription');
var problemText = document.querySelector('#problemText');
var questionText = document.querySelector('#questionText');
var problemPPreview = document.querySelector("#problemPPreview");



let pip = [];
var selectedProblemNumber = 1;


newFileButton.addEventListener('click', () => {
  mainProcess.createWindow();
  console.log("newFileButton Pressed");
});

newProblemButton.addEventListener('click', () => {
  a = new pb.Problem;
  if (pip.length==0) pip.push(a);
  pip.push(a);
  updateMasterTable();
});

duplicateProblemButton.addEventListener('click', () => {
  a = new pb.Problem;
  pip.push(a);
  updateMasterTable();
});



problemDescription.addEventListener('keyup', () => {
  pip[selectedProblemNumber].problemDescription = problemDescription.value;
  masterTable.rows[selectedProblemNumber].cells[1].innerText = problemDescription.value;
});

questionText.addEventListener('keyup', () => {
  pip[selectedProblemNumber].questionText = questionText.value;
});


openFileButton.addEventListener('click', () => {
  mainProcess.getFileFromUser(currentWindow);
});

ipcRenderer.on('file-opened', (event, file, content) => {
  pip=[];
  const aa =  pb.Problem();

  pip = JSON.parse(content);
  // convert the objects to Problems.
  pip.forEach(e => Object.setPrototypeOf(e, pb.Problem.prototype));
  pip.unshift(aa); // insert a dummy problem as problem 0 to make the indexing
                   // start at 1, and to make the probelm number match the
                   // row index of masterTable

  updateMasterTable();

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
    r = masterTable.insertRow(i);
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

      selectedProblemNumber = rowId;
      // console.log("Selected Problem is "+selectedProblemNumber);
      rowSelected.className += " selected";
      updateDetailTable();

    }
  }
}
