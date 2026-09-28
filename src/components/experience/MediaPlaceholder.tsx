type MediaPlaceholderProps = {
  path: string
  label?: string
  compact?: boolean
}

export default function MediaPlaceholder({
  path,
  label = 'FILE NOT FOUND',
  compact = false,
}: MediaPlaceholderProps) {
  return (
    <div className={`media-placeholder ${compact ? 'media-placeholder--compact' : ''}`.trim()}>
      <span className="media-placeholder__symbol" aria-hidden="true">
        +
      </span>
      <span className="media-placeholder__label">{label}</span>
      <span className="media-placeholder__path">{path}</span>
    </div>
  )
}
