function removeSpaces(str) {
    return str.replace(/\s+/g, '');
}

function getContentByBr(element) {
    const contentArray = element.innerHTML
      .split(/<br\s*\/?>/i)
      .map(item => item.trim())
      .filter(item => item)
    return contentArray;
}

function getFontStyles(element) {
  
    // 계산된 스타일 가져오기
    const computedStyle = window.getComputedStyle(element);
  
    // font-size와 line-height 값 가져오기
    let fontSize = computedStyle.fontSize;
    let lineHeight = computedStyle.lineHeight;
  
    // line-height가 'normal'일 경우 계산 (대략적으로 1.2 배율로 가정)
    if (lineHeight === 'normal') {
      const fontSizeValue = parseFloat(fontSize); // '16px' -> 16
      lineHeight = `${fontSizeValue * 1.2}px`; // 기본적으로 1.2 배율로 계산
    }
  
    return { fontSize, lineHeight };
}

document.addEventListener("DOMContentLoaded",function(){
    
    let tags = document.querySelectorAll(".bbyong")
    if(tags.length){
        tags.forEach(function(tag,index){
            let resultContent = ""
            let textarray = getContentByBr(tag)
            let originalStyles = getFontStyles(tag)

            let defaultStyles = {
                display:'inline-block',
                overflow:'hidden',
                height: `calc(${originalStyles.lineHeight} + 15px)`,  // 이 줄만 수정
                boxSizing:'border-box',
                paddingTop:originalStyles.lineHeight,

            }

            // let showStyles = {
            //     maxHeight:originalStyles.lineHeight
            // }

            for(let i=0 ; i<textarray.length ; i++){
                resultContent += `<span style="transition:all 1s ease ${0.1*i}s">${textarray[i]}</span>`
                if(i!==textarray.length-1){
                    resultContent += `<br>`
                }
            }
            tag.innerHTML = resultContent
            Array.from(tag.children).forEach(child => {
                Object.assign(child.style, defaultStyles)
            });
        })
    }

    tags.forEach(function(tag,index){
        let originalStyles = getFontStyles(tag)
        console.log(originalStyles)
        tag.style.fontSize=0
        Array.from(tag.children).forEach(function (child, index) {
            child.style.fontSize = originalStyles.fontSize // 원래 글씨 크기 적용
        });
    })

    // IntersectionObserver 설정
    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 요소가 화면에 보일 때 span 태그 스타일 변경
                Array.from(entry.target.children).forEach(child => {
                    Object.assign(child.style, {
                         paddingTop:0,
                    });
                });
            } else {
                // 화면에서 사라질 때 기본 스타일로 되돌림
                Array.from(entry.target.children).forEach(child => {
                    const computedStyle = getComputedStyle(child);
                    let lineHeight = computedStyle.lineHeight;
    
                    // "normal"인 경우 계산
                    if (lineHeight === "normal") {
                        const fontSize = parseFloat(computedStyle.fontSize); // font-size 가져오기
                        const defaultLineHeightRatio = 1.2; // 일반적인 비율(조정 가능)
                        lineHeight = `${fontSize * defaultLineHeightRatio}px`;
                    }
    
                    Object.assign(child.style, {
                        paddingTop: lineHeight, // 계산된 line-height 적용
                    });
                });
            }
        })
    }, { threshold: 1 }) // 요소가 100% 화면에 보이면 트리거

    // 각 요소에 대해 observer 적용
    tags.forEach(element => {
       observer.observe(element);
    });


})
