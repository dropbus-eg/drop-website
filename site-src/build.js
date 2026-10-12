const fs = require('node:fs');
const path = require('node:path');
const homeCopy = require('./home-copy');
const howSurfaces = require('./how-surfaces');
const legalCopy = require('./legal-copy');

const root = path.resolve(__dirname, '..');
const pages = ['home', 'how-it-works', 'about', 'contact', 'privacy', 'terms'];
const labels = {
  en: { home: 'Home', how: 'How it works', about: 'About us', contact: 'Contact', privacy: 'Privacy Policy', terms: 'Terms of Use', demo: 'Book a demo', language: 'العربية', menu: 'Open menu', footer: 'Footer navigation', nav: 'Main navigation', mobile: 'Mobile navigation', descriptor: 'FOR SCHOOLS', tagline: 'School Transport Management' },
  ar: { home: 'الرئيسية', how: 'إزاي بيشتغل', about: 'عن دروب', contact: 'تواصل معنا', privacy: 'سياسة الخصوصية', terms: 'شروط الاستخدام', demo: 'احجز عرض توضيحي', language: 'English', menu: 'افتح القائمة', footer: 'روابط أسفل الصفحة', nav: 'القائمة الرئيسية', mobile: 'قائمة الهاتف', descriptor: 'للمدارس', tagline: 'إدارة ومتابعة النقل المدرسي' }
};
const titles = {
  en: { home: 'DROP for Schools | School Transport Management', 'how-it-works': 'How it works | DROP for Schools', about: 'About us | DROP for Schools', contact: 'Contact and book a demo | DROP for Schools', privacy: 'Privacy Policy draft | DROP for Schools', terms: 'Terms of Use draft | DROP for Schools' },
  ar: { home: 'دروب للمدارس | إدارة ومتابعة النقل المدرسي', 'how-it-works': 'إزاي بيشتغل | دروب للمدارس', about: 'عن دروب | دروب للمدارس', contact: 'تواصل واحجز عرض توضيحي | دروب للمدارس', privacy: 'مسودة سياسة الخصوصية | دروب للمدارس', terms: 'مسودة شروط الاستخدام | دروب للمدارس' }
};
const descriptions = {
  en: { home: homeCopy.en.description, 'how-it-works': 'See how DROP connects school transport planning, bus teams and parent updates through the school journey.', about: 'Learn how DROP approaches clearer school transport coordination and communication.', contact: 'Contact DROP for Schools to discuss your school transport needs or request a demo.', privacy: 'Short draft privacy policy for the DROP for Schools website and platform.', terms: 'Short draft terms for the DROP for Schools website and platform.' },
  ar: { home: homeCopy.ar.description, 'how-it-works': 'تعرف على إزاي دروب بيربط تخطيط النقل المدرسي وفريق الباص وتحديثات أولياء الأمور.', about: 'تعرف على نهج دروب في تنظيم النقل المدرسي والتواصل بشكل أوضح.', contact: 'تواصل مع دروب للمدارس لمناقشة احتياجات النقل المدرسي أو طلب عرض توضيحي.', privacy: 'مسودة مبسطة لخصوصية موقع دروب ومنصة المدارس.', terms: 'مسودة مبسطة لشروط موقع دروب ومنصة المدارس.' }
};

function escapeHtml(value) { return String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]); }
function ctx(lang, page) {
  const atHome = page === 'home';
  const up = atHome ? '../' : '../../';
  const local = atHome ? '' : '../';
  const link = target => target === 'home' ? (atHome ? './' : '../') : `${local}${target}/`;
  const other = lang === 'en' ? 'ar' : 'en';
  const switchUrl = `${up}${other}/${atHome ? '' : `${page}/`}`;
  return { up, link, switchUrl, contactUrl: `${link('contact')}?intent=demo#demo-form` };
}
function brand(lang, up, homeUrl) {
  return `<a class="brand" href="${homeUrl}" aria-label="${lang === 'en' ? 'DROP for Schools home' : 'دروب للمدارس، الصفحة الرئيسية'}"><img src="${up}assets/logo.png" alt="" width="42" height="42"><span class="brand-name">DROP</span><span class="brand-divider" aria-hidden="true"></span><span class="brand-descriptor">${labels[lang].descriptor}</span></a>`;
}
function header(lang, page) {
  const x = ctx(lang, page), l = labels[lang];
  const items = [['home', l.home], ['how-it-works', l.how], ['about', l.about], ['contact', l.contact]];
  const links = items.map(([key, text]) => `<a href="${x.link(key)}"${page === key ? ' aria-current="page"' : ''}>${text}</a>`).join('');
  return `<header class="site-header" id="top"><div class="header-inner container">${brand(lang, x.up, x.link('home'))}<nav class="desktop-nav" aria-label="${l.nav}">${links}</nav><div class="header-actions"><a class="language-toggle" href="${x.switchUrl}" lang="${lang === 'en' ? 'ar' : 'en'}" aria-label="${lang === 'en' ? 'Switch to Arabic' : 'Switch to English'}">${l.language}</a><a class="button button-primary header-demo" href="${x.contactUrl}"><span>${l.demo}</span><span aria-hidden="true" class="arrow">→</span></a><button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-nav" aria-label="${l.menu}"><span></span><span></span></button></div></div><nav class="mobile-nav" id="mobile-nav" aria-label="${l.mobile}" hidden>${links}<a class="mobile-language" href="${x.switchUrl}" lang="${lang === 'en' ? 'ar' : 'en'}">${l.language}</a><a class="button button-primary" href="${x.contactUrl}">${l.demo}<span aria-hidden="true" class="arrow">→</span></a></nav></header>`;
}
function footer(lang, page) {
  const x = ctx(lang, page), l = labels[lang];
  return `<footer class="site-footer"><div class="container footer-inner"><div class="footer-brand">${brand(lang, x.up, x.link('home'))}<p>${l.tagline}</p></div><nav class="footer-nav" aria-label="${l.footer}"><a href="${x.link('about')}">${l.about}</a><a href="${x.link('how-it-works')}">${l.how}</a><a href="${x.link('contact')}">${l.contact}</a><a href="${x.link('privacy')}">${l.privacy}</a><a href="${x.link('terms')}">${l.terms}</a></nav><div class="footer-contact"><a href="${x.up}assets/downloads/DROP-Schools-1.0.6.apk" download="DROP-Schools-1.0.6.apk">${lang === 'en' ? 'Download Android app (APK)' : 'تحميل تطبيق أندرويد (APK)'}</a><a href="mailto:support@dropeg.com" dir="ltr">support@dropeg.com</a></div></div></footer>`;
}
function replaceTranslations(html, lang) {
  const t = homeCopy[lang];
  html = html.replace(/(<([a-z][a-z0-9]*)\b[^>]*\bdata-i18n="([^"]+)"[^>]*>)([\s\S]*?)(<\/\2>)/gi, (all, open, tag, key, old, close) => {
    if (t[key] === undefined) throw new Error(`Missing ${lang} translation: ${key}`);
    const value = key === 'heroLine1' || key === 'closingTitle' ? t[key] : escapeHtml(t[key]);
    return open + value + close;
  });
  html = html.replace(/aria-label="[^"]*" data-i18n-aria="([^"]+)"/g, (all, key) => `aria-label="${escapeHtml(t[key])}"`);
  html = html.replace(/alt="[^"]*" data-i18n-alt="([^"]+)"/g, (all, key) => `alt="${escapeHtml(t[key])}"`);
  return html;
}
function home(lang) {
  const x = ctx(lang, 'home');
  let html = fs.readFileSync(path.join(__dirname, 'home.template.html'), 'utf8');
  html = html.replace('<html lang="en" dir="ltr">', `<html lang="${lang}" dir="${lang === 'ar' ? 'rtl' : 'ltr'}">`);
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(titles[lang].home)}</title>`);
  html = html.replace(/(<meta name="description" content=")[^"]*(">)/, `$1${escapeHtml(descriptions[lang].home)}$2`);
  html = html.replace(/(<meta property="og:title" content=")[^"]*(">)/, `$1${escapeHtml(titles[lang].home)}$2`);
  html = html.replace(/(<meta property="og:description" content=")[^"]*(">)/, `$1${escapeHtml(descriptions[lang].home)}$2`);
  html = html.replace(/<header class="site-header"[\s\S]*?<\/header>/, header(lang, 'home'));
  html = html.replace(/<footer class="site-footer">[\s\S]*?<\/footer>/, footer(lang, 'home'));
  html = html.replace(/^[ \t]*<dialog class="demo-dialog"[\s\S]*?<\/dialog>\r?\n/m, '');
  html = html.replace(/<button class="button button-primary" type="button" data-open-demo>([\s\S]*?)<\/button>/g, `<a class="button button-primary" href="${x.contactUrl}">$1</a>`);
  html = html.replace('href="#how-it-works"', 'href="how-it-works/"');
  html = html.replace(/(["'])assets\//g, '$1../assets/');
  html = html.replace('<script src="../assets/js/school-home.js" defer></script>', '<script src="../assets/js/school-site.js?v=contact-direct-1" defer></script>');
  html = replaceTranslations(html, lang);
  return html;
}
function documentPage(lang, page, body, draft = false) {
  const x = ctx(lang, page), title = titles[lang][page], description = descriptions[lang][page];
  return `<!doctype html><html lang="${lang}" dir="${lang === 'ar' ? 'rtl' : 'ltr'}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#1D3555"><meta name="description" content="${escapeHtml(description)}">${draft ? '<meta name="robots" content="noindex,nofollow">' : ''}<title>${escapeHtml(title)}</title><link rel="icon" href="${x.up}assets/logo.png" type="image/png"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet"><link rel="stylesheet" href="${x.up}assets/css/school-home.css?v=contact-direct-1"><link rel="stylesheet" href="${x.up}assets/css/school-pages.css"><meta property="og:type" content="website"><meta property="og:title" content="${escapeHtml(title)}"><meta property="og:description" content="${escapeHtml(description)}"><meta property="og:image" content="${x.up}assets/schools/schoolboy-hero.jpg"></head><body><a class="skip-link" href="#main">${lang === 'en' ? 'Skip to content' : 'انتقل إلى المحتوى'}</a>${header(lang, page)}<main id="main">${body}</main>${footer(lang, page)}<script src="${x.up}assets/js/school-site.js?v=contact-direct-1" defer></script></body></html>`;
}
function callToAction(lang, page) {
  const x = ctx(lang, page);
  return `<section class="interior-cta container"><div><p class="eyebrow">${lang === 'en' ? 'DROP FOR SCHOOLS' : 'دروب للمدارس'}</p><h2>${lang === 'en' ? 'Let’s connect your school journeys.' : 'خلّي رحلات مدرستك مترابطة.'}</h2><p>${lang === 'en' ? 'Tell us about your school transport setup and we can discuss how DROP may fit.' : 'احكيلنا عن نظام النقل في مدرستك ونتكلم عن إزاي دروب ممكن يساعدك.'}</p></div><a class="button button-primary" href="${x.contactUrl}">${labels[lang].demo}<span class="arrow" aria-hidden="true">→</span></a></section>`;
}
function howPage(lang) {
  const ar = lang === 'ar', x = ctx(lang, 'how-it-works');
  const content = ar ? {
    eyebrow:'خطوة بخطوة', title:'من أول ركوب لحد آخر نزول.', intro:'دروب بيربط تجهيز المدرسة للخطوط بمتابعة فريق الباص وتحديثات أولياء الأمور خلال اليوم الدراسي.',
    one:'المدرسة بتجهّز الرحلة', oneBody:'فريق النقل يضيف الخطوط والمواقف والطلاب ويحدد الباص والجدول لكل رحلة.',
    two:'المشرف بيتابع الركوب', twoBody:'فريق الباص يشوف قائمة الطلاب ويسجل حالة الركوب أو الغياب أو الانتظار أثناء الرحلة.',
    three:'الأهالي بيتابعوا التحديثات', threeBody:'ولي الأمر يقدر يشوف الباص المخصص وتحديثات الرحلة ويبلغ عن غياب الطالب من التطبيق.',
    sample:'مثال توضيحي لرحلة', sampleBody:'المعاينة دي بتوضح شكل المعلومات، ومش بيانات رحلة حقيقية أو متابعة مباشرة.', route:'الخط 04', status:'رحلة صباحية', boarded:'ركب', pending:'قيد الانتظار', faq:'أسئلة سريعة', q1:'دروب للمدارس إيه؟', a1:'منصة برمجية تساعد المدرسة وفريق الباص وأولياء الأمور على تنظيم ومتابعة رحلات النقل المدرسي.', q2:'مين بيستخدم المنصة؟', a2:'فريق النقل بالمدرسة، فريق الباص، وأولياء الأمور، وكل طرف يشوف المعلومات المناسبة لدوره.', q3:'إزاي أطلب عرض توضيحي؟', a3:'افتح صفحة التواصل واكتب بيانات المدرسة، واضغط ابعت الطلب. هنرد عليك بالبريد الإلكتروني.'
  } : {
    eyebrow:'STEP BY STEP', title:'From the first pickup to the final drop-off.', intro:'DROP connects the school’s transport setup with bus team updates and the information parents need throughout the school day.',
    one:'The school sets up the journey', oneBody:'The transport team adds routes, stops and students, then assigns a bus and schedule to each trip.',
    two:'Supervisors manage boarding', twoBody:'The bus team sees the student list and records boarding, absence or waiting status during the trip.',
    three:'Parents follow updates', threeBody:'Parents can view the assigned bus and trip updates, and report a student absence in the app.',
    sample:'An illustrative school journey', sampleBody:'This preview shows the kind of information available. It is not a real trip or a live feed.', route:'Route 04', status:'Morning trip', boarded:'Boarded', pending:'Pending', faq:'A few quick answers', q1:'What is DROP for Schools?', a1:'It is a software platform that helps schools, bus teams and parents organize and follow school transport journeys.', q2:'Who uses it?', a2:'School transport teams, bus teams and parents each see information relevant to their role.', q3:'How can I request a demo?', a3:'Open the Contact page, enter your school details and select Send enquiry. We will reply by email.'
  };
  const row = (n, title, body, img, reverse = false) => `<section class="process-row${reverse ? ' reverse' : ''}"><div class="process-copy"><span class="process-number">${n}</span><h2>${title}</h2><p>${body}</p></div><div class="process-art"><img src="${x.up}assets/schools/${img}" alt="" loading="lazy"></div></section>`;
  const body = `<section class="interior-hero container"><div><p class="eyebrow">${content.eyebrow}</p><h1>${content.title}</h1><p>${content.intro}</p></div><img src="${x.up}assets/schools/minibus-illustration.png" alt="" width="1536" height="1024"></section><div class="container process-list">${row('01',content.one,content.oneBody,'school-illustration.png')}${row('02',content.two,content.twoBody,'minibus-illustration.png',true)}${row('03',content.three,content.threeBody,'backpack-illustration.png')}</div>${howSurfaces(lang,x.up)}<section class="faq-section container"><h2>${content.faq}</h2><div class="faq-list"><details><summary>${content.q1}</summary><p>${content.a1}</p></details><details><summary>${content.q2}</summary><p>${content.a2}</p></details><details><summary>${content.q3}</summary><p>${content.a3}</p></details></div></section>${callToAction(lang,'how-it-works')}`;
  return documentPage(lang, 'how-it-works', body);
}
function aboutPage(lang) {
  const ar=lang==='ar', x=ctx(lang,'about');
  const c=ar ? { eyebrow:'عن دروب', title:'مصمم لرحلة المدرسة.', intro:'دروب منصة برمجية تساعد المدارس على تنظيم النقل المدرسي وتخلي معلومات الرحلة أوضح لفريق الباص وأولياء الأمور.', problem:'لما معلومات الرحلة تتفرق', problemBody:'تخطيط الخطوط، تسجيل ركوب الطلاب، وتحديثات الأهالي محتاجين يكونوا متصلين ببعض. دروب بيجمعهم في تجربة واحدة تساعد كل طرف يعرف اللي يهمه.', focus:'تركيزنا على المدارس', focusBody:'بنصمم الخدمة حوالين يوم المدرسة الفعلي: من تجهيز الخطوط والطلاب إلى متابعة الرحلة وتحديثات الوصول.', principles:'المبادئ اللي بنشتغل بيها', clarity:'وضوح', clarityBody:'معلومات سهلة الفهم وقت ما الفريق أو ولي الأمر يحتاجها.', coordination:'تنسيق', coordinationBody:'طريقة مشتركة تربط المدرسة وفريق الباص والأهالي.', design:'تصميم عملي', designBody:'أدوات واضحة تناسب شغل النقل المدرسي اليومي.'} : {eyebrow:'ABOUT DROP',title:'Built around the school journey.',intro:'DROP is a software platform that helps schools organize transport and makes journey information clearer for bus teams and parents.',problem:'When journey information is scattered',problemBody:'Route planning, student check-ins and parent updates need to work together. DROP brings them into one experience so each person can see what matters to them.',focus:'Focused on school days',focusBody:'We design around the real rhythm of school transport: preparing routes and students, following a trip and sharing arrival updates.',principles:'What guides the work',clarity:'Clarity',clarityBody:'Information that is easy to understand when a team or parent needs it.',coordination:'Coordination',coordinationBody:'A shared way to connect schools, bus teams and families.',design:'Thoughtful design',designBody:'Practical tools shaped around daily school transport work.'};
  const body=`<section class="interior-hero container about-hero"><div><p class="eyebrow">${c.eyebrow}</p><h1>${c.title}</h1><p>${c.intro}</p></div><img class="about-photo" src="${x.up}assets/schools/schoolboy-hero.jpg" alt="${ar?'طالب مبتسم يحمل حقيبة دروب أمام المدرسة':'Smiling student with a DROP backpack outside school'}" width="1536" height="1024"></section><section class="about-story container"><div><p class="eyebrow">01</p><h2>${c.problem}</h2><p>${c.problemBody}</p></div><div><p class="eyebrow">02</p><h2>${c.focus}</h2><p>${c.focusBody}</p></div></section><section class="principles-section container"><div class="section-heading centered"><h2>${c.principles}</h2></div><div class="principles-grid"><article><span>01</span><h3>${c.clarity}</h3><p>${c.clarityBody}</p></article><article><span>02</span><h3>${c.coordination}</h3><p>${c.coordinationBody}</p></article><article><span>03</span><h3>${c.design}</h3><p>${c.designBody}</p></article></div></section>${callToAction(lang,'about')}`;
  return documentPage(lang,'about',body);
}
function contactPage(lang) {
  const ar=lang==='ar', x=ctx(lang,'contact');
  const c=ar ? {eyebrow:'تواصل مع دروب',title:'خلينا نتكلم عن مدرستك.',intro:'اكتب بيانات المدرسة وابعت طلبك مباشرة من الموقع. طلبك بداية لمحادثة، مش تأكيد لموعد.',name:'الاسم',school:'اسم المدرسة',email:'بريد العمل',phone:'رقم الهاتف (اختياري)',message:'رسالة (اختياري)',note:'النموذج مخصص لاستفسارات المدارس. من فضلك ما تكتبش بيانات الطلاب. بيتم إرسال الطلب عبر خدمة FormSubmit.',privacy:'اقرأ مسودة سياسة الخصوصية',continue:'ابعت الطلب',explain:'هنبعت طلبك لبريد الدعم ونرد عليك هناك.',copy:'انسخ الرسالة',emailDirect:'أو ابعت مباشرة إلى',phoneDirect:'اتصل بنا'} : {eyebrow:'CONTACT DROP',title:"Let's talk about your school.",intro:'Share your school details and send your enquiry from this page. This starts a conversation; it does not confirm an appointment.',name:'Name',school:'School name',email:'Work email',phone:'Phone (optional)',message:'Message (optional)',note:"This form is for school enquiries. Please don't include student information. Submission is handled by FormSubmit.",privacy:'Read the Privacy Policy draft',continue:'Send enquiry',explain:"We'll send your enquiry to our support inbox and reply by email.",copy:'Copy enquiry',emailDirect:'Or email us directly at',phoneDirect:'Call us'};
  const body=`<section class="contact-page container"><div class="contact-intro"><p class="eyebrow">${c.eyebrow}</p><h1>${c.title}</h1><p>${c.intro}</p><img src="${x.up}assets/schools/school-illustration.png" alt="" width="1254" height="1254" loading="lazy"><div class="contact-details"><p>${c.emailDirect} <a href="mailto:support@dropeg.com" dir="ltr">support@dropeg.com</a></p><p>${c.phoneDirect} <a href="tel:+201287441113" dir="ltr">01287441113</a></p></div></div><div class="contact-form-card"><form id="demo-form" action="https://formsubmit.co/support@dropeg.com" method="POST"><input type="hidden" name="_subject" value="DROP school enquiry"><input type="hidden" name="_url" value="https://dropeg.com/${lang}/contact/"><div class="form-grid"><div class="form-field"><label for="demo-name">${c.name} *</label><input id="demo-name" name="name" type="text" autocomplete="name" required aria-describedby="name-error"><small class="field-error" id="name-error"></small></div><div class="form-field"><label for="demo-school">${c.school} *</label><input id="demo-school" name="school" type="text" autocomplete="organization" required aria-describedby="school-error"><small class="field-error" id="school-error"></small></div><div class="form-field"><label for="demo-email">${c.email} *</label><input id="demo-email" name="email" type="email" autocomplete="email" required aria-describedby="email-error"><small class="field-error" id="email-error"></small></div><div class="form-field"><label for="demo-phone">${c.phone}</label><input id="demo-phone" name="phone" type="tel" autocomplete="tel"><small class="field-error" id="phone-error"></small></div></div><div class="form-field"><label for="demo-message">${c.message}</label><textarea id="demo-message" name="message" rows="4"></textarea></div><p class="form-note">${c.note} <a href="${x.link('privacy')}">${c.privacy}</a></p><button class="button button-primary form-submit" type="submit">${c.continue}<span class="arrow" aria-hidden="true">→</span></button><p class="email-explain">${c.explain}</p><div class="email-fallback"><span dir="ltr">support@dropeg.com</span><button type="button" id="copy-enquiry">${c.copy}</button></div><p class="form-status" id="form-status" role="status" aria-live="polite"></p></form></div></section>`;
  return documentPage(lang,'contact',body);
}
function legalPage(lang, page) {
  const ar=lang==='ar';
  const c=legalCopy[lang][page];
  const sections=c.sections.map(([heading,text],i)=>`<section id="section-${i+1}"><h2>${i+1}. ${heading}</h2><p>${text}</p></section>`).join('');
  const toc=c.sections.map(([heading],i)=>`<a href="#section-${i+1}">${i+1}. ${heading}</a>`).join('');
  const body=`<section class="legal-header container"><span class="draft-badge">${ar?'مسودة — في انتظار مراجعة المالك':'Draft — pending owner review'}</span><h1>${c.title}</h1><p>${c.intro}</p></section><div class="legal-layout container"><aside class="legal-toc"><h2>${ar?'المحتويات':'Contents'}</h2><nav aria-label="${ar?'محتويات الوثيقة':'Document contents'}">${toc}</nav></aside><div class="legal-content"><details class="mobile-toc"><summary>${ar?'المحتويات':'Contents'}</summary><nav>${toc}</nav></details>${sections}<div class="legal-contact"><h2>${ar?'التواصل والمراجعة':'Contact and review'}</h2><p>${ar?'للاستفسارات عن هذه المسودة:':'Questions about this draft:'} <a href="mailto:support@dropeg.com" dir="ltr">support@dropeg.com</a></p></div></div></div>`;
  return documentPage(lang,page,body,true);
}

for (const lang of ['en','ar']) {
  for (const page of pages) {
    const dir = path.join(root, lang, page === 'home' ? '' : page);
    fs.mkdirSync(dir,{recursive:true});
    let html = page === 'home' ? home(lang) : page === 'how-it-works' ? howPage(lang) : page === 'about' ? aboutPage(lang) : page === 'contact' ? contactPage(lang) : legalPage(lang,page);
    const canonical = `https://dropeg.com/${lang}/${page === 'home' ? '' : `${page}/`}`;
    const other = lang === 'en' ? 'ar' : 'en';
    const alternate = `https://dropeg.com/${other}/${page === 'home' ? '' : `${page}/`}`;
    html = html.replace('</head>', `<link rel="canonical" href="${canonical}"><link rel="alternate" hreflang="${other}" href="${alternate}"></head>`);
    fs.writeFileSync(path.join(dir,'index.html'),html,'utf8');
  }
}
function redirectPage(destination) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><meta http-equiv="refresh" content="0;url=${destination}"><title>DROP for Schools</title></head><body><p>Continue to <a href="${destination}">DROP for Schools</a>.</p><script>location.replace(${JSON.stringify(destination)}+location.search+location.hash)</script></body></html>`;
}
fs.writeFileSync(path.join(root,'index.html'),redirectPage('en/'),'utf8');
const legacy = {
  'schools.html':'en/', 'about.html':'en/about/', 'contact.html':'en/contact/',
  'privacy.html':'en/privacy/', 'terms.html':'en/terms/', 'cookies.html':'en/privacy/',
  'blog.html':'en/', 'corporate.html':'en/', 'drop-plus.html':'en/',
  'payment.html':'en/', 'refund.html':'en/', 'complaints.html':'en/'
};
for (const [filename,destination] of Object.entries(legacy)) fs.writeFileSync(path.join(root,filename),redirectPage(destination),'utf8');
const siteUrl = 'https://dropeg.com';
const sitemap = ['en','ar'].flatMap(lang => ['','how-it-works/','about/','contact/'].map(segment => `<url><loc>${siteUrl}/${lang}/${segment}</loc></url>`)).join('');
fs.writeFileSync(path.join(root,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${sitemap}</urlset>`,'utf8');
fs.writeFileSync(path.join(root,'robots.txt'),`User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`,'utf8');
fs.writeFileSync(path.join(root,'404.html'),`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>Page not found | DROP for Schools</title><link rel="icon" href="assets/logo.png"><link rel="stylesheet" href="assets/css/school-home.css?v=contact-direct-1"><link rel="stylesheet" href="assets/css/school-pages.css"></head><body><main class="not-found container"><img src="assets/logo.png" alt="DROP" width="56" height="56"><p class="eyebrow">404 / PAGE NOT FOUND</p><h1>We couldn't find that page.</h1><p>Choose a place to continue. / اختر صفحة للمتابعة.</p><div><a class="button button-primary" href="en/">Home</a><a class="button button-secondary" href="en/contact/">Contact</a><a class="button button-secondary" href="ar/" lang="ar">الرئيسية</a><a class="button button-secondary" href="ar/contact/" lang="ar">تواصل معنا</a></div></main></body></html>`,'utf8');
console.log('Built 12 localized pages.');
