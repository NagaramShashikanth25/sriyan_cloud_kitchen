# Sriyan Cloud Kitchen — website

A static, no-build website: `index.html`, `style.css`, `script.js`. No framework,
no server, no database — everything runs in the browser, so it deploys as-is.

## Before you deploy — edit these placeholders

**In `script.js`, top of the file (`CONFIG` object):**
- `whatsappNumber` — your real WhatsApp number, country code first, digits only (e.g. `919876543210`)
- `cateringEmail` — the inbox catering enquiries should land in

**In `index.html`:**
- Phone number in the "Call to order" button and the "Find us" section (`tel:` links)
- Email in the "Find us" section
- Instagram / Zomato / Swiggy links in the social row (currently `#` placeholders)
- Delivery area, hours, and address text if they differ from what's drafted

**In `script.js`, the `MENU` array:**
- Add, remove or reprice dishes freely — the menu grid and filter tabs regenerate
  from this list automatically, so you only edit it in one place.

## What already works, no setup needed

- Menu filtering by category
- Add-to-order with quantity steppers, on both the hero "today's special" and every menu item
- A running order total in a floating bar, saved in the browser so it survives a page reload
- "Send order on WhatsApp" — opens WhatsApp with an itemised message pre-filled
- Catering enquiry form with validation, handed off to the visitor's email app via `mailto:`
- Mobile menu, sticky header, keyboard-accessible focus states

If you'd rather have the catering form submit without opening an email app, wire it to a
form backend like Formspree or Web3Forms (both have a free tier and just need the form's
`action` URL swapped in) — ask your developer/Claude to do this if you want it.

## Deploy to Vercel

**Option A — from GitHub (recommended):**
1. Create a new GitHub repository and push these files to it:
   ```
   git init
   git add .
   git commit -m "Sriyan Cloud Kitchen site"
   git branch -M main
   git remote add origin <your-repo-url>
   git push -u origin main
   ```
2. Go to https://vercel.com/new, import that repository.
3. Framework preset: **Other** (it's static — no build command or output directory needed).
4. Click **Deploy**.

**Option B — Vercel CLI, no GitHub needed:**
```
npm install -g vercel
cd sriyan-cloud-kitchen
vercel
```
Follow the prompts (link or create a project, keep default settings) and it will give you
a live URL immediately. Run `vercel --prod` to push it to your production domain.

## Local preview before deploying

Any static server works, e.g.:
```
npx serve .
```
Then open the printed local URL in your browser.
