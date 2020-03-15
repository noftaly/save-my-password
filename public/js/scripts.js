// Please, free me from jquery ;(

// Collapse navbar when scrolling the page
window.addEventListener('scroll', () => (window.scrollY > 80
  ? document.getElementById('navbar').classList.add('top-nav-collapse')
  : document.getElementById('navbar').classList.remove('top-nav-collapse')));

// Smooth scrolling
for (const scroller of document.querySelectorAll('a.page-scroll')) {
  scroller.addEventListener('click', function () {
    const scrollTop = $(this.getAttribute('href')).offset().top;
    $('html, body').stop().animate({ scrollTop }, 600, 'easeInOutExpo');
  });
}

// Closes the responsive menu on menu item click
for (const link of document.querySelectorAll('.nav-link')) {
  link.addEventListener('click', () => {
    if (link.id !== 'navbarDropdown') $('.navbar-collapse').collapse('hide');
  });
}

// eslint-disable-next-line no-unused-vars, no-undef
const cardSlider = new Swiper('.card-slider', {
  autoplay: {
    delay: 4000,
    disableOnInteraction: false,
  },
  loop: true,
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
});

// Create the video modal by injecting the youtube link into the <iframe>
$('#videoModal').on('shown.bs.modal', () => {
  const id = document.getElementById('youtubeVideoFrame').getAttribute('data-youtube-id');
  document.getElementById('youtubeVideoFrame').src = `https://www.youtube.com/embed/${id}?autoplay=1`;
});
// Deleting the link from the iframe to kill the video, otherwise it will continue to play in the background
$('#videoModal').on('hide.bs.modal', () => {
  document.getElementById('youtubeVideoFrame').src = '';
});

// Create the "back to top" button
$('body').prepend('<a href="#top" class="back-to-top page-scroll">Haut de page</a>');
document.addEventListener('scroll', () => (window.scrollY > 700
  ? $('a.back-to-top').fadeIn(500)
  : $('a.back-to-top').fadeOut(500)));
