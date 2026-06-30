// Select The Elements
let quizApp = document.querySelector(".quiz-app");
let countSpan = document.querySelector(".quiz-info .count span");
let bullets = document.querySelector(".spans");
let info = document.querySelector(".bullets");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitBtn = document.querySelector(".submit-button");
// Current Question
let currentIndex = 0;
// Right Ansewrs
let RightAnswers = 0;
let countdownInteral;
let countdownElement = document.querySelector(".countdown");
function getQuestions() {
    let myRequest = new XMLHttpRequest();
    myRequest.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let questions = JSON.parse(this.responseText);
            createBullets(questions.length);
            addQuestionData(questions[currentIndex], questions.length);
            countdown(150, questions.length);
            submitBtn.addEventListener("click", function() {
                let theRightAnswer = questions[currentIndex].right_answer
                checkAnswer(theRightAnswer, questions.length)
                if (currentIndex+1 < questions.length) {
                    answersArea.innerHTML = "";
                    quizArea.innerHTML = "";
                    currentIndex++;
                    addQuestionData (questions[currentIndex], questions.length)
                    bulletsClass ();
                    clearInterval(countdownInteral);
                    countdown(150, questions.length);
                } else {
                    showResults(questions.length);
                }
            });
        }
    }
    myRequest.open("GET", "questions.json");
    myRequest.send();
}

getQuestions ()

function createBullets (num) {
    countSpan.innerHTML = num;
    for (let i=0; i<num ; i++) {
        let bullet = document.createElement("span")
        bullets.appendChild(bullet)
        if (i === 0) {
            bullet.className = "active";
        }
    }
}

function addQuestionData (qobj, count) {
    if (currentIndex < count) {
        let questionTitle = document.createElement("h2");
        let questionText = document.createTextNode(qobj["title"]);
        questionTitle.appendChild(questionText);
        quizArea.appendChild(questionTitle);
        for (let i=0; i<4; i++) {
            // Answer Div
            let answer = document.createElement("div")
            answer.classList = "answer";
            // Radio Input
            let radioInput = document.createElement("input");
            radioInput.name = 'question';
            radioInput.type = 'radio';
            radioInput.id = `answer_${i+1}`;
            radioInput.dataset.answer = qobj[`answer_${i+1}`]
            
            // The Label
            let label = document.createElement("label");
            label.htmlFor = `answer_${i+1}`;
            let answerText = document.createTextNode(qobj[`answer_${i+1}`]);
            label.appendChild(answerText);
            
            answer.appendChild(radioInput)
            answer.appendChild(label)
            answersArea.appendChild(answer)
            
            
        }
    }
}

function checkAnswer (right_answer, count) {
    let answers = document.getElementsByName("question")
    let theChoosenAnswer;
    for (let i=0 ; i<answers.length ; i++) {
        if (answers[i].checked) {
            theChoosenAnswer = answers[i].dataset.answer
        }
    }
    if (right_answer === theChoosenAnswer) {
        RightAnswers++;
        console.log("yes")
    }
}
function bulletsClass () {
    let bulletsSpans = Array.from(document.querySelectorAll(".bullets .spans span"))
    bulletsSpans.forEach((span,index) => {
        span.className = "";
        if (currentIndex === index) {
            span.className = "active"
        }
    })
}

function showResults (count) {
    quizArea.remove()
    answersArea.remove()
    info.remove()
    submitBtn.remove()
    let resultsDiv = document.createElement("div");
    resultsDiv.classList = "results";
    let evaluate = document.createElement("span");
    if (RightAnswers > (count / 2) && RightAnswers < count) {
        let evaluateText = document.createTextNode("Good: ");
        evaluate.appendChild(evaluateText);
        evaluate.className = "good";
    } else if (RightAnswers === count ) {
        let evaluateText = document.createTextNode ("Perfect: ");
        evaluate.appendChild(evaluateText);
        evaluate.className = "perfect";
    } else {
        let evaluateText = document.createTextNode ("Bad: ");
        evaluate.appendChild(evaluateText);
        evaluate.classList = "bad";
    }
    resultsDiv.appendChild(evaluate);
    resultsDiv.innerHTML += `You answered ${RightAnswers} from ${count}`
    quizApp.appendChild(resultsDiv);
}

function countdown(duration) {
        let minutes, seconds;
        countdownInteral = setInterval(()=> {
        minutes = parseInt(duration / 60);
        seconds = parseInt(duration % 60);
        minutes = minutes<10?`0${minutes}`:minutes;
        seconds = seconds<10?`0${seconds}`:seconds;
        countdownElement.innerHTML = `${minutes} : ${seconds}`;
        if (--duration < 0) {
            clearInterval(countdownInteral);
            submitBtn.click();
        }
    }, 1000)
}