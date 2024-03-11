let quizData;
    const quizContainer = document.getElementById('quiz');
    const resultContainer = document.getElementById('result');
    const submitButton = document.getElementById('submit');
    const retryButton = document.getElementById('retry');
    const showAnswerButton = document.getElementById('showAnswer');

    let currentQuestion = 0;
    let score = 0;
    let incorrectAnswers = [];

    document.addEventListener("DOMContentLoaded", function () {
        const quizTime = 130 * 60; // Convert minutes to seconds
        let timer = quizTime;

        // Function to update the timer display
        function updateTimer() {
            const minutes = Math.floor(timer / 60);
            const seconds = timer % 60;
            document.getElementById('timer').innerHTML = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        }

        // Update the timer every second
        const timerInterval = setInterval(function () {
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
            retryButton.style.display = 'inline-block';
            showAnswerButton.style.display = 'inline-block';
            resultContainer.innerHTML = `Time's up! You scored ${score} out of ${quizData.length}!`;
        }

        updateTimer(); // Initial display of the timer
    });

    function fetchQuizData() {
        const jsonUrl = 'https://raw.githubusercontent.com/your-username/your-repository/main/quiz-data.json';

        return fetch(jsonUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                return data;
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
        questionElement.innerHTML = questionData.question;

        const optionsElement = document.createElement('div');
        optionsElement.className = 'options';

        const shuffledOptions = [...questionData.options];
        shuffleArray(shuffledOptions);

        for (let i = 0; i < shuffledOptions.length; i++) {
            const option = document.createElement('label');
            option.className = 'option';

            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = 'quiz';
            radio.value = shuffledOptions[i];

            const optionText = document.createTextNode(shuffledOptions[i]);

            option.appendChild(radio);
            option.appendChild(optionText);
            optionsElement.appendChild(option);
        }

        quizContainer.innerHTML = '';
        quizContainer.appendChild(questionElement);
        quizContainer.appendChild(optionsElement);
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
                displayResult();
            }
        }
    }

    function displayResult() {
        quizContainer.style.display = 'none';
        submitButton.style.display = 'none';
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
            <p>Incorrect Answers:</p>
            ${incorrectAnswersHtml}
        `;
    }

    function retryQuiz() {
        currentQuestion = 0;
        score = 0;
        incorrectAnswers = [];
        quizContainer.style.display = 'block';
        submitButton.style.display = 'inline-block';
        retryButton.style.display = 'none';
        showAnswerButton.style.display = 'none';
        resultContainer.innerHTML = '';
        displayQuestion();
    }

    function showAnswer() {
        quizContainer.style.display = 'none';
        submitButton.style.display = 'none';
        retryButton.style.display = 'inline-block';
        showAnswerButton.style.display = 'none';

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
            <p>Incorrect Answers:</p>
            ${incorrectAnswersHtml}
        `;
    }

    submitButton.addEventListener('click', checkAnswer);
    retryButton.addEventListener('click', retryQuiz);
    showAnswerButton.addEventListener('click', showAnswer);

    initializeQuiz();
  </script>
