/**
 * 테마 관리 시스템
 * 페이지별로 자동으로 테마를 변경할 수 있는 유틸리티
 */

// 사용 가능한 테마 목록
const THEMES = {
    BLUE: 'theme-blue',
    GREEN: 'theme-green',
    PURPLE: 'theme-purple',
    BROWN: 'theme-brown'
};

// 페이지 번호별 테마 매핑 함수
function getThemeByPageNumber(pageNumber) {
    const pageNum = parseInt(pageNumber, 10);
    
    if (pageNum >= 1 && pageNum <= 8) {
        return THEMES.BLUE;
    } else if (pageNum >= 9 && pageNum <= 16) {
        return THEMES.GREEN;
    } else if (pageNum >= 17 && pageNum <= 24) {
        return THEMES.PURPLE;
    } else if (pageNum >= 25 && pageNum <= 32) {
        return THEMES.BROWN;
    } else {
        return THEMES.BLUE; // 기본값
    }
}

// 테마를 적용하는 함수
function applyTheme(theme) {
    // 기존 테마 클래스 모두 제거
    document.body.classList.remove(THEMES.BLUE, THEMES.GREEN, THEMES.PURPLE, THEMES.BROWN);
    // 새 테마 클래스 추가
    document.body.classList.add(theme);
    
    // 네비게이션 이미지 업데이트
    updateNavigationImages(theme);
}

// 네비게이션 버튼 이미지 업데이트 함수
function updateNavigationImages(theme) {
    const themeColor = theme.split('-')[1]; // 'theme-blue' -> 'blue'
    
    const prevButton = document.querySelector('.navigation button img[alt*="이전"]');
    const nextButton = document.querySelector('.navigation button img[alt*="다음"]');

    if (prevButton) {
        let imageBase = './static/images/base/page_prev';
        prevButton.src = `${imageBase}_${themeColor}.svg`;
    }

    if (nextButton) {
        let imageBase = './static/images/base/page_next';
        nextButton.src = `${imageBase}_${themeColor}.svg`;
    }
}

// 현재 페이지 번호에 따라 테마 자동 설정
function setThemeByPageNumber() {
    try {
        const url = window.location.pathname;
        // 여러 가능한 URL 패턴 처리
        let pageNumber;
        
        // 패턴 1: '/pageX.html'
        const pattern1 = url.match(/page(\d+)\.html/);
        // 패턴 2: 'pageX.html'
        const pattern2 = url.match(/page(\d+)\.html$/);
        // 패턴 3: '/X' 
        const pattern3 = url.match(/\/(\d+)$/);
        
        if (pattern1) {
            pageNumber = pattern1[1];
        } else if (pattern2) {
            pageNumber = pattern2[1];
        } else if (pattern3) {
            pageNumber = pattern3[1];
        } else {
            // URL에서 마지막 숫자 찾기 시도
            const anyNumber = url.match(/(\d+)(?:[^\d]*$)/);
            if (anyNumber) {
                pageNumber = anyNumber[1];
            } else {
                // 파일명에서 숫자 추출 시도
                const fileName = url.split('/').pop();
                const fileNumber = fileName.match(/(\d+)/);
                if (fileNumber) {
                    pageNumber = fileNumber[1];
                } else {
                    console.log('페이지 번호를 찾을 수 없음, 기본 테마 적용');
                    pageNumber = 1; // 기본값
                }
            }
        }
        
        console.log(`현재 페이지 번호: ${pageNumber}`);
        const theme = getThemeByPageNumber(pageNumber);
        console.log(`적용할 테마: ${theme}`);
        applyTheme(theme);
    } catch (error) {
        console.error('테마 설정 중 오류 발생:', error);
        applyTheme(THEMES.BLUE); // 오류 시 기본 테마
    }
}

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', function() {
    // 페이지 번호에 따른 테마 적용 (로컬 스토리지 사용 안 함)
    setThemeByPageNumber();
});