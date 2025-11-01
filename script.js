// Global Variables
let currentTheme = 'rainbow';
let soundEnabled = true;
let userLevel = 3;
let userPoints = 150;
let userBadges = ['🌟', '📚', '🎨'];
let currentGame = null;
let gameState = {};

// Game Data
const memoryEmojis = ['🐱', '🐶', '🐰', '🐼', '🦊', '🐸', '🐨', '🐮'];
const mathProblems = [
    { question: '2 + 3 = ?', answer: 5, options: [4, 5, 6] },
    { question: '7 - 4 = ?', answer: 3, options: [2, 3, 4] },
    { question: '5 + 2 = ?', answer: 7, options: [6, 7, 8] },
    { question: '9 - 3 = ?', answer: 6, options: [5, 6, 7] },
    { question: '3 × 4 = ?', answer: 12, options: [10, 12, 14] },
    { question: '15 ÷ 3 = ?', answer: 5, options: [4, 5, 6] }
];

const wordChallenges = [
    { word: 'CAT', letters: ['C', 'A', 'T', 'B', 'X'], hint: '🐱' },
    { word: 'DOG', letters: ['D', 'O', 'G', 'F', 'Z'], hint: '🐶' },
    { word: 'SUN', letters: ['S', 'U', 'N', 'M', 'K'], hint: '☀️' },
    { word: 'TREE', letters: ['T', 'R', 'E', 'E', 'A', 'X'], hint: '🌳' },
    { word: 'BOOK', letters: ['B', 'O', 'O', 'K', 'L', 'M'], hint: '📚' }
];

const studyQuestions = {
    math: [
        { question: 'What is 2 + 3?', answers: [4, 5, 6], correct: 1 },
        { question: 'What is 8 - 3?', answers: [4, 5, 6], correct: 1 },
        { question: 'What is 4 × 2?', answers: [6, 8, 10], correct: 1 },
        { question: 'What is 10 ÷ 2?', answers: [4, 5, 6], correct: 1 }
    ],
    reading: [
        { question: 'What letter does "Apple" start with?', answers: ['A', 'B', 'C'], correct: 0 },
        { question: 'How many letters are in "DOG"?', answers: [2, 3, 4], correct: 1 },
        { question: 'What sound does "CAT" start with?', answers: ['/k/', '/d/', '/m/'], correct: 0 }
    ],
    science: [
        { question: 'What do plants need to grow?', answers: ['Water', 'Toys', 'Cars'], correct: 0 },
        { question: 'How many legs does a spider have?', answers: [6, 8, 10], correct: 1 },
        { question: 'What color do you get when you mix red and yellow?', answers: ['Green', 'Orange', 'Purple'], correct: 1 }
    ],
    art: [
        { question: 'What are the primary colors?', answers: ['Red, Blue, Yellow', 'Green, Orange, Purple', 'Black, White, Gray'], correct: 0 },
        { question: 'What tool do we use to paint?', answers: ['Spoon', 'Brush', 'Fork'], correct: 1 }
    ]
};

// Mascot messages
const mascotMessages = [
    "Great job! Keep learning! 🌟",
    "You're doing amazing! 🎉",
    "Learning is fun, isn't it? 😊",
    "Try another game! 🎮",
    "You earned some points! ⭐",
    "What would you like to explore next? 🔍",
    "Remember to take breaks! 😌",
    "You're getting smarter every day! 🧠"
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupEventListeners();
    updateUI();
    showMascotMessage();
    setInterval(showMascotMessage, 10000); // Show message every 10 seconds
}

function setupEventListeners() {
    // Tab navigation
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            switchTab(this.dataset.tab);
        });
    });

    // Theme selection
    document.querySelectorAll('.theme-option').forEach(option => {
        option.addEventListener('click', function(e) {
            e.stopPropagation();
            changeTheme(this.dataset.theme);
        });
    });

    document.querySelectorAll('.theme-choice').forEach(choice => {
        choice.addEventListener('click', function() {
            changeTheme(this.dataset.theme);
        });
    });

    // Sound toggle
    document.getElementById('soundToggle').addEventListener('click', toggleSound);

    // Parental controls
    document.getElementById('parentalControlsBtn').addEventListener('click', showParentalControls);
    document.getElementById('cancelAuth').addEventListener('click', hideParentalControls);
    document.getElementById('closeParental').addEventListener('click', hideParentalControls);
    document.getElementById('unlockBtn').addEventListener('click', authenticateParent);

    // Study section
    document.querySelectorAll('.study-card').forEach(card => {
        card.addEventListener('click', function() {
            startStudyActivity(this.dataset.subject);
        });
    });

    document.getElementById('backToStudy').addEventListener('click', backToStudy);

    // Games section
    document.querySelectorAll('.game-card').forEach(card => {
        card.addEventListener('click', function() {
            startGame(this.dataset.game);
        });
    });

    document.getElementById('backToGames').addEventListener('click', backToGames);

    // Parental dashboard tabs
    document.querySelectorAll('.dashboard-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            switchDashboardTab(this.dataset.dashboardTab);
        });
    });

    // Settings controls
    const timeLimitSlider = document.getElementById('timeLimitSlider');
    const goalSlider = document.getElementById('goalSlider');
    
    if (timeLimitSlider) {
        timeLimitSlider.addEventListener('input', function() {
            document.getElementById('timeLimitValue').textContent = `${this.value} minutes`;
        });
    }
    
    if (goalSlider) {
        goalSlider.addEventListener('input', function() {
            document.getElementById('goalValue').textContent = `${this.value} minutes`;
        });
    }

    // Mascot interaction
    document.getElementById('mascot').addEventListener('click', showMascotMessage);

    // Modal overlay
    document.getElementById('parentalModal').addEventListener('click', function(e) {
        if (e.target === this) {
            hideParentalControls();
        }
    });

    // Enter key for password
    document.getElementById('parentPassword').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            authenticateParent();
        }
    });
}

function switchTab(tabId) {
    // Update tab buttons
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');

    // Update tab content
    document.querySelectorAll('.tab-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    document.getElementById(tabId).classList.add('active');
}

function changeTheme(themeName) {
    currentTheme = themeName;
    document.body.className = `theme-${themeName}`;
    
    // Update theme selector active state
    document.querySelectorAll('.theme-option').forEach(option => {
        option.classList.remove('active');
    });
    document.querySelector(`[data-theme="${themeName}"]`).classList.add('active');

    // Update parental dashboard theme selector
    document.querySelectorAll('.theme-choice').forEach(choice => {
        choice.classList.remove('active');
    });
    document.querySelector(`.theme-choice[data-theme="${themeName}"]`)?.classList.add('active');
    
    playSound('click');
    showMascotMessage("I love this theme! 🎨");
}

function toggleSound() {
    soundEnabled = !soundEnabled;
    const icon = document.querySelector('#soundToggle i');
    icon.className = soundEnabled ? 'fas fa-volume-up' : 'fas fa-volume-mute';
    
    if (soundEnabled) {
        showMascotMessage("Sound is on! 🔊");
    } else {
        showMascotMessage("Sound is off 🔇");
    }
}

function playSound(type) {
    if (!soundEnabled) return;
    
    // In a real implementation, you would play actual sound files
    // For demo purposes, we'll just show visual feedback
    console.log(`Playing ${type} sound`);
}

function updateUI() {
    // Update progress displays
    document.getElementById('userLevel').textContent = userLevel;
    document.getElementById('userPoints').textContent = userPoints;
    document.getElementById('mobileLevel').textContent = userLevel;
    document.getElementById('mobilePoints').textContent = userPoints;
    
    // Update badges
    const badgeContainers = [
        document.getElementById('userBadges'),
        document.getElementById('mobileBadges')
    ];
    
    badgeContainers.forEach(container => {
        if (container) {
            container.innerHTML = userBadges.map(badge => `<span class="badge">${badge}</span>`).join('');
        }
    });
}

function addPoints(points) {
    userPoints += points;
    updateUI();
    playSound('success');
    showMascotMessage(`Awesome! You earned ${points} points! ⭐`);
}

function addBadge(badge) {
    if (!userBadges.includes(badge)) {
        userBadges.push(badge);
        updateUI();
        playSound('achievement');
        showMascotMessage(`New badge earned: ${badge}! 🏆`);
    }
}

function showMascotMessage(message = null) {
    const mascotText = document.getElementById('mascotText');
    const mascotBubble = document.getElementById('mascotBubble');
    
    if (message) {
        mascotText.textContent = message;
    } else {
        const randomMessage = mascotMessages[Math.floor(Math.random() * mascotMessages.length)];
        mascotText.textContent = randomMessage;
    }
    
    mascotBubble.style.opacity = '1';
    mascotBubble.style.visibility = 'visible';
    mascotBubble.style.transform = 'translateY(0)';
    
    setTimeout(() => {
        mascotBubble.style.opacity = '0';
        mascotBubble.style.visibility = 'hidden';
        mascotBubble.style.transform = 'translateY(10px)';
    }, 3000);
}

// Study Section Functions
function startStudyActivity(subject) {
    document.querySelector('.study-categories').style.display = 'none';
    document.getElementById('studyActivity').style.display = 'block';
    document.getElementById('activityTitle').textContent = `${subject.charAt(0).toUpperCase() + subject.slice(1)} Quiz`;
    
    gameState.currentSubject = subject;
    gameState.questionIndex = 0;
    gameState.score = 0;
    gameState.questions = studyQuestions[subject] || studyQuestions.math;
    
    showStudyQuestion();
}

function showStudyQuestion() {
    const question = gameState.questions[gameState.questionIndex];
    document.getElementById('questionText').textContent = question.question;
    document.getElementById('activityScore').textContent = gameState.score;
    
    const optionsContainer = document.getElementById('answerOptions');
    optionsContainer.innerHTML = '';
    
    question.answers.forEach((answer, index) => {
        const button = document.createElement('button');
        button.className = 'answer-btn';
        button.textContent = answer;
        button.onclick = () => checkStudyAnswer(index);
        optionsContainer.appendChild(button);
    });
}

function checkStudyAnswer(selectedIndex) {
    const question = gameState.questions[gameState.questionIndex];
    const buttons = document.querySelectorAll('.answer-btn');
    
    buttons.forEach((button, index) => {
        button.disabled = true;
        if (index === question.correct) {
            button.classList.add('correct');
        } else if (index === selectedIndex && index !== question.correct) {
            button.classList.add('incorrect');
        }
    });
    
    if (selectedIndex === question.correct) {
        gameState.score += 10;
        addPoints(10);
        playSound('correct');
    } else {
        playSound('incorrect');
    }
    
    setTimeout(() => {
        gameState.questionIndex++;
        if (gameState.questionIndex < gameState.questions.length) {
            showStudyQuestion();
        } else {
            completeStudyActivity();
        }
    }, 2000);
}

function completeStudyActivity() {
    const percentage = (gameState.score / (gameState.questions.length * 10)) * 100;
    let message = `Great job! You scored ${gameState.score}/${gameState.questions.length * 10}!`;
    
    if (percentage >= 80) {
        addBadge('🏆');
        message += " Perfect work!";
    } else if (percentage >= 60) {
        message += " Good effort!";
    }
    
    showMascotMessage(message);
    
    setTimeout(() => {
        backToStudy();
    }, 3000);
}

function backToStudy() {
    document.querySelector('.study-categories').style.display = 'grid';
    document.getElementById('studyActivity').style.display = 'none';
}

// Game Section Functions
function startGame(gameType) {
    currentGame = gameType;
    document.getElementById('gamesMenu').style.display = 'none';
    document.getElementById('gameArena').style.display = 'block';
    
    // Hide all games first
    document.querySelectorAll('#gameArena > div:not(.game-arena-header)').forEach(game => {
        game.style.display = 'none';
    });
    
    // Reset game state
    gameState = {
        score: 0,
        lives: 3,
        level: 1
    };
    
    updateGameUI();
    
    switch (gameType) {
        case 'memory':
            initMemoryGame();
            break;
        case 'math':
            initMathGame();
            break;
        case 'word':
            initWordGame();
            break;
        case 'simon':
            initSimonGame();
            break;
    }
}

function updateGameUI() {
    document.getElementById('gameTitle').textContent = getGameTitle();
    document.getElementById('gameScore').textContent = gameState.score;
    document.getElementById('gameLives').textContent = gameState.lives;
}

function getGameTitle() {
    const titles = {
        memory: 'Memory Match',
        math: 'Math Adventure',
        word: 'Word Builder',
        simon: 'Color Sequence'
    };
    return titles[currentGame] || 'Game';
}

function backToGames() {
    document.getElementById('gamesMenu').style.display = 'grid';
    document.getElementById('gameArena').style.display = 'none';
    currentGame = null;
}

// Memory Game
function initMemoryGame() {
    document.getElementById('memoryGame').style.display = 'block';
    
    // Create shuffled pairs
    const shuffledEmojis = [...memoryEmojis, ...memoryEmojis]
        .sort(() => Math.random() - 0.5);
    
    gameState.cards = shuffledEmojis.map((emoji, index) => ({
        id: index,
        emoji,
        flipped: false,
        matched: false
    }));
    
    gameState.flippedCards = [];
    gameState.matchedPairs = 0;
    
    renderMemoryGrid();
}

function renderMemoryGrid() {
    const grid = document.getElementById('memoryGrid');
    grid.innerHTML = '';
    
    gameState.cards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.className = `memory-card ${card.flipped || card.matched ? 'flipped' : ''} ${card.matched ? 'matched' : ''}`;
        cardElement.textContent = card.flipped || card.matched ? card.emoji : '?';
        cardElement.onclick = () => flipMemoryCard(card.id);
        grid.appendChild(cardElement);
    });
}

function flipMemoryCard(cardId) {
    if (gameState.flippedCards.length >= 2) return;
    if (gameState.cards[cardId].matched || gameState.cards[cardId].flipped) return;
    
    gameState.cards[cardId].flipped = true;
    gameState.flippedCards.push(cardId);
    renderMemoryGrid();
    
    if (gameState.flippedCards.length === 2) {
        setTimeout(checkMemoryMatch, 1000);
    }
}

function checkMemoryMatch() {
    const [first, second] = gameState.flippedCards;
    
    if (gameState.cards[first].emoji === gameState.cards[second].emoji) {
        // Match found
        gameState.cards[first].matched = true;
        gameState.cards[second].matched = true;
        gameState.matchedPairs++;
        gameState.score += 100;
        addPoints(50);
        playSound('match');
        
        if (gameState.matchedPairs === memoryEmojis.length) {
            setTimeout(() => {
                addBadge('🧠');
                showMascotMessage("Amazing memory! You matched all pairs! 🎉");
            }, 500);
        }
    } else {
        // No match
        gameState.cards[first].flipped = false;
        gameState.cards[second].flipped = false;
        playSound('nomatch');
    }
    
    gameState.flippedCards = [];
    renderMemoryGrid();
    updateGameUI();
}

// Math Game
function initMathGame() {
    document.getElementById('mathGame').style.display = 'block';
    gameState.currentQuestion = 0;
    gameState.questions = [...mathProblems].sort(() => Math.random() - 0.5).slice(0, 5);
    showMathQuestion();
}

function showMathQuestion() {
    const question = gameState.questions[gameState.currentQuestion];
    document.getElementById('mathQuestion').textContent = question.question;
    
    const optionsContainer = document.getElementById('mathOptions');
    optionsContainer.innerHTML = '';
    
    question.options.forEach(option => {
        const button = document.createElement('button');
        button.className = 'math-option';
        button.textContent = option;
        button.onclick = () => checkMathAnswer(option);
        optionsContainer.appendChild(button);
    });
}

function checkMathAnswer(selectedAnswer) {
    const question = gameState.questions[gameState.currentQuestion];
    const buttons = document.querySelectorAll('.math-option');
    
    buttons.forEach(button => {
        button.disabled = true;
        if (parseInt(button.textContent) === question.answer) {
            button.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        } else if (parseInt(button.textContent) === selectedAnswer && selectedAnswer !== question.answer) {
            button.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
        }
    });
    
    if (selectedAnswer === question.answer) {
        gameState.score += 50;
        addPoints(25);
        playSound('correct');
    } else {
        gameState.lives--;
        playSound('incorrect');
    }
    
    updateGameUI();
    
    setTimeout(() => {
        gameState.currentQuestion++;
        if (gameState.currentQuestion < gameState.questions.length && gameState.lives > 0) {
            showMathQuestion();
        } else {
            completeMathGame();
        }
    }, 2000);
}

function completeMathGame() {
    const correctAnswers = gameState.score / 50;
    if (correctAnswers >= 4) {
        addBadge('🔢');
        showMascotMessage("Math genius! You're amazing with numbers! 🧮");
    } else if (correctAnswers >= 2) {
        showMascotMessage("Good job! Keep practicing math! 📊");
    } else {
        showMascotMessage("Nice try! Math gets easier with practice! 💪");
    }
    
    setTimeout(() => {
        backToGames();
    }, 3000);
}

// Word Game
function initWordGame() {
    document.getElementById('wordGame').style.display = 'block';
    gameState.currentWord = 0;
    gameState.words = [...wordChallenges];
    gameState.builtWord = '';
    showWordChallenge();
}

function showWordChallenge() {
    const challenge = gameState.words[gameState.currentWord];
    document.getElementById('wordHint').textContent = challenge.hint;
    
    // Create letter slots
    const wordDisplay = document.getElementById('wordDisplay');
    wordDisplay.innerHTML = '';
    
    challenge.word.split('').forEach((letter, index) => {
        const slot = document.createElement('div');
        slot.className = `letter-slot ${gameState.builtWord[index] ? 'filled' : ''}`;
        slot.textContent = gameState.builtWord[index] || '_';
        wordDisplay.appendChild(slot);
    });
    
    // Create letter options
    const letterOptions = document.getElementById('letterOptions');
    letterOptions.innerHTML = '';
    
    challenge.letters.forEach(letter => {
        const button = document.createElement('button');
        button.className = 'letter-btn';
        button.textContent = letter;
        button.onclick = () => addLetter(letter);
        button.disabled = gameState.builtWord.includes(letter) && 
                         challenge.word.indexOf(letter) === gameState.builtWord.indexOf(letter);
        letterOptions.appendChild(button);
    });
    
    // Setup remove letter button
    document.getElementById('removeLetterBtn').onclick = removeLetter;
    document.getElementById('removeLetterBtn').disabled = gameState.builtWord.length === 0;
}

function addLetter(letter) {
    const challenge = gameState.words[gameState.currentWord];
    
    if (gameState.builtWord.length < challenge.word.length) {
        gameState.builtWord += letter;
        showWordChallenge();
        
        if (gameState.builtWord === challenge.word) {
            gameState.score += 100;
            addPoints(50);
            playSound('success');
            
            setTimeout(() => {
                gameState.currentWord++;
                gameState.builtWord = '';
                
                if (gameState.currentWord < gameState.words.length) {
                    showWordChallenge();
                } else {
                    completeWordGame();
                }
            }, 1500);
        }
    }
}

function removeLetter() {
    gameState.builtWord = gameState.builtWord.slice(0, -1);
    showWordChallenge();
}

function completeWordGame() {
    addBadge('📝');
    showMascotMessage("Fantastic! You built all the words! 🎯");
    updateGameUI();
    
    setTimeout(() => {
        backToGames();
    }, 3000);
}

// Simon Game
function initSimonGame() {
    document.getElementById('simonGame').style.display = 'block';
    gameState.sequence = [];
    gameState.playerSequence = [];
    gameState.isShowing = false;
    document.getElementById('simonLevel').textContent = gameState.level;
    
    // Setup button listeners
    document.querySelectorAll('.simon-btn').forEach(btn => {
        btn.onclick = () => simonButtonClick(btn.dataset.color);
    });
    
    setTimeout(() => {
        addToSimonSequence();
    }, 1000);
}

function addToSimonSequence() {
    const colors = ['red', 'blue', 'green', 'yellow'];
    const newColor = colors[Math.floor(Math.random() * colors.length)];
    gameState.sequence.push(newColor);
    showSimonSequence();
}

function showSimonSequence() {
    gameState.isShowing = true;
    gameState.playerSequence = [];
    
    gameState.sequence.forEach((color, index) => {
        setTimeout(() => {
            highlightSimonButton(color);
            if (index === gameState.sequence.length - 1) {
                setTimeout(() => {
                    gameState.isShowing = false;
                }, 500);
            }
        }, (index + 1) * 800);
    });
}

function highlightSimonButton(color) {
    const button = document.querySelector(`[data-color="${color}"]`);
    button.classList.add('active');
    playSound(color);
    
    setTimeout(() => {
        button.classList.remove('active');
    }, 400);
}

function simonButtonClick(color) {
    if (gameState.isShowing) return;
    
    gameState.playerSequence.push(color);
    highlightSimonButton(color);
    
    // Check if the sequence is correct
    const currentIndex = gameState.playerSequence.length - 1;
    
    if (gameState.playerSequence[currentIndex] !== gameState.sequence[currentIndex]) {
        // Wrong color
        gameState.lives--;
        updateGameUI();
        playSound('incorrect');
        showMascotMessage("Oops! Try to remember the pattern! 🤔");
        
        if (gameState.lives <= 0) {
            setTimeout(() => {
                backToGames();
            }, 2000);
        } else {
            setTimeout(() => {
                showSimonSequence();
            }, 1500);
        }
        return;
    }
    
    // Check if sequence is complete
    if (gameState.playerSequence.length === gameState.sequence.length) {
        gameState.score += gameState.sequence.length * 20;
        gameState.level++;
        addPoints(gameState.sequence.length * 10);
        document.getElementById('simonLevel').textContent = gameState.level;
        updateGameUI();
        
        if (gameState.level > 5) {
            addBadge('🌈');
            showMascotMessage("Incredible memory! You're a pattern master! 🏆");
        }
        
        setTimeout(() => {
            addToSimonSequence();
        }, 1000);
    }
}

// Parental Controls
function showParentalControls() {
    document.getElementById('parentalModal').classList.add('active');
    document.getElementById('parentalAuth').style.display = 'block';
    document.getElementById('parentalDashboard').style.display = 'none';
    document.getElementById('parentPassword').focus();
}

function hideParentalControls() {
    document.getElementById('parentalModal').classList.remove('active');
    document.getElementById('parentPassword').value = '';
}

function authenticateParent() {
    const password = document.getElementById('parentPassword').value;
    
    if (password === 'parent123') {
        document.getElementById('parentalAuth').style.display = 'none';
        document.getElementById('parentalDashboard').style.display = 'flex';
        switchDashboardTab('overview');
    } else {
        alert('Demo password is: parent123');
        document.getElementById('parentPassword').value = '';
        document.getElementById('parentPassword').focus();
    }
}

function switchDashboardTab(tabId) {
    // Update tab buttons
    document.querySelectorAll('.dashboard-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`[data-dashboard-tab="${tabId}"]`).classList.add('active');

    // Update tab content
    document.querySelectorAll('.dashboard-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    document.getElementById(tabId).classList.add('active');
}

// Responsive Design
function handleResize() {
    if (window.innerWidth <= 768) {
        // Mobile view adjustments
        if (currentGame && document.getElementById('gameArena').style.display !== 'none') {
            // Adjust game layout for mobile
            document.querySelectorAll('.memory-grid, .simon-grid').forEach(grid => {
                if (window.innerWidth <= 480) {
                    grid.style.maxWidth = '250px';
                }
            });
        }
    }
}

window.addEventListener('resize', handleResize);

// Utility Functions
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function saveProgress() {
    // In a real implementation, this would save to localStorage or a server
    const progress = {
        userLevel,
        userPoints,
        userBadges,
        currentTheme,
        soundEnabled
    };
    
    try {
        localStorage.setItem('funlearn-progress', JSON.stringify(progress));
    } catch (e) {
        console.log('Could not save progress to localStorage');
    }
}

function loadProgress() {
    try {
        const saved = localStorage.getItem('funlearn-progress');
        if (saved) {
            const progress = JSON.parse(saved);
            userLevel = progress.userLevel || 3;
            userPoints = progress.userPoints || 150;
            userBadges = progress.userBadges || ['🌟', '📚', '🎨'];
            currentTheme = progress.currentTheme || 'rainbow';
            soundEnabled = progress.soundEnabled !== undefined ? progress.soundEnabled : true;
            
            // Apply loaded settings
            changeTheme(currentTheme);
            if (!soundEnabled) {
                toggleSound();
            }
            updateUI();
        }
    } catch (e) {
        console.log('Could not load progress from localStorage');
    }
}

// Auto-save progress periodically
setInterval(saveProgress, 30000); // Save every 30 seconds

// Load progress on startup
loadProgress();

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        addPoints,
        addBadge,
        changeTheme,
        toggleSound,
        startGame,
        initMemoryGame,
        initMathGame,
        initWordGame,
        initSimonGame
    };
}