document.addEventListener('DOMContentLoaded', function () {
  const slides = document.querySelectorAll('.slider img');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  const dots = document.querySelectorAll('.dot');
  let currentSlide = 0;

  function showSlide(index) {
    slides.forEach((slide) => (slide.style.display = 'none'));
    dots.forEach((dot) => dot.classList.remove('active'));
    slides[index].style.display = 'block';
    dots[index].classList.add('active');
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length; //для обеспечения циклического переключения
    showSlide(currentSlide);
  }

  function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length; //для обеспечения циклического переключения
    showSlide(currentSlide);
  }

  function setSlide(index) {
    currentSlide = index;
    showSlide(currentSlide);
  }

  nextBtn.addEventListener('click', nextSlide);
  prevBtn.addEventListener('click', prevSlide);
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => setSlide(index));
  });

  showSlide(currentSlide);
});
