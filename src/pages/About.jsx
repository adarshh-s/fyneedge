import PageHero from './PageHero.jsx'
import CTA from '../sections/CTA.jsx'
import { Eyebrow, Reveal, ScrollText, SplitHeading, usePageMeta } from '../components/ui.jsx'
import { SITE } from '../config.js'

const VALUES = [
  ['Build what matters', 'Outcomes over features.'],
  ['Keep it simple', 'Clear work, clear communication, no jargon.'],
  ['Honest by default', 'Realistic timelines and transparent pricing.'],
  ['Always improving', 'We ship often and keep making things better.'],
]

export default function About() {
  usePageMeta(`About Us | ${SITE.name}`, 'Meet the team building web apps, mobile apps and AI agents for growing businesses.')
  return (
    <>
      <PageHero eyebrow="About us" title={'We turn ideas into software —\nand software into *growth*.'} />

      <section className="about container">
        <ScrollText className="about__lead" text={`${SITE.name} builds web applications, mobile apps and AI agents for growing businesses — solid engineering and practical AI, under one roof.`} />
        <ScrollText className="about__body" text="One team takes your project from first idea to launch, then stays to keep improving it. No hand-offs between agencies, no guesswork about who owns what." />
      </section>

      <section className="mv container">
        <Reveal tilt className="mv__card mv__card--lime">
          <Eyebrow>Our mission</Eyebrow>
          <p>Make powerful technology simple and useful for every business.</p>
        </Reveal>
        <Reveal tilt className="mv__card mv__card--dark" delay={0.1}>
          <Eyebrow light>Our vision</Eyebrow>
          <p>Every business with an AI team working beside its people.</p>
        </Reveal>
      </section>

      <section className="values container">
        <div className="section-head">
          <Eyebrow>Our values</Eyebrow>
          <SplitHeading text="How we work, every *day*." className="h2" />
        </div>
        <div className="values__grid">
          {VALUES.map(([t, d], i) => (
            <Reveal tilt className="spot values__item" key={t} delay={i * 0.08}>
              <span>0{i + 1}</span>
              <h3>{t}</h3>
              <p>{d}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <CTA />
    </>
  )
}
