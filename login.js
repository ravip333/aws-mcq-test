document.addEventListener("DOMContentLoaded", function() {
    const registrationContainer = document.getElementById('registrationContainer');
    const loginContainer = document.getElementById('loginContainer');
    const quizContainer = document.getElementById('quizContainer');
    const scoreContainer = document.getElementById('scoreContainer');
    let loggedInUser = '';

    function registerUser() {
        const username = document.getElementById('username').value.trim();
        if (username !== '') {
            if (localStorage.getItem(username)) {
                alert('Username already exists. Please choose another username.');
            } else {
                localStorage.setItem(username, JSON.stringify({ scores: [] }));
                alert('User registered successfully. Please login to continue.');
                registrationContainer.style.display = 'none';
                loginContainer.style.display = 'block';
            }
        } else {
            alert('Please enter a valid username.');
        }
    }

    function loginUser() {
        const username = document.getElementById('loginUsername').value.trim();
        if (username !== '') {
            if (localStorage.getItem(username)) {
                loggedInUser = username;
                document.getElementById('loggedInUser').textContent = loggedInUser;
                loginContainer.style.display = 'none';
                quizContainer.style.display = 'block';
            } else {
                alert('User not found. Please register first.');
            }
        } else {
            alert('Please enter a valid username.');
        }
    }

    function showPreviousScores() {
        const userData = JSON.parse(localStorage.getItem(loggedInUser));
        if (userData && userData.scores.length > 0) {
            const scoreList = document.getElementById('scoreList');
            scoreList.innerHTML = '';
            userData.scores.forEach(score => {
                const listItem = document.createElement('li');
                listItem.textContent = `Score: ${score}`;
                scoreList.appendChild(listItem);
            });
            quizContainer.style.display = 'none';
            scoreContainer.style.display = 'block';
        } else {
            alert('No previous scores found.');
        }
    }

    function hidePreviousScores() {
        scoreContainer.style.display = 'none';
        quizContainer.style.display = 'block';
    }

    function submitQuiz() {
        // Logic to submit quiz and calculate score
        const score = 80; // Example score
        const userData = JSON.parse(localStorage.getItem(loggedInUser));
        userData.scores.push(score);
        localStorage.setItem(loggedInUser, JSON.stringify(userData));
        alert(`Quiz submitted successfully. Your score: ${score}`);
    }

    // You can add your quiz logic here

    window.registerUser = registerUser;
    window.loginUser = loginUser;
    window.submitQuiz = submitQuiz;
    window.showPreviousScores = showPreviousScores;
    window.hidePreviousScores = hidePreviousScores;
});



///////////<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>User Registration and Quiz</title>
</head>
<body>
    <div id="registrationContainer">
        <h2>User Registration</h2>
        <label for="username">Username:</label>
        <input type="text" id="username">
        <button onclick="registerUser()">Register</button>
    </div>

    <div id="loginContainer" style="display: none;">
        <h2>User Login</h2>
        <label for="loginUsername">Username:</label>
        <input type="text" id="loginUsername">
        <button onclick="loginUser()">Login</button>
    </div>

    <div id="quizContainer" style="display: none;">
        <h2>Quiz</h2>
        <p>Welcome, <span id="loggedInUser"></span>!</p>
        <!-- Your quiz questions and logic here -->
        <button onclick="submitQuiz()">Submit Quiz</button>
        <button onclick="showPreviousScores()">View Previous Scores</button>
    </div>

    <div id="scoreContainer" style="display: none;">
        <h2>Previous Scores</h2>
        <ul id="scoreList"></ul>
        <button onclick="hidePreviousScores()">Close</button>
    </div>

    <script src="script.js"></script>
</body>
</html>
