import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import PageHero from './PageHero.jsx'
import { Btn, Reveal, ease, usePageMeta } from '../components/ui.jsx'
import { SITE } from '../config.js'

const INTERESTS = ['Web app', 'Mobile app', 'AI agent', 'OmniReach AI', 'SEO/AEO/GEO Agent', 'Social Media AI', 'Other']

export default function Contact() {
  usePageMeta(`Contact Us | ${SITE.name}`, 'Tell us about your project — we reply within one business day.')
  const [picked, setPicked] = useState([])
  const [sent, setSent] = useState(false)

  const toggle = (t) => setPicked((p) => (p.includes(t) ? p.filter((x) => x !== t) : [...p, t]))

  const submit = (e) => {
    e.preventDefault()
    // TODO: connect to your form backend (Formspree, email API, CRM webhook…)
    const data = Object.fromEntries(new FormData(e.currentTarget))
    console.log('Contact form', { ...data, interests: picked })
    setSent(true)
  }

  return (
    <>
      <PageHero eyebrow="Contact" title={"Let's talk about\nyour project."} text="Tell us a little about what you need. We'll get back to you within one business day." />
      <section className="contact container">
        <Reveal className="contact__form">
          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div key="ok" className="contact__ok" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, ease }}>
                <span className="contact__check">✓</span>
                <h3>Thanks!</h3>
                <p>We've received your message and will be in touch within one business day.</p>
                <Btn variant="ghost" onClick={() => setSent(false)}>
                  Send another
                </Btn>
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={submit} exit={{ opacity: 0, y: -10 }}>
                <div className="field-row">
                  <label className="field">
                    <span>Full name</span>
                    <input name="name" required autoComplete="name" />
                  </label>
                  <label className="field">
                    <span>Company</span>
                    <input name="company" autoComplete="organization" />
                  </label>
                </div>
                <div className="field-row">
                  <label className="field">
                    <span>Email</span>
                    <input name="email" type="email" required autoComplete="email" />
                  </label>
                  <label className="field">
                    <span>Phone / WhatsApp</span>
                    <input name="phone" type="tel" autoComplete="tel" />
                  </label>
                </div>
                <fieldset className="field">
                  <span>I'm interested in</span>
                  <div className="chips chips--pick">
                    {INTERESTS.map((t) => (
                      <button type="button" key={t} className={picked.includes(t) ? 'on' : ''} onClick={() => toggle(t)}>
                        {t}
                      </button>
                    ))}
                  </div>
                </fieldset>
                <label className="field">
                  <span>Tell us about your project</span>
                  <textarea name="message" rows={5} required />
                </label>
                <Btn variant="dark" type="submit" arrow>
                  Send message
                </Btn>
              </motion.form>
            )}
          </AnimatePresence>
        </Reveal>

        <Reveal className="contact__details" delay={0.1}>
          <h3>Contact details</h3>
          <dl>
            <dt>Email</dt>
            <dd>
              <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
            </dd>
            <dt>Phone / WhatsApp</dt>
            <dd>{SITE.phone}</dd>
            <dt>Office</dt>
            <dd>{SITE.office}</dd>
            <dt>Hours</dt>
            <dd>{SITE.hours}</dd>
          </dl>
          <Btn href={SITE.whatsapp} variant="lime" arrow>
            Chat on WhatsApp
          </Btn>
        </Reveal>
      </section>
    </>
  )
}
