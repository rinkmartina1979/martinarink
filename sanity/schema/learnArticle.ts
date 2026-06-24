/**
 * learnArticle — clinical education content for the portal.
 *
 * Private to authenticated clients. Authored by Ruta Nürnberger.
 * Content is read-only in the portal; Martina manages it in Studio.
 *
 * Each document is one thematic block (physiological / hormonal / etc.)
 * with bilingual body text (DE + EN). sortOrder controls display sequence.
 */

import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'learnArticle',
  title: 'Learn Article',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title (English)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'titleDe',
      title: 'Title (German)',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 80 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Physiological', value: 'physiological' },
          { title: 'Hormonal', value: 'hormonal' },
          { title: 'Tolerance & Dependence', value: 'tolerance' },
          { title: 'Withdrawal', value: 'withdrawal' },
          { title: 'Social & Psychological', value: 'social' },
          { title: 'Long-term Health', value: 'long-term' },
          { title: 'Summary', value: 'summary' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'bodyEn',
      title: 'Body (English)',
      type: 'text',
      rows: 8,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'bodyDe',
      title: 'Body (German)',
      type: 'text',
      rows: 8,
    }),
    defineField({
      name: 'attribution',
      title: 'Attribution',
      type: 'string',
      initialValue: 'Ruta Nürnberger',
      description: 'Defaults to "Ruta Nürnberger" — the clinical partner who authored this content.',
    }),
    defineField({
      name: 'programme',
      title: 'Programme',
      type: 'string',
      options: {
        list: [
          { title: 'Sober Muse', value: 'sober-muse' },
          { title: 'Empowerment', value: 'empowerment' },
          { title: 'Both', value: 'both' },
        ],
        layout: 'radio',
      },
      initialValue: 'sober-muse',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sort order',
      type: 'number',
      initialValue: 0,
      description: 'Lower numbers appear first. Use 10, 20, 30… to leave room for insertions.',
    }),
  ],
  orderings: [
    {
      title: 'Display order',
      name: 'sortOrderAsc',
      by: [{ field: 'sortOrder', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      category: 'category',
      programme: 'programme',
    },
    prepare({ title, category, programme }) {
      return {
        title: title ?? 'Untitled',
        subtitle: `${category ?? '—'} · ${programme ?? '—'}`,
      }
    },
  },
})
