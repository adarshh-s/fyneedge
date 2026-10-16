import { INDUSTRIES } from '../data.js'
import { Eyebrow, Marquee, SplitHeading } from '../components/ui.jsx'

export default function Industries() {
  const half = Math.ceil(INDUSTRIES.length / 2)
  return (
    <section className="industries">
      <div className="container section-head section-head--center">
        <Eyebrow>Who we help</Eyebrow>
        <SplitHeading text="Built for businesses that run on conversations." className="h2" />
        <p className="lead">Our software and agents fit any team that needs to respond faster, follow up better and grow online.</p>
      </div>
      <Marquee speed={35}>
        {INDUSTRIES.slice(0, half).map((t) => (
          <span className="ind" key={t}>
            {t}
          </span>
        ))}
      </Marquee>
      <Marquee speed={40} reverse>
        {INDUSTRIES.slice(half).map((t) => (
          <span className="ind ind--alt" key={t}>
            {t}
          </span>
        ))}
      </Marquee>
    </section>
  )
}
