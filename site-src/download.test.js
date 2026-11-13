const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { spawn } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const script = fs.readFileSync(path.join(root, 'assets/js/download.js'), 'utf8');
const apple = 'https://apps.apple.com/eg/app/drop-bus/id6804240531';
const google = 'https://play.google.com/store/apps/details?id=com.dropmobile';
for (const [name, userAgent, maxTouchPoints, expected] of [
  ['iPhone', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) Mobile', 5, apple],
  ['iPad', 'Mozilla/5.0 (iPad; CPU OS 18_0 like Mac OS X) Mobile', 5, apple],
  ['iPod', 'Mozilla/5.0 (iPod touch; CPU iPhone OS 15_0 like Mac OS X)', 5, apple],
  ['iPad desktop mode', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) Safari/605.1', 5, apple],
  ['iPad mobile token', 'Mozilla/5.0 (Macintosh) Mobile Safari', 0, apple],
  ['Android', 'Mozilla/5.0 (Linux; Android 15; Pixel 9) Chrome/130 Mobile', 5, google],
  ['Android tablet', 'Mozilla/5.0 (Linux; Android 14; Tablet) Chrome/130', 5, google],
  ['Windows desktop', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/130', 0, null],
  ['Mac desktop', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) Safari/605.1', 0, null],
  ['Linux desktop', 'Mozilla/5.0 (X11; Linux x86_64) Firefox/130', 0, null],
  ['unknown', '', 0, null],
  ['missing user agent', undefined, undefined, null],
]) {
  test(name, () => {
    const redirects = [];
    vm.runInNewContext(script, { navigator: { userAgent, maxTouchPoints }, window: { location: { replace: url => redirects.push(url) } } });
    assert.deepEqual(redirects, expected ? [expected] : []);
  });
}
test('blocked navigation leaves fallback usable', () => {
  assert.doesNotThrow(() => vm.runInNewContext(script, { navigator: { userAgent: 'iPhone' }, window: { location: { replace() { throw Error('Blocked'); } } } }));
});
test('built fallback has permanent canonical and both store links', () => {
  const html = fs.readFileSync(path.join(root, 'download/index.html'), 'utf8');
  assert.ok(html.includes('href="https://dropeg.com/download"'));
  for (const url of [apple, google]) assert.ok(html.includes(`href="${url}"`));
  for (const [, asset] of html.matchAll(/(?:href|src)="(\/assets\/[^"?]+)/g)) assert.ok(fs.existsSync(path.join(root, asset)));
  assert.equal((html.match(/<h1>/g) || []).length, 1);
});
test('localized footers retire APK links', () => {
  for (const lang of ['en', 'ar']) for (const page of ['', 'about', 'contact', 'how-it-works', 'privacy', 'terms']) {
    const html = fs.readFileSync(path.join(root, lang, page, 'index.html'), 'utf8');
    assert.match(html, /href="(?:\.\.\/)+download\/"/);
    assert.ok(!/\.apk/i.test(html));
  }
  assert.ok(!fs.existsSync(path.join(root, 'assets/downloads/DROP-Schools-1.0.6.apk')));
});
test('HTTP routes, assets and retired APK', async () => {
  const server = spawn(process.execPath, ['site-src/serve.js'], {
    cwd: root, env: { ...process.env, PORT: '4189' }, stdio: ['ignore', 'pipe', 'pipe'],
  });
  try {
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(Error('Preview startup timed out')), 10000);
      server.once('error', error => { clearTimeout(timeout); reject(error); });
      server.once('exit', code => { clearTimeout(timeout); reject(Error(`Preview exited: ${code}`)); });
      server.stdout.once('data', () => { clearTimeout(timeout); resolve(); });
    });
    for (const route of ['/download', '/download/', '/download?qr=print', '/en/', '/ar/', '/assets/js/download.js', '/assets/css/download.css', '/assets/qr/DROP_Smart_QR_Only.png']) {
      const response = await fetch(`http://127.0.0.1:4189${route}`);
      assert.equal(response.status, 200, route);
      if (route.startsWith('/download')) assert.ok((await response.text()).includes(`href="${apple}"`));
    }
    const retired = await fetch('http://127.0.0.1:4189/assets/downloads/DROP-Schools-1.0.6.apk');
    assert.equal(retired.status, 410);
    assert.equal((await fetch('http://127.0.0.1:4189/unknown-page')).status, 404);
  } finally { server.kill(); }
});
