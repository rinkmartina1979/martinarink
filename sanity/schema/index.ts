import { type SchemaTypeDefinition } from 'sanity'
import siteSettings from './siteSettings'
import post from './post'
import testimonial from './testimonial'
import assessmentResult from './assessmentResult'

export const schemaTypes: SchemaTypeDefinition[] = [
  // Singletons
  siteSettings,
  // Documents
  post,
  testimonial,
  assessmentResult,
]
