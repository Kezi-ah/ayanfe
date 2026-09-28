import { useEffect, useRef, useState } from 'react'
import type { MouseEvent } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import type { MemoryItem } from '../../data/memories'
import MediaPlaceholder from './MediaPlaceholder'

type MediaLightboxProps = {
  item: MemoryItem | null
  onClose: () => void
}

export default function MediaLightbox({ item, onClose }: MediaLightboxProps) {
  const [failedId, setFailedId] = useState<string | null>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const imageFailed = Boolean(item && failedId === item.id)

  useEffect(() => {
    if (!item) return
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const focusTimer = window.setTimeout(() => closeButtonRef.current?.focus(), 0)
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.clearTimeout(focusTimer)
      window.removeEventListener('keydown', handleKeyDown)
      if (previousFocus && document.contains(previousFocus)) previousFocus.focus()
    }
  }, [item, onClose])

  const stopPropagation = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation()
  }

  const lightbox = (
    <AnimatePresence>
      {item ? (
        <motion.div
          className="media-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={item.caption}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          onClick={onClose}
        >
          <motion.div
            className="media-lightbox__panel"
            layoutId={`memory-card-${item.id}`}
            onClick={stopPropagation}
            initial={{ opacity: 0, scale: 0.88, y: 30, filter: 'blur(16px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.92, y: 18, filter: 'blur(12px)' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              ref={closeButtonRef}
              type="button"
              className="media-lightbox__close"
              onClick={onClose}
              aria-label="Close memory"
            >
              ×
            </button>
            <div className="media-lightbox__media">
              {item.type === 'video' ? (
                <video
                  src={item.src}
                  controls
                  playsInline
                  preload="metadata"
                  onError={() => setFailedId(item.id)}
                  aria-label={item.caption}
                >
                  Your browser does not support embedded video.
                </video>
              ) : imageFailed ? (
                <MediaPlaceholder path={item.src} label="MEMORY PENDING" />
              ) : (
                <motion.img
                  layoutId={`memory-image-${item.id}`}
                  src={item.src}
                  alt={item.alt ?? item.caption}
                  onError={() => setFailedId(item.id)}
                />
              )}
              {item.type === 'video' && imageFailed ? (
                <div className="media-lightbox__video-fallback">
                  <MediaPlaceholder path={item.src} label="VIDEO PENDING" />
                </div>
              ) : null}
            </div>
            <div className="media-lightbox__caption">
              <div>
                <span className="eyebrow">{item.date ?? 'A MOMENT'}</span>
                <h2>{item.caption}</h2>
              </div>
              {item.note ? <p>{item.note}</p> : null}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )

  return typeof document === 'undefined' ? null : createPortal(lightbox, document.body)
}
