import { type SchemaTypeDefinition } from 'sanity'

// Objects
import seoMeta from './objects/seoMeta'

// Singletons
import siteSettings from './siteSettings'
import seoDefaults from './seoDefaults'
import homePage from './homePage'
import aboutPage from './aboutPage'
import soberMusePage from './soberMusePage'
import empowermentPage from './empowermentPage'
import workWithMePage from './workWithMePage'
import newsletterPage from './newsletterPage'
import pressPage from './pressPage'
import contactPage from './contactPage'
import assessmentPage from './assessmentPage'

// Documents — Content
import post from './post'
import testimonial from './testimonial'
import faqItem from './faqItem'
import pressItem from './pressItem'
import publication from './publication'
import partnerLogo from './partnerLogo'

// Documents — Assessment
import assessmentResult from './assessmentResult'
import assessmentSubmission from './assessmentSubmission'

// Documents — Legal
import legalPage from './legalPage'

// Singletons — Creative
import creativeWorkPage from './creativeWorkPage'

// Documents — Phase 2: Members & Clients
import clientProfile from './clientProfile'
import audioDrop from './audioDrop'
import clientMilestone from './clientMilestone'
import caseStudy from './caseStudy'
import emailDigestLog from './emailDigestLog'

export const schemaTypes: SchemaTypeDefinition[] = [
  // Objects (must come before document types that reference them)
  seoMeta,

  // Singletons
  siteSettings,
  seoDefaults,
  homePage,
  aboutPage,
  soberMusePage,
  empowermentPage,
  workWithMePage,
  newsletterPage,
  pressPage,
  contactPage,
  assessmentPage,
  creativeWorkPage,

  // Documents — Content
  post,
  testimonial,
  faqItem,
  pressItem,
  publication,
  partnerLogo,

  // Documents — Assessment
  assessmentResult,
  assessmentSubmission,

  // Documents — Legal
  legalPage,

  // Documents — Phase 2: Members & Clients
  clientProfile,
  audioDrop,
  clientMilestone,
  caseStudy,
  emailDigestLog,
]
