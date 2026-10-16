import { WHY } from '../data.js'
import { Eyebrow, Reveal, SplitHeading } from '../components/ui.jsx'

const ICONS = ['◐', '✦', '◎', '∞']

export default function WhyUs() {
  return (
    <section className="why">
      <div className="container">
        <div className="section-head">
          <Eyebrow light>Why choose us</Eyebrow>
          <SplitHeading text="One team. Software and AI, working together." className="h2 h2--light" accent={['AI,', 'AI']} />
        </div>
        <div className="why__grid">
          {WHY.map(([t, d], i) => (
            <Reveal tilt className="spot why__item" key={t} delay={i * 0.08}>
              <span className="why__icon">{ICONS[i]}</span>
              <h3>{t}</h3>
              <p>{d}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
