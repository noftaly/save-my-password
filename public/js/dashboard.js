const togglers = document.querySelectorAll('button.sidebar-toggler');
const sidebarWrapper = document.getElementById('sidebar-wrapper');

for (const toggler of togglers) {
  toggler.addEventListener('click', (event) => {
    console.log('test');
    event.preventDefault();
    sidebarWrapper.classList.toggle('minimized');
  });
}

const mql = window.matchMedia('(max-width: 768px)');

function resideSidebar(e) {
  if (e.matches)
    sidebarWrapper.classList.add('minimized');
  else
    sidebarWrapper.classList.remove('minimized');
}

mql.addListener(resideSidebar);
