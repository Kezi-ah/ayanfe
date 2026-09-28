import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { experience } from '../../data/birthdayExperience'
import { EASE } from '../../motionShared'
import Envelope from './Envelope'
import MagneticButton from './MagneticButton'
import MediaPlaceholder from './MediaPlaceholder'
import SceneShell from './SceneShell'

type LetterSceneProps = {
  onContinue: () => void
  onOpenLetter?: () => void
}

export default function LetterScene({ onContinue, onOpenLetter }: LetterSceneProps) {
  const [opened, setOpened] = useState(false)
  const [photoFailed, setPhotoFailed] = useState(false)
  const paragraphs = experience.letter.paragraphs

  const openLetter = () => {
    if (opened) return
    setOpened(true)
    onOpenLetter?.()
  }

  return (
    <SceneShell
      tone="rose"
      className="letter-scene"
      contentClassName="letter-scene__content"
      ariaLabel="A letter from Keziah"
    >
      <AnimatePresence mode="wait">
        {!opened ? (
          <motion.div
            className="letter-intro"
            key="closed"
            initial={{ opacity: 0, y: 26, filter: 'blur(12px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -24, scale: 0.96, filter: 'blur(12px)' }}
            transition={{ duration: 0.75, ease: EASE }}
          >
            <div className="letter-intro__copy">
              <div className="eyebrow">
                <span className="eyebrow__dot" aria-hidden="true" />
                A NOTE FROM THE OTHER SIDE
              </div>
              <h1 className="display-title">{experience.letter.heading}</h1>
              <p className="scene-lede">{experience.letter.subheading}</p>
              <MagneticButton className="magnetic-button--rose" onClick={openLetter}>
                {experience.letter.cta}
              </MagneticButton>
            </div>
            <div className="envelope-stage">
              <span className="envelope-stage__halo" />
              <Envelope open={false} onOpen={openLetter} />
              <span className="envelope-stage__caption">PRESS TO OPEN</span>
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="letter-open-layout"
            key="open"
            initial={{ opacity: 0, scale: 0.96, filter: 'blur(16px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.95, ease: EASE }}
          >
            <motion.article
              className="letter-paper"
              initial={{ opacity: 0, y: 48, rotateX: 12 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 1, delay: 0.18, ease: EASE }}
            >
              <div className="letter-paper__texture" aria-hidden="true" />
              <div className="letter-paper__header">
                <span>AYANFE / 19</span>
                <span>FOR YOUR EYES ONLY</span>
              </div>
              <div className="letter-paper__body">
                {paragraphs.map((paragraph, index) => (
                  <motion.p
                    key={`${paragraph.slice(0, 16)}-${index}`}
                    initial={{ opacity: 0, y: 14, filter: 'blur(7px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{ duration: 0.55, delay: 0.42 + index * 0.08, ease: EASE }}
                  >
                    {renderLetterText(paragraph)}
                  </motion.p>
                ))}
              </div>
              <div className="letter-paper__signature">
                <span>With love,</span>
                <strong>{experience.letter.signature}</strong>
              </div>
            </motion.article>
            <motion.aside
              className="letter-photo"
              initial={{ opacity: 0, x: 28, rotate: 5 }}
              animate={{ opacity: 1, x: 0, rotate: 2 }}
              transition={{ duration: 0.95, delay: 0.42, ease: EASE }}
            >
              <div className="letter-photo__frame">
                {photoFailed ? (
                  <MediaPlaceholder path={experience.letter.photo} label="PHOTO PENDING" compact />
                ) : (
                  <img
                    src={experience.letter.photo}
                    alt="Ayanfe and Keziah together"
                    onError={() => setPhotoFailed(true)}
                  />
                )}
              </div>
              <span>ONE SMALL PROOF</span>
            </motion.aside>
            <motion.div
              className="letter-action"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.25, ease: EASE }}
            >
              <MagneticButton className="magnetic-button--primary" onClick={onContinue}>
                I have more for you →
              </MagneticButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </SceneShell>
  )
}

function renderLetterText(text: string) {
  return text.split(/(\*\*.*?\*\*)/g).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={`${part}-${index}`}>{part.slice(2, -2)}</strong>
    }
    return part
  })
}
