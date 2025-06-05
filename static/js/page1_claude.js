// 문제 데이터
const questions = [
    {
        image: "👨‍🌾",
        description: "정신을 차릴 수 없을 만큼 이리저리 헤매며<br>다급하게 서두르는 모양.",
        answers: ["허둥지둥", "꼴볼꼴볼", "홀얼홀얼", "와자지껄"],
        correct: "허둥지둥"
    },
    {
        image: "🏃‍♂️",
        description: "매우 빠르게 달려가는 모습을<br>나타내는 말.",
        answers: ["터벅터벅", "성큼성큼", "휘적휘적", "후다닥"],
        correct: "후다닥"
    },
    {
        image: "💤",
        description: "깊이 잠들어 코를 골며<br>자는 소리를 나타내는 말.",
        answers: ["드르렁", "졸졸", "찰랑찰랑", "뚝뚝"],
        correct: "드르렁"
    },
    {
        image: "🌟",
        description: "작은 별들이 하늘에서<br>반짝반짝 빛나는 모양.",
        answers: ["반들반들", "번들번들", "반짝반짝", "빤들빤들"],
        correct: "반짝반짝"
    }
];

let currentQuestion = 0;
let correctAnswers = 0;

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    loadQuestion();
    setupEventListeners();
});

// 이벤트 리스너 설정
function setupEventListeners() {
    const answerButtons = document.querySelectorAll('.answer-button');
    answerButtons.forEach(button => {
        button.addEventListener('click', function() {
            handleAnswer(this.dataset.answer);
        });
    });
}

// 문제 로드
function loadQuestion() {
    if (currentQuestion >= questions.length) {
        showCompletionPopup();
        return;
    }

    const question = questions[currentQuestion];
    document.getElementById('questionImage').textContent = question.image;
    document.getElementById('questionDescription').innerHTML = question.description;
    
    // 답안 버튼 업데이트
    const answerButtons = document.querySelectorAll('.answer-button');
    answerButtons.forEach((button, index) => {
        button.textContent = question.answers[index];
        button.dataset.answer = question.answers[index];
        button.style.display = 'flex';
    });

    // 페이지 번호 업데이트
    document.querySelector('.page-indicator').textContent = currentQuestion + 1;
    document.querySelector('.step-number').textContent = currentQuestion + 1;
}

// 답안 처리
function handleAnswer(selectedAnswer) {
    const question = questions[currentQuestion];
    
    if (selectedAnswer === question.correct) {
        correctAnswers++;
        showCorrectPopup();
        setTimeout(() => {
            hidePopup('correctPopup');
            currentQuestion++;
            loadQuestion();
        }, 1500);
    } else {
        showIncorrectPopup();
        setTimeout(() => {
            hidePopup('incorrectPopup');
        }, 1500);
    }
}

// 정답 팝업 표시
function showCorrectPopup() {
    document.getElementById('correctPopup').classList.remove('hidden');
}

// 오답 팝업 표시
function showIncorrectPopup() {
    document.getElementById('incorrectPopup').classList.remove('hidden');
}

// 완료 팝업 표시
function showCompletionPopup() {
    document.getElementById('completionPopup').classList.remove('hidden');
}

// 팝업 숨기기
function hidePopup(popupId) {
    document.getElementById(popupId).classList.add('hidden');
}

// 게임 다시 시작
function restartGame() {
    currentQuestion = 0;
    correctAnswers = 0;
    hidePopup('completionPopup');
    loadQuestion();
}

// 다음 페이지로 이동
function goToNextPage() {
    window.location.href = 'page2_1.html';
}