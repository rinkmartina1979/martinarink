import { defineField, defineType } from 'sanity'

// Reusable image gallery field builder
function imageGalleryField(name: string, title: string) {
  return defineField({
    name,
    title,
    type: 'array',
    of: [
      {
        type: 'image',
        options: { hotspot: true },
        fields: [
          defineField({ name: 'alt', title: 'Alt text (required)', type: 'string', validation: (R) => R.required() }),
          defineField({ name: 'caption', title: 'Caption (optional)', type: 'string' }),
        ],
      },
    ],
    options: { layout: 'grid' },
  })
}

export default defineType({
  name: 'creativeWorkPage',
  title: 'Creative Work Page',
  type: 'document',

  groups: [
    { name: 'hero', title: 'Hero & Intro', default: true },
    { name: 'peopleOfDeutschland', title: 'People of Deutschland' },
    { name: 'isabellaBlow', title: 'Isabella Blow' },
    { name: 'fashionGermany', title: 'Fashion Germany' },
    { name: 'closing', title: 'Closing & CTAs' },
    { name: 'seo', title: 'SEO' },
  ],

  fields: [
    // ── Hero & Intro ──────────────────────────────────────────────
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow Label',
      type: 'string',
      group: 'hero',
      description: 'Small label above the headline. e.g. "CREATIVE WORK"',
    }),
    defineField({
      name: 'heroHeadline',
      title: 'Hero Headline',
      type: 'string',
      group: 'hero',
      validation: (R) => R.max(100),
    }),
    defineField({
      name: 'heroSubheadline',
      title: 'Hero Subheadline',
      type: 'string',
      group: 'hero',
    }),
    defineField({
      name: 'introCopy',
      title: 'Intro Copy',
      type: 'text',
      rows: 6,
      group: 'hero',
      description: 'Opening paragraphs. Use blank lines to separate paragraphs.',
    }),

    // ── People of Deutschland ─────────────────────────────────────
    defineField({
      name: 'peopleOfDeutschland',
      title: 'People of Deutschland',
      type: 'object',
      group: 'peopleOfDeutschland',
      fields: [
        defineField({ name: 'heading', title: 'Section Heading', type: 'string' }),
        defineField({ name: 'body', title: 'Body Copy', type: 'text', rows: 5 }),
        imageGalleryField('imageGallery', 'Image Gallery'),
        defineField({ name: 'photoCredit', title: 'Photo Credit', type: 'string', description: 'e.g. "Photography: Thomas Rafalzyk"' }),
      ],
    }),

    // ── Isabella Blow ─────────────────────────────────────────────
    defineField({
      name: 'isabellaBlow',
      title: 'Isabella Blow',
      type: 'object',
      group: 'isabellaBlow',
      fields: [
        defineField({ name: 'heading', title: 'Section Heading', type: 'string' }),
        defineField({ name: 'body', title: 'Body Copy', type: 'text', rows: 5 }),
        imageGalleryField('imageGallery', 'Image Gallery'),
        defineField({ name: 'quote', title: 'Pull Quote', type: 'text', rows: 2 }),
        defineField({ name: 'quoteSource', title: 'Quote Source', type: 'string', description: 'e.g. "Evening Standard"' }),
        defineField({ name: 'photoCredit', title: 'Photo Credit', type: 'string' }),
      ],
    }),

    // ── Fashion Germany ───────────────────────────────────────────
    defineField({
      name: 'fashionGermany',
      title: 'Fashion Germany',
      type: 'object',
      group: 'fashionGermany',
      fields: [
        defineField({ name: 'heading', title: 'Section Heading', type: 'string' }),
        defineField({ name: 'body', title: 'Body Copy', type: 'text', rows: 5 }),
        imageGalleryField('imageGallery', 'Image Gallery'),
        defineField({ name: 'quote', title: 'Pull Quote', type: 'text', rows: 2 }),
        defineField({ name: 'quoteSource', title: 'Quote Source', type: 'string' }),
        defineField({ name: 'photoCredit', title: 'Photo Credit', type: 'string' }),
      ],
    }),

    // ── Closing ──────────────────────────────────────────────────
    defineField({
      name: 'closingSection',
      title: 'Closing Section',
      type: 'object',
      group: 'closing',
      fields: [
        defineField({ name: 'heading', title: 'Heading', type: 'string' }),
        defineField({ name: 'body', title: 'Body Copy', type: 'text', rows: 4 }),
        defineField({ name: 'primaryCtaLabel', title: 'Primary CTA Label', type: 'string' }),
        defineField({ name: 'primaryCtaUrl', title: 'Primary CTA URL', type: 'string' }),
        defineField({ name: 'secondaryCtaLabel', title: 'Secondary CTA Label', type: 'string' }),
        defineField({ name: 'secondaryCtaUrl', title: 'Secondary CTA URL', type: 'string' }),
      ],
    }),

    // ── SEO ───────────────────────────────────────────────────────
    defineField({
      name: 'seo',
      title: 'SEO Settings',
      type: 'seoMeta',
      group: 'seo',
    }),
  ],

  preview: {
    prepare() {
      return { title: 'Creative Work Page' }
    },
  },
})
