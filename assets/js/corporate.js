window.addEventListener('scroll',()=>document.getElementById('navbar').classList.toggle('scrolled',scrollY>50));
function openMobileMenu(){document.getElementById('mobileMenu').classList.add('open');document.body.style.overflow='hidden';const h=document.querySelector('.hamburger');if(h)h.setAttribute('aria-expanded','true')}
function closeMobileMenu(){document.getElementById('mobileMenu').classList.remove('open');document.body.style.overflow='';const h=document.querySelector('.hamburger');if(h)h.setAttribute('aria-expanded','false')}
const ro=new IntersectionObserver(e=>e.forEach(x=>{if(x.isIntersecting){x.target.classList.add('visible');ro.unobserve(x.target)}}),{threshold:.1});
document.querySelectorAll('.reveal,.reveal-left,.reveal-right').forEach(el=>ro.observe(el));
function animateCount(el){const t=parseFloat(el.dataset.target),s=el.dataset.suffix||'',d=2000,st=performance.now();function tick(n){const p=Math.min((n-st)/d,1),ease=1-Math.pow(1-p,3),v=t*ease;el.textContent=Math.floor(v)+s;if(p<1)requestAnimationFrame(tick)}requestAnimationFrame(tick)}
const co=new IntersectionObserver(e=>e.forEach(x=>{if(x.isIntersecting&&x.target.dataset.target){animateCount(x.target);co.unobserve(x.target)}}),{threshold:.5});
document.querySelectorAll('[data-target]').forEach(el=>co.observe(el));
function submitCorp(e){
  e.preventDefault();
  const form=document.getElementById('corpForm');
  const btn=form.querySelector('.submit-btn');
  const status=document.getElementById('cp-status');
  const original=btn.textContent;
  btn.disabled=true;btn.textContent='Sending…';status.textContent='';status.className='form-status';
  fetch('https://formsubmit.co/ajax/dropbus.eg@gmail.com',{
    method:'POST',
    headers:{'Content-Type':'application/json',Accept:'application/json'},
    body:JSON.stringify(Object.fromEntries(new FormData(form)))
  }).then(r=>{if(!r.ok)throw new Error('Request failed');return r.json()}).then(result=>{
    if(result.success===false)throw new Error('Request was not accepted');
    btn.textContent='✓ Quote Request Sent!';btn.style.background='#4caf50';
    status.textContent='Thanks — your request has been sent. Our team will get back to you as soon as possible.';
    status.className='form-status success';
    form.reset();
    setTimeout(()=>{btn.textContent=original;btn.style.background='';btn.disabled=false},3000);
  }).catch(()=>{
    btn.textContent=original;btn.style.background='';btn.disabled=false;
    status.textContent='Something went wrong sending your request. Please email us directly at dropbus.eg@gmail.com or WhatsApp 0128 744 1113.';
    status.className='form-status error';
  });
  return false;
}
document.querySelectorAll('a[href^="#"]').forEach(a=>{a.addEventListener('click',e=>{const t=document.querySelector(a.getAttribute('href'));if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth'})}})});
// COOKIE
function showCookie(){
  const stored=localStorage.getItem('drop-cookie');
  if(!stored)setTimeout(()=>document.getElementById('cookieBanner').classList.add('show'),1800);
}
function acceptCookies(){try{localStorage.setItem('drop-cookie','accepted')}catch(e){}document.getElementById('cookieBanner').classList.remove('show')}
function declineCookies(){try{localStorage.setItem('drop-cookie','declined')}catch(e){}document.getElementById('cookieBanner').classList.remove('show')}
showCookie();
