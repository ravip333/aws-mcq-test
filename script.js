let quizData;
const quizContainer = document.getElementById('quiz');
const resultContainer = document.getElementById('result');
const submitButton = document.getElementById('submit');
const nextButton = document.getElementById('next');
const retryButton = document.getElementById('retry');
const showAnswerButton = document.getElementById('showAnswer');

let currentQuestion = 0;
let score = 0;
let incorrectAnswers = [];
let timerInterval; // Declare the timerInterval variable globally

document.addEventListener("DOMContentLoaded", function () {
    const quizTime = 5 * 60; // Convert minutes to seconds
    let timer = quizTime;

    // Function to update the timer display
    function updateTimer() {
        const minutes = Math.floor(timer / 60);
        const seconds = timer % 60;
        document.getElementById('timer').innerHTML = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    // Update the timer every second
    timerInterval = setInterval(function () {
        if (timer > 0) {
            timer--;
            updateTimer();
        } else {
            clearInterval(timerInterval);
            displayResult();
        }
    }, 1000);

    function displayResult() {
        clearInterval(timerInterval); // Stop the timer when the quiz ends
        quizContainer.style.display = 'none';
        submitButton.style.display = 'none';
        nextButton.style.display = 'none'; // Hide the Next button
        retryButton.style.display = 'inline-block';
        showAnswerButton.style.display = 'inline-block';
        resultContainer.innerHTML = `Time's up! You scored ${score} out of ${quizData.length}!`;
    }

    updateTimer(); // Initial display of the timer
});

function fetchQuizData() {
    const jsonUrl = 'https://raw.githubusercontent.com/ravip333/aws-mcq-test/main/data.json';

    return fetch(jsonUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            shuffleArray(data);
            // Select the first 10 questions
            quizData = data.slice(0, 10);
            return quizData;
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

function initializeQuiz() {
    fetchQuizData().then(data => {
        quizData = data;
        displayQuestion();
    });
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function displayQuestion() {
    const questionData = quizData[currentQuestion];

    const questionElement = document.createElement('div');
    questionElement.className = 'question';
    questionElement.innerHTML = `<p>Question ${currentQuestion + 1}:</p> ${questionData.question}`;

    const optionsElement = document.createElement('div');
    optionsElement.className = 'options';

    for (let i = 0; i < questionData.options.length; i++) {
        const option = document.createElement('label');
        option.className = 'option';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = 'quiz';
        checkbox.value = questionData.options[i];

        const optionText = document.createTextNode(questionData.options[i]);

        option.appendChild(checkbox);
        option.appendChild(optionText);
        optionsElement.appendChild(option);
    }

    quizContainer.innerHTML = '';
    quizContainer.appendChild(questionElement);
    quizContainer.appendChild(optionsElement);

    // Hide or show Next button based on whether it's the last question
    if (currentQuestion === quizData.length - 1) {
        nextButton.style.display = 'none'; // Hide the Next button
        submitButton.style.display = 'inline-block'; // Show the Submit button
    } else {
        nextButton.style.display = 'inline-block'; // Show the Next button
        submitButton.style.display = 'none'; // Hide the Submit button
    }
    retryButton.style.display = 'none';
    showAnswerButton.style.display = 'none';
}


function checkAnswer() {
    const selectedOption = document.querySelector('input[name="quiz"]:checked');
    if (selectedOption) {
        const answer = selectedOption.value;
        if (answer === quizData[currentQuestion].answer) {
            score++;
        } else {
            incorrectAnswers.push({
                question: quizData[currentQuestion].question,
                incorrectAnswer: answer,
                correctAnswer: quizData[currentQuestion].answer,
            });
        }
        currentQuestion++;
        selectedOption.checked = false;
        if (currentQuestion < quizData.length) {
            displayQuestion();
        } else {
            clearInterval(timerInterval); // Stop the timer when the last question is submitted
            displayResult();
        }
    } else {
        alert("Please select an option before proceeding to the next question.");
    }
}


function displayResult() {
    quizContainer.style.display = 'none';
    submitButton.style.display = 'none';
    nextButton.style.display = 'none'; // Hide the Next button
    retryButton.style.display = 'inline-block';
    showAnswerButton.style.display = 'inline-block';
    let incorrectAnswersHtml = '';
    for (let i = 0; i < incorrectAnswers.length; i++) {
        incorrectAnswersHtml += `
            <p>
                <strong>Question:</strong> ${incorrectAnswers[i].question}<br>
                <strong>Your Answer:</strong> ${incorrectAnswers[i].incorrectAnswer}<br>
                <strong>Correct Answer:</strong> ${incorrectAnswers[i].correctAnswer}
            </p>
        `;
    }

    resultContainer.innerHTML = `
        <p>You scored ${score} out of ${quizData.length}!</p>

    `;
}


function retryQuiz() {
    currentQuestion = 0;
    score = 0;
    incorrectAnswers = [];
    quizContainer.style.display = 'block';
    submitButton.style.display = 'inline-block';
    nextButton.style.display = 'inline-block';
    retryButton.style.display = 'none';
    showAnswerButton.style.display = 'none';
    resultContainer.innerHTML = '';
    displayQuestion();
}

function showAnswer() {
    quizContainer.style.display = 'none';
    submitButton.style.display = 'none';
    nextButton.style.display = 'none'; // Hide the Next button
    retryButton.style.display = 'inline-block';
    showAnswerButton.style.display = 'none';

    let questionAnswersHtml = '';
    for (let i = 0; i < quizData.length; i++) {
        const questionData = quizData[i];
        const correctAnswers = questionData.answer instanceof Array ? questionData.answer : [questionData.answer]; // Handle case where answer is an array or string

        let correctAnswersHtml = '';
        correctAnswers.forEach((answer, index) => {
            correctAnswersHtml += `<span style="color: green;">${answer}</span>`;
            if (index !== correctAnswers.length - 1) {
                correctAnswersHtml += '<br>';
            }
        });

        questionAnswersHtml += `
            <div class="question-answer" style="text-align: left;">
                <p>Question ${i + 1}: ${questionData.question}</p>
                <p>Correct Answer(s): ${correctAnswersHtml}</p>
            </div>
        `;
    }

    resultContainer.innerHTML = `
        <p>You scored ${score} out of ${quizData.length}!</p>
        <div class="answers">
            ${questionAnswersHtml}
        </div>
    `;
}



submitButton.addEventListener('click', checkAnswer);
nextButton.addEventListener('click', checkAnswer); // Attach checkAnswer to Next button
retryButton.addEventListener('click', retryQuiz);
showAnswerButton.addEventListener('click', showAnswer);

initializeQuiz();
