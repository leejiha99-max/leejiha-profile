document.addEventListener("DOMContentLoaded",()=>{

const elevator = document.querySelector(".elevator");
const title = document.querySelector(".title");
const desc = document.querySelector(".desc");
const textBox = document.querySelector(".text");
const inside = document.querySelector(".inside")

let openCount = 0;
let isOpen = false;

elevator.addEventListener("click", () => {
  // 문이 닫혀있을 때 → 열기
  if (!isOpen) {
    openCount++;
    elevator.classList.add("open");
    textBox.classList.add("show");

    if (openCount % 2 === 1) {
      // 첫 번째 문구
      title.textContent = "One Step,";
      desc.textContent = "한 걸음씩, 앞으로 나아가는";
    } else {
      // 두 번째 문구
      title.textContent = "Then another.";
      desc.textContent = "Web Publisher 이지하입니다.";
      
    }

    isOpen = true;
  } 
  // 문이 열려있을 때 → 닫기
  else {
    elevator.classList.remove("open");
    textBox.classList.remove("show");
    isOpen = false;
  }
  
});

})