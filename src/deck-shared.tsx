/* eslint-disable react-refresh/only-export-components */
import { spring, useVideoConfig } from 'remotion'
import type { SlideRenderContext } from './types'

// ─────────────────────────────────────────────────────────────────────────
// Shared branding & call-to-action template.
// Edit BRAND below and EVERY deck updates at once (logo, like/subscribe/
// membership/note copy + links). The logo slide-2 and the closing slide both
// render the CtaSlide from here.
// ─────────────────────────────────────────────────────────────────────────
export type CtaAction = {
  icon: string
  label: string
  body: string
  href?: string
  linkLabel?: string
}

export const BRAND = {
  // Logo file lives in public/brand/. Swap this file (or the path) to rebrand
  // every deck's opening and CTA slides.
  logoSrc: '/brand/ebi-logo.png',
  channelName: '胡田のチャンネル',
  cta: {
    title: '応援お願いします！',
    subtitle: 'チャンネルとこのコースは、みなさんの応援で続きます',
    actions: [
      { icon: '👍', label: '高評価', body: '役に立ったら「いいね」をお願いします' },
      { icon: '🔔', label: 'チャンネル登録・通知オン', body: '登録＋ベルマークで新着を見逃さない' },
      {
        icon: '⭐',
        label: 'メンバーシップ',
        body: 'メンバー限定動画や、1対1で質問できるプランがあります',
        href: 'https://www.youtube.com/channel/UCn_7IV61pGOfoiC5Lc8nHUw/join',
        linkLabel: 'YouTube で参加する'
      },
      {
        icon: '📝',
        label: 'note メンバーシップ',
        body: '200本以上の有料記事が読み放題',
        href: 'https://note.com/ebibibi/membership',
        linkLabel: 'note.com/ebibibi/membership'
      }
    ]
  }
}

function entrance(frame: number, fps: number, delay = 0) {
  return spring({
    frame: frame - delay,
    fps,
    config: { damping: 18, stiffness: 110 }
  })
}

function lift(value: number, distance = 32) {
  return {
    opacity: value,
    transform: `translateY(${(1 - value) * distance}px)`
  }
}

export function LogoMark({ className }: { className?: string }) {
  return <img src={BRAND.logoSrc} alt="" className={className ?? 'deck-logo'} />
}

export function CtaSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const head = entrance(frame, fps)

  return (
    <section className="remotion-slide cta-slide">
      <div className="motion-grid" />
      <div className="cta-head" style={lift(head, 36)}>
        <img src={BRAND.logoSrc} alt="" className="cta-logo" />
        <div>
          <h1>{BRAND.cta.title}</h1>
          <p>{BRAND.cta.subtitle}</p>
        </div>
      </div>
      <div className="cta-grid">
        {BRAND.cta.actions.map((action: CtaAction, index) => {
          const style = lift(entrance(frame, fps, 24 + index * 10), 26)
          const inner = (
            <>
              <span className="cta-icon">{action.icon}</span>
              <strong>{action.label}</strong>
              <p>{action.body}</p>
              {action.href ? (
                <span className="cta-link">{action.linkLabel ?? action.href} →</span>
              ) : null}
            </>
          )

          return action.href ? (
            <a
              key={action.label}
              className="cta-card cta-card-link"
              href={action.href}
              target="_blank"
              rel="noreferrer"
              style={style}
            >
              {inner}
            </a>
          ) : (
            <div key={action.label} className="cta-card" style={style}>
              {inner}
            </div>
          )
        })}
      </div>
    </section>
  )
}
