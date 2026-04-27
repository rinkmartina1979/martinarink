import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import {
  DocumentTextIcon,
  StarIcon,
  CogIcon,
  EditIcon,
} from '@sanity/icons'
import { schemaTypes } from './sanity/schema'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'placeholder'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

// These types are singletons — only one document exists, no "new" button
const singletonTypes = new Set(['siteSettings'])
const singletonActions = new Set(['publish', 'discardChanges', 'restore'])

export default defineConfig({
  basePath: '/admin',
  name: 'Martina_Rink_Studio',
  title: 'Martina Rink ✦',
  projectId,
  dataset,

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            // ── Singleton: Settings ───────────────────────────
            S.listItem()
              .title('Site Settings')
              .icon(CogIcon)
              .child(
                S.document()
                  .schemaType('siteSettings')
                  .documentId('siteSettings')
                  .title('Site Settings'),
              ),

            S.divider(),

            // ── Writing / Journal ─────────────────────────────
            S.listItem()
              .title('Writing & Journal')
              .icon(EditIcon)
              .child(
                S.documentTypeList('post')
                  .title('Writing & Journal')
                  .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }]),
              ),

            // ── Testimonials ──────────────────────────────────
            S.listItem()
              .title('Testimonials')
              .icon(StarIcon)
              .child(
                S.documentTypeList('testimonial')
                  .title('Testimonials')
                  .defaultOrdering([{ field: 'order', direction: 'asc' }]),
              ),

            // ── All documents (power user) ────────────────────
            S.divider(),
            ...S.documentTypeListItems().filter(
              (item) =>
                item.getId() &&
                !['siteSettings', 'post', 'testimonial'].includes(item.getId()!),
            ),
          ]),
    }),
    visionTool({ defaultApiVersion: '2026-02-01' }),
  ],

  schema: {
    types: schemaTypes,
    // Hide "Create new" for singletons
    templates: (templates) =>
      templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
  },

  document: {
    // For singletons, only allow publish / discard / restore
    actions: (input, context) =>
      singletonTypes.has(context.schemaType)
        ? input.filter(({ action }) => action && singletonActions.has(action))
        : input,
  },
})
