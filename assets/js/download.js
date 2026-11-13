(function () {
  'use strict';
  var ua = navigator.userAgent || '';
  var isApple = /iPhone|iPad|iPod/i.test(ua) ||
    (/Macintosh/i.test(ua) && (/Mobile/i.test(ua) || navigator.maxTouchPoints > 1));
  var destination = isApple ? 'https://apps.apple.com/eg/app/drop-bus/id6804240531' :
    /Android/i.test(ua) ? 'https://play.google.com/store/apps/details?id=com.dropmobile' : null;
  if (destination) {
    try { window.location.replace(destination); } catch (_) { /* Store links remain available. */ }
  }
})();
