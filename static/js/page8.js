// 문제 데이터
const sentences = [
    {
        prefix: "목소리로만 연기하는 배우는",
        suffix: "입니다.",
        options: [
            { text: "조종사", correct: false },
            { text: "성우", correct: true }
        ]
    },
    {
        prefix: "비행기를 조종하는 사람은",
        suffix: "입니다.",
        options: [
            { text: "제빵사", correct: false },
            { text: "조종사", correct: true }
        ]
    },
    {
        prefix: "고고학을 연구하는 사람은",
        suffix: "입니다.",
        options: [
            { text: "고고학자", correct: true },
            { text: "성우", correct: false }
        ]
    },
    {
        prefix: "빵을 만드는 일을 전문으로 하는 사람은",
        suffix: "입니다.",
        options: [
            { text: "제빵사", correct: true },
            { text: "고고학자", correct: false }
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
    
    // 결과 화면에서 다시 시작 버튼
    document.getElementById('restart-btn').onclick = resetQuiz;
    
    // 이전 문제 버튼
    document.getElementById('nav-btn').onclick = function() {
        window.location.href = 'page7.html';
    };
});

// 문장들 동적 생성
function generateSentences() {
    const sentencesArea = document.getElementById('sentencesArea');
    
    sentences.forEach((sentence, index) => {
        const sentenceRow = document.createElement('div');
        sentenceRow.className = 'sentence-row';
        sentenceRow.dataset.sentence = index;
        
        // prefix와 suffix 존재 여부에 따라 HTML 구성
        let htmlContent = '';
        
        // prefix가 있으면 추가
        if (sentence.prefix && sentence.prefix.trim() !== '') {
            htmlContent += `<span class="sentence-text prefix-text">${sentence.prefix}</span>`;
        }
        
        // answer-options는 항상 추가
        htmlContent += `
            <div class="answer-options">
                ${sentence.options.map(option => 
                    `<div class="answer-option" data-answer="${option.text}" data-correct="${option.correct}">${option.text}</div>`
                ).join('')}
            </div>
        `;
        
        // suffix가 있으면 추가
        if (sentence.suffix && sentence.suffix.trim() !== '') {
            htmlContent += `<span class="sentence-text suffix-text">${sentence.suffix}</span>`;
        }
        
        sentenceRow.innerHTML = htmlContent;
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
        showCorrectImage(selectedOption);
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
                showResultPopup();
            }, 1000);
        }
    } else {
        // 오답 처리
        showIncorrectImage(selectedOption);
        setTimeout(() => {
            hideIncorrectImage(selectedOption);
        }, 1500);
    }
}

// 정답 이미지 표시
function showCorrectImage(option) {
    const image = document.createElement('img');
    image.className = 'answer-result-image';
    image.src = './static/images/base/pencil_correct.svg';
    image.alt = '정답';
    option.appendChild(image);
    
    // 선택된 옵션 스타일 변경
    option.style.pointerEvents = 'none';
}

// 오답 이미지 표시
function showIncorrectImage(option) {
    const image = document.createElement('img');
    image.className = 'answer-result-image';
    image.src = './static/images/base/pencil_incorrect.svg';
    image.alt = '오답';
    option.appendChild(image);
    
    // 선택된 옵션 임시 스타일 변경
}

// 오답 이미지 제거
function hideIncorrectImage(option) {
    const image = option.querySelector('.answer-result-image');
    if (image) {
        image.remove();
    }
    
    // 스타일 원복 - 색상 변경 없음
}

// 결과 팝업 표시
function showResultPopup() {
    document.getElementById('result-popup').style.display = 'flex';
}

// 퀴즈 초기화
function resetQuiz() {
    correctAnswers = 0;
    answeredQuestions.clear();
    
    // 모든 답안 옵션 초기화
    const answerOptions = document.querySelectorAll('.answer-option');
    answerOptions.forEach(option => {
        const image = option.querySelector('.answer-result-image');
        if (image) {
            image.remove();
        }
        option.style.pointerEvents = 'auto';
        option.style.opacity = '1';
    });
    
    document.getElementById('result-popup').style.display = 'none';
}