// 화면 방향을 가로 모드로 고정시키는 스크립트
document.addEventListener('DOMContentLoaded', function() {
    // 모바일 기기에서 화면 방향 고정 시도
    tryLockOrientation();
    
    // resize 이벤트 발생 시 캔버스 크기 조정
    window.addEventListener('resize', function() {
      if (typeof resizeCanvas === 'function') {
        resizeCanvas();
      }
      // 방향 확인 및 메시지 업데이트
      checkOrientation();
    });
    
    // orientationchange 이벤트 - 방향 변경 시 직접 호출
    window.addEventListener('orientationchange', function() {
      // 약간의 지연 후 방향 확인 (브라우저가 업데이트되는 시간 고려)
      setTimeout(function() {
        checkOrientation();
      }, 100);
    });
    
    // 메타 뷰포트 태그 업데이트
    updateViewportMeta();
    
    // 초기 방향 확인 및 처리
    checkOrientation();
  });
  
  // 메타 뷰포트 태그 업데이트 함수
  function updateViewportMeta() {
    const metaViewport = document.querySelector('meta[name="viewport"]');
    if (metaViewport) {
      // 기존 뷰포트 설정에 width=device-width, initial-scale=1.0 추가
      metaViewport.setAttribute('content', 
        'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    }
  }
  
  // 화면 방향 고정 시도 함수
  function tryLockOrientation() {
    try {
      // 대부분의 모바일 브라우저에서 사용
      if (screen.orientation && screen.orientation.lock) {
        screen.orientation.lock('landscape').catch(function(error) {
          console.log('화면 방향 고정 실패:', error);
          // 화면 방향 고정 실패 시 경고 메시지 표시
          showOrientationWarning();
        });
      } else {
        // 방향 고정을 지원하지 않는 경우 경고 메시지 표시
        showOrientationWarning();
      }
    } catch (e) {
      console.log('화면 방향 고정 오류:', e);
      showOrientationWarning();
    }
    
    // 현재 방향 확인 및 처리
    checkOrientation();
  }
  
  // 방향 경고 메시지 표시
  function showOrientationWarning() {
    createOrUpdateWarningElement();
    // 경고 메시지가 생성된 후 바로 방향 체크
    checkOrientation();
  }
  
  // 경고 메시지 요소 생성/업데이트
  function createOrUpdateWarningElement() {
    // 경고 메시지 요소가 이미 있는지 확인
    let warningElement = document.getElementById('orientation-warning');
    
    // 없으면 새로 생성
    if (!warningElement) {
      warningElement = document.createElement('div');
      warningElement.id = 'orientation-warning';
      
      // 사용자 정의 이미지 추가
      const rotateImage = document.createElement('img');
      rotateImage.className = 'rotate-image';
      // 이미지 경로 설정 - 플라스크 템플릿 사용
      rotateImage.src = "./static/images/base/rotate_device.svg";
      rotateImage.alt = "기기를 가로로 돌려주세요";
      
      // 이미지 로드 오류 처리
      rotateImage.onerror = function() {
        // 이미지 로드 실패 시 대체 SVG 사용
        this.outerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="rotate-image">
            <rect x="4" y="2" width="16" height="20" rx="2" ry="2" transform="rotate(90 12 12)"></rect>
            <line x1="12" y1="18" x2="12.01" y2="18" transform="rotate(90 12 12)"></line>
          </svg>
        `;
      };
      
      // 텍스트 메시지
      const messageElement = document.createElement('p');
      //messageElement.textContent = '이 콘텐츠는 가로 모드에서 가장 잘 보입니다. 기기를 가로로 돌려주세요.';
      
      // 요소 추가
      warningElement.appendChild(rotateImage);
      warningElement.appendChild(messageElement);
      document.body.appendChild(warningElement);
      
      // 방향 변경 이벤트 리스너는 최상위 스크립트에 추가
    }
    
    return warningElement;
  }
  
  // 방향 확인 및 경고 메시지 처리
  function checkOrientation() {
    const isPortrait = isPortraitMode();
    
    // 경고 메시지 요소가 없으면 생성
    let warningElement = document.getElementById('orientation-warning');
    if (!warningElement) {
      warningElement = createOrUpdateWarningElement();
    }
    
    if (warningElement) {
      // 세로 모드일 때만 경고 표시, 가로 모드면 숨김
      if (isPortrait) {
        warningElement.style.display = 'flex';
      } else {
        warningElement.style.display = 'none';
        // 가로 모드로 돌아왔을 때 캔버스 다시 그리기
        if (typeof resizeCanvas === 'function') {
          setTimeout(resizeCanvas, 300); // 약간의 지연 후 실행
        }
      }
    }
  }
  
  // 기기 방향이 세로인지 확인하는 함수 (다양한 방법으로 확인)
  function isPortraitMode() {
    // 1. window.matchMedia 사용 (가장 권장)
    if (window.matchMedia) {
      return window.matchMedia('(orientation: portrait)').matches;
    }
    
    // 2. window.orientation 사용 (구형 기기)
    if (typeof window.orientation !== 'undefined') {
      return window.orientation === 0 || window.orientation === 180;
    }
    
    // 3. 화면 치수 비교
    return window.innerHeight > window.innerWidth;
  }
  
  // 초기 및 방향 변경 추가 처리
  document.addEventListener('readystatechange', function(event) {
    if (document.readyState === 'complete') {
      // 페이지가 완전히 로드된 후 방향 확인
      setTimeout(checkOrientation, 100);
    }
  });
  
  // window.onload 이벤트 리스너 - 기존 onload와 충돌하지 않게 처리
  const existingOnload = window.onload;
  window.onload = function() {
    // 기존 onload 함수가 있으면 실행
    if (typeof existingOnload === 'function') {
      existingOnload();
    }
    
    // 페이지 로드 완료 후 방향 확인
    setTimeout(checkOrientation, 100);
  };
  
  // 디바이스 방향 변경 리스너 추가 - iOS 전용
  if (typeof window.DeviceOrientationEvent !== 'undefined') {
    window.addEventListener('deviceorientation', function() {
      setTimeout(checkOrientation, 300);
    }, false);
  }