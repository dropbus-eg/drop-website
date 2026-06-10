// PARTICLES
(function(){
  const c=document.getElementById('particles');
  if(!c) return;
  for(let i=0;i<28;i++){
    const p=document.createElement('div');
    p.className='particle';
    p.style.cssText=`left:${Math.random()*100}%;--dur:${6+Math.random()*10}s;--delay:${Math.random()*8}s;--drift:${(Math.random()-.5)*80}px;width:${1+Math.random()*2.5}px;height:${1+Math.random()*2.5}px;opacity:${.3+Math.random()*.7}`;
    c.appendChild(p);
  }
})();

// NAV + BACK TO TOP
const nav=document.getElementById('navbar');
const bt=document.getElementById('backTop');
window.addEventListener('scroll',()=>{
  const s=window.scrollY;
  if(nav) nav.classList.toggle('scrolled',s>50);
  if(bt) bt.classList.toggle('visible',s>400);
});

// SCROLL REVEAL
const revEls=document.querySelectorAll('.reveal,.reveal-left,.reveal-right');
const ro=new IntersectionObserver((entries)=>{
  entries.forEach((e,i)=>{
    if(e.isIntersecting){
      e.target.style.transitionDelay=(i%5)*.1+'s';
      e.target.classList.add('visible');
      ro.unobserve(e.target);
    }
  });
},{threshold:.1});
revEls.forEach(el=>ro.observe(el));

// COUNTER ANIMATION
function animateCount(el){
  const target=parseFloat(el.dataset.target);
  const suffix=el.dataset.suffix||'';
  const isDecimal=el.dataset.decimal==='1';
  const dur=2000;const start=performance.now();
  function tick(now){
    const p=Math.min((now-start)/dur,1);
    const ease=1-Math.pow(1-p,3);
    const v=target*ease;
    if(isDecimal)el.textContent=(v/10).toFixed(1)+suffix;
    else if(target>=1000)el.textContent=Math.floor(v/1000)+'K'+suffix;
    else el.textContent=Math.floor(v)+suffix;
    if(p<1)requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
const co=new IntersectionObserver((entries)=>{
  entries.forEach(e=>{if(e.isIntersecting&&e.target.dataset.target){animateCount(e.target);co.unobserve(e.target)}});
},{threshold:.5});
document.querySelectorAll('[data-target]').forEach(el=>co.observe(el));

// PRICING TOGGLE
let yearly=false;
function togglePricing(){
  yearly=!yearly;
  document.getElementById('priceToggle').classList.toggle('yearly',yearly);
  document.getElementById('monthlyLabel').classList.toggle('active',!yearly);
  document.getElementById('yearlyLabel').classList.toggle('active',yearly);
  document.getElementById('solo-price').textContent='EGP 0';
  document.getElementById('pro-price').textContent=yearly?'EGP 399':'EGP 499';
  document.getElementById('solo-period').textContent='Pay per ride — no subscription';
  document.getElementById('pro-period').textContent=yearly?'per month · billed annually':'per month';
}

// FAQ
function toggleFAQ(q){
  const item=q.parentElement;
  document.querySelectorAll('.faq-item').forEach(i=>{if(i!==item)i.classList.remove('open')});
  item.classList.toggle('open');
}

// MOBILE MENU
function openMobileMenu(){document.getElementById('mobileMenu').classList.add('open');document.body.style.overflow='hidden';const h=document.querySelector('.hamburger');if(h)h.setAttribute('aria-expanded','true')}
function closeMobileMenu(){document.getElementById('mobileMenu').classList.remove('open');document.body.style.overflow='';const h=document.querySelector('.hamburger');if(h)h.setAttribute('aria-expanded','false')}

// COOKIE
function showCookie(){
  const stored=localStorage.getItem('drop-cookie');
  if(!stored)setTimeout(()=>document.getElementById('cookieBanner').classList.add('show'),1800);
}
function acceptCookies(){try{localStorage.setItem('drop-cookie','accepted')}catch(e){}document.getElementById('cookieBanner').classList.remove('show')}
function declineCookies(){try{localStorage.setItem('drop-cookie','declined')}catch(e){}document.getElementById('cookieBanner').classList.remove('show')}
showCookie();

// SMOOTH SCROLL
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const t=document.querySelector(a.getAttribute('href'));
    if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth'})}
  });
});