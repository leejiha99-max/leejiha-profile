 /* ================================
        기존 Elevator + Accordion (유지)
  ================================ */

  function introAnimate(){
    const elevator = document.querySelector(".elevator");
    const textBox = document.querySelector(".text");
    const title = document.querySelector(".title");
    const desc = document.querySelector(".desc");
    const nextSection = document.querySelector(".blackandwhite");

    document.body.classList.add("lock");
    const delay = (ms) => new Promise(res => setTimeout(res, ms));

    function smoothScrollTo(targetY, duration = 1500) {
      const startY = window.scrollY;
      const diff = targetY - startY;
      const startTime = performance.now();
      const easing = t => 1 - Math.pow(1 - t, 3);

      function animate(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easing(progress);
        window.scrollTo({ top: startY + diff * eased, left: 0 });
        if (progress < 1) requestAnimationFrame(animate);
      }

      requestAnimationFrame(animate);
    }

    (async function intro() {
      await delay(1000);
      elevator.classList.add("open");

      await delay(700);
      title.textContent = "One Step,";
      desc.textContent = "한 걸음씩, 앞으로 나아가는";
      textBox.classList.add("show");

      await delay(1500);
      textBox.classList.remove("show");

      await delay(1000);
      title.textContent = "Then another.";
      desc.textContent = "Web Publisher 이지하입니다.";
      textBox.classList.add("show");

      await delay(1500);
      textBox.classList.remove("show");

      await delay(500);
      elevator.classList.remove("open");

      await delay(400);
      smoothScrollTo(nextSection.offsetTop, 1600);

      await delay(1600);
      document.body.classList.remove("lock");
    })();
  }