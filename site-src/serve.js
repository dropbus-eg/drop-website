const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname,'..');
const port = Number(process.env.PORT || 4173);
const types = { '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.png':'image/png', '.jpeg':'image/jpeg', '.jpg':'image/jpeg', '.svg':'image/svg+xml', '.apk':'application/vnd.android.package-archive', '.xml':'application/xml; charset=utf-8', '.txt':'text/plain; charset=utf-8' };
http.createServer((request,response) => {
  const url = new URL(request.url,'http://localhost');
  if (url.pathname === '/') { response.writeHead(302,{Location:'/en/'}); response.end(); return; }
  const decoded = decodeURIComponent(url.pathname);
  if (/^\/(drafts|site-src|DROP-WEBSITE)(\/|$)/.test(decoded)) { response.writeHead(404); response.end(); return; }
  const filename = path.resolve(root,'.' + decoded);
  if (!filename.startsWith(root + path.sep)) { response.writeHead(404); response.end(); return; }
  let target = filename;
  try {
    if (fs.statSync(target).isDirectory()) {
      if (!decoded.endsWith('/')) { response.writeHead(301,{Location:decoded + '/' + url.search}); response.end(); return; }
      target = path.join(target,'index.html');
    }
    const data = fs.readFileSync(target);
    response.writeHead(200,{'Content-Type':types[path.extname(target)] || 'application/octet-stream','Cache-Control':'no-store'});
    response.end(data);
  } catch (_) {
    response.writeHead(404,{'Content-Type':'text/html; charset=utf-8'});
    response.end(fs.readFileSync(path.join(root,'404.html')));
  }
}).listen(port,'127.0.0.1',()=>console.log(`DROP preview: http://127.0.0.1:${port}/en/`));
