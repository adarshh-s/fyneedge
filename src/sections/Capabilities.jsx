import { Marquee } from '../components/ui.jsx'

const ITEMS = [
  ['◐', 'Web applications'],
  ['▢', 'Mobile apps'],
  ['◉', 'AI voice agents'],
  ['✦', 'WhatsApp agents'],
  ['✉', 'Email automation'],
  ['⟳', 'Workflow automation'],
  ['◎', 'SEO · AEO · GEO'],
  ['❖', 'Social Media AI'],
]

export default function Capabilities() {
  return (
    <div className="caps">
      <Marquee speed={45}>
        {ITEMS.map(([i, t]) => (
          <span className="caps__item" key={t}>
            <b>{i}</b>
            {t}
          </span>
        ))}
      </Marquee>
    </div>
  )
}
