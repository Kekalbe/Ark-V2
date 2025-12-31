const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector); // apenas se precisar de vários

// Seletores únicos
const btn = $('.nav');
const icon = $('.menu-icon');
const menuTitle = $('.menu-title');
const sectionMenu = $('.menu-section');
const homeBG = $('.background');
const menuP = $$('.menu-section p');

btn.addEventListener('click', function () {
  const MenuSectionActive = () => sectionMenu.classList.contains('active');

  [icon, menuTitle, sectionMenu].forEach(el => el.classList.toggle('active'));
  homeBG.style.opacity = MenuSectionActive() ? '0.5' : '1';
  if (MenuSectionActive()) { resetAndAnimateMenu(); }
});

function resetAndAnimateMenu() {
  const delayBase = 200;
  menuP.forEach(p => { p.style.animation = 'none'; p.style.animationDelay = '0ms'; });
  void menuP[0].offsetWidth;
  menuP.forEach((p, index) => {
    const totalDelay = delayBase + index * 400;
    p.style.animation = `slideIn 1s ease forwards`;
    p.style.animationDelay = `${totalDelay}ms`;
  });
}