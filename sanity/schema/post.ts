import { DocumentTextIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'post',
  title: 'Writing & Journal',
  type: 'document',
  icon: DocumentTextIcon,

  // Preview in studio list
  preview: {
    select: {
      title: 'title',
      subtitle: 'publishedAt',
      media: 'coverImage',
    },
    prepare({ title, subtitle }) {
      return {
        title: title || 'Untitled post',
        subtitle: subtitle
          ? new Date(subtitle).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })
          : 'No date set',
      }
    },
  },

  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'seo', title: 'SEO & Publishing' },
  ],

  fields: [
    // ── Content ──────────────────────────────────────────────
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      description: 'The essay or article title.',
      validation: (Rule) => Rule.required().min(10).max(120),
    }),

    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      group: 'content',
      description:
        'A short summary shown on the Writing index page (1–2 sentences).',
      validation: (Rule) => Rule.max(280),
    }),

    defineField({
      name: 'coverImage',
      title: 'Cover image',
      type: 'image',
      group: 'content',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          description: 'Describe the image for screen readers.',
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),

    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      group: 'content',
      description: 'Write the full essay here. Use the toolbar for headings and emphasis.',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Paragraph', value: 'normal' },
            { title: 'Heading', value: 'h2' },
            { title: 'Sub-heading', value: 'h3' },
            { title: 'Quote', value: 'blockquote' },
          ],
          marks: {
            decorators: [
              { title: 'Bold', value: 'strong' },
              { title: 'Italic', value: 'em' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                    title: 'URL',
                    validation: (Rule) =>
                      Rule.uri({ scheme: ['http', 'https', 'mailto'] }),
                  },
                ],
              },
            ],
          },
        },
      ],
    }),

    // ── SEO & Publishing ──────────────────────────────────────
    defineField({
      name: 'slug',
      title: 'URL slug',
      type: 'slug',
      group: 'seo',
      description: 'The URL of the article (auto-generated from title).',
      options: {
        source: 'title',
        maxLength: 80,
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'publishedAt',
      title: 'Published date',
      type: 'datetime',
      group: 'seo',
      description: 'Set a future date to schedule the article.',
      initialValue: () => new Date().toISOString(),
    }),

    defineField({
      name: 'seoTitle',
      title: 'SEO title',
      type: 'string',
      group: 'seo',
      description: 'If blank, the article title is used. Max 60 characters.',
      validation: (Rule) => Rule.max(60),
    }),

    defineField({
      name: 'seoDescription',
      title: 'SEO description',
      type: 'text',
      rows: 2,
      group: 'seo',
      description: 'If blank, the excerpt is used. Max 160 characters.',
      validation: (Rule) => Rule.max(160),
    }),
  ],
})
