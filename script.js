const pages = Array.from(document.querySelectorAll('.page'));
let currentIndex = 0;
let isTransitioning = false;

function showPage(index) {
  if (isTransitioning) return;
  if (index < 0 || index >= pages.length) return;

  isTransitioning = true;

  const currentPage = pages[currentIndex];
  const nextPage = pages[index];

  if (currentPage) {
    currentPage.classList.add('fade-out');
  }

  setTimeout(() => {
    pages.forEach(p => {
      p.classList.remove('active', 'fade-out');
    });

    nextPage.classList.add('active');
    currentIndex = index;
    updateArrows();
    updateBodyState();

    isTransitioning = false;
  }, 260);
}

function goNext() {
  if (currentIndex >= pages.length - 1) return;

  // cover: apertura elegante più veloce
  if (currentIndex === 0) {
    const cover = document.getElementById('cover');
    if (!cover || isTransitioning) return;

    isTransitioning = true;
    cover.classList.add('opening');

    setTimeout(() => {
      cover.classList.remove('active', 'opening');
      pages[1].classList.add('active');
      currentIndex = 1;
      updateArrows();
      updateBodyState();
      isTransitioning = false;
    }, 520);

    return;
  }

  showPage(currentIndex + 1);
}

function goPrev() {
  if (currentIndex > 0) {
    showPage(currentIndex - 1);
  }
}

function updateArrows() {
  const leftArrow = document.querySelector('.nav-left');
  const rightArrow = document.querySelector('.nav-right');

  if (!leftArrow || !rightArrow) return;

  if (currentIndex === 0) {
    leftArrow.style.opacity = '0';
    rightArrow.style.opacity = '0';
    leftArrow.style.pointerEvents = 'none';
    rightArrow.style.pointerEvents = 'none';
    return;
  }

  leftArrow.style.opacity = currentIndex === 0 ? '0' : '1';
  leftArrow.style.pointerEvents = currentIndex === 0 ? 'none' : 'auto';

  rightArrow.style.opacity = currentIndex === pages.length - 1 ? '0' : '1';
  rightArrow.style.pointerEvents = currentIndex === pages.length - 1 ? 'none' : 'auto';
}

function updateBodyState() {
  document.body.classList.toggle('on-cover', currentIndex === 0);
  document.body.classList.toggle('soft-arrows', currentIndex === 2 || currentIndex === 3);
}

/* tap laterale */
document.querySelectorAll('.nav-tap').forEach(container => {
  container.addEventListener('click', (e) => {
    const target = e.target;

    if (
      target.closest('a') ||
      target.closest('button') ||
      target.closest('.nav-arrow')
    ) return;

    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const isRight = x > rect.width / 2;

    if (isRight) goNext();
    else goPrev();
  }, { passive: true });
});

/* swipe mobile */
let touchStartX = 0;
let touchEndX = 0;

document.querySelectorAll('.nav-tap').forEach(container => {
  container.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  container.addEventListener('touchend', (e) => {
    const target = e.target;
    if (
      target.closest('a') ||
      target.closest('button') ||
      target.closest('.nav-arrow')
    ) return;

    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });
});

function handleSwipe() {
  if (currentIndex === 0) return;

  const delta = touchEndX - touchStartX;
  if (Math.abs(delta) < 50) return;

  if (delta < 0) {
    goNext();
  } else {
    goPrev();
  }
}

updateArrows();
updateBodyState();
