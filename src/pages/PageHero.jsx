import { motion } from 'framer-motion'
import Clouds from '../components/Clouds.jsx'
import { ease } from '../components/ui.jsx'

export default function PageHero({ eyebrow, title, text, children }) {
  return (
    <section className="phero">
      <div className="phero__sky">
        <div className="stars" />
        <div className="phero__content">
          <motion.p className="pill pill--glass" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="dot" /> {eyebrow}
          </motion.p>
          <h1 className="phero__title">
            {title.split('\n').map((l, i) => (
              <span className="mask" key={i}>
                <motion.span initial={{ y: '110%' }} animate={{ y: '0%' }} transition={{ duration: 1.1, ease, delay: 0.1 + i * 0.12 }}>
                  {l}
                </motion.span>
              </span>
            ))}
          </h1>
          {text && (
            <motion.p className="hero__sub" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.45, ease }}>
              {text}
            </motion.p>
          )}
          {children}
        </div>
        <motion.div className="phero__clouds" initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1.6, ease }}>
          <Clouds seed={14} />
        </motion.div>
      </div>
    </section>
  )
}
