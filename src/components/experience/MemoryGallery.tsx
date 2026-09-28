import { useState } from 'react'
import type { CSSProperties } from 'react'
import { motion } from 'framer-motion'
import { experience } from '../../data/birthdayExperience'
import { memories } from '../../data/memories'
import type { MemoryItem } from '../../data/memories'
import { EASE } from '../../motionShared'
import MagneticButton from './MagneticButton'
import MediaLightbox from './MediaLightbox'
import MediaPlaceholder from './MediaPlaceholder'
import SceneShell from './SceneShell'

type MemoryGalleryProps = {
  onContinue: () => void
}

type MemoryCardProps = {
  item: MemoryItem
  index: number
  failed: boolean
  onOpen: () => void
  onError: () => void
}

const cardRotations = [-5, 3, -2, 4, -3]

function MemoryCard({ item, index, failed, onOpen, onError }: MemoryCardProps) {
  return (
    <motion.div
      className={`memory-card memory-card--${index + 1}`}
      layoutId={`memory-card-${item.id}`}
      style={
        {
          '--card-rotation': `${cardRotations[index % cardRotations.length]}deg`,
          rotate: `${cardRotations[index % cardRotations.length]}deg`,
        } as CSSProperties
      }
      whileHover={{ y: -12, scale: 1.025 }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      <motion.button
        type="button"
        className="memory-card__button"
        onClick={onOpen}
        whileTap={{ scale: 0.98 }}
        aria-label={`Open memory: ${item.caption}`}
      >
        <div className="memory-card__media">
          {failed ? (
            <MediaPlaceholder path={item.src} label={item.type === 'video' ? 'VIDEO PENDING' : 'PHOTO PENDING'} compact />
          ) : item.type === 'video' ? (
            <video src={item.src} muted playsInline preload="metadata" onError={onError} aria-label={item.caption} />
          ) : (
            <img src={item.src} alt={item.alt ?? item.caption} onError={onError} loading="lazy" />
          )}
        </div>
        <div className="memory-card__veil" aria-hidden="true" />
        <span className="memory-card__index">0{index + 1}</span>
        <span className="memory-card__play" aria-hidden="true">
          {item.type === 'video' ? '▶' : '＋'}
        </span>
        <span className="memory-card__caption">
          <strong>{item.caption}</strong>
          <small>{item.date ?? 'A MOMENT'}</small>
        </span>
        {item.note ? <span className="memory-card__hidden-note">{item.note}</span> : null}
      </motion.button>
    </motion.div>
  )
}

export default function MemoryGallery({ onContinue }: MemoryGalleryProps) {
  const [selected, setSelected] = useState<MemoryItem | null>(null)
  const [failed, setFailed] = useState<Record<string, boolean>>({})

  const markFailed = (id: string) => {
    setFailed((current) => ({ ...current, [id]: true }))
  }

  return (
    <SceneShell
      tone="violet"
      className="memories-scene"
      contentClassName="memories-scene__content"
      ariaLabel="Ayanfe's memory gallery"
    >
      <motion.div
        className="memories-heading"
        initial={{ opacity: 0, y: 24, filter: 'blur(12px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.9, ease: EASE }}
      >
        <div className="eyebrow">
          <span className="eyebrow__dot" aria-hidden="true" />
          THE PRIVATE ARCHIVE
        </div>
        <div className="memories-heading__row">
          <div>
            <h1 className="display-title">{experience.memories.heading}</h1>
            <p className="scene-lede">{experience.memories.subheading}</p>
          </div>
          <span className="memories-heading__count">{String(memories.length).padStart(2, '0')} FILES</span>
        </div>
      </motion.div>

      <motion.div
        className="memory-gallery"
        initial={{ opacity: 0, y: 40, filter: 'blur(16px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 1.1, delay: 0.16, ease: EASE }}
      >
        {memories.map((item, index) => (
          <MemoryCard
            item={item}
            index={index}
            key={item.id}
            failed={Boolean(failed[item.id])}
            onOpen={() => setSelected(item)}
            onError={() => markFailed(item.id)}
          />
        ))}
      </motion.div>

      <motion.div
        className="gallery-footer"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8, ease: EASE }}
      >
        <p>{experience.memories.hint}</p>
        <MagneticButton className="magnetic-button--primary" onClick={onContinue}>
          {experience.memories.cta}
        </MagneticButton>
      </motion.div>

      <MediaLightbox item={selected} onClose={() => setSelected(null)} />
    </SceneShell>
  )
}
