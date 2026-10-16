import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { SITE } from '../config.js'
import { Logo } from './ui.jsx'

export default function Footer() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] })
  const y = useTransform(scrollYProgress, [0, 1], ['60%', '0%'])

  return (
    <footer className="footer" ref={ref}>
      <div className="container footer__grid">
        <div className="footer__brand">
          <Logo light />
          <p>{SITE.tagline}</p>
          <a className="footer__mail" href={`mailto:${SITE.email}`}>
            {SITE.email}
          </a>
        </div>
        <div>
          <h4>Services</h4>
          <Link to="/services#web">Web Applications</Link>
          <Link to="/services#mobile">Mobile Apps</Link>
          <Link to="/services#ai">AI Agents</Link>
        </div>
        <div>
          <h4>Products</h4>
          <Link to="/products#omnireach">OmniReach AI</Link>
          <Link to="/products#seo">SEO · AEO · GEO Agent</Link>
          <Link to="/products#social">Social Media AI</Link>
        </div>
        <div>
          <h4>Company</h4>
          <Link to="/about">About</Link>
          <Link to="/faq">FAQ</Link>
          <Link to="/contact">Contact</Link>
          <a href={SITE.whatsapp} target="_blank" rel="noreferrer">
            WhatsApp
          </a>
        </div>
      </div>
      <div className="container footer__bottom">
        <span>
          © {SITE.year} {SITE.name}. All rights reserved.
        </span>
        <span className="footer__legal">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms</a>
        </span>
      </div>
      <div className="footer__word" aria-hidden="true">
        <motion.span style={{ y }}>{SITE.name}</motion.span>
      </div>
    </footer>
  )
}
