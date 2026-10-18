import Hero from '../sections/Hero.jsx'
import BigType from '../sections/BigType.jsx'
import Capabilities from '../sections/Capabilities.jsx'
import Statement from '../sections/Statement.jsx'
import ServicesStack from '../sections/ServicesStack.jsx'
import ProductsScroll from '../sections/ProductsScroll.jsx'
import Shortcut from '../sections/Shortcut.jsx'
import Integrations from '../sections/Integrations.jsx'
import Process from '../sections/Process.jsx'
import WhyUs from '../sections/WhyUs.jsx'
import Industries from '../sections/Industries.jsx'
import FAQ from '../sections/FAQ.jsx'
import CTA from '../sections/CTA.jsx'
import { usePageMeta } from '../components/ui.jsx'
import { SITE } from '../config.js'

export default function Home() {
  usePageMeta(`Web, Mobile & AI Agent Development | ${SITE.name}`, 'We build web applications, mobile apps and AI agents that help businesses grow. Book a free consultation today.')
  return (
    <>
      <Hero />
      <BigType />
      <Capabilities />
      <Statement />
      <Shortcut />
      <ServicesStack />
      <ProductsScroll />
      <Integrations />
      <Process />
      <WhyUs />
      <Industries />
      <FAQ />
      <CTA />
    </>
  )
}
