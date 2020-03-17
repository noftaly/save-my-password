const togglers = document.querySelectorAll('button.sidebar-toggler');
const sidebarWrapper = document.getElementById('sidebar-wrapper');

for (const toggler of togglers) {
  toggler.addEventListener('click', (event) => {
    event.preventDefault();

    sidebarWrapper.classList.add('minimizing');
    sidebarWrapper.classList.toggle('minimized');

    const min = sidebarWrapper.classList.contains('minimized');
    localStorage.setItem('sidebar_size', min ? 'min' : 'max');

    setTimeout(() => { sidebarWrapper.classList.remove('minimizing'); }, 250);
  });
}

window.matchMedia('(max-width: 768px)').addListener((evt) => {
  if (evt.matches) {
    sidebarWrapper.classList.add('minimized');
    localStorage.setItem('sidebar_size', 'min');
  } else {
    sidebarWrapper.classList.remove('minimized');
    localStorage.setItem('sidebar_size', 'max');
  }
});

const currentSize = localStorage.getItem('sidebar_size') || document.documentElement.dataset.sidebar_size || 'max';
if (currentSize === 'min')
  document.getElementById('sidebar-wrapper').classList.add('minimized');
