import { useMemo } from 'react'
import type { CSSProperties } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { experience } from '../../data/birthdayExperience'
import { EASE } from '../../motionShared'
import MagneticButton from './MagneticButton'
import MusicPlayer from './MusicPlayer'
import SceneShell from './SceneShell'

type BirthdayCelebrationProps = {
  onContinue: () => void
  musicStatus: 'idle' | 'ready' | 'playing' | 'blocked' | 'missing'
  musicPlaying: boolean
  musicProgress: number
  musicCurrentTime: number
  musicDuration: number
  musicBlocked: boolean
  onToggleMusic: () => void
}

type ConfettiPiece = {
  left: number
  delay: number
  duration: number
  drift: number
  rotation: number
  color: string
  shape: 'bar' | 'dot' | 'ring'
}

const colors = ['#8B5CF6', '#EC4899', '#FB7185', '#FFF1D6', '#C4B5FD', '#F0ABFC']

const pseudoRandom = (seed: number) => {
  const value = Math.sin(seed * 78.233 + 12.9898) * 43758.5453
  return value - Math.floor(value)
}

export default function BirthdayCelebration({
  onContinue,
  musicStatus,
  musicPlaying,
  musicProgress,
  musicCurrentTime,
  musicDuration,
  musicBlocked,
  onToggleMusic,
}: BirthdayCelebrationProps) {
  const reducedMotion = useReducedMotion()

  const confetti = useMemo<ConfettiPiece[]>(
    () =>
      Array.from({ length: reducedMotion ? 18 : 52 }, (_, index) => ({
        left: pseudoRandom(index + 13) * 100,
        delay: pseudoRandom(index + 73) * 1.1,
        duration: 2.8 + pseudoRandom(index + 133) * 2.4,
        drift: (pseudoRandom(index + 193) - 0.5) * 120,
        rotation: 180 + pseudoRandom(index + 253) * 720,
        color: colors[index % colors.length],
        shape: index % 5 === 0 ? 'ring' : index % 3 === 0 ? 'dot' : 'bar',
      })),
    [reducedMotion],
  )

  return (
    <SceneShell
      tone="violet"
      className={`celebration-scene ${musicPlaying ? 'celebration-scene--playing' : ''}`.trim()}
      ariaLabel="Birthday celebration"
    >
      <div className={`confetti-field ${reducedMotion ? 'confetti-field--reduced' : ''}`} aria-hidden="true">
        {confetti.map((piece, index) => {
          const style = {
            left: `${piece.left}%`,
            '--confetti-color': piece.color,
            '--confetti-drift': `${piece.drift}px`,
            '--confetti-rotation': `${piece.rotation}deg`,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
          } as CSSProperties

          return <motion.span className={`confetti-piece confetti-piece--${piece.shape}`} key={index} style={style} />
        })}
      </div>

      <motion.div
        className="celebration-content"
        animate={reducedMotion ? { x: 0, y: 0 } : { x: [0, -4, 4, -2, 2, 0], y: [0, 2, -2, 0] }}
        transition={{ duration: 0.72, ease: 'easeOut' }}
      >
        <motion.div
          className="celebration-burst"
          initial={{ opacity: 0, scale: 0.3 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, ease: EASE }}
          aria-hidden="true"
        >
          <span />
          <span />
          <span />
        </motion.div>
        <div className="eyebrow celebration-eyebrow">
          <span className="eyebrow__dot" aria-hidden="true" />
          {experience.celebration.eyebrow}
        </div>
        <motion.h1
          className="celebration-title"
          initial={{ opacity: 0, y: 44, scale: 0.9, filter: 'blur(18px)' }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 1.2, delay: 0.18, ease: EASE }}
        >
          {experience.celebration.title}
        </motion.h1>
        <motion.p
          className="celebration-line"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.75, ease: EASE }}
        >
          {experience.celebration.line}
        </motion.p>
        <motion.p
          className="celebration-body"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1, ease: EASE }}
        >
          {experience.celebration.body}
        </motion.p>
        <motion.div
          className="celebration-number"
          initial={{ opacity: 0, rotate: -15, scale: 0.5 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          transition={{ duration: 1.1, delay: 1.3, ease: EASE }}
          aria-hidden="true"
        >
          19
        </motion.div>
        <motion.div
          className="celebration-music"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.75, ease: EASE }}
        >
          <MusicPlayer
            status={musicStatus}
            playing={musicPlaying}
            progress={musicProgress}
            currentTime={musicCurrentTime}
            duration={musicDuration}
            blocked={musicBlocked}
            label={experience.music.label}
            missingHint={experience.music.missingHint}
            onToggle={onToggleMusic}
          />
        </motion.div>
        <motion.div
          className="celebration-action"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.5, ease: EASE }}
        >
          <MagneticButton className="magnetic-button--primary" onClick={onContinue}>
            {experience.celebration.cta}
          </MagneticButton>
        </motion.div>
      </motion.div>
    </SceneShell>
  )
}
