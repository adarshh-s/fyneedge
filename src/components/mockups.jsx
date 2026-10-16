import { motion } from 'framer-motion'

/* ---------- tiny building blocks ---------- */

export function Wave({ bars = 28, className = '' }) {
  return (
    <div className={`wave ${className}`}>
      {Array.from({ length: bars }).map((_, i) => (
        <span key={i} style={{ animationDelay: `${(i % 7) * -0.13}s`, height: `${30 + ((i * 37) % 70)}%` }} />
      ))}
    </div>
  )
}

export function LineChart({ stroke = '#2b7bff', fill = 'rgba(43,123,255,.15)' }) {
  const d = 'M0 70 C 20 60, 30 66, 45 52 S 70 40, 85 44 S 110 20, 130 26 S 160 8, 180 4'
  return (
    <svg viewBox="0 0 180 80" className="linechart" preserveAspectRatio="none">
      <path d={`${d} L180 80 L0 80 Z`} fill={fill} />
      <path d={d} fill="none" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" className="draw" />
    </svg>
  )
}

const Check = () => (
  <svg viewBox="0 0 16 16" width="12" height="12">
    <path d="M3 8.5 6.5 12 13 4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

/* ---------- hero ring cards ---------- */

export const RING_CARDS = [
  () => (
    <div className="rc rc--white">
      <p className="rc__t">Sales dashboard</p>
      <p className="rc__big">+38%</p>
      <LineChart />
      <div className="rc__rows">
        <i style={{ width: '80%' }} />
        <i style={{ width: '55%' }} />
      </div>
    </div>
  ),
  () => (
    <div className="rc rc--wa">
      <p className="rc__t">WhatsApp agent</p>
      <div className="bubble bubble--in">Hi! Is the 2-bed still available?</div>
      <div className="bubble bubble--out">Yes 👋 Want to view it Thursday at 5pm?</div>
      <div className="bubble bubble--in">Perfect, book it.</div>
    </div>
  ),
  () => (
    <div className="rc rc--dark">
      <p className="rc__t rc__t--light">AI voice agent</p>
      <div className="rc__avatar">AI</div>
      <Wave bars={18} />
      <p className="rc__small">Qualifying lead · 01:24</p>
    </div>
  ),
  () => (
    <div className="rc rc--lime">
      <p className="rc__t">Web apps</p>
      <p className="rc__head">Portals, dashboards & SaaS</p>
      <div className="rc__code">
        <span>&lt;App/&gt;</span>
      </div>
    </div>
  ),
  () => (
    <div className="rc rc--white">
      <p className="rc__t">Booked</p>
      <div className="cal">
        {Array.from({ length: 21 }).map((_, i) => (
          <span key={i} className={i === 10 ? 'on' : i % 6 === 2 ? 'mid' : ''} />
        ))}
      </div>
      <p className="rc__ok">
        <Check /> Appointment confirmed
      </p>
    </div>
  ),
  () => (
    <div className="rc rc--sky">
      <span className="rc__plus">+</span>
      <p className="rc__head rc__head--light">AI agents that work 24/7</p>
    </div>
  ),
  () => (
    <div className="rc rc--white">
      <p className="rc__t">Search visibility</p>
      <div className="rank">
        {['Google', 'Answers', 'ChatGPT', 'Gemini'].map((r, i) => (
          <div key={r}>
            <span>{r}</span>
            <i style={{ width: `${90 - i * 12}%` }} />
          </div>
        ))}
      </div>
    </div>
  ),
  () => (
    <div className="rc rc--phone">
      <div className="rc__notch" />
      <p className="rc__t">Mobile app</p>
      <div className="rc__tiles">
        <i />
        <i />
        <i />
        <i />
      </div>
      <div className="rc__bar" />
    </div>
  ),
  () => (
    <div className="rc rc--white">
      <p className="rc__t">Email follow-up</p>
      <div className="mail">
        <b>Re: Your quote</b>
        <span>Hi Sara, following up on…</span>
      </div>
      <div className="mail">
        <b>Thanks — let's talk</b>
        <span>Tuesday works for me.</span>
      </div>
    </div>
  ),
  () => (
    <div className="rc rc--dark">
      <p className="rc__t rc__t--light">Social Media AI</p>
      <div className="post">
        <i />
        <span>Scheduled · 9:00 AM</span>
      </div>
      <p className="rc__small">Caption written in your voice</p>
    </div>
  ),
  () => (
    <div className="rc rc--white">
      <p className="rc__t">Leads reached</p>
      <div className="donut">
        <svg viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="14" fill="none" stroke="#e8edf3" strokeWidth="5" />
          <circle cx="18" cy="18" r="14" fill="none" stroke="#2b7bff" strokeWidth="5" strokeDasharray="62 88" strokeLinecap="round" transform="rotate(-90 18 18)" />
          <circle cx="18" cy="18" r="14" fill="none" stroke="#c8f031" strokeWidth="5" strokeDasharray="18 88" strokeDashoffset="-64" strokeLinecap="round" transform="rotate(-90 18 18)" />
        </svg>
      </div>
      <p className="rc__small rc__small--dark">WhatsApp · Email · Voice</p>
    </div>
  ),
  () => (
    <div className="rc rc--lime">
      <p className="rc__t">Workflow</p>
      <div className="flow">
        <span>Form</span>
        <span>CRM</span>
        <span>Calendar</span>
      </div>
    </div>
  ),
]

/* ---------- larger product / service visuals ---------- */

export function BrowserMock() {
  return (
    <div className="mock browser">
      <div className="browser__bar">
        <i />
        <i />
        <i />
        <span>app.yourbusiness.com</span>
      </div>
      <div className="browser__body">
        <aside>
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className={i === 1 ? 'on' : ''} />
          ))}
        </aside>
        <div className="browser__main">
          <div className="browser__kpis">
            {[
              ['Orders', '1,284'],
              ['Revenue', '$48.2k'],
              ['Bookings', '312'],
            ].map(([k, v]) => (
              <div key={k}>
                <small>{k}</small>
                <b>{v}</b>
              </div>
            ))}
          </div>
          <div className="browser__chart">
            <LineChart />
          </div>
          <div className="browser__table">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i}>
                <i />
                <i />
                <i className={i % 2 ? 'tag' : 'tag tag--lime'} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function PhoneMock({ children, className = '' }) {
  return (
    <div className={`mock phone ${className}`}>
      <div className="phone__notch" />
      <div className="phone__screen">{children}</div>
    </div>
  )
}

export function AppScreen() {
  return (
    <div className="appscreen">
      <p className="appscreen__hi">Good morning, Lina</p>
      <div className="appscreen__card">
        <small>Next booking</small>
        <b>Today · 4:30 PM</b>
        <span>Dental check-up</span>
      </div>
      <div className="appscreen__grid">
        {['Book', 'Orders', 'Chat', 'Pay'].map((t) => (
          <div key={t}>
            <i />
            {t}
          </div>
        ))}
      </div>
      <div className="appscreen__list">
        <div />
        <div />
      </div>
      <div className="appscreen__tab">
        <i className="on" />
        <i />
        <i />
        <i />
      </div>
    </div>
  )
}

export function AgentMock() {
  return (
    <div className="mock agent">
      <div className="agent__head">
        <div className="agent__orb" />
        <div>
          <b>Maya · AI receptionist</b>
          <small>
            <span className="live" /> On a call · 02:13
          </small>
        </div>
      </div>
      <Wave bars={40} className="wave--big" />
      <div className="agent__transcript">
        <p className="c">“I'd like to book a consultation for next week.”</p>
        <p className="a">“Of course. I have Tuesday at 11 or Wednesday at 3 — which suits you?”</p>
      </div>
      <div className="agent__tags">
        <span>
          <Check /> Lead qualified
        </span>
        <span>
          <Check /> Synced to CRM
        </span>
      </div>
    </div>
  )
}

export function SeoMock() {
  return (
    <div className="mock seo">
      <div className="seo__search">
        <span className="seo__g">G</span> best clinic near me
      </div>
      <div className="seo__result seo__result--top">
        <small>yourbusiness.com</small>
        <b>Your Business — Trusted care, book online</b>
        <i />
      </div>
      <div className="seo__ai">
        <span className="seo__spark">✦</span>
        <div>
          <small>AI answer</small>
          <p>
            Top-rated options include <mark>Your Business</mark>, known for same-day appointments…
          </p>
        </div>
      </div>
      <div className="seo__pills">
        <span>SEO ↑</span>
        <span>AEO ✓</span>
        <span>GEO ✓</span>
      </div>
    </div>
  )
}

export function SocialMock() {
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
  return (
    <div className="mock social">
      <div className="social__head">
        <b>Content calendar</b>
        <span>Auto-scheduled</span>
      </div>
      <div className="social__grid">
        {days.map((d, i) => (
          <div key={i} className="social__day">
            <small>{d}</small>
            {(i % 2 === 0 || i === 3) && <motion.i className={`social__post p${i % 3}`} initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.1 * i, type: 'spring' }} />}
          </div>
        ))}
      </div>
      <div className="social__caption">
        <i />
        <div>
          <b>New post · Instagram</b>
          <span>“3 ways we cut wait times this month ✨” #healthcare</span>
        </div>
      </div>
    </div>
  )
}

export function OmniMock() {
  return (
    <div className="mock omni">
      <div className="omni__head">
        <b>OmniReach AI</b>
        <span className="live" /> <small>Running</small>
      </div>
      {[
        ['wa', 'WhatsApp', 'Ahmed replied: “Yes, send details”', 'Warm'],
        ['em', 'Email', 'Follow-up #2 opened by Priya', 'Engaged'],
        ['vc', 'AI call', 'Call with Daniel — interested in demo', 'Hot'],
        ['wa', 'WhatsApp', 'Reminder sent to 48 leads', 'Queued'],
      ].map(([c, ch, msg, st], i) => (
        <motion.div className="omni__row" key={i} initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 * i, duration: 0.6 }}>
          <span className={`ch ch--${c}`}>{ch[0]}</span>
          <div>
            <small>{ch}</small>
            <p>{msg}</p>
          </div>
          <em className={`st st--${st.toLowerCase()}`}>{st}</em>
        </motion.div>
      ))}
    </div>
  )
}
