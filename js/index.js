document.addEventListener("DOMContentLoaded", () => {
  const elevator = document.querySelector(".elevator");
  const textBox = document.querySelector(".text");
  const title = document.querySelector(".title");
  const desc = document.querySelector(".desc");
  const nextSection = document.querySelector(".blackandwhite");

  /* ------------------------------
      0. 페이지 로딩 → 스크롤 잠금
  ------------------------------ */
  document.body.classList.add("lock");

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  /* ------------------------------
      부드러운 스크롤 함수
  ------------------------------ */
  function smoothScrollTo(targetY, duration = 1500) {
    const startY = window.scrollY;
    const diff = targetY - startY;
    const startTime = performance.now();

    function easing(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function animate(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easing(progress);

      window.scrollTo({
        top: startY + diff * eased,
        left: 0,
      });

      if (progress < 1) requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }

  /* ------------------------------
      1. 인트로 시퀀스 실행
  ------------------------------ */
  (async function intro() {

    // 1) 1초 후 자동으로 문 열림
    await delay(1000);
    elevator.classList.add("open");

    // 2) 문 열리고 0.7초 후 첫 문구 등장
    await delay(700);
    title.textContent = "One Step,";
    desc.textContent = "한 걸음씩, 앞으로 나아가는";
    textBox.classList.add("show");

    // 3) 1.5초 후 사라짐
    await delay(1500);
    textBox.classList.remove("show");

    // 4) 1초 후 두 번째 문구 등장
    await delay(1000);
    title.textContent = "Then another.";
    desc.textContent = "Web Publisher 이지하입니다.";
    textBox.classList.add("show");

    // 5) 1.5초 후 사라짐
    await delay(1500);
    textBox.classList.remove("show");

    // 6) 0.5초 후 문 닫힘
    await delay(500);
    elevator.classList.remove("open");

    // 7) 레이아웃 안정화 후 아래로 부드럽게 스크롤
    await delay(300);
    await delay(100); // ★ offsetTop 보정
    const targetY = nextSection.offsetTop;
    smoothScrollTo(targetY, 1600);

    // 8) 스크롤 애니메이션 끝나면 스크롤 잠금 해제
    await delay(1600);
    document.body.classList.remove("lock");

  })();


  /* ------------------------------
      ⭐ EXPERIENCE 아코디언
      (plus ↔ minus 아이콘 변경 포함)
  ------------------------------ */
  const rows = document.querySelectorAll(".exp-row");

  rows.forEach(row => {
    const head = row.querySelector(".exp-head");
    const body = row.querySelector(".exp-body");
    const icon = head.querySelector(".dot img"); // ★ 여기 절대 빼먹지 않음

    head.addEventListener("click", () => {
      const isOpen = body.classList.toggle("open");

      // 아이콘 변경
      if (isOpen) {
        icon.src = "./img/minus.svg";
      } else {
        icon.src = "./img/plus.svg";
      }
    });
  });

});
