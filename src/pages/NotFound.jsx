import PageHero from './PageHero.jsx'
import { Btn } from '../components/ui.jsx'

export default function NotFound() {
  return (
    <PageHero eyebrow="404" title={'This page wandered\noff the map.'}>
      <div className="hero__ctas">
        <Btn to="/" variant="white" arrow>
          Back home
        </Btn>
      </div>
    </PageHero>
  )
}
