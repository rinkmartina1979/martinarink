import { defineConfig } from 'sanity'
import { structureTool, type StructureBuilder } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import {
  DocumentTextIcon,
  StarIcon,
  CogIcon,
  EditIcon,
  HomeIcon,
  UserIcon,
  BookIcon,
  SearchIcon,
} from '@sanity/icons'
import { schemaTypes } from './sanity/schema'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'placeholder'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

// All singleton document types — only one document each, no "Create" button
const SINGLETON_TYPES = new Set([
  'siteSettings',
  'seoDefaults',
  'homePage',
  'aboutPage',
  'soberMusePage',
  'empowermentPage',
  'workWithMePage',
  'newsletterPage',
  'pressPage',
  'contactPage',
  'assessmentPage',
  'creativeWorkPage',
])

const SINGLETON_ACTIONS = new Set(['publish', 'discardChanges', 'restore'])

// All types that appear explicitly in the structure (exclude from the auto-generated fallback)
const EXPLICIT_TYPES = new Set([
  ...SINGLETON_TYPES,
  'post',
  'testimonial',
  'faqItem',
  'pressItem',
  'publication',
  'partnerLogo',
  'assessmentResult',
  'assessmentSubmission',
  'legalPage',
  'creativeWorkPage',
  // seoMeta is an object type, not a document — it won't appear anyway
])

function singleton(S: StructureBuilder, type: string, title: string, icon?: typeof CogIcon) {
  const item = S.listItem().title(title).schemaType(type)
  if (icon) item.icon(icon)
  return item.child(
    S.document().schemaType(type).documentId(type).title(title),
  )
}

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
          .title('Martina Rink')
          .items([

            // ── PAGES ─────────────────────────────────────────
            S.listItem()
              .title('Pages')
              .child(
                S.list()
                  .title('Pages')
                  .items([
                    singleton(S, 'homePage', 'Homepage', HomeIcon),
                    singleton(S, 'aboutPage', 'About Page', UserIcon),
                    singleton(S, 'soberMusePage', 'Sober Muse Method'),
                    singleton(S, 'empowermentPage', 'Empowerment & Leadership'),
                    singleton(S, 'workWithMePage', 'Work With Me'),
                    singleton(S, 'assessmentPage', 'Assessment Page'),
                    singleton(S, 'newsletterPage', 'Newsletter Page'),
                    singleton(S, 'pressPage', 'Press Page'),
                    singleton(S, 'contactPage', 'Contact Page'),
                    singleton(S, 'creativeWorkPage', 'Creative Work Page'),
                  ]),
              ),

            S.divider(),

            // ── CONTENT ───────────────────────────────────────
            S.listItem()
              .title('Writing & Articles')
              .icon(EditIcon)
              .child(
                S.documentTypeList('post')
                  .title('Writing & Articles')
                  .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }]),
              ),

            S.listItem()
              .title('Testimonials')
              .icon(StarIcon)
              .child(
                S.documentTypeList('testimonial')
                  .title('Testimonials')
                  .defaultOrdering([{ field: 'order', direction: 'asc' }]),
              ),

            S.listItem()
              .title('FAQs')
              .child(
                S.documentTypeList('faqItem')
                  .title('FAQs')
                  .defaultOrdering([{ field: 'order', direction: 'asc' }]),
              ),

            S.listItem()
              .title('Publications')
              .icon(BookIcon)
              .child(
                S.documentTypeList('publication')
                  .title('Publications')
                  .defaultOrdering([{ field: 'order', direction: 'asc' }]),
              ),

            S.listItem()
              .title('Press Items')
              .child(
                S.documentTypeList('pressItem')
                  .title('Press Items')
                  .defaultOrdering([{ field: 'order', direction: 'asc' }]),
              ),

            S.listItem()
              .title('Partner Logos')
              .child(
                S.documentTypeList('partnerLogo')
                  .title('Partner Logos')
                  .defaultOrdering([{ field: 'order', direction: 'asc' }]),
              ),

            S.divider(),

            // ── ASSESSMENT ────────────────────────────────────
            S.listItem()
              .title('Assessment')
              .child(
                S.list()
                  .title('Assessment')
                  .items([
                    S.listItem()
                      .title('Result Letters')
                      .child(
                        S.documentTypeList('assessmentResult')
                          .title('Result Letters'),
                      ),
                    S.listItem()
                      .title('Submissions (Private)')
                      .child(
                        S.documentTypeList('assessmentSubmission')
                          .title('Submissions'),
                      ),
                  ]),
              ),

            S.divider(),

            // ── LEGAL ─────────────────────────────────────────
            S.listItem()
              .title('Legal Pages')
              .icon(DocumentTextIcon)
              .child(
                S.documentTypeList('legalPage')
                  .title('Legal Pages')
                  .defaultOrdering([{ field: 'title', direction: 'asc' }]),
              ),

            S.divider(),

            // ── SETTINGS ──────────────────────────────────────
            S.listItem()
              .title('Settings')
              .icon(CogIcon)
              .child(
                S.list()
                  .title('Settings')
                  .items([
                    singleton(S, 'siteSettings', 'Site Settings', CogIcon),
                    singleton(S, 'seoDefaults', 'SEO Defaults', SearchIcon),
                  ]),
              ),
          ]),
    }),
    visionTool({ defaultApiVersion: '2026-02-01' }),
  ],

  schema: {
    types: schemaTypes,
    // Hide "Create new" button for all singletons
    templates: (templates) =>
      templates.filter(({ schemaType }) => !SINGLETON_TYPES.has(schemaType)),
  },

  document: {
    // For singletons, only allow publish / discard / restore
    actions: (input, context) =>
      SINGLETON_TYPES.has(context.schemaType)
        ? input.filter(({ action }) => action && SINGLETON_ACTIONS.has(action))
        : input,
  },
})
