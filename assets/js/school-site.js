const lang = document.documentElement.lang === 'ar' ? 'ar' : 'en';
const text = {
  en: {
    openMenu: 'Open menu', closeMenu: 'Close menu', required: 'This field is required.', invalidEmail: 'Enter a valid email address.',
    subject: 'DROP school demo enquiry', intro: 'Hello DROP, I would like to discuss a school demo.',
    name: 'Name', school: 'School', email: 'Work email', phone: 'Phone', message: 'Message',
    sending: 'Sending your enquiry…',
    sent: 'Your enquiry was submitted. We will reply by email.',
    activation: 'Online delivery is being activated. Please email support@dropeg.com directly for now.',
    sendFailed: 'We could not send your enquiry. Please email support@dropeg.com directly or copy your message below.',
    copied: 'Enquiry copied. Paste it into your email app and send it to support@dropeg.com.',
    copyFailed: 'Copy did not work. Please email support@dropeg.com directly.'
  },
  ar: {
    openMenu: 'افتح القائمة', closeMenu: 'اقفل القائمة', required: 'الخانة دي مطلوبة.', invalidEmail: 'اكتب بريد إلكتروني صحيح.',
    subject: 'طلب عرض توضيحي لدروب للمدارس', intro: 'مرحبًا دروب، أرغب في مناقشة عرض توضيحي للمدرسة.',
    name: 'الاسم', school: 'المدرسة', email: 'بريد العمل', phone: 'الهاتف', message: 'الرسالة',
    sending: 'جارٍ إرسال طلبك…',
    sent: 'تم إرسال طلبك. هنرد عليك بالبريد الإلكتروني.',
    activation: 'الإرسال من الموقع لسه بيتفعّل. ابعت مباشرة إلى support@dropeg.com دلوقتي.',
    sendFailed: 'ماقدرناش نبعت طلبك. ابعت مباشرة إلى support@dropeg.com أو انسخ الرسالة من الزر اللي تحت.',
    copied: 'تم نسخ الرسالة. الصقها في تطبيق البريد وابعتها إلى support@dropeg.com.',
    copyFailed: 'النسخ ما اشتغلش. ابعت رسالة مباشرة إلى support@dropeg.com.'
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
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!validate()) return;
    const button = form.querySelector('.form-submit');
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    button.disabled = true;
    form.setAttribute('aria-busy', 'true');
    status.dataset.state = 'sending';
    status.textContent = text.sending;
    try {
      const response = await fetch('https://formsubmit.co/ajax/support@dropeg.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
        signal: controller.signal
      });
      if (!response.ok) throw new Error('Request failed');
      const result = await response.json();
      if (result.success !== true && result.success !== 'true') {
        if (/activat/i.test(result.message || '')) {
          status.dataset.state = 'error';
          status.textContent = text.activation;
          return;
        }
        throw new Error('Request was not accepted');
      }
      status.dataset.state = 'success';
      status.textContent = text.sent;
      form.reset();
    } catch (_) {
      status.dataset.state = 'error';
      status.textContent = text.sendFailed;
    } finally {
      clearTimeout(timeout);
      button.disabled = false;
      form.removeAttribute('aria-busy');
    }
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
