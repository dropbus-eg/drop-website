window.addEventListener('scroll',()=>document.getElementById('navbar').classList.toggle('scrolled',scrollY>50));
function openMobileMenu(){document.getElementById('mobileMenu').classList.add('open');document.body.style.overflow='hidden';const h=document.querySelector('.hamburger');if(h)h.setAttribute('aria-expanded','true')}
function closeMobileMenu(){document.getElementById('mobileMenu').classList.remove('open');document.body.style.overflow='';const h=document.querySelector('.hamburger');if(h)h.setAttribute('aria-expanded','false')}
const ro=new IntersectionObserver(e=>e.forEach(x=>{if(x.isIntersecting){x.target.classList.add('visible');ro.unobserve(x.target)}}),{threshold:.1});
document.querySelectorAll('.reveal').forEach(el=>ro.observe(el));
function filterCat(btn,cat){document.querySelectorAll('.cat-btn').forEach(b=>b.classList.remove('active'));btn.classList.add('active')}
function subscribeNL(btn){const inp=btn.previousElementSibling;if(inp.value){btn.textContent='✓ Subscribed!';btn.style.background='#4caf50';inp.value='';setTimeout(()=>{btn.textContent='Subscribe';btn.style.background=''},3000)}}
// COOKIE
function showCookie(){
  const stored=localStorage.getItem('drop-cookie');
  if(!stored)setTimeout(()=>document.getElementById('cookieBanner').classList.add('show'),1800);
}
function acceptCookies(){try{localStorage.setItem('drop-cookie','accepted')}catch(e){}document.getElementById('cookieBanner').classList.remove('show')}
function declineCookies(){try{localStorage.setItem('drop-cookie','declined')}catch(e){}document.getElementById('cookieBanner').classList.remove('show')}
showCookie();
