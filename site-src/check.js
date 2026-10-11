const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const pages = ['','how-it-works/','about/','contact/','privacy/','terms/'];
let checked = 0;
for (const lang of ['en','ar']) {
  for (const page of pages) {
    const file = path.join(root,lang,page,'index.html');
    const html = fs.readFileSync(file,'utf8');
    const route = `${lang}/${page || 'home'}`;
    if (!html.includes(`<html lang="${lang}" dir="${lang === 'ar' ? 'rtl' : 'ltr'}">`)) throw Error(`${route}: locale missing`);
    if ((html.match(/<h1\b/g) || []).length !== 1) throw Error(`${route}: expected one H1`);
    if (!html.includes('<link rel="canonical"')) throw Error(`${route}: canonical missing`);
    if ((page === 'privacy/' || page === 'terms/') !== html.includes('noindex,nofollow')) throw Error(`${route}: incorrect draft indexing`);
    for (const [,attribute,target] of html.matchAll(/\b(href|src)="([^"]*)"/g)) {
      if (!target || target.startsWith('#') || /^(https?:|mailto:|tel:|data:)/.test(target)) continue;
      const clean = target.split(/[?#]/)[0];
      const resolved = path.resolve(path.dirname(file),clean);
      const candidate = clean.endsWith('/') ? path.join(resolved,'index.html') : resolved;
      if (!candidate.startsWith(root + path.sep) || !fs.existsSync(candidate)) throw Error(`${route}: broken ${attribute} ${target}`);
    }
    checked++;
  }
}
const sitemap = fs.readFileSync(path.join(root,'sitemap.xml'),'utf8');
if ((sitemap.match(/<url>/g) || []).length !== 8 || sitemap.includes('/privacy/') || sitemap.includes('/terms/')) throw Error('Sitemap must contain only eight indexable pages');
console.log(`Checked ${checked} localized pages, their local links/assets, and sitemap.`);
