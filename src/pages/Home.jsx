import Hero from '../sections/Hero.jsx'
import BigType from '../sections/BigType.jsx'
import ServicesStack from '../sections/ServicesStack.jsx'
import Shortcut from '../sections/Shortcut.jsx'
import Process from '../sections/Process.jsx'
import CTA from '../sections/CTA.jsx'
import { usePageMeta } from '../components/ui.jsx'
import { SITE } from '../config.js'

export default function Home() {
  usePageMeta(`Web, Mobile & AI Agent Development | ${SITE.name}`, 'We build web applications, mobile apps and AI agents that help businesses grow. Book a free consultation today.')
  return (
    <>
      <Hero />
      <BigType />
      <ServicesStack />
      <Shortcut />
      <Process />
      <CTA />
    </>
  )
}
