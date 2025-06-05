// 문제 데이터
const sentences = [
    {
        prefix: "도깨비들이",
        suffix: "떠들어요.",
        options: [
            { text: "와자지껄", correct: true },
            { text: "허둥지둥", correct: false }
        ]
    },
    {
        prefix: "흑부리 영감이",
        suffix: "노래를 불러요.",
        options: [
            { text: "엉금엉금", correct: false },
            { text: "홀얼홀얼", correct: true }
        ]
    },
    {
        prefix: "흑부리 영감이",
        suffix: "뛰어가요.",
        options: [
            { text: "허둥지둥", correct: true },
            { text: "힐끗힐끗", correct: false }
        ]
    },
    {
        prefix: "흑부리 영감이",
        suffix: "한 산길을 걸어요.",
        options: [
            { text: "꼴볼꼴볼", correct: true },
            { text: "보들보들", correct: false }
        ]
    }
];

// 게임 상태 관리
let correctAnswers = 0;
const totalQuestions = sentences.length;
const answeredQuestions = new Set();

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    generateSentences();
    setupEventListeners();
});

// 문장들 동적 생성
function generateSentences() {
    const sentencesArea = document.getElementById('sentencesArea');
    
    sentences.forEach((sentence, index) => {
        const sentenceRow = document.createElement('div');
        sentenceRow.className = 'sentence-row';
        sentenceRow.dataset.sentence = index;
        
        sentenceRow.innerHTML = `
            <span class="sentence-text">${sentence.prefix}</span>
            <div class="answer-options">
                ${sentence.options.map(option => 
                    `<div class="answer-option" data-answer="${option.text}" data-correct="${option.correct}">${option.text}</div>`
                ).join('')}
            </div>
            <span class="sentence-text">${sentence.suffix}</span>
        `;
        
        sentencesArea.appendChild(sentenceRow);
    });
}

// 이벤트 리스너 설정
function setupEventListeners() {
    const answerOptions = document.querySelectorAll('.answer-option');
    answerOptions.forEach(option => {
        option.addEventListener('click', function() {
            const sentenceIndex = parseInt(this.parentElement.parentElement.dataset.sentence);
            const isCorrect = this.dataset.correct === 'true';
            handleAnswer(this, sentenceIndex, isCorrect);
        });
    });
}

// 답안 처리
function handleAnswer(selectedOption, sentenceIndex, isCorrect) {
    // 이미 답한 문제는 무시
    if (answeredQuestions.has(sentenceIndex)) {
        return;
    }

    const sentenceRow = selectedOption.parentElement.parentElement;
    const allOptions = sentenceRow.querySelectorAll('.answer-option');
    
    if (isCorrect) {
        // 정답 처리
        showCorrectMark(selectedOption);
        correctAnswers++;
        answeredQuestions.add(sentenceIndex);
        
        // 다른 옵션들 비활성화
        allOptions.forEach(option => {
            if (option !== selectedOption) {
                option.style.pointerEvents = 'none';
                option.style.opacity = '0.5';
            }
        });
        
        // 모든 문제를 맞혔는지 확인
        if (correctAnswers === totalQuestions) {
            setTimeout(() => {
                showCompletionPopup();
            }, 1000);
        }
    } else {
        // 오답 처리
        showIncorrectMark(selectedOption);
        setTimeout(() => {
            hideIncorrectMark(selectedOption);
        }, 1500);
    }
}

// 정답 표시 (빨간 동그라미)
function showCorrectMark(option) {
    const mark = document.createElement('div');
    mark.className = 'answer-mark';
    mark.innerHTML = '⭕';
    mark.style.color = '#ff4444';
    option.appendChild(mark);
    
    // 선택된 옵션 스타일 변경
    option.style.backgroundColor = '#e8f5e8';
    option.style.borderColor = '#4CAF50';
    option.style.pointerEvents = 'none';
}

// 오답 표시 (빨간 X)
function showIncorrectMark(option) {
    const mark = document.createElement('div');
    mark.className = 'answer-mark';
    mark.innerHTML = '❌';
    mark.style.color = '#ff4444';
    option.appendChild(mark);
    
    // 선택된 옵션 임시 스타일 변경
    option.style.backgroundColor = '#ffe8e8';
    option.style.borderColor = '#f44336';
}

// 오답 표시 제거
function hideIncorrectMark(option) {
    const mark = option.querySelector('.answer-mark');
    if (mark) {
        mark.remove();
    }
    
    // 스타일 원복
    option.style.backgroundColor = 'white';
    option.style.borderColor = '#4A90E2';
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
    correctAnswers = 0;
    answeredQuestions.clear();
    
    // 모든 답안 옵션 초기화
    const answerOptions = document.querySelectorAll('.answer-option');
    answerOptions.forEach(option => {
        const mark = option.querySelector('.answer-mark');
        if (mark) {
            mark.remove();
        }
        option.style.backgroundColor = 'white';
        option.style.borderColor = '#4A90E2';
        option.style.pointerEvents = 'auto';
        option.style.opacity = '1';
    });
    
    hidePopup('completionPopup');
}

// 이전 페이지로 이동
function goToPreviousPage() {
    window.location.href = 'page1_1.html';
}