import PageHero from './PageHero.jsx'
import CTA from '../sections/CTA.jsx'
import Process from '../sections/Process.jsx'
import { SERVICES } from '../data.js'
import { AgentMock, AppScreen, BrowserMock, PhoneMock } from '../components/mockups.jsx'
import { Btn, Eyebrow, Parallax, Reveal, SplitHeading, usePageMeta } from '../components/ui.jsx'
import { SITE } from '../config.js'

const VISUAL = {
  web: <BrowserMock />,
  mobile: (
    <div className="phones">
      <PhoneMock className="phone--back">
        <AppScreen />
      </PhoneMock>
      <PhoneMock>
        <AppScreen />
      </PhoneMock>
    </div>
  ),
  ai: <AgentMock />,
}

export default function Services() {
  usePageMeta(`Services — Web, Mobile & AI Agents | ${SITE.name}`, 'Custom web apps, iOS & Android apps and AI agents that answer calls and messages, qualify leads and book appointments 24/7.')
  return (
    <>
      <PageHero eyebrow="Services" title={'Build, launch and grow —\nunder one roof.'} text="Web applications, mobile apps and AI agents. Pick one, or let us combine them into something bigger." />

      {SERVICES.map((s, idx) => (
        <section className={`svc svc--${s.theme}`} id={s.id} key={s.id}>
          <div className={`container svc__grid ${idx % 2 ? 'svc__grid--flip' : ''}`}>
            <div className="svc__text">
              <Eyebrow light={s.theme === 'dark'}>
                Service {s.num} · {s.tag}
              </Eyebrow>
              <SplitHeading text={s.title} className={`h2 ${s.theme === 'dark' ? 'h2--light' : ''}`} />
              <Reveal as="p" className="lead">
                {s.intro}
              </Reveal>
              {s.kinds && (
                <div className="svc__kinds">
                  {s.kinds.map(([t, d], i) => (
                    <Reveal className="svc__kind" key={t} delay={i * 0.06}>
                      <b>{t}</b>
                      <p>{d}</p>
                    </Reveal>
                  ))}
                </div>
              )}
              <div className="svc__lists">
                {!s.kinds && (
                  <Reveal>
                    <h4>What we build</h4>
                    <ul>
                      {s.build.map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                  </Reveal>
                )}
                <Reveal delay={0.1}>
                  <h4>{s.kinds ? 'What every agent includes' : 'What you get'}</h4>
                  <ul>
                    {s.get.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                </Reveal>
              </div>
              <Btn to="/contact" variant={s.theme === 'dark' ? 'lime' : 'dark'} arrow>
                {s.cta}
              </Btn>
            </div>
            <Parallax className="svc__visual" speed={60}>
              {VISUAL[s.id]}
            </Parallax>
          </div>
        </section>
      ))}

      <Process />
      <CTA title="Not sure which service you need?" text="Tell us the problem you want to solve. We'll recommend the right mix of web, mobile and AI — and be honest if something isn't worth building." />
    </>
  )
}
