import type { CSSProperties } from 'react'
import { motion } from 'framer-motion'
import { experience } from '../../data/birthdayExperience'
import { EASE } from '../../motionShared'
import MagneticButton from './MagneticButton'
import SceneShell from './SceneShell'

type FinalSceneProps = {
  onReplay: () => void
}

type Sparkle = {
  left: number
  top: number
  size: number
  opacity: number
  delay: number
  duration: number
}

const pseudoRandom = (seed: number) => {
  const value = Math.sin(seed * 12.9898 + 78.233) * 43758.5453
  return value - Math.floor(value)
}

const sparkles: Sparkle[] = Array.from({ length: 18 }, (_, index) => ({
  left: pseudoRandom(index + 17) * 100,
  top: pseudoRandom(index + 97) * 100,
  size: 1.4 + pseudoRandom(index + 157) * 3.4,
  opacity: 0.2 + pseudoRandom(index + 217) * 0.55,
  delay: pseudoRandom(index + 277) * 9,
  duration: 4.5 + pseudoRandom(index + 337) * 7,
}))

const VIEWPORT = { once: true, amount: 0.35 } as const

const reveal = (delay = 0) => ({
  initial: { opacity: 0, y: 26, filter: 'blur(12px)' },
  whileInView: { opacity: 1, y: 0, filter: 'blur(0px)' },
  viewport: VIEWPORT,
  transition: { duration: 1.25, delay, ease: EASE },
})

export default function FinalScene({ onReplay }: FinalSceneProps) {
  return (
    <SceneShell
      tone="ink"
      className="final-scene"
      ariaLabel="A quiet final note for Ayanfe"
      backdrop={
        <>
          <div className="final-ambience" aria-hidden="true">
            <span className="final-ambience__glow final-ambience__glow--one" />
            <span className="final-ambience__glow final-ambience__glow--two" />
            <span className="final-ambience__glow final-ambience__glow--three" />
            {sparkles.map((sparkle, index) => (
              <span
                className="final-spark"
                key={index}
                style={
                  {
                    left: `${sparkle.left}%`,
                    top: `${sparkle.top}%`,
                    width: `${sparkle.size}px`,
                    height: `${sparkle.size}px`,
                    opacity: sparkle.opacity,
                    animationDelay: `${-sparkle.delay}s`,
                    animationDuration: `${sparkle.duration}s`,
                  } as CSSProperties
                }
              />
            ))}
          </div>

          <div className="final-scene__quiet" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        </>
      }
    >
      <div className="final-scene__column">
        <section className="final-opening">
          <motion.div className="eyebrow final-eyebrow" {...reveal(0.1)}>
            <span className="eyebrow__dot" aria-hidden="true" />
            {experience.final.eyebrow}
          </motion.div>

          <motion.p className="final-whisper" {...reveal(0.42)}>
            {experience.final.whisper}
          </motion.p>

          <motion.h1 className="final-opening__line" {...reveal(0.78)}>
            {experience.final.opening}
          </motion.h1>

          <motion.span
            className="final-rule"
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={VIEWPORT}
            transition={{ duration: 1.6, delay: 1.15, ease: EASE }}
            aria-hidden="true"
          />

          <motion.p className="final-hint" {...reveal(1.6)} aria-hidden="true">
            keep going
            <span className="final-hint__arrow">↓</span>
          </motion.p>
        </section>

        <ul className="final-wishes">
          {experience.final.wishes.map((wish, index) => (
            <motion.li className="final-wish" key={wish} {...reveal(index * 0.22)}>
              <span className="final-wish__mark" aria-hidden="true" />
              <span className="final-wish__text">{wish}</span>
            </motion.li>
          ))}
        </ul>

        <motion.div
          className="final-breath"
          initial={{ opacity: 0, scale: 0.6, filter: 'blur(10px)' }}
          whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          viewport={VIEWPORT}
          transition={{ duration: 1.6, ease: EASE }}
          aria-hidden="true"
        >
          <span className="final-breath__heart">♡</span>
        </motion.div>

        <section className="final-closing">
          <motion.h2 className="final-title" {...reveal(0.16)}>
            {experience.final.heading}
          </motion.h2>

          <motion.p className="final-body" {...reveal(0.52)}>
            {experience.final.body}
          </motion.p>

          <motion.p className="final-again" {...reveal(0.82)}>
            {experience.final.closing}
          </motion.p>

          <motion.p className="final-signature" {...reveal(1.14)}>
            <span className="final-signature__off">{experience.final.signOff}</span>
            <span className="final-signature__name">{experience.final.signature}</span>
          </motion.p>

          <motion.div className="final-action" {...reveal(1.46)}>
            <MagneticButton className="magnetic-button--rose" onClick={onReplay}>
              {experience.final.cta}
            </MagneticButton>
          </motion.div>
        </section>

        <motion.div className="final-scene__footer" {...reveal(1.9)}>
          <span>AYANFE FILES / AF</span>
          <span>MADE WITH A LITTLE TOO MUCH HEART</span>
        </motion.div>
      </div>
    </SceneShell>
  )
}
