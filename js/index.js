document.addEventListener("DOMContentLoaded", () => {

  /* ================================
        기존 Elevator + Accordion (유지)
  ================================ */
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

  const rows = document.querySelectorAll(".exp-row");
  rows.forEach(row => {
    const head = row.querySelector(".exp-head");
    const body = row.querySelector(".exp-body");
    const icon = head.querySelector(".dot img");
    head.addEventListener("click", () => {
      const isOpen = body.classList.toggle("open");
      icon.src = isOpen ? "./img/minus.svg" : "./img/plus.svg";
    });
  });



  /* ================================
        ⭐ 무한 슬라이더
  ================================ */
  const slider = document.querySelector(".slider");
  const track = document.querySelector(".slide-track");
  const slides = document.querySelectorAll(".slide");

  const wrap = document.createElement("div");
  wrap.classList.add("track-wrap");
  slider.insertBefore(wrap, track);
  wrap.appendChild(track);

  const clone = track.cloneNode(true);
  clone.classList.add("clone");
  wrap.appendChild(clone);

  let trackWidth = track.scrollWidth;

  let isDown = false;
  let startX = 0;
  let startTranslate = 0;
  let isDragging = false;

  function getTranslateX(el) {
    const st = window.getComputedStyle(el);
    const matrix = new WebKitCSSMatrix(st.transform);
    return matrix.m41;
  }

  slider.addEventListener("mousedown", e => {
    isDown = true;
    isDragging = false;
    startX = e.pageX;
    startTranslate = getTranslateX(wrap);
  });

  slider.addEventListener("mousemove", e => {
    if (!isDown) return;
    isDragging = true;
    const move = e.pageX - startX;
    wrap.style.transform = `translateX(${startTranslate + move}px)`;
  });

  slider.addEventListener("mouseup", () => isDown = false);
  slider.addEventListener("mouseleave", () => isDown = false);

  let pos = 0;
  const speed = 0.7;

  function autoMove() {
    // trackWidth를 매번 다시 계산하여 화면 크기 변경에 대응
    const currentTrackWidth = track.scrollWidth;
    
    pos -= speed;
    if (Math.abs(pos) >= currentTrackWidth) pos = 0;
    wrap.style.transform = `translateX(${pos}px)`;
    requestAnimationFrame(autoMove);
  }
  autoMove();



  /* ================================
        ⭐ 확대 + 커진 부분 위 오버레이 토글
  ================================ */

  let zoomWrap = null;      // 커진 카드 전체 래퍼
  let zoomOverlay = null;   // 이미지 위 까만 오버레이
  let zoomText = null;      // 흰 글자
  let zoomCloseBtn = null;  // X 닫기 버튼
  let zoomOpen = false;     // 확대 열려 있는지
  let textVisible = false;  // 오버레이/텍스트 보이는지
  let zoomResizeHandler = null; // 리사이즈 이벤트 핸들러

  // 슬라이드(작은 카드) 클릭 → 확대만 (이벤트 위임 사용)
  slider.addEventListener("click", (e) => {
    if (isDragging) return;        // 드래그 중이면 무시
    
    // 클릭된 요소가 .slide인지 확인 (원본 또는 클론 모두)
    const slide = e.target.closest(".slide");
    if (!slide) return;
    
    e.stopPropagation();

    // 이미 확대 중이면 무시 (커진 카드만 조작)
    if (zoomOpen) return;

    openZoom(slide);
  });

  function openZoom(slide) {
    zoomOpen = true;

    // 래퍼 만들기 (중앙 고정)
    zoomWrap = document.createElement("div");
    zoomWrap.classList.add("zoom-wrap");

    // 이미지 복제
    const img = slide.querySelector("img").cloneNode(true);
    img.classList.add("zoom-img");
    zoomWrap.appendChild(img);

    // 오버레이 (처음엔 안 보임)
    zoomOverlay = document.createElement("div");
    zoomOverlay.classList.add("zoom-overlay");
    zoomWrap.appendChild(zoomOverlay);

    // 텍스트 (처음엔 안 보임)
    zoomText = document.createElement("div");
    zoomText.classList.add("zoom-text");
    zoomText.textContent = slide.dataset.desc || ""; // data-desc 사용
    zoomWrap.appendChild(zoomText);

    // X 닫기 버튼
    zoomCloseBtn = document.createElement("button");
    zoomCloseBtn.classList.add("zoom-close-btn");
    zoomCloseBtn.innerHTML = "×";
    zoomCloseBtn.setAttribute("aria-label", "닫기");
    // X 버튼을 즉시 보이게 설정 (애니메이션 없이)
    zoomCloseBtn.style.opacity = "1";
    zoomWrap.appendChild(zoomCloseBtn);

    document.body.appendChild(zoomWrap);

    // X 버튼 위치를 실제 렌더링된 이미지 기준으로 설정 (24px 위)
    function setCloseBtnPosition() {
      const imgRect = img.getBoundingClientRect();
      
      if (imgRect.width > 0 && imgRect.height > 0) {
        // 이미지 상단에서 정확히 24px 위에 위치
        const centerX = imgRect.left + imgRect.width / 2;
        const buttonTop = imgRect.top - 24;
        
        zoomCloseBtn.style.left = `${centerX}px`;
        zoomCloseBtn.style.top = `${buttonTop}px`;
        zoomCloseBtn.style.transform = `translate(-50%, -100%)`;
      }
    }

    // 즉시 위치 설정 시도
    requestAnimationFrame(() => {
      setCloseBtnPosition();
      requestAnimationFrame(() => {
        setCloseBtnPosition();
      });
    });

    // 이미지가 로드되면 위치 설정
    if (img.complete && img.naturalHeight > 0) {
      requestAnimationFrame(() => {
        setCloseBtnPosition();
      });
    } else {
      img.addEventListener('load', () => {
        requestAnimationFrame(() => {
          setCloseBtnPosition();
        });
      }, { once: true });
    }

    // 살짝 확대 애니메이션
    requestAnimationFrame(() => {
      img.classList.add("show");
      
      // 애니메이션 중에도 지속적으로 위치 업데이트
      const updatePosition = () => {
        setCloseBtnPosition();
        if (zoomOpen) {
          requestAnimationFrame(updatePosition);
        }
      };
      requestAnimationFrame(updatePosition);
      
      // 애니메이션 완료 후 최종 위치 설정
      setTimeout(() => {
        updateOverlaySize();
        updateCloseBtnPosition();
      }, 450);
    });

    textVisible = false;

    // X 버튼 클릭 → 확대 닫기
    zoomCloseBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      closeZoom();
    });

    // 커진 부분 클릭 → 오버레이 + 텍스트 토글 (X 버튼 제외)
    zoomWrap.addEventListener("click", (e) => {
      if (e.target === zoomCloseBtn) return; // X 버튼 클릭은 무시
      e.stopPropagation();
      toggleOverlay();
    }, { once: false });

    // 윈도우 리사이즈 시 오버레이 크기 및 X 버튼 위치 업데이트
    zoomResizeHandler = () => {
      updateOverlaySize();
      updateCloseBtnPosition();
    };
    window.addEventListener("resize", zoomResizeHandler);
  }

  function updateOverlaySize() {
    if (!zoomWrap || !zoomOverlay || !zoomText) return;
    
    const img = zoomWrap.querySelector(".zoom-img");
    if (!img) return;

    const imgRect = img.getBoundingClientRect();
    
    // 오버레이를 이미지와 동일한 크기와 위치로 설정
    zoomOverlay.style.width = `${imgRect.width}px`;
    zoomOverlay.style.height = `${imgRect.height}px`;
    zoomOverlay.style.left = `${imgRect.left + imgRect.width / 2}px`;
    zoomOverlay.style.top = `${imgRect.top + imgRect.height / 2}px`;
    
    // 텍스트도 이미지 중앙에 위치
    zoomText.style.left = `${imgRect.left + imgRect.width / 2}px`;
    zoomText.style.top = `${imgRect.top + imgRect.height / 2}px`;
  }

  function updateCloseBtnPosition() {
    if (!zoomWrap || !zoomCloseBtn) return;
    
    const img = zoomWrap.querySelector(".zoom-img");
    if (!img) return;

    const imgRect = img.getBoundingClientRect();
    
    // X 버튼을 이미지 위 24px에 위치
    zoomCloseBtn.style.left = `${imgRect.left + imgRect.width / 2}px`;
    zoomCloseBtn.style.top = `${imgRect.top - 24}px`;
    zoomCloseBtn.style.transform = `translate(-50%, -100%)`;
  }

  function toggleOverlay() {
    textVisible = !textVisible;
    if (!zoomOverlay || !zoomText) return;

    // 오버레이 크기 업데이트
    updateOverlaySize();
    updateCloseBtnPosition();

    if (textVisible) {
      zoomOverlay.classList.add("show");
      zoomText.classList.add("show");
    } else {
      zoomOverlay.classList.remove("show");
      zoomText.classList.remove("show");
    }
  }

  // 바깥 아무 데나 클릭 → 확대 통째로 닫기
  document.addEventListener("click", (e) => {
    if (!zoomOpen) return;
    if (zoomWrap && zoomWrap.contains(e.target)) return; // 커진 카드 안이면 무시

    closeZoom();
  });

  function closeZoom() {
    if (zoomWrap) zoomWrap.remove();
    if (zoomResizeHandler) {
      window.removeEventListener("resize", zoomResizeHandler);
      zoomResizeHandler = null;
    }
    zoomWrap = null;
    zoomOverlay = null;
    zoomText = null;
    zoomCloseBtn = null;
    zoomOpen = false;
    textVisible = false;
  }

});
