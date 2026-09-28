import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useReducedMotion } from 'framer-motion'
import { experience } from '../../data/birthdayExperience'
import { EASE } from '../../motionShared'
import MagneticButton from './MagneticButton'
import SceneShell from './SceneShell'

type IntroSceneProps = {
  onStart: () => void
}

export default function IntroScene({ onStart }: IntroSceneProps) {
  const reducedMotion = useReducedMotion()
  const [stage, setStage] = useState(0)
  const [secretFound, setSecretFound] = useState(false)
  const visibleStage = reducedMotion ? 3 : stage

  useEffect(() => {
    if (reducedMotion) return

    const timers = [
      window.setTimeout(() => setStage(1), 850),
      window.setTimeout(() => setStage(2), 1850),
      window.setTimeout(() => setStage(3), 3050),
    ]

    return () => timers.forEach((timer) => window.clearTimeout(timer))
  }, [reducedMotion])

  return (
    <SceneShell tone="plum" className="intro-scene" ariaLabel="Ayanfe's Day introduction">
      <div className="intro-layout">
        <motion.div
          className="intro-copy"
          initial={{ opacity: 0, y: 24, filter: 'blur(12px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.1, ease: EASE }}
        >
          <div className="eyebrow intro-eyebrow">
            <span className="eyebrow__dot" aria-hidden="true" />
            {experience.intro.eyebrow}
          </div>

          <div className="intro-reveal" aria-live="polite">
            <AnimatePresence mode="wait">
              {visibleStage < 3 ? (
                <motion.p
                  key={visibleStage}
                  className="intro-line"
                  initial={{ opacity: 0, y: 18, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -16, filter: 'blur(8px)' }}
                  transition={{ duration: 0.65, ease: EASE }}
                >
                  {experience.intro.lines[visibleStage]}
                </motion.p>
              ) : null}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {visibleStage >= 2 ? (
              <motion.div
                className="intro-lockup"
                initial={{ opacity: 0, y: 34, filter: 'blur(18px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 1, delay: 0.1, ease: EASE }}
              >
                <span className="intro-lockup__name">AYANFE'S</span>
                <span className="intro-lockup__day">DAY</span>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <AnimatePresence>
            {visibleStage >= 2 ? (
              <motion.p
                className="intro-lede"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.38, ease: EASE }}
              >
                {experience.intro.lede}
              </motion.p>
            ) : null}
          </AnimatePresence>

          <AnimatePresence>
            {visibleStage >= 3 ? (
              <motion.div
                className="intro-action"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
              >
                <MagneticButton className="magnetic-button--primary" onClick={onStart}>
                  {experience.intro.cta}
                </MagneticButton>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.div>

        <motion.div
          className="intro-sigil"
          initial={{ opacity: 0, scale: 0.7, rotate: -12 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1.4, delay: 0.35, ease: EASE }}
        >
          <div className="intro-sigil__ring" aria-hidden="true">
            <span>19</span>
          </div>
          <span className="intro-sigil__label">A DAY TO KEEP</span>
          <span className="intro-sigil__sub">AF / PRIVATE EDITION</span>
        </motion.div>
      </div>

      <button
        type="button"
        className="secret-star"
        onClick={() => setSecretFound(true)}
        aria-label="A tiny hidden star"
      >
        ✦
      </button>
      <AnimatePresence>
        {secretFound ? (
          <motion.span
            className="secret-star__message"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
          >
            AF / you found the quiet star.
          </motion.span>
        ) : null}
      </AnimatePresence>
    </SceneShell>
  )
}
