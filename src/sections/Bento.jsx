import Clouds from '../components/Clouds.jsx'
import { Counter, Reveal } from '../components/ui.jsx'

export default function Bento() {
  return (
    <section className="bento container">
      <Reveal className="bento__card bento__card--sky" delay={0}>
        <Clouds seed={11} className="bento__clouds" />
        <div className="bento__top">
          <span className="bento__brand">OmniReach AI</span>
          <span className="bento__icon">↗</span>
        </div>
        <div className="bento__panel">
          <p className="bento__num">
            <Counter to={3} />
          </p>
          <p>Channels from one platform — WhatsApp, email and AI voice calls.</p>
        </div>
      </Reveal>

      <Reveal className="bento__card bento__card--grey" delay={0.1}>
        <p className="bento__label">Always on</p>
        <p className="bento__num">
          <Counter to={24} />
          /7
        </p>
        <div className="bento__chat">
          <div className="bubble bubble--in">Do you have a slot tomorrow?</div>
          <div className="bubble bubble--out">Yes — 10:30 or 2:00. Shall I book one?</div>
        </div>
        <p className="bento__quote">AI agents that answer, qualify, book and follow up — even while you sleep.</p>
      </Reveal>

      <div className="bento__col">
        <Reveal className="bento__card bento__card--lime" delay={0.2}>
          <p className="bento__label">Under one roof</p>
          <p className="bento__num">
            <Counter to={1} /> team
          </p>
          <p>Strategy, design, development and AI — no juggling agencies or freelancers.</p>
        </Reveal>
        <Reveal className="bento__card bento__card--dark" delay={0.3}>
          <p className="bento__label">From idea to impact</p>
          <p className="bento__num">
            <Counter to={4} /> steps
          </p>
        </Reveal>
      </div>
    </section>
  )
}
