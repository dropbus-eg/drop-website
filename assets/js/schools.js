const menu = document.getElementById('mobileMenu');
const menuButton = document.querySelector('.hamburger');
function openMobileMenu() {
  menu.classList.add('open');
  menu.inert = false;
  menuButton.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
  menu.querySelector('.mobile-menu-close').focus();
}
function closeMobileMenu() {
  menu.classList.remove('open');
  menu.inert = true;
  menuButton.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
  menuButton.focus();
}
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu.classList.contains('open')) closeMobileMenu();
});
document.getElementById('year').textContent = new Date().getFullYear();
