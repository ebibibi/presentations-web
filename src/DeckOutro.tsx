import { BookOpen, ChevronRight, MonitorPlay } from 'lucide-react'
import type { DeckMeta } from './types'

// Slides are published to everyone, members or not. The deck is therefore the
// top of the funnel rather than the destination: a reader who got this far is
// the most likely person to watch the video or subscribe to the course, so the
// links to both live at the end of every deck instead of inside a handful of
// hand-built closing slides.

const CHANNEL_URL = 'https://www.youtube.com/@ebibibi'
const EBI_STUDY_URL = 'https://study.ebisuda.net'

export function DeckOutro({ meta }: { meta: DeckMeta }) {
  const youtube = meta.youtube

  return (
    <section className="deck-outro" aria-label="関連リンク">
      {youtube ? (
        <a className="outro-video" href={youtube.url} target="_blank" rel="noreferrer">
          <img src={`https://img.youtube.com/vi/${youtube.id}/hqdefault.jpg`} alt="" loading="lazy" />
          <div>
            <span className="outro-eyebrow">この資料の解説動画</span>
            <strong>{youtube.title ?? meta.title}</strong>
            <span className="outro-link-text">
              YouTubeで見る
              <ChevronRight size={16} aria-hidden />
            </span>
          </div>
        </a>
      ) : null}

      <div className="outro-cards">
        <a className="outro-card outro-card-study" href={EBI_STUDY_URL} target="_blank" rel="noreferrer">
          <BookOpen size={22} aria-hidden />
          <span className="outro-eyebrow">体系的に学びたい方へ</span>
          <strong>Ebi Study</strong>
          <p>Microsoft資格・Windows Server・Azure・Claude Codeを、順番に進められる動画講座にまとめています。</p>
          <span className="outro-link-text">
            study.ebisuda.net
            <ChevronRight size={16} aria-hidden />
          </span>
        </a>

        <a className="outro-card" href={CHANNEL_URL} target="_blank" rel="noreferrer">
          <MonitorPlay size={22} aria-hidden />
          <span className="outro-eyebrow">新しい資料と動画を受け取る</span>
          <strong>YouTubeチャンネル</strong>
          <p>Windows Server・Azure・Microsoft 365・生成AIの解説を公開しています。</p>
          <span className="outro-link-text">
            チャンネルを見る
            <ChevronRight size={16} aria-hidden />
          </span>
        </a>
      </div>
    </section>
  )
}
