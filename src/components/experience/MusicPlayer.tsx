import { motion, useReducedMotion } from 'framer-motion'

type MusicStatus = 'idle' | 'ready' | 'playing' | 'blocked' | 'missing'

type MusicPlayerProps = {
  status: MusicStatus
  playing: boolean
  progress: number
  currentTime: number
  duration: number
  blocked: boolean
  label: string
  missingHint: string
  onToggle: () => void
}

export default function MusicPlayer({
  status,
  playing,
  progress,
  currentTime,
  duration,
  blocked,
  label,
  missingHint,
  onToggle,
}: MusicPlayerProps) {
  const reducedMotion = useReducedMotion()
  const timeLabel = duration ? `${formatTime(currentTime)} / ${formatTime(duration)}` : '00:00 / --:--'

  return (
    <div className="music-player" role="group" aria-label="Birthday song player" aria-live="polite">
      <div className="music-player__topline">
        <span className="music-player__status">
          <span className={`music-player__pulse ${playing ? 'is-playing' : ''}`} aria-hidden="true" />
          {playing ? 'BIRTHDAY SONG PLAYING' : status === 'missing' ? 'BIRTHDAY SONG WAITING' : 'BIRTHDAY SONG'}
        </span>
        <span className="music-player__time">{timeLabel}</span>
      </div>
      <div className="music-player__body">
        <button
          type="button"
          className="music-player__play"
          onClick={onToggle}
          aria-label={playing ? 'Pause birthday song' : label}
        >
          <span aria-hidden="true">{playing ? 'Ⅱ' : '▶'}</span>
        </button>
        <div className="music-player__track" aria-hidden="true">
          <motion.span animate={{ width: `${Math.min(progress * 100, 100)}%` }} />
        </div>
      </div>
      {status === 'missing' || blocked ? (
        <p className="music-player__hint">
          {status === 'missing' ? missingHint : 'Tap play once more if your browser needs a little permission.'}
        </p>
      ) : null}
      <div className="music-player__note">
        <span>SOUNDTRACK / LOCAL FILE</span>
        <span className={reducedMotion ? 'is-reduced' : ''}>{reducedMotion ? 'MOTION SOFTENED' : 'A SMALL SURPRISE'}</span>
      </div>
    </div>
  )
}

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return '00:00'
  const minutes = Math.floor(seconds / 60)
  const remainder = Math.floor(seconds % 60)
  return `${String(minutes).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`
}
