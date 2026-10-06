# Kothakota Sai Swetha: Portfolio

A static, dependency-free portfolio (HTML5, CSS3, vanilla JavaScript), ready for GitHub and Vercel.

> **Content note:** every fact on the site comes from the resume. The resume lists no projects, work experience, certifications, email, phone, LinkedIn or GitHub, so those sections and links are intentionally **not** shown. See "Adding content later" below.

## Structure

```
portfolio/
├── index.html
├── style.css
├── script.js
├── vercel.json
├── README.md
└── assets/
    ├── profile.jpg
    ├── favicon.png
    └── Kothakota_Sai_Swetha_Resume.docx
```

## 1. Run locally

Open `index.html` in a browser, or serve the folder:

```bash
cd portfolio
python3 -m http.server 5500     # then visit http://localhost:5500
# or: npx serve .
```

## 2. Upload to GitHub

```bash
cd portfolio
git init
git add .
git commit -m "Initial portfolio"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```
(Create the empty repository on github.com first.)

## 3. Deploy on Vercel

1. Sign in at https://vercel.com with GitHub.
2. **Add New → Project**, import your repository.
3. Framework Preset: **Other**. Leave Build Command and Output Directory empty. Root Directory is `./`.
4. Click **Deploy**. Every `git push` to `main` redeploys automatically.

Then replace `YOUR-DOMAIN.vercel.app` in `index.html` (canonical and Open Graph tags) with your real URL.

## 4. Custom domain

Vercel project → **Settings → Domains** → add your domain, then add the DNS records Vercel shows at your registrar (an `A` record for the root domain, a `CNAME` for `www`). Update the canonical/OG URLs afterwards.

## 5. Replace the profile photo

Overwrite `assets/profile.jpg` (square, about 700×700 px, under 150 KB). If your face is cropped oddly, adjust `object-position` in `.photo img` in `style.css`.

## 6. Edit content

All text is in `index.html`, section by section (`#about`, `#skills`, `#learning`, `#education`, `#contact`). Colours and fonts are CSS variables at the top of `style.css`.

## 7. Add projects (when you have them)

1. Add `<li><a href="#projects" class="nav__link">Projects</a></li>` to the nav in `index.html`.
2. Add a section after Skills:

```html
<section id="projects" class="section" aria-labelledby="projTitle">
  <div class="container">
    <div class="section__head reveal"><h2 id="projTitle">Projects</h2></div>
    <div class="skills reveal-group">
      <article class="skill skill--wide reveal">
        <h3>Project name</h3>
        <p class="skill__cat">One-line description</p>
        <ul class="chips chips--inline"><li>Python</li><li>SQL</li></ul>
        <a class="btn btn--ghost btn--sm" href="https://github.com/you/repo">GitHub</a>
      </article>
    </div>
  </div>
</section>
```
Experience and certifications can reuse the `.timeline` / `.card` markup from the Education section.

## 8. Update the resume

Replace `assets/Kothakota_Sai_Swetha_Resume.docx` with the new file, keeping the same name (or update the two `href`s in `index.html`). Converting it to PDF (`assets/resume.pdf`) is recommended so it opens in the browser.

## 9. Add email, phone and social links

In `index.html`, in the Contact section, add a card where the comment says so:

```html
<article class="card">
  <h3 class="card__title mono">email</h3>
  <p><a href="mailto:you@example.com">you@example.com</a></p>
</article>
```
Do the same for LinkedIn/GitHub (`https://...` links with `target="_blank" rel="noopener noreferrer"`), and optionally add them to the footer.

## Contact form

The form validates input but **does not send anything** until connected to a service:

- **Formspree:** create a form at formspree.io, then set `data-endpoint="https://formspree.io/f/xxxxxxx"` on `<form id="contactForm">`.
- **Web3Forms:** get an access key at web3forms.com, add `<input type="hidden" name="access_key" value="YOUR_KEY">` inside the form and set `data-endpoint="https://api.web3forms.com/submit"`.

Until `data-endpoint` is set, the form tells the visitor that nothing was sent.

## Accessibility and motion

Semantic HTML, skip link, visible focus states, ARIA on the menu/form, and full `prefers-reduced-motion` support (animations are disabled and content shows immediately).
