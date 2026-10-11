module.exports = function howSurfaces(lang, up) {
  const c = lang === 'ar' ? {
    kicker: 'جوا دروب', title: 'من مكتب المدرسة لحد بابها.', intro: 'المدرسة تتابع التشغيل من المنصة، والأهالي يشوفوا تحديثات الرحلة في التطبيق.',
    tripsTag: '01 / منصة المدرسة', tripsTitle: 'الرحلات اليومية في مكان واحد', tripsBody: 'شاشة الرحلات بتجمع الخطوط والمواعيد وحالة كل رحلة لفريق المدرسة.', tripsAlt: 'شاشة من نظام دروب للمدارس تعرض الرحلات المجدولة', tripsOpen: 'افتح شاشة الرحلات بحجمها الكامل',
    reportsTag: '02 / منصة المدرسة', reportsTitle: 'التقارير بصورة أوضح', reportsBody: 'ملخصات التشغيل تساعد الفريق يراجع نشاط النقل المدرسي.', reportsAlt: 'شاشة من نظام دروب للمدارس تعرض تقارير التشغيل', reportsOpen: 'افتح شاشة التقارير بحجمها الكامل',
    mobileTag: 'تطبيق المدارس', mobileTitle: 'الرحلة قدام ولي الأمر.', mobileBody: 'شاشة ولي الأمر تعرض الباص المخصص وتحديثات الرحلة، وشاشة التتبع تعرض المسار وحالة الوصول.',
    parentLabel: 'واجهة ولي الأمر', parentAlt: 'لقطة من تطبيق دروب لولي الأمر تعرض حالة الرحلة بعد إخفاء بيانات الأطفال والتواصل', trackingLabel: 'واجهة التتبع', trackingAlt: 'لقطة من تطبيق دروب تعرض خريطة الرحلة بعد إخفاء بيانات الطفل والعناوين',
    note: 'صور الموبايل مبنية على لقطات من التطبيق، مع تعديلها لإخفاء بيانات الأطفال والتواصل والأماكن الدقيقة.'
  } : {
    kicker: 'INSIDE DROP', title: 'From the school desk to the school gate.', intro: 'Schools follow daily operations in the platform, while parents see journey updates in the app.',
    tripsTag: '01 / SCHOOL PLATFORM', tripsTitle: 'Daily trips in one place', tripsBody: 'The trips view brings routes, schedules and journey status together for the school team.', tripsAlt: 'DROP school platform screen showing scheduled trips', tripsOpen: 'Open the full-sized trips screen',
    reportsTag: '02 / SCHOOL PLATFORM', reportsTitle: 'A clearer view of reports', reportsBody: 'Operational summaries help the team review school transport activity.', reportsAlt: 'DROP school platform screen showing operational reports', reportsOpen: 'Open the full-sized reports screen',
    mobileTag: 'THE SCHOOL APP', mobileTitle: 'The journey in a parent’s hand.', mobileBody: 'The parent view shows the assigned bus and trip updates. The tracking view brings the route and arrival status into focus.',
    parentLabel: 'Parent view', parentAlt: 'DROP parent app journey screen with child and contact details obscured', trackingLabel: 'Tracking view', trackingAlt: 'DROP app tracking screen with child and location details obscured',
    note: 'Mobile views are based on supplied product screenshots, edited to obscure child, contact and precise location details.'
  };
  const erp = (file, tag, title, body, alt, open, height) => `<figure class="erp-shot"><a class="erp-image" href="${up}assets/${file}" target="_blank" rel="noopener noreferrer" aria-label="${open}"><img src="${up}assets/${file}" alt="${alt}" width="1280" height="${height}" loading="lazy"></a><figcaption><span>${tag}</span><h3>${title}</h3><p>${body}</p></figcaption></figure>`;
  return `<section class="surface-section container" aria-labelledby="surface-title">
    <div class="section-heading surface-heading"><p class="eyebrow">${c.kicker}</p><h2 id="surface-title">${c.title}</h2><p>${c.intro}</p></div>
    <div class="erp-gallery">${erp('school-trips.jpeg',c.tripsTag,c.tripsTitle,c.tripsBody,c.tripsAlt,c.tripsOpen,693)}${erp('school-reports.jpeg',c.reportsTag,c.reportsTitle,c.reportsBody,c.reportsAlt,c.reportsOpen,500)}</div>
    <div class="mobile-story"><div class="mobile-story-copy"><p class="eyebrow">${c.mobileTag}</p><h3>${c.mobileTitle}</h3><p>${c.mobileBody}</p><img src="${up}assets/schools/backpack-illustration.png" alt="" width="1254" height="1254" loading="lazy"></div>
      <div class="mobile-preview"><figure class="app-shot"><img src="${up}assets/schools/parent-app-redacted.png" alt="${c.parentAlt}" width="851" height="1847" loading="lazy"><figcaption>${c.parentLabel}</figcaption></figure><figure class="app-shot"><img src="${up}assets/schools/tracking-app-redacted.png" alt="${c.trackingAlt}" width="851" height="1847" loading="lazy"><figcaption>${c.trackingLabel}</figcaption></figure></div>
    </div><p class="surface-note">${c.note}</p>
  </section>`;
};
