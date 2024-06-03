const userName = document.getElementById("username")
const startScreen = document.querySelector(".startScreen")
const playground = document.querySelector(".playground")
const endScreen = document.querySelector(".endScreen")
const questionCount = document.getElementById("questionCount")
const questionTimer = document.getElementById("questionTimer")
const question = document.getElementById("question")
const quizOptions = document.getElementById("quizOptions")
const quizBody = document.querySelector(".quizBody")
const loader = document.querySelector(".loader")
const finalScore = document.querySelector(".finalScore")

const resultUserName = document.getElementById("resultUserName")

let arrayQuestions = [],
  questionIndex = 0,
  score = 0,
  count = 10,
  countdown;

function startQuiz() {
  if (userName.value != "") {
    questionIndex = score = 0;
    startScreen.style.display = "none"
    playground.style.display = "block"
    endScreen.style.display = "none"
    nextButton.innerHTML = "Next"
    quizBody.style.display = "none"
    loader.style.display = "block" 
    loadQuestion();
  }
  else {
    userName.style.border = "2px solid red";
    userName.classList.add('error');
    setTimeout(function () {
      userName.classList.remove('error');
    }, 300);
  }
}

function loadQuestion() {
  fetch("https://opentdb.com/api.php?amount=5&category=18").then((response) => response.json()).then((data) => {
    arrayQuestions = data.results;
    displayQuestions(arrayQuestions[questionIndex]);
  })
}

function displayQuestions(questionData) {
  count = 10;
  clearInterval(countdown);

  // console.log(questionData);
  question.innerHTML = questionData.question;
  questionCount.innerHTML = questionIndex + 1;
  loadAnswers(questionData);
}

function loadAnswers(questionData) {
  quizOptions.innerHTML = "";
  let correct_answers = questionData.correct_answer;
  let correct_answer = [correct_answers]
  let answers = [...questionData.incorrect_answers, ...correct_answer];
  answers = answers.sort(() => Math.random() - 0.5)
  // console.log(answers);

  answers.forEach((answer, index) => {
    let option = document.createElement("li");
    option.innerHTML = answer;
    option.addEventListener("click", () =>{
      checkAnswers(option, answers, correct_answers)
    })
    quizOptions.append(option);
  });

  quizBody.style.display = "block";

  loader.style.display = "none";
  displayTimer();
}

function checkAnswers(answerOptions, answers, correctAnswers) {
  let correctElement;

  answers.forEach((answer)=>{
    if(htmlDecode(answer) === htmlDecode(correctAnswers)) {
      correctElement = [...quizOptions.childNodes].find((li)=>li.innerText === htmlDecode(correctAnswers));
    }
  })
  quizOptions.childNodes.forEach((li)=>{
    li.classList.add("disable");
  });

  if (htmlDecode(correctAnswers) === answerOptions.innerText) {
    answerOptions.classList.add("correct")
    score++;
  }
  else {
    answerOptions.classList.add("incorrect")
    correctElement.classList.add("correct")
  }
  clearInterval(countdown)
}

nextButton.addEventListener("click", ()=>{
  questionTimer.innerHTML = 10;
  if (nextButton.innerText == 'Next') {      
    questionIndex = questionIndex + 1;
    displayQuestions(arrayQuestions[questionIndex]);
  }
  else {
    showAnswers();
  }
  if (questionIndex == 4) {      
    nextButton.innerText = 'Submit';
  }
});

function showAnswers() {
  playground.style.display = 'none';
  endScreen.style.display = 'block';
  finalScore.innerHTML = score;
  resultUserName.innerHTML = userName.value;
  questionCount.innerHTML = 1;
  clearInterval(countdown);
  count = 10;
  // console.log(score)
}

function htmlDecode(html) {
  var txt = document.createElement("textarea")
  txt.innerHTML = html;
  return txt.value;
}

const displayTimer = () => {
  countdown = setInterval(() => {
      count--;
      questionTimer.innerHTML = count;
      if (count === 0) {
          clearInterval(countdown);
          quizOptions.childNodes.forEach((li)=>{
            li.classList.add("disable");
          });
          questionTimer.innerHTML = "Time's Up!";
          showAnswers();
      }
  }, 1000);
}