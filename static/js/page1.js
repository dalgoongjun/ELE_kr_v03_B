// 문제 데이터 (이미지, 문제, 보기는 원하는 내용/경로로 교체)
const problems = [
    {
      image: './static/images/unit01/hurriedly.svg',
      question: '정신을 차릴 수 없을 만큼 이리저리 헤매며 다급하게 서두르는 모양.',
      answers: ['허둥지둥', '꼬불꼬불', '흥얼흥얼', '왁자지껄'],
      correct: 0,
    },
    {
      image: './static/images/unit01/twirly.svg',
      question: '모양이 곧지 않고 이리저리 구부러진 모양.',
      answers: ['허둥지둥', '꼬불꼬불', '흥얼흥얼', '왁자지껄'],
      correct: 1,
    },
    {
      image: './static/images/unit01/humming.svg',
      question: '흥이 나거나 기분이 좋아서 입속으로 계속 노래를 부르는 소리. 또는 그 모양.',
      answers: ['허둥지둥', '꼬불꼬불', '흥얼흥얼', '왁자지껄'],
      correct: 2,
    },
    {
      image: './static/images/unit01/noisy.svg',
      question: '여럿이 한데 모여 시끄럽게 떠들고 지껄이는 소리. 또는 그 모양.',
      answers: ['허둥지둥', '꼬불꼬불', '흥얼흥얼', '왁자지껄'],
      correct: 3,
    },
  ];
  
  // 정답/오답 이미지 경로
  const correctImages = [
    './static/images/base/elekr_correct1.svg',
    './static/images/base/elekr_correct2.svg',
    './static/images/base/elekr_correct3.svg',
    './static/images/base/elekr_correct4.svg'
  ];
  
  const incorrectImages = [
    './static/images/base/elekr_incorrect1.svg',
    './static/images/base/elekr_incorrect2.svg',
    './static/images/base/elekr_incorrect3.svg',
    './static/images/base/elekr_incorrect4.svg'
  ];
  
  // 현재 문제 인덱스
  let currentProblemIndex = 0;
  // 맞춘 문제 배열
  let solved = [false, false, false, false];
  
  // 랜덤 이미지 선택 함수
  function getRandomImage(imageArray) {
    const randomIndex = Math.floor(Math.random() * imageArray.length);
    return imageArray[randomIndex];
  }
  
  // 문제 렌더링 함수 - 현재 인덱스의 문제만 표시
  function renderCurrentProblem() {
    const wrapper = document.getElementById('problems-wrapper');
    wrapper.innerHTML = '';
    
    // 모든 문제를 풀었는지 확인
    if (currentProblemIndex >= problems.length) {
      showResultPopup('next');
      return;
    }
    
    const p = problems[currentProblemIndex];
    const set = document.createElement('div');
    set.className = 'problem-set';
    
    // 문제 구조 변경: 질문과 이미지는 같은 줄, 답변은 아래 한 줄에
    set.innerHTML = `
        <div class="question-container">
            <div class="pic1"><img src="${p.image}" alt="문제이미지"></div>
            <div class="question-area">
                <div class="question-counter">문제 ${currentProblemIndex + 1} / ${problems.length}</div>
                <span class="question-text">${p.question}</span>
            </div>
        </div>
        <div class="answers">
            ${p.answers.map((a, idx) => 
              `<div class="answer" data-answer="${idx}">${a}</div>`
            ).join('')}
        </div>
    `;
    
    wrapper.appendChild(set);
    
    // 정답 체크 이벤트
    document.querySelectorAll('.answer').forEach(el => {
      el.onclick = function() {
        const ans = +el.dataset.answer;
        
        // 모든 답변 버튼 비활성화
        document.querySelectorAll('.answer').forEach(a => {
            a.style.pointerEvents = 'none';
        });
        
        if (ans === problems[currentProblemIndex].correct) {
            // 정답인 경우
            el.classList.add('correct');
            solved[currentProblemIndex] = true;
            
            // 정답 팝업 표시
            setTimeout(() => {
                showCorrectPopup();
            }, 500);
        } else {
            // 오답인 경우
            el.classList.add('incorrect');
            
            // 오답 팝업 표시
            setTimeout(() => {
                showIncorrectPopup();
            }, 500);
        }
      };
    });
  }
  
  // 정답 팝업 표시 - 1초 후 자동으로 다음 문제로 이동
  function showCorrectPopup() {
    const popup = document.getElementById('correct-popup');
    // 랜덤 정답 이미지 선택
    const randomImage = getRandomImage(correctImages);
    popup.querySelector('.popup-content').innerHTML = `<img src="${randomImage}" alt="정답">`;
    popup.style.display = 'flex';
    
    // 1초 후 자동으로 닫고 다음 문제로 이동
    setTimeout(() => {
        popup.style.display = 'none';
        currentProblemIndex++;
        if (currentProblemIndex >= problems.length) {
          showResultPopup('next');
      } else {
          renderCurrentProblem();
      }
    }, 1000);
  }
  
  // 오답 팝업 표시 - 1초 후 자동으로 같은 문제 다시 시도
  function showIncorrectPopup() {
    const popup = document.getElementById('incorrect-popup');
    // 랜덤 오답 이미지 선택
    const randomImage = getRandomImage(incorrectImages);
    popup.querySelector('.popup-content').innerHTML = `<img src="${randomImage}" alt="오답">`;
    popup.style.display = 'flex';
    
    // 1초 후 자동으로 닫고 같은 문제 다시 시도
    setTimeout(() => {
        popup.style.display = 'none';
        // 모든 답변 버튼 활성화 및 오답 클래스 제거
        document.querySelectorAll('.answer').forEach(a => {
            a.classList.remove('incorrect');
            a.style.pointerEvents = 'auto';
        });
    }, 1000);
  }
  
  // 결과 팝업 표시
  function showResultPopup(direction = 'next') {
    // 모든 다른 팝업이 표시되지 않도록 확인
    document.getElementById('correct-popup').style.display = 'none';
    document.getElementById('incorrect-popup').style.display = 'none';
  
    const navBtn = document.getElementById('nav-btn');
    if (direction === 'prev') {
      navBtn.textContent = '이전 문제';
      navBtn.onclick = () => {
        window.location.href = 'page1.html';
      };
    } else {
      navBtn.textContent = '다음 문제';
      navBtn.onclick = () => {
        window.location.href = 'page2.html';
      };
    }
  
    document.getElementById('result-popup').style.display = 'flex';
  }
  
  // 퀴즈 초기화
  function resetQuiz() {
    solved = [false, false, false, false];
    currentProblemIndex = 0;
    document.getElementById('result-popup').style.display = 'none';
    renderCurrentProblem();
  }
  
  // 페이지 로드 시 이벤트 리스너 설정
  window.onload = function() {
    renderCurrentProblem();
    
    // 결과 화면에서 다시 시작 버튼
    document.getElementById('restart-btn').onclick = resetQuiz;
  };