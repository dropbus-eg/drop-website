window.addEventListener('scroll',()=>document.getElementById('navbar').classList.toggle('scrolled',scrollY>50));
function openMobileMenu(){document.getElementById('mobileMenu').classList.add('open');document.body.style.overflow='hidden';const h=document.querySelector('.hamburger');if(h)h.setAttribute('aria-expanded','true')}
function closeMobileMenu(){document.getElementById('mobileMenu').classList.remove('open');document.body.style.overflow='';const h=document.querySelector('.hamburger');if(h)h.setAttribute('aria-expanded','false')}
const ro=new IntersectionObserver(e=>e.forEach(x=>{if(x.isIntersecting){x.target.classList.add('visible');ro.unobserve(x.target)}}),{threshold:.1});
document.querySelectorAll('.reveal,.reveal-left,.reveal-right').forEach(el=>ro.observe(el));
function animateCount(el){const t=parseFloat(el.dataset.target),s=el.dataset.suffix||'',d=2000,st=performance.now();function tick(n){const p=Math.min((n-st)/d,1),ease=1-Math.pow(1-p,3),v=t*ease;if(t>=10000)el.textContent=Math.floor(v/1000)+'K'+s;else el.textContent=Math.floor(v)+s;if(p<1)requestAnimationFrame(tick)}requestAnimationFrame(tick)}
const co=new IntersectionObserver(e=>e.forEach(x=>{if(x.isIntersecting&&x.target.dataset.target){animateCount(x.target);co.unobserve(x.target)}}),{threshold:.5});
document.querySelectorAll('[data-target]').forEach(el=>co.observe(el));
// COOKIE
function showCookie(){
  const stored=localStorage.getItem('drop-cookie');
  if(!stored)setTimeout(()=>document.getElementById('cookieBanner').classList.add('show'),1800);
}
function acceptCookies(){try{localStorage.setItem('drop-cookie','accepted')}catch(e){}document.getElementById('cookieBanner').classList.remove('show')}
function declineCookies(){try{localStorage.setItem('drop-cookie','declined')}catch(e){}document.getElementById('cookieBanner').classList.remove('show')}
showCookie();
