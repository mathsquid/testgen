
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
     this.processedAnswers = [];
     this.processedQuestionText="TT:"+this.questionText;
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

module.exports = { Problem, problemFromJSON};
