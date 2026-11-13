# DROP for Schools website

This is a static six-page website with English and Arabic routes under `en/` and `ar/`. The school homepage follows the supplied design reference. Source content and page generation live in `site-src/`.

The How it works page uses the existing school ERP trip and report screenshots plus privacy-redacted derivatives of the supplied parent app and tracking screenshots. The original mobile screenshots with names, phone numbers and detailed locations are kept outside the public site. The homepage scenery is a small local SVG matching the supplied blue-and-white illustration family.

## Work locally

```powershell
node site-src/build.js
node site-src/check.js
node site-src/serve.js
```

Open `http://127.0.0.1:4173/`. The root redirects to `/en/`. The local server is for preview only.

The Contact page submits enquiries through FormSubmit to `support@dropeg.com`; it does not book a demo automatically. The destination mailbox was activated and a test enquiry was delivered. Changing the destination requires a new email confirmation. The Privacy and Terms pages contain detailed Arabic and English policies based on the supplied school agreement template, the current website, and the owner's 90-day retention instruction. At the owner's request, the public draft/review wording was removed. They remain `noindex` while operational details are checked internally. See [legal-review-checklist.md](site-src/legal-review-checklist.md).

The previous intercity site is saved at `drafts/intercity-website-2026-10-11.zip`. Direct APK downloads have been retired. Both localized footers link to the smart download page.

The `main` branch of `dropbus-eg/drop-website` deploys to the VPS through GitHub Actions. The workflow excludes `drafts/`, `site-src/`, and the old `DROP-WEBSITE/` copy from the served directory.

## Smart QR download

The permanent QR destination is https://dropeg.com/download. The build copies site-src/download.template.html to download/index.html. Local JavaScript redirects iOS (including iPad desktop mode) to the App Store and Android to Google Play. Other devices see both store buttons, which also work without JavaScript. Original kit QR images are preserved unchanged in assets/qr/.

Validation: node site-src/build.js; node site-src/check.js; node --test site-src/download.test.js.

Deployment requires owner approval. Do not push to main before approval: that triggers the production workflow. Apply deploy/nginx-dropeg.com.conf and validate/reload Nginx separately; rsync does not apply server configuration. Rsync --delete removes the retired APK. After deployment verify /download and /download/, the retired APK URL, and scan the QR on physical iOS and Android devices.
