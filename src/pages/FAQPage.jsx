import PageHero from './PageHero.jsx'
import FAQ from '../sections/FAQ.jsx'
import CTA from '../sections/CTA.jsx'
import { usePageMeta } from '../components/ui.jsx'
import { SITE } from '../config.js'

export default function FAQPage() {
  usePageMeta(`FAQ | ${SITE.name}`, 'Timelines, pricing, languages, CRM integrations and support — answers to the questions we hear most.')
  return (
    <>
      <PageHero eyebrow="FAQ" title={'Frequently asked\nquestions.'} text="Can't find what you're looking for? Send us a message — we reply within one business day." />
      <FAQ title="Everything you wanted to ask." />
      <CTA title="Still have a question?" text="Talk to a real person on our team. No sales script, just straight answers." />
    </>
  )
}
