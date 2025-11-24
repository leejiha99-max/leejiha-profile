document.addEventListener("DOMContentLoaded",()=>{

    const header = document.querySelector(".header-smart")
    const btnMenu = document.querySelector("#btn-gnb")

     // 마우스 휠을 올리거나 내릴 때 사용하는 소스코드
    let lastScrollTop = 0
    window.addEventListener("scroll",()=>{
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop // 브라우저의 호환성을 생각하여 스크롤바가 내려온 길이를 계산

        if(scrollTop < lastScrollTop){
            // 마우스 휠을 위로 굴렸을 때
            header.classList.remove("on")    
            state = false
        }else{
            // 마우스 휠을 아래로 굴렸을 때
            header.classList.remove("on")    
            state = false
        }
        lastScrollTop = scrollTop
    })

    let state = false // 메뉴가 현재 닫혀있는 상태

    btnMenu.addEventListener("click",()=>{
        if(state == false){
            // 메뉴를 여는 경우
            header.classList.add("on")    
            state = true
        }else{
            // 메뉴를 닫는 경우
            header.classList.remove("on")    
            state = false
        }
        
    })

    header.addEventListener("click",()=>{
        header.classList.remove("on")    
        state = false
    })





})