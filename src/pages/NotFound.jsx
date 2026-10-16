import PageHero from './PageHero.jsx'
import { Btn } from '../components/ui.jsx'

export default function NotFound() {
  return (
    <PageHero eyebrow="404" title={'This page drifted\ninto the clouds.'}>
      <div className="hero__ctas">
        <Btn to="/" variant="lime" arrow>
          Back home
        </Btn>
      </div>
    </PageHero>
  )
}
