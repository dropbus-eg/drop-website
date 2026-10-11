const lang = document.documentElement.lang === 'ar' ? 'ar' : 'en';
const text = {
  en: {
    openMenu: 'Open menu', closeMenu: 'Close menu', required: 'This field is required.', invalidEmail: 'Enter a valid email address.',
    subject: 'DROP school demo enquiry', intro: 'Hello DROP, I would like to discuss a school demo.',
    name: 'Name', school: 'School', email: 'Work email', phone: 'Phone', message: 'Message',
    handoff: 'Your email app should open with the enquiry ready. Please send it from there.',
    copied: 'Enquiry copied. Paste it into your email app and send it to founder@dropeg.com.',
    copyFailed: 'Copy did not work. Please email founder@dropeg.com directly.'
  },
  ar: {
    openMenu: 'افتح القائمة', closeMenu: 'اقفل القائمة', required: 'الخانة دي مطلوبة.', invalidEmail: 'اكتب بريد إلكتروني صحيح.',
    subject: 'طلب عرض توضيحي لدروب للمدارس', intro: 'مرحبًا دروب، أرغب في مناقشة عرض توضيحي للمدرسة.',
    name: 'الاسم', school: 'المدرسة', email: 'بريد العمل', phone: 'الهاتف', message: 'الرسالة',
    handoff: 'تطبيق البريد المفروض يفتح برسالتك جاهزة. ابعتها من هناك.',
    copied: 'تم نسخ الرسالة. الصقها في تطبيق البريد وابعتها إلى founder@dropeg.com.',
    copyFailed: 'النسخ ما اشتغلش. ابعت رسالة مباشرة إلى founder@dropeg.com.'
  }
}[lang];

const menuButton = document.querySelector('.menu-toggle');
const mobileNav = document.getElementById('mobile-nav');
function closeMenu(restoreFocus = true) {
  mobileNav.hidden = true;
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', text.openMenu);
  if (restoreFocus) menuButton.focus();
}
menuButton.addEventListener('click', () => {
  if (!mobileNav.hidden) { closeMenu(); return; }
  mobileNav.hidden = false;
  menuButton.setAttribute('aria-expanded', 'true');
  menuButton.setAttribute('aria-label', text.closeMenu);
  mobileNav.querySelector('a').focus();
});
mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu(false)));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !mobileNav.hidden) closeMenu();
});

if (location.search.includes('intent=demo')) {
  document.querySelectorAll('.language-toggle,.mobile-language').forEach(link => {
    const url = new URL(link.href);
    url.searchParams.set('intent', 'demo');
    url.hash = 'demo-form';
    link.href = url.href;
  });
}

const form = document.getElementById('demo-form');
if (form) {
  const status = document.getElementById('form-status');
  const ids = ['name', 'school', 'email', 'phone'];
  function validate() {
    let firstInvalid = null;
    for (const id of ids) {
      const field = document.getElementById(`demo-${id}`);
      const error = document.getElementById(`${id}-error`);
      const value = field.value.trim();
      let message = '';
      if (field.required && !value) message = text.required;
      else if (id === 'email' && value && !field.checkValidity()) message = text.invalidEmail;
      error.textContent = message;
      if (message) { field.setAttribute('aria-invalid', 'true'); if (!firstInvalid) firstInvalid = field; }
      else field.removeAttribute('aria-invalid');
    }
    if (firstInvalid) firstInvalid.focus();
    return !firstInvalid;
  }
  ids.forEach(id => document.getElementById(`demo-${id}`).addEventListener('input', event => {
    event.target.removeAttribute('aria-invalid');
    document.getElementById(`${id}-error`).textContent = '';
  }));
  function enquiry() {
    const values = Object.fromEntries(new FormData(form));
    const lines = [text.intro, '', `${text.name}: ${values.name.trim()}`, `${text.school}: ${values.school.trim()}`, `${text.email}: ${values.email.trim()}`];
    if (values.phone.trim()) lines.push(`${text.phone}: ${values.phone.trim()}`);
    if (values.message.trim()) lines.push('', `${text.message}:`, values.message.trim());
    return lines.join('\n');
  }
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!validate()) return;
    status.textContent = text.handoff;
    location.href = `mailto:founder@dropeg.com?subject=${encodeURIComponent(text.subject)}&body=${encodeURIComponent(enquiry())}`;
  });
  document.getElementById('copy-enquiry').addEventListener('click', async () => {
    if (!validate()) return;
    const content = `${text.subject}\n\n${enquiry()}`;
    try {
      if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(content);
      else {
        const field = document.createElement('textarea');
        field.value = content;
        field.style.position = 'fixed';
        field.style.opacity = '0';
        document.body.appendChild(field);
        field.select();
        const copied = document.execCommand('copy');
        field.remove();
        if (!copied) throw new Error('Clipboard unavailable');
      }
      status.textContent = text.copied;
    } catch (_) { status.textContent = text.copyFailed; }
  });
}
