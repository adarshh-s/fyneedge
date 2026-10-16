import PageHero from './PageHero.jsx'
import OmniPhone from '../sections/OmniPhone.jsx'
import CTA from '../sections/CTA.jsx'
import Clouds from '../components/Clouds.jsx'
import { OmniMock, SeoMock, SocialMock } from '../components/mockups.jsx'
import { Btn, Eyebrow, Parallax, Reveal, SplitHeading, usePageMeta } from '../components/ui.jsx'
import { SITE } from '../config.js'

const OMNI_WHY = [
  ['Every lead contacted', 'No lead left waiting or forgotten in a spreadsheet.'],
  ['The right channel', "Reach people where they're most likely to respond."],
  ['Follow-ups on autopilot', 'Consistent, timely follow-up without manual chasing.'],
  ['More time for selling', 'Your team speaks to interested leads, not cold lists.'],
]

const SOCIAL = [
  ['Plan', 'Content ideas and calendars matched to your brand'],
  ['Create', 'Captions, posts and hashtags written in your voice'],
  ['Schedule', 'Posts published at the right time, automatically'],
  ['Engage', 'Help replying to comments and messages'],
  ['Report', "Simple insights on what's working"],
  ['Business or personal', 'For brands, founders and creators'],
]

export default function Products() {
  usePageMeta(`Products — OmniReach AI, SEO Agent & Social Media AI | ${SITE.name}`, 'Ready-made AI products: multi-channel lead outreach, search visibility across Google and AI assistants, and social media on autopilot.')
  return (
    <>
      <PageHero eyebrow="Products" title={'AI products, ready to\nplug into your business.'} text="Ready-made tools we build and use every day. Switch them on, connect your channels, and let them work." />

      <section className="prod container" id="omnireach">
        <div className="prod__card prod__card--sky">
          <Clouds seed={2} className="prod__clouds" />
          <div className="prod__text">
            <Eyebrow light>Product 01 · Flagship</Eyebrow>
            <h2 className="h2 h2--light">OmniReach AI</h2>
            <p className="prod__sub">Reach every lead. On every channel. Automatically.</p>
            <p className="lead lead--light">
              OmniReach AI reaches out to your leads on WhatsApp, email and AI voice calls — from one platform. It starts the conversation, follows up on time, and passes warm, interested leads to your sales team.
            </p>
            <div className="hero__ctas hero__ctas--left">
              <Btn to="/contact" variant="lime" arrow>
                Book an OmniReach AI demo
              </Btn>
              <Btn to="/contact" variant="glass">
                Talk to sales
              </Btn>
            </div>
          </div>
          <Parallax className="prod__mock" speed={40}>
            <OmniMock />
          </Parallax>
        </div>
        <div className="prod__why">
          {OMNI_WHY.map(([t, d], i) => (
            <Reveal className="prod__whyitem" key={t} delay={i * 0.08}>
              <span>0{i + 1}</span>
              <b>{t}</b>
              <p>{d}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <OmniPhone />

      <section className="prod container" id="seo">
        <div className="prod__card prod__card--white">
          <div className="prod__text">
            <Eyebrow>Product 02 · Search visibility</Eyebrow>
            <SplitHeading text="SEO · AEO · GEO Agent" className="h2" />
            <p className="prod__sub prod__sub--dark">Be found on Google, in answers and inside AI.</p>
            <p className="lead">
              People don't just search on Google anymore — they ask voice assistants and AI tools like ChatGPT, Gemini and Perplexity. Our always-on agent keeps your business visible across all three.
            </p>
            <div className="tri">
              {[
                ['SEO', 'Search engines', 'Technical fixes, keyword research and fresh content so you rank higher on Google.'],
                ['AEO', 'Answer engines', 'Clear, answer-ready content built to win featured snippets and voice-search answers.'],
                ['GEO', 'Generative engines', 'Consistent, trusted information about your business so AI assistants mention and cite you.'],
              ].map(([k, t, d], i) => (
                <Reveal className="tri__item" key={k} delay={i * 0.08}>
                  <span>{k}</span>
                  <b>{t}</b>
                  <p>{d}</p>
                </Reveal>
              ))}
            </div>
            <Btn to="/contact" variant="dark" arrow>
              Get a free visibility check
            </Btn>
          </div>
          <Parallax className="prod__mock" speed={40}>
            <SeoMock />
          </Parallax>
        </div>
      </section>

      <section className="prod container" id="social">
        <div className="prod__card prod__card--dark">
          <div className="prod__text">
            <Eyebrow light>Product 03 · Social media</Eyebrow>
            <SplitHeading text="Social Media AI" className="h2 h2--light" />
            <p className="prod__sub">Your social media, handled.</p>
            <p className="lead lead--light">AI tools that manage business and personal social media accounts — from ideas to published posts — so you stay active and consistent without spending hours every day.</p>
            <div className="feat">
              {SOCIAL.map(([t, d], i) => (
                <Reveal className="feat__item" key={t} delay={i * 0.05}>
                  <b>{t}</b>
                  <p>{d}</p>
                </Reveal>
              ))}
            </div>
            <Btn to="/contact" variant="lime" arrow>
              Try Social Media AI
            </Btn>
          </div>
          <Parallax className="prod__mock" speed={40}>
            <SocialMock />
          </Parallax>
        </div>
      </section>

      <CTA title="Want to see it with your own leads?" text="Book a short demo and we'll show you the product working on a scenario from your business." />
    </>
  )
}
