// DOM Elements
const sections = {
    landingPage: document.getElementById('landing-page'),
    teacherGuide: document.getElementById('teacher-guide'),
    gameIntro: document.getElementById('game-intro'),
    mission1: document.getElementById('mission-1'),
    mission2: document.getElementById('mission-2'),
    mission3: document.getElementById('mission-3'),
    reward: document.getElementById('reward')
};

// State
let currentState = 'landingPage';
let introStep = 0;
let quizStep = 0;

// Data
const introData = [
    {
        title: "오늘의 이야기 (1/3)",
        text: "\"옛날 옛날에, 아기 돼지 삼형제가 살고 있었어요.<br>첫째는 짚으로, 둘째는 나무로 집을 지었지요.\"",
        img: "🐷🐷🐷"
    },
    {
        title: "오늘의 이야기 (2/3)",
        text: "\"그런데 배고픈 늑대가 나타나 '후~' 하고 입김을 불자,<br>짚 집과 나무 집이 휙~ 날아가 버렸어요!\"",
        img: "🐺💨"
    },
    {
        title: "오늘의 이야기 (3/3)",
        text: "\"이제 남은 건 막내의 벽돌 집 뿐이에요.<br>우리가 힘을 합쳐 튼튼한 벽돌 집을 완성하고 늑대를 막아낼 수 있을까요?\"",
        img: "🏡✨"
    }
];

const quizData = [
    {
        question: "늑대가 나타나서 '후~' 하고 무엇을 불었나요?",
        answer: true, // True for '입김' context (User presses O for correct fact) -> Wait, logic is O/X. Question phrasing matters.
        // Let's rephrase to be O/X statements.
        // Q1 Statement: "늑대는 입김을 '후~' 하고 불어서 집을 날려버렸어요." -> True
        statement: "늑대는 입김을 '후~' 하고 불어서 집을 날려버렸어요.",
        isTrue: true,
        icon: "🐺💨"
    },
    {
        // Q2 Statement: "첫째와 둘째 돼지의 집은 튼튼해서 날아가지 않았어요." -> False
        statement: "첫째와 둘째 돼지의 집은 튼튼해서 날아가지 않았어요.",
        isTrue: false,
        icon: "🏠❌"
    },
    {
        // Q3 Statement: "막내 돼지의 집은 벽돌로 지어서 아주 튼튼해요." -> True
        statement: "막내 돼지의 집은 벽돌로 지어서 아주 튼튼해요.",
        isTrue: true,
        icon: "🧱🏡"
    }
];

// Transition Functions
function hideAllSections() {
    Object.values(sections).forEach(section => {
        section.classList.add('hidden');
        section.classList.remove('active');
    });
}

function showSection(sectionId) {
    hideAllSections();
    const target = sections[sectionId];
    if (target) {
        target.classList.remove('hidden');
        target.classList.add('active');
    }
}

function enterTeacherGuide() {
    showSection('teacherGuide');
}

function startGame() {
    introStep = 0;
    updateIntro();
    showSection('gameIntro');
}

function updateIntro() {
    const data = introData[introStep];
    document.getElementById('intro-title').textContent = data.title;
    document.getElementById('intro-text').innerHTML = data.text;
    document.getElementById('intro-img').textContent = data.img;

    // Update Button Text if last step
    const btn = document.querySelector('#game-intro .btn-next');
    if (introStep === 2) {
        btn.textContent = "도와주러 가기! 🚩";
        btn.onclick = function () { goToMission(1); };
    } else {
        btn.textContent = "다음 이야기 ➡";
        btn.onclick = nextIntro;
    }
}

function nextIntro() {
    if (introStep < 2) {
        introStep++;
        updateIntro();
    } else {
        goToMission(1);
    }
}

function goToMission(missionNum) {
    if (missionNum === 1) {
        quizStep = 0;
        updateQuiz();
        showSection('mission1');
    }
    else if (missionNum === 2) showSection('mission2');
    else if (missionNum === 3) showSection('mission3');
    else if (missionNum === 4) showSection('reward');
}

function nextStep(nextMissionNum) {
    goToMission(nextMissionNum);
}


// --- Mission 1 Logic (Quiz) ---
function updateQuiz() {
    const data = quizData[quizStep];
    document.getElementById('quiz-title').textContent = `이야기 속 진실 혹은 거짓? (${quizStep + 1}/3)`;
    document.getElementById('quiz-question').innerHTML = data.statement;
    document.getElementById('quiz-icon').textContent = data.icon;

    // Reset feedback
    const feedbackEl = document.getElementById('feedback-m1');
    feedbackEl.classList.add('hidden');
    feedbackEl.querySelector('.btn-next').classList.add('hidden');
}

function checkAnswer(userChoice) { // userChoice is boolean (true = O, false = X)
    const feedbackEl = document.getElementById('feedback-m1');
    const msgEl = feedbackEl.querySelector('.feedback-msg');
    const nextBtn = feedbackEl.querySelector('.btn-next');

    const data = quizData[quizStep];
    const isCorrect = (userChoice === data.isTrue);

    feedbackEl.classList.remove('hidden');

    if (isCorrect) {
        msgEl.textContent = "딩동댕! 정답이에요! 👏�";
        msgEl.style.color = "#4CAF50";

        // Check if last quiz
        if (quizStep === 2) {
            nextBtn.textContent = "다음 단계로! 🚀";
            nextBtn.onclick = function () { nextStep(2); };
        } else {
            nextBtn.textContent = "다음 문제로! ➡";
            nextBtn.onclick = nextQuiz;
        }
        nextBtn.classList.remove('hidden');
    } else {
        msgEl.textContent = "어머, 다시 한번 생각해보세요! 🤔";
        msgEl.style.color = "#F44336";
        nextBtn.classList.add('hidden');
    }
}

function nextQuiz() {
    if (quizStep < 2) {
        quizStep++;
        updateQuiz();
    } else {
        nextStep(2);
    }
}

// --- Mission 2 Logic (Math) ---
function checkMath(answer) {
    const feedbackEl = document.getElementById('feedback-m2');
    const msgEl = feedbackEl.querySelector('.feedback-msg');
    const nextBtn = feedbackEl.querySelector('.btn-next');

    // We have 6 bricks in the HTML
    const correctAnswer = 6;

    feedbackEl.classList.remove('hidden');

    if (answer === correctAnswer) {
        msgEl.textContent = "정답! 벽돌 6개를 모두 찾았어요! 👏👏";
        msgEl.style.color = "#4CAF50";
        nextBtn.classList.remove('hidden');
    } else {
        msgEl.textContent = "다시 한번 천천히 세어볼까요? 하나.. 둘.. 🧱";
        msgEl.style.color = "#F44336";
        nextBtn.classList.add('hidden');
    }
}

// --- Mission 3 Logic (Writing) ---
function checkWord() {
    const input = document.getElementById('word-input');
    const feedbackEl = document.getElementById('feedback-m3');
    const msgEl = feedbackEl.querySelector('.feedback-msg');
    const nextBtn = feedbackEl.querySelector('.btn-next');

    const target = "벽돌집";

    if (input.value.trim() === target) {
        feedbackEl.classList.remove('hidden');
        msgEl.innerHTML = "성공! 아주 튼튼한 벽돌집이 완성되었어요! 🏡✨";
        msgEl.style.color = "#673AB7";
        nextBtn.classList.remove('hidden');
    } else {
        feedbackEl.classList.remove('hidden');
        msgEl.textContent = "글자를 다시 확인해보세요. '벽돌집'";
        msgEl.style.color = "#F44336";
        nextBtn.classList.add('hidden');
    }
}

// --- Reward Logic ---
const fortuneMessages = [
    "친구에게 고마워!라고 이야기해요 �",
    "선생님 말씀을 끝까지 잘 들어요 👂",
    "장난감을 스스로 정리정돈해요 🧸",
    "맛있는 밥을 골고루 먹어요 🍚",
    "친구와 사이좋게 지내요 🤝",
    "어려운 친구를 보면 먼저 도와줘요 ❤️"
];

function openCookie() {
    const cookieWrapper = document.getElementById('cookie-wrapper');
    const messageArea = document.getElementById('fortune-message');
    const fortuneText = document.getElementById('fortune-text');

    if (cookieWrapper.classList.contains('opened')) return;

    // Animate break
    cookieWrapper.classList.remove('closed');
    cookieWrapper.innerHTML = "✨ 바사삭! ✨";
    cookieWrapper.classList.add('opened');

    setTimeout(() => {
        // Random message
        const randomIndex = Math.floor(Math.random() * fortuneMessages.length);
        fortuneText.textContent = fortuneMessages[randomIndex];

        messageArea.classList.remove('hidden');
        messageArea.style.animation = "popIn 0.5s forwards";
    }, 500);
}

// Add Enter key support for Mission 3
document.getElementById('word-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        checkWord();
    }
});
