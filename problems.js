
function Problem(){
  this.problemDescription = "";
  this.questionText = "";
  this.variables = [];
  this.answers = [];
  this.processedQuestionText = "";
  this.processedAnswers = [];
  this.problemNumber = 0;
  this.linesOfWorkSpace = 0;
}

Problem.prototype.compileProblem = function () {
  // Pick Values for the Variables
  // Fill this in later

  var s = ""
  var chunks = this.questionText.split('#');

  chunks.forEach((item) => {
    if (item.match(/^~/)) {
      // process the expression
      // remove the tilde
      item = item.substr(1);
      // replace the variables with their values
      item  = item.replace(/A/g, 1);
      item  = item.replace(/B/g, 2);
      item  = item.replace(/C/g, 3);
      item  = item.replace(/D/g, 4);
      // do any computations  Probably use KAS.js or math.js
      // along with a custom function to handle symbolic square roots
    }
    // add the chunk to the output string.
    s = s+item;
});

  this.processedQuestionText = s;


  this.processedAnswers = [];
  this.answers.forEach( e => this.processedAnswers.push("RR"+e));
};


//---------------------------------------------------------
//---------------------------------------------------------

function problemFromJSON(jsonObject){
  var a = new Problem;
  a.problemDescription = jsonObject["problemDescription"];
  a.questionText = jsonObject["questionText"];
  a.variables = [];
  a.answers = [];
  a.processedQuestionText="";
  a.processedAnswers = [];
  a.problemNumber = jsonObject["problemNumber"];
  a.linesOfWorkSpace = jsonObject["linesOfWorkSpace"];

  return a;
}


function cloneProblem(existing){
  var a = new Problem;
  a.problemDescription = existing.problemDescription;
  a.questionText = existing.questionText;
  a.variables = [];
  existing.variables.forEach(e => { a.variables.push(e) });
  existing.answers.forEach(e => { a.answers.push(e) });
  a.linesOfWorkSpace = existing.linesOfWorkSpace;

  return a;
}


module.exports = { Problem, problemFromJSON, cloneProblem};
