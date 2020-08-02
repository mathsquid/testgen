function variableProfile(){
  this.type='integer';
  this.decimalPlaces = 3;
  this.identifierCharacter ='';
  this.minimum=-10;
  this.maximum=10;
  this.nonzero=false;
  this.value = Math.floor(Math.random()*(this.maximum-this.minimum+1)+this.minimum);
}

function Problem(){
  this.problemDescription = "";
  this.questionText = "";
  this.variables = [];
  this.answers = [];
  for (var i=0; i<5; i++) {
    var a = new variableProfile;
    a.identifierCharacter = String.fromCharCode(65+i);
    this.variables.push(a);
  }
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

  // GENERATE VALUES FOR THE Variables
  this.variables.forEach((v) => {
    if (v.maximum < v.minimum) {
      alert("maximum less than minimum");
      return;
    }
    trials = 0;
    do{
        min = Math.ceil(v.minimum);
        max = Math.floor(v.maximum);
        if(v.type=='integer') max = max+1;
        v.value = Math.random() * (max-min) + min;
        if(v.type=='integer') v.value = Math.floor(v.value);
        if(v.type=='fixed') { v.value = Math.floor(10**v.decimalPlaces * v.value )/(10**v.decimalPlaces);}
        trials++;

      }
    while (v.nonzero==true && v.value == 0 && trials < 10);
    if (trials >8) alert("Problem with variable" + v.identifierCharacter);
  });

  chunks.forEach((item) => {
    if (item.match(/^~/)) {
      // process the expression
      // remove the tilde
      item = item.substr(1);
      // replace the variables with their values
      for (var i=0; i<5; i++){
        h = new RegExp(this.variables[i].identifierCharacter, 'g');
        item  = item.replace(h, this.variables[i].value);
      }
    }

    // do any computations  Probably use KAS.js or math.js
    // along with a custom function to handle symbolic square roots
    // add the chunk to the output string.
    // maybe add in transformations to convert 1x to x, x^1 to x, etc

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
