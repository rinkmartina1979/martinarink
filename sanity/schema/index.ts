import { type SchemaTypeDefinition } from 'sanity'
import siteSettings from './siteSettings'
import post from './post'
import testimonial from './testimonial'
import assessmentResult from './assessmentResult'
import assessmentSubmission from './assessmentSubmission'
import assessmentPage from './assessmentPage'

export const schemaTypes: SchemaTypeDefinition[] = [
  // Singletons
  siteSettings,
  assessmentPage,
  // Documents
  post,
  testimonial,
  assessmentResult,
  // Private / internal (server-write only — do not expose in public queries)
  assessmentSubmission,
]
