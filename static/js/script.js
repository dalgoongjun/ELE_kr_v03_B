// 문제 데이터
const questionData = [
    {
        image: "./static/images/unit01/humming.svg", // 1번 문제 이미지 경로
        question: "배고픈 호랑이가 동물들을 잡아먹으려고 했을 때, 꾀를 내어 '나중에 먹으면 더 맛있을 것'이라고 호랑이를 속인 동물은 무엇인가요?",
        options: ["토끼", "고양이", "여우", "곰"],
        correctAnswer: 0 // 인덱스 기준 (0: 토끼)
    },
    {
        image: "./static/images/unit01/hurriedly.svg", // 2번 문제 이미지 경로
        question: "나무꾼이 도끼를 물에 빠뜨렸을 때, 금도끼와 은도끼를 보여주며 정직함을 시험했던 존재는 누구인가요?",
        options: ["산신령", "도깨비", "선녀", "신선"],
        correctAnswer: 2 // 인덱스 기준 (2: 선녀)
    },
    {
        image: "./static/images/unit01/noisy.svg", // 3번 문제 이미지 경로
        question: "거북이와의 경주에서 자만하다가 잠을 자서 결국 경주에서 진 동물은 무엇인가요?",
        options: ["사슴", "토끼", "늑대", "여우"],
        correctAnswer: 1 // 인덱스 기준 (1: 토끼)
    },
    {
        image: "./static/images/unit01/twirly.svg", // 4번 문제 이미지 경로
        question: "까마귀가 갈증을 해소하기 위해 돌을 넣어 물의 높이를 올린 용기는 무엇인가요?",
        options: ["항아리", "그릇", "컵", "물통"],
        correctAnswer: 0 // 인덱스 기준 (0: 항아리)
    }
];


// 전역 변수
let currentQuestionIndex = 0;
let answeredCorrectly = [false, false, false, false]; // 각 문제의 정답 여부 기록

// DOM 요소
const questionNumberElement = document.getElementById('current-question');
const questionImageElement = document.getElementById('question-image');
const questionTextElement = document.getElementById('question-text');
const answerOptions = document.querySelectorAll('.answer-option');
const feedbackMessage = document.getElementById('feedback-message');
const completionPopup = document.getElementById('completion-popup');
const restartButton = document.getElementById('restart-button');

// 문제 표시 함수
function displayQuestion(index) {
    const question = questionData[index];
    
    // 문제 번호 업데이트
    questionNumberElement.textContent = index + 1;
    
    // 이미지 및 문제 텍스트 업데이트
    questionImageElement.src = question.image;
    questionTextElement.textContent = question.question;
    
    // 답변 옵션 업데이트
    answerOptions.forEach((option, i) => {
        option.textContent = question.options[i];
        option.classList.remove('selected');
    });
    
    // 피드백 메시지 숨기기
    feedbackMessage.classList.add('hidden');
}

// 정답 체크 함수
function checkAnswer(selectedIndex) {
    const question = questionData[currentQuestionIndex];
    
    if (selectedIndex === question.correctAnswer) {
        // 정답일 경우
        feedbackMessage.textContent = '정답입니다!';
        feedbackMessage.classList.remove('hidden', 'incorrect');
        feedbackMessage.classList.add('correct');
        answeredCorrectly[currentQuestionIndex] = true;
        
        // 잠시 후 다음 문제로 이동
        setTimeout(() => {
            goToNextQuestion();
        }, 1500);
    } else {
        // 오답일 경우
        feedbackMessage.textContent = '다시 시도해보세요.';
        feedbackMessage.classList.remove('hidden', 'correct');
        feedbackMessage.classList.add('incorrect');
        
        // 선택 초기화
        setTimeout(() => {
            answerOptions.forEach(option => {
                option.classList.remove('selected');
            });
            feedbackMessage.classList.add('hidden');
        }, 1500);
    }
}

// 다음 문제로 이동 함수
function goToNextQuestion() {
    // 다음 문제 인덱스
    let nextIndex = currentQuestionIndex + 1;
    
    // 모든 문제를 다 풀었는지 확인
    if (nextIndex >= questionData.length) {
        showCompletionPopup();
        return;
    }
    
    // 다음 문제 표시
    currentQuestionIndex = nextIndex;
    displayQuestion(currentQuestionIndex);
}

// 완료 팝업 표시 함수
function showCompletionPopup() {
    const allCorrect = answeredCorrectly.every(status => status === true);
    if (allCorrect) {
        completionPopup.classList.remove('hidden');
        completionPopup.style.display = 'flex'; // 보이게
    } else {
        currentQuestionIndex = 0;
        displayQuestion(currentQuestionIndex);
    }
}

// 게임 재시작 함수
function restartGame() {
    currentQuestionIndex = 0;
    answeredCorrectly = [false, false, false, false];
    completionPopup.classList.add('hidden');
    completionPopup.style.display = 'none'; // 숨기기
    displayQuestion(currentQuestionIndex);
}

// 이벤트 리스너 설정
document.addEventListener('DOMContentLoaded', function() {
    // 팝업 초기에 숨기기
    completionPopup.classList.add('hidden');
    completionPopup.style.display = 'none';
    
    // 첫 번째 문제 표시
    displayQuestion(currentQuestionIndex);
    
    // 답변 옵션 클릭 이벤트
    answerOptions.forEach(option => {
        option.addEventListener('click', function() {
            // 이미 선택된 경우 무시
            if (this.classList.contains('selected')) {
                return;
            }
            
            // 피드백이 표시되고 있는 경우 무시
            if (!feedbackMessage.classList.contains('hidden')) {
                return;
            }
            
            // 선택 표시
            answerOptions.forEach(opt => {
                opt.classList.remove('selected');
            });
            this.classList.add('selected');
            
            // 정답 확인
            const selectedIndex = parseInt(this.getAttribute('data-index'));
            checkAnswer(selectedIndex);
        });
    });
    
    // 재시작 버튼 클릭 이벤트
    restartButton.addEventListener('click', restartGame);
});