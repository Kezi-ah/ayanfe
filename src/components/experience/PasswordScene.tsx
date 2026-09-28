import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { experience } from '../../data/birthdayExperience'
import { EASE } from '../../motionShared'
import MagneticButton from './MagneticButton'
import SceneShell from './SceneShell'

type PasswordSceneProps = {
  onVerified: () => void
  onContinue: () => void
}

type AccessState = 'idle' | 'granted'

export default function PasswordScene({ onVerified, onContinue }: PasswordSceneProps) {
  const [value, setValue] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [attempts, setAttempts] = useState(0)
  const [accessState, setAccessState] = useState<AccessState>('idle')
  const transitionTimer = useRef<number | null>(null)

  useEffect(
    () => () => {
      if (transitionTimer.current !== null) window.clearTimeout(transitionTimer.current)
    },
    [],
  )

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const candidate = value.trim().toLowerCase()

    if (!candidate) {
      setError('The key is waiting for you.')
      return
    }

    if (candidate !== experience.accessPassword) {
      const deniedMessage = experience.access.denied[attempts % experience.access.denied.length]
      setAttempts((current) => current + 1)
      setError(deniedMessage)
      setValue('')
      return
    }

    setError(null)
    setAccessState('granted')
    onVerified()
    transitionTimer.current = window.setTimeout(onContinue, 1200)
  }

  const handleChange = (nextValue: string) => {
    setValue(nextValue)
    if (error) setError(null)
  }

  const progress = Math.min(value.length / experience.accessPassword.length, 1)

  return (
    <SceneShell tone="rose" className="password-scene" ariaLabel="Private access">
      <div className="password-layout">
        <motion.div
          className="password-intro"
          initial={{ opacity: 0, x: -28, filter: 'blur(12px)' }}
          animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <div className="eyebrow">
            <span className="eyebrow__dot" aria-hidden="true" />
            {experience.access.label}
          </div>
          <h1 className="display-title">{experience.access.heading}</h1>
          <p className="scene-lede">{experience.access.subheading}</p>
          <div className="access-signal" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
          <p className="access-hint">{experience.access.hint}</p>
        </motion.div>

        <motion.div
          className={`access-panel ${accessState === 'granted' ? 'access-panel--granted' : ''}`.trim()}
          initial={{ opacity: 0, y: 32, scale: 0.96, filter: 'blur(14px)' }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.95, delay: 0.14, ease: EASE }}
        >
          <div className="access-panel__topline">
            <span>KEY / 01</span>
            <span className="access-panel__status">
              {accessState === 'granted' ? 'VERIFIED' : 'ENCRYPTED'}
            </span>
          </div>

          <AnimatePresence mode="wait">
            {accessState === 'granted' ? (
              <motion.div
                className="access-granted"
                key="granted"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.65, ease: EASE }}
              >
                <span className="access-granted__mark">✓</span>
                <strong>{experience.access.granted}</strong>
                <span>Opening your little world...</span>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35 }}
              >
                <label className="access-label" htmlFor="private-key">
                  ENTER THE PRIVATE KEY
                </label>
                <div className="access-input-wrap">
                  <span className="access-input-wrap__key" aria-hidden="true">
                    ◇
                  </span>
                  <input
                    id="private-key"
                    className="access-input"
                    type="password"
                    value={value}
                    onChange={(event) => handleChange(event.target.value)}
                    placeholder="••••••••"
                    autoComplete="off"
                    spellCheck={false}
                    aria-describedby="access-feedback"
                    autoFocus
                  />
                </div>
                <div className="access-progress" aria-hidden="true">
                  <motion.span animate={{ width: `${progress * 100}%` }} />
                </div>
                <div className="access-meta">
                  <span>{value.length ? 'SIGNAL RECEIVED' : 'AWAITING INPUT'}</span>
                  <span>AF / 19</span>
                </div>
                <div id="access-feedback" className="access-feedback" aria-live="polite">
                  <AnimatePresence mode="wait">
                    {error ? (
                      <motion.span
                        key={error}
                        className="access-feedback__error"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                      >
                        {error}
                      </motion.span>
                    ) : (
                      <motion.span
                        key="hint"
                        className="access-feedback__hint"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        The door only opens once.
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
                <MagneticButton
                  className="magnetic-button--primary access-submit"
                  type="submit"
                >
                  Unlock the next scene →
                </MagneticButton>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </SceneShell>
  )
}
