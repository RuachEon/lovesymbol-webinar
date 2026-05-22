# Lovesymbol Family Life Clinic — Webinar Landing

Static HTML site. Deploy directly to GitHub Pages, Vercel, Netlify, or any static host — no build step.

## Structure
- `index.html` — full page
- `css/styles.css` — design system + layout
- `js/main.js` — countdown, scroll reveal, form, WhatsApp redirect
- `images/` — logo, host portrait, hero, supporting visuals, favicon
- `favicon.ico` — site favicon

## Form
Web3Forms integration is wired with the provided access key. On successful submit the user is redirected to the WhatsApp group after a brief animated confirmation.

## Deploy to GitHub Pages
1. Create a new repo, push these files to the root.
2. Settings → Pages → Source = `main` / root.
3. Done.

## Deploy to Vercel
- Drag and drop the folder, or `vercel --prod` from inside it. No framework, "Other" preset.
