import { SlideHeading } from './SlideHeading'
import { Slide } from './Slide'
import { useEnter } from './motion'

/** YouTube ids are 11 url-safe characters; anything else is a typo, not a video. */
const VIDEO_ID = /^[A-Za-z0-9_-]{11}$/

export type VideoSlideProps = {
  frame: number
  kicker?: string
  heading: string
  lead?: string
  /** YouTube video id, not a full URL. */
  videoId: string
  /** Line under the player, for example the episode number or a timestamp. */
  caption?: string
  /**
   * Replaces the still with a live player. Leave it off for a recorded deck:
   * a running iframe competes with the recording and cannot be scrubbed.
   */
  embed?: boolean
  /** Site-absolute path under public/ to use instead of the YouTube still. */
  poster?: string
}

/** A slide whose subject is a video: a still that links out, or a live embed. */
export function VideoSlide({
  frame,
  kicker,
  heading,
  lead,
  videoId,
  caption,
  embed = false,
  poster
}: VideoSlideProps) {
  if (!VIDEO_ID.test(videoId)) {
    throw new Error(
      `VideoSlide received "${videoId}", which is not a YouTube video id. ` +
        'Pass the 11-character id, not the watch URL.'
    )
  }

  const stage = useEnter(frame, 18, 26)
  const watchUrl = `https://www.youtube.com/watch?v=${videoId}`
  const stillUrl = poster ?? `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`

  return (
    <Slide className="sk-video-slide">
      <SlideHeading frame={frame} kicker={kicker} heading={heading} lead={lead} />
      <figure className="sk-video" style={stage}>
        {embed ? (
          <iframe
            className="sk-video-frame"
            src={`https://www.youtube-nocookie.com/embed/${videoId}`}
            title={heading}
            allow="accelerometer; clipboard-write; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <a className="sk-video-still" href={watchUrl} target="_blank" rel="noreferrer">
            <img src={stillUrl} alt="" />
            <span className="sk-video-play" aria-hidden="true">
              ▶
            </span>
          </a>
        )}
        {caption ? <figcaption>{caption}</figcaption> : null}
      </figure>
    </Slide>
  )
}
