import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FAQS } from '../data.js'
import { Eyebrow, SplitHeading, ease } from '../components/ui.jsx'

export default function FAQ({ title = 'Questions, answered.' }) {
  const [open, setOpen] = useState(0)
  return (
    <section className="faq container">
      <div className="faq__head">
        <Eyebrow>FAQ</Eyebrow>
        <SplitHeading text={title} className="h2" />
      </div>
      <div className="faq__list">
        {FAQS.map(([q, a], i) => (
          <div className={`faq__item ${open === i ? 'is-open' : ''}`} key={q}>
            <button onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>
              <span>{q}</span>
              <i />
            </button>
            <AnimatePresence initial={false}>
              {open === i && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.45, ease }}>
                  <p>{a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  )
}
