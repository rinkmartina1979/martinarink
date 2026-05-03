import { UserIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  icon: UserIcon,

  groups: [
    { name: 'hero', title: 'Hero', default: true },
    { name: 'story', title: 'Story Sections' },
    { name: 'cta', title: 'CTA' },
    { name: 'seo', title: 'SEO' },
  ],

  fields: [
    defineField({
      name: 'heroHeadline',
      title: 'Hero Headline',
      type: 'string',
      group: 'hero',
    }),
    defineField({
      name: 'heroCopy',
      title: 'Hero Opening Copy',
      type: 'text',
      rows: 3,
      group: 'hero',
      description: 'The introductory paragraph(s). Max 80 words.',
    }),
    defineField({
      name: 'storyOrigin',
      title: 'Origin Story',
      type: 'text',
      rows: 4,
      group: 'story',
      description: 'Persian roots, adoption by German parents, Germany/London background.',
    }),
    defineField({
      name: 'storyIsabellaBlowEra',
      title: 'Isabella Blow Era',
      type: 'text',
      rows: 4,
      group: 'story',
      description: 'Working with Isabella Blow, the fashion world, what she observed.',
    }),
    defineField({
      name: 'storyBooks',
      title: 'Author & Books',
      type: 'text',
      rows: 3,
      group: 'story',
      description: 'The three books — Isabella Blow, People of Deutschland, Fashion Germany.',
    }),
    defineField({
      name: 'storySobriety',
      title: 'Sobriety Turning Point',
      type: 'text',
      rows: 4,
      group: 'story',
      description: 'How and why the re-examination of alcohol began. No recovery clichés.',
    }),
    defineField({
      name: 'storyWhy',
      title: 'Why This Work Now',
      type: 'text',
      rows: 3,
      group: 'story',
      description: 'What led from personal experience to private practice.',
    }),
    defineField({
      name: 'ctaLabel',
      title: 'CTA Button Label',
      type: 'string',
      group: 'cta',
      description: 'e.g. "Begin the assessment"',
    }),
    defineField({
      name: 'ctaUrl',
      title: 'CTA URL',
      type: 'string',
      group: 'cta',
    }),
    defineField({
      name: 'seo',
      title: 'SEO Settings',
      type: 'seoMeta',
      group: 'seo',
    }),
  ],

  preview: {
    prepare() {
      return { title: 'About Page' }
    },
  },
})
