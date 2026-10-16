import { useState } from 'react'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { Eyebrow, SplitHeading, ease } from '../components/ui.jsx'

// Edit to match the tools you actually connect to.
const TABS = {
  Messaging: [
    ['WhatsApp Business', 'Agents reply, qualify and follow up in chats.', '#25D366'],
    ['Gmail', 'Personalised replies and follow-up sequences.', '#EA4335'],
    ['Outlook', 'Inbox triage and automatic responses.', '#0A64D8'],
    ['Twilio', 'AI voice calls in and out, worldwide.', '#F22F46'],
    ['Slack', 'Hot leads and alerts sent to your team.', '#4A154B'],
  ],
  'Sales & CRM': [
    ['HubSpot', 'Every conversation logged to the right contact.', '#FF7A59'],
    ['Salesforce', 'Leads created, scored and routed automatically.', '#00A1E0'],
    ['Zoho CRM', 'Deals and follow-ups kept in sync.', '#E42527'],
    ['Pipedrive', 'Pipeline stages updated by your agents.', '#1A1A1A'],
    ['Google Sheets', 'Simple lead lists, imported and updated.', '#0F9D58'],
  ],
  Scheduling: [
    ['Google Calendar', 'Agents check availability and book slots.', '#4285F4'],
    ['Calendly', 'Booking links sent at the right moment.', '#006BFF'],
    ['Outlook Calendar', 'Meetings booked straight into your diary.', '#0A64D8'],
    ['Zoom', 'Video links created with every booking.', '#0B5CFF'],
    ['Google Meet', 'Instant meeting links for demos.', '#00897B'],
  ],
  Commerce: [
    ['Stripe', 'Payments, invoices and subscriptions in your apps.', '#635BFF'],
    ['Shopify', 'Order updates and support on WhatsApp.', '#95BF47'],
    ['WooCommerce', 'Store data your agents can answer from.', '#7F54B3'],
    ['PayPal', 'Checkout built into web and mobile apps.', '#003087'],
    ['Google Maps', 'Locations, delivery and directions in-app.', '#34A853'],
  ],
}

export default function Integrations() {
  const tabs = Object.keys(TABS)
  const [tab, setTab] = useState(tabs[0])
  return (
    <section className="integ container">
      <div className="section-head section-head--center">
        <Eyebrow>Integrations</Eyebrow>
        <SplitHeading text="There's an integration for that." className="h2" />
        <p className="lead">Your apps and agents plug into the tools you already use — so leads, bookings and data flow without manual work.</p>
      </div>

      <LayoutGroup>
        <div className="integ__tabs" role="tablist">
          {tabs.map((t) => (
            <button key={t} role="tab" aria-selected={tab === t} className={tab === t ? 'is-on' : ''} onClick={() => setTab(t)}>
              {tab === t && <motion.span layoutId="integ-pill" className="integ__pill" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
              <span>{t}</span>
            </button>
          ))}
        </div>
      </LayoutGroup>

      <div className="integ__grid">
        <AnimatePresence mode="popLayout" initial={false}>
          {TABS[tab].map(([name, desc, color], i) => (
            <motion.article
              key={tab + name}
              className="spot integ__card"
              layout
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.5, ease, delay: i * 0.05 }}
            >
              <span className="integ__icon" style={{ background: color }}>
                {name
                  .split(' ')
                  .map((w) => w[0])
                  .join('')
                  .slice(0, 2)}
              </span>
              <b>{name}</b>
              <p>{desc}</p>
              <span className="integ__link">Connect ↗</span>
            </motion.article>
          ))}
          <motion.article key={tab + 'more'} className="integ__card integ__card--more" layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
            <span className="integ__plus">+</span>
            <b>Plus anything with an API</b>
            <p>If your tool can talk to other software, we can connect it.</p>
          </motion.article>
        </AnimatePresence>
      </div>
    </section>
  )
}
