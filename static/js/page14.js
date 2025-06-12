// 문제 데이터
const sentences = [
    {
        prefix: "혼자 살아가는",
        suffix: "가 늘어나고 있어요.",
        options: [
            { text: "1인 가구", correct: true },
            { text: "고령화", correct: false }
        ]
    },
    {
        prefix: "국적과 문화가 다른 사람들이 함께 사는",
        suffix: "을 쉽게 볼 수 있어요.",
        options: [
            { text: "다문화 가족", correct: true },
            { text: "1인 가구", correct: false }
        ]
    },
    {
        suffix: "는 일정한 지역에 사는 사람의 수예요.",
        options: [
            { text: "다문화 가족", correct: false },
            { text: "인구", correct: true }
        ]
    },
    {
        prefix: "노인 인구 비율이 높은 상태로 나타나는 일을",
        suffix: "라고 해요.",
        options: [
            { text: "고령화", correct: true },
            { text: "인구", correct: false }
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
        window.location.href = 'page13.html';
    };
});

// 문장들 동적 생성
function generateSentences() {
    const sentencesArea = document.getElementById('sentencesArea');
    
    sentences.forEach((sentence, index) => {
        const sentenceRow = document.createElement('div');
        sentenceRow.className = 'sentence-row';
        sentenceRow.dataset.sentence = index;
        
        // sentence-content div로 모든 내용을 감싸기
        const sentenceContent = document.createElement('div');
        sentenceContent.className = 'sentence-content';
        
        let htmlContent = '';
        let hasPrefix = sentence.prefix && sentence.prefix.trim() !== '';
        
        // prefix가 있으면 추가
        if (hasPrefix) {
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
        
        sentenceContent.innerHTML = htmlContent;
        sentenceRow.appendChild(sentenceContent);
        
        // 첫 번째 요소가 answer-option인 경우 원형 불릿 위치 조정
        if (!hasPrefix) {
            sentenceRow.classList.add('starts-with-option');
        }
        
        sentencesArea.appendChild(sentenceRow);
    });
}

// 이벤트 리스너 설정
function setupEventListeners() {
    const answerOptions = document.querySelectorAll('.answer-option');
    answerOptions.forEach(option => {
        option.addEventListener('click', function() {
            const sentenceIndex = parseInt(this.closest('.sentence-row').dataset.sentence);
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

    const sentenceRow = selectedOption.closest('.sentence-row');
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
    
    // 스타일 원복
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