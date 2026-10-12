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

The Contact page submits enquiries through FormSubmit to `support@dropeg.com`; it does not book a demo automatically. The destination mailbox was activated and a test enquiry was delivered. Changing the destination requires a new email confirmation. The Privacy and Terms pages now contain short summaries based on the supplied school agreement template. They remain draft and `noindex` pending owner review because the template is unsigned and has incomplete details. See [legal-review-checklist.md](site-src/legal-review-checklist.md).

The previous intercity site is saved at `drafts/intercity-website-2026-10-11.zip`. The supplied Android APK is available at `assets/downloads/DROP-Schools-1.0.6.apk` and linked from the footer on every page as a direct download. The link makes no claim about which school roles the app supports.

The `main` branch of `dropbus-eg/drop-website` deploys to the VPS through GitHub Actions. The workflow excludes `drafts/`, `site-src/`, and the old `DROP-WEBSITE/` copy from the served directory.
