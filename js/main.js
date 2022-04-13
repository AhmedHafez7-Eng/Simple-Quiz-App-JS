
// var category = 'music';
// $.ajax({
//     method: 'GET',
//     url: 'https://api.api-ninjas.com/v1/trivia?category=' + category,
//     headers: { 'X-Api-Key': 'YOUR_API_KEY' },
//     contentType: 'application/json',
//     success: function (result) {
//         console.log(result);
//     },
//     error: function ajaxError(jqXHR) {
//         console.error('Error: ', jqXHR.responseText);
//     }
// });


// ============== Getting All Required Elements =====================

const startBtn = document.querySelector('.startBtn button');
const infoBox = document.querySelector('.infoBox');
const exitBtn = infoBox.querySelector('.buttons .quit');
const continueBtn = infoBox.querySelector('.buttons .restart');
const quizBox = document.querySelector('.quizBox');
const resultBox = document.querySelector('.resultBox');
const restartQuiz = resultBox.querySelector('.buttons .restart');
const quitQuiz = resultBox.querySelector('.buttons .quit');
const nextBtn = quizBox.querySelector('.nextBtn');
const optionList = document.querySelector('.optionList');
const timeCount = quizBox.querySelector('.timer .timerSec');
const timeOff = quizBox.querySelector('.timer .timerText');
const timeLine = quizBox.querySelector('header .timeLine');
const scoreText = document.querySelector('.scoreText');
// ============== When Start Quiz Button Clicked =====================
startBtn.onclick = () => {
    infoBox.classList.add('activeInfo');  // Show Info Box
    startBtn.style.display = 'none';  // Hide Start Button
}

// ============== When Exit Quiz Button Clicked =====================

exitBtn.onclick = () => {
    infoBox.classList.remove('activeInfo');  // Hide Info Box
    startBtn.style.display = 'block';  // Show Start Button
}

// ============== When Continue Quiz Button Clicked =====================

continueBtn.onclick = () => {
    infoBox.classList.remove('activeInfo');  // Hide Info Box
    quizBox.classList.add('activeQuiz');  // Show Quiz Box
    document.querySelector('footer.footer').style.position = 'relative';
    timeCount.textContent = questions[0].quesTime;
    showQuestions(0);
    startTimer(questions[0].quesTime);
    startTimerLine(0);
}


let quesCount = 0;
let widthValue = 0;

// ============== When Next Question Button Clicked =====================
nextBtn.onclick = () => {
    if (quesCount < questions.length - 1) {
        quesCount++;
        showQuestions(quesCount);
        clearInterval(timeCounter);
        startTimer(questions[quesCount].quesTime);
        clearInterval(counterLine);
        startTimerLine(widthValue);
        nextBtn.style.display = "none";
        timeOff.textContent = "Time Left";
    } else {
        clearInterval(timeCounter);
        clearInterval(counterLine);
        showResult();
    }
}

// ============== Getting Questions & Options from array =====================
function showQuestions(index) {
    const quesText = document.querySelector('.queText');
    let quesTag = "<span>Q" + questions[index].number + "| " + questions[index].question + "</span>";
    let optionTag =
        `<div class="option"><span>${questions[index].options[0]}</span></div>` +
        `<div class="option"><span>${questions[index].options[1]}</span></div>` +
        `<div class="option"><span>${questions[index].options[2]}</span></div>` +
        `<div class="option"><span>${questions[index].options[3]}</span></div>`;
    quesText.innerHTML = quesTag;
    optionList.innerHTML = optionTag;


    // ============== Checking Answer =====================
    const option = optionList.querySelectorAll('.option');

    for (let i = 0; i < option.length; i++) {
        option[i].setAttribute('onclick', "optionSelected(this)");
    }


    // ============== Quiz Box Footer =====================
    const quesFooter = document.querySelector('.totalQue');
    let quesTagFooter =
        `<span>
            <p>${questions[index].number}</p> Of <p>${questions.length}</p> Questions
        </span>`;

    quesFooter.innerHTML = quesTagFooter;


}

let tickIcon = `<div class="icon tick"><i class="fas fa-check"></i></div>`;
let crossIcon = `<div class="icon cross"><i class="fas fa-times"></i></div>`;
let userScore = 0;

function optionSelected(answer) {
    clearInterval(timeCounter);
    clearInterval(counterLine);
    let userAnswer = answer.textContent;
    let correctAnswer = questions[quesCount].answer;
    let allOptions = optionList.children.length;
    if (userAnswer == correctAnswer) {
        answer.classList.add('correct');
        answer.insertAdjacentHTML("beforeend", tickIcon);
        userScore += 1;
    } else {
        answer.classList.add('wrong');
        answer.insertAdjacentHTML("beforeend", crossIcon);

        // ======== If answer is wrong, automatic select the correct answer ==============
        for (let i = 0; i < allOptions; i++) {
            if (optionList.children[i].textContent == correctAnswer) {
                optionList.children[i].setAttribute('class', 'option correct');
                optionList.children[i].insertAdjacentHTML("beforeend", tickIcon);
            }
        }
    }
    // ============== Disable All options once user selected one =====================
    for (let i = 0; i < allOptions; i++) {
        optionList.children[i].classList.add('disabled');
    }

    nextBtn.style.display = "block";
}

let timeCounter;

function startTimer(time) {
    timeCounter = setInterval(timer, 1000);
    function timer() {
        timeCount.textContent = time;
        time--;
        if (time < 9) {
            let addZero = timeCount.textContent;
            timeCount.textContent = "0" + addZero;
        }
        if (time < 0) {
            clearInterval(timeCounter);
            timeCount.textContent = "00";
            timeOff.textContent = "Time Off";

            let correctAnswer = questions[quesCount].answer;
            let allOptions = optionList.children.length;

            for (let i = 0; i < allOptions; i++) {
                if (optionList.children[i].textContent == correctAnswer) {
                    optionList.children[i].setAttribute('class', 'option correct');
                    optionList.children[i].insertAdjacentHTML("beforeend", tickIcon);
                }
            }

            // ============== Disable All options once user selected one =====================
            for (let i = 0; i < allOptions; i++) {
                optionList.children[i].classList.add('disabled');
            }

            nextBtn.style.display = "block";
        }
    }
}

function startTimerLine(time) {
    counterLine = setInterval(timer, 29);
    function timer() {
        time += 1;
        timeLine.style.width = time + "px";
        if (time > 549) {
            clearInterval(counterLine);
        }
    }
}

function showResult() {
    infoBox.classList.remove('activeInfo');  // Hide Info Box
    quizBox.classList.remove('activeQuiz'); // Hide Quiz Box
    if (userScore <= 5) {
        scoreText.innerHTML = `<span>and sorry, you've got only <p>${userScore}</p> out of <p>${questions.length}</p></span>`;
    } else {
        scoreText.innerHTML = `<span>and Congratulations, you've got <p>${userScore}</p> out of <p>${questions.length}</p></span>`;
    }
    resultBox.classList.add('activeResult'); // Show Result Box
}

quitQuiz.onclick = () => {
    window.location.reload();
}

restartQuiz.onclick = () => {
    quesCount = 0;
    widthValue = 0;
    userScore = 0;
    resultBox.classList.remove('activeResult'); // Hide Result Box
    quizBox.classList.add('activeQuiz'); // Show Quiz Box
    showQuestions(quesCount);
    clearInterval(timeCounter);
    startTimer(questions[quesCount].quesTime);
    clearInterval(counterLine);
    startTimerLine(widthValue);
    nextBtn.style.display = "none";
    timeOff.textContent = "Time Left";
}