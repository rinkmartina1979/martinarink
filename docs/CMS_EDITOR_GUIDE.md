# CMS Editor Guide — Martina Rink

Welcome to your website backend. This guide covers everything you need to edit content, SEO, and media without needing a developer.

---

## How to log in

**Backend URL:** `https://martinarink.com/admin`

1. Go to `https://martinarink.com/admin`
2. Click **Log in with Google** or **Email** (whichever you registered with)
3. Use the Sanity account connected to your email address

If you cannot log in, ask your developer to invite you at `sanity.io/manage` under your project's Members section. Your role should be **Editor**.

> The backend is at `/admin` — not `/studio`. This is intentional.

---

## What you can edit

The sidebar organises everything into five sections:

```
Pages
Writing & Articles
Content (testimonials, FAQs, press items, publications, partner logos)
Assessment
Legal Pages
Settings
```

---

## PAGES

Each page in the Pages section is a **singleton** — meaning there is exactly one document per page, and you edit it directly. There is no "Create new" button.

### How to edit a page

1. Click **Pages** in the sidebar
2. Click the page you want (e.g. Homepage)
3. Edit the fields
4. Click **Publish** in the top right

The fields are organised into tabs:
- **Content / Hero** — the main copy
- **SEO** — meta title, description, OG image, noindex

### SEO fields (every page has these)

| Field | What it controls |
|-------|-----------------|
| Meta Title | The title shown in Google results. Max 60 characters. |
| Meta Description | The description shown in Google. Max 160 characters. |
| Open Graph Image | The image shown when shared on social media. 1200 × 630 px. |
| Canonical URL | Leave blank — it is set automatically. |
| Hide from search engines | Toggle on only for private pages (do not use on public pages). |

**Do not leave Meta Title or Meta Description blank on public pages.** Every page should have a unique, accurate description.

### What each page controls

| Page | What you can edit |
|------|------------------|
| **Homepage** | Hero text, CTA labels, about teaser, assessment section copy, newsletter section copy, SEO |
| **About Page** | Hero headline, origin story, Isabella Blow section, books section, sobriety section, why this work, SEO |
| **Sober Muse Method** | Hero, "who this is for", "what this is not", method, privacy note, investment text, CTA, SEO |
| **Empowerment & Leadership** | Same structure as Sober Muse, SEO |
| **Work With Me** | Hero headline, opening copy, CTA, SEO |
| **Assessment Page** | Assessment landing copy, email gate headline, privacy note, SEO |
| **Newsletter Page** | Headline, subheadline, body copy, trust note, SEO |
| **Press Page** | Media bio, press kit URL, contact CTA, SEO |
| **Contact Page** | Headline, press/private/speaking inquiry copy, contact email, SEO |
| **Creative Work Page** | Eyebrow, hero headline/subheadline, intro copy, three gallery sections (People of Deutschland, Isabella Blow, Fashion Germany), closing section, SEO |

---

## WRITING & ARTICLES

Articles are fully editable with SEO control.

### How to publish a new article

1. Click **Writing & Articles** in the sidebar
2. Click **Create new document**
3. Fill in:
   - **Title** — the article headline
   - **Excerpt** — 1–2 sentence summary (shown on the writing index)
   - **Cover image** — always add alt text
   - **Body** — use paragraph, heading, and blockquote styles
   - **URL slug** — auto-generated from title (can be edited)
   - **Published date** — set a future date to schedule
4. In the **SEO & Publishing** tab:
   - Set SEO title (if different from article title)
   - Set SEO description (if different from excerpt)
5. Click **Publish**

The article will appear on `martinarink.com/writing` immediately.

### Image guidelines for articles

- Cover image: minimum 1200 × 630 px
- Alt text is required — describe the image for accessibility
- JPEG or PNG — no GIFs

---

## TESTIMONIALS

Testimonials appear on the homepage (featured ones) and can be filtered by programme on other pages.

### How to add a testimonial

1. Click **Testimonials** in the sidebar
2. Click **Create new document**
3. Fill in:
   - **Client name** — use initials only if NDA requested
   - **Role / description** — e.g. "Founder · London"
   - **Quote** — use their exact words
   - **Programme** — select which programme
   - **Feature on homepage?** — toggle on to show on homepage
   - **NDA — show as anonymous?** — toggle on to show role only, not name
   - **Display order** — lower numbers appear first

### Important: NDA field

If a client asked for anonymity, toggle **NDA** on. Their name will not be shown — only their role (e.g. "Founder · London") will be visible.

---

## FAQs

FAQs are managed as individual documents and filtered by programme.

1. Click **FAQs** in the sidebar
2. Create or edit FAQ items
3. Set the **Programme** to control which page the FAQ appears on
4. Set **Display Order** — lower numbers appear first

> Note: FAQ items in Sanity are for future dynamic rendering. The current site uses hardcoded FAQs as fallback. Ask your developer to connect them when the Sanity project is active.

---

## PUBLICATIONS

Manage books and publications for the Press page.

1. Click **Publications** in the sidebar
2. Edit existing entries or create new ones
3. Toggle **Mark as Bestseller** to show the Spiegel Bestseller badge

---

## PRESS ITEMS

Individual press appearances.

1. Click **Press Items**
2. Create entries for each media appearance
3. Toggle **Feature prominently** to show in the hero press strip
4. Upload the publication logo for visual display

---

## PARTNER LOGOS

Brands and partners shown on the Press page.

1. Click **Partner Logos**
2. Add the logo (SVG or PNG preferred) with alt text
3. Set display order

---

## ASSESSMENT

### Assessment Result Letters

The three archetype letters (Quiet Reckoning, Threshold, The Return) are fully editable.

1. Click **Assessment → Result Letters**
2. Click the archetype to edit
3. Edit:
   - **Opening paragraph** — the first thing she reads (italic pull-quote)
   - **Body paragraphs** — 2–3 paragraphs (max 100 words each)
   - **What This Means / What You May Be Protecting / What Becomes Possible** — optional depth sections
   - **Closing line** — final line before the signature

**Brand rules for result copy:**
- No exclamation marks
- No banned words (unlock, transform, journey, healing, recovery, addict)
- Max 3 sentences per paragraph
- Direct, emotionally precise, intelligent

### Assessment Submissions (Private)

Assessment submissions are stored here automatically when someone completes the assessment. This is a private read-only backup.

**Do not share or export this data.** It contains real email addresses and personal information.

---

## LEGAL PAGES

Privacy policy, imprint, and terms of service are editable here.

1. Click **Legal Pages**
2. Click the page (privacy / imprint / terms)
3. Edit using the rich text editor (headings, paragraphs, bold/italic, links)
4. Update the **Last Updated** date when you make changes
5. Publish

> German law requires the Impressum (imprint) to contain accurate legal information. Do not publish an imprint with placeholder information.

---

## SETTINGS

### Site Settings

Basic site identity — title, description, logo.

### SEO Defaults

Global fallback SEO settings used when a page doesn't have its own SEO fields set.

---

## CREATIVE WORK PAGE — IMAGE GALLERIES

The Creative Work page contains three gallery sections. Each works the same way:

1. Click **Pages → Creative Work Page**
2. Click the relevant tab (People of Deutschland / Isabella Blow / Fashion Germany)
3. Under **Image Gallery**, click **Add item**
4. Upload the image and fill in **Alt text** (required) and **Caption** (optional)
5. Drag items to reorder
6. Publish when done

**Recommended image sizes:**
- People of Deutschland: portrait orientation, 800 × 1066 px (3:4 ratio)
- Isabella Blow: first image 1200 × 675 px (16:9), detail images 800 × 800 px (square)
- Fashion Germany: 800 × 1200 px (2:3 ratio)

**Photo credit field:** Add a single credit line, e.g. `Photography: Thomas Rafalzyk`. This appears as a small caption beneath the gallery.

---

## Replacing images safely

When you replace an image:

1. Use the same aspect ratio as the original — this prevents layout shifts
2. Always add alt text — this is required for accessibility and SEO
3. Recommended sizes:
   - **Hero portrait**: 800 × 1000 px (portrait orientation)
   - **About image**: 800 × 1000 px
   - **Article cover**: 1200 × 630 px
   - **OG image**: 1200 × 630 px

Never upload images wider than 2400 px — it increases page load time unnecessarily.

---

## What not to touch

Do not edit or delete:
- **Assessment Submissions** (private data — only read)
- **URL slugs** on existing published pages or articles (this breaks SEO and links)
- **seoMeta type** in settings (this is a technical object type)
- Any document you did not create

If you are unsure whether an edit is safe, ask your developer first.

---

## Troubleshooting

| Problem | Solution |
|---------|---------|
| I published something but the site hasn't updated | Wait 30 seconds and refresh. If still not updated, ask your developer — a Vercel redeploy may be needed. |
| I can't log in | Ask your developer to re-invite you at sanity.io/manage |
| An image isn't showing | Check that the image has been published (not just saved as draft). Check alt text is filled in. |
| I deleted something by accident | Use the **History** panel in Sanity (clock icon) to restore a previous version. |
| I see "placeholder" content | This means Sanity is not configured in Vercel yet. Contact your developer. |
