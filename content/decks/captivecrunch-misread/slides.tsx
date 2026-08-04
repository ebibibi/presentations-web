/* eslint-disable react-refresh/only-export-components */
import { spring, useVideoConfig } from 'remotion'
import type { SlideModule, SlideRenderContext } from '../../../src/types'
import { LogoMark } from '../../../src/deck-shared'

export const slides: SlideModule['slides'] = [
  { render: (props) => <OpeningSlide {...props} /> },
  { render: (props) => <HeadlinesSlide {...props} /> },
  { render: (props) => <OriginalTextSlide {...props} /> },
  { render: (props) => <NotWifiSlide {...props} /> },
  { render: (props) => <ThreePathsSlide {...props} /> },
  { render: (props) => <DeviceCodeSlide {...props} /> },
  { render: (props) => <VpnGapSlide {...props} /> },
  { render: (props) => <RealPrioritySlide {...props} /> },
  { render: (props) => <DetectionSlide {...props} /> },
  { render: (props) => <TwoMessagesSlide {...props} /> },
  { render: (props) => <RecapSlide {...props} /> },
  { render: (props) => <SourcesSlide {...props} /> }
]

// Pure helper (not a hook): spring-based entrance value for staggered items.
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

function OpeningSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const title = entrance(frame, fps)

  const goals = [
    ['01', '攻撃の実体を読む', 'CaptiveCrunchが突いているのは何か'],
    ['02', '見出しの危うさを見る', '最も効く対策が、なぜ記事から消えたのか']
  ]

  return (
    <section className="remotion-slide cc-slide cc-opening">
      <LogoMark />
      <div className="motion-grid" />
      <div className="cc-opening-copy" style={lift(title, 48)}>
        <span className="slide-kicker">Microsoft CaptiveCrunch ─ 原文を読む</span>
        <h1>
          「ホテルのWi-Fiを
          <br />
          使うな」は誤読
        </h1>
      </div>
      <div className="cc-goal-row">
        {goals.map(([number, heading, body], index) => (
          <div key={number} style={lift(entrance(frame, fps, 28 + index * 12), 28)}>
            <strong>{number}</strong>
            <span>{heading}</span>
            <p>{body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function HeadlinesSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const heading = entrance(frame, fps)
  const note = entrance(frame, fps, 60)

  const headlines = [
    'マイクロソフトが緊急警告',
    'Windowsユーザーは「ホテルのWi-Fiは使うな」',
    'ホテルWi-Fiを避けよ'
  ]

  return (
    <section className="remotion-slide cc-slide">
      <div style={lift(heading, 24)}>
        <span className="slide-kicker">2026年7月31日 ─ 報道</span>
        <h1>各社の見出しはこうなった</h1>
      </div>
      <div className="cc-headline-stack">
        {headlines.map((text, index) => (
          <div key={text} style={lift(entrance(frame, fps, 22 + index * 12), 26)}>
            <span className="cc-quote-mark">“</span>
            <strong>{text}</strong>
          </div>
        ))}
      </div>
      <p className="cc-note" style={lift(note, 18)}>
        腑に落ちなかったので、一次ソースを読みに行った。
      </p>
    </section>
  )
}

function OriginalTextSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const heading = entrance(frame, fps)
  const first = entrance(frame, fps, 22)
  const second = entrance(frame, fps, 40)
  const note = entrance(frame, fps, 58)

  return (
    <section className="remotion-slide cc-slide">
      <div style={lift(heading, 24)}>
        <span className="slide-kicker">Microsoft Security Blog 原文</span>
        <h1>実際に書かれていた2文</h1>
      </div>
      <div className="cc-quote-card" style={lift(first, 28)}>
        <p>
          users should treat hotel, conference, airport, and other guest wireless
          networks as <b>untrustworthy</b>.
        </p>
        <span>信頼できるという前提を捨てろ ─ 禁止ではない</span>
      </div>
      <div className="cc-quote-card" style={lift(second, 28)}>
        <p>
          <b>Prefer</b> private connectivity over public Wi-Fi{' '}
          <b>whenever practical</b>.
        </p>
        <span>実務上可能な範囲で優先しろ ─ 条件付きの推奨</span>
      </div>
      <p className="cc-note" style={lift(note, 18)}>
        宛先は <b>corporate travelers</b>（企業の出張者）。一般向けの緊急警告ではない。
      </p>
    </section>
  )
}

function NotWifiSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const heading = entrance(frame, fps)
  const note = entrance(frame, fps, 70)

  const flow = [
    ['端末', 'ホテルのWi-Fiに接続', 'cc-node-plain'],
    ['キャプティブポータル', 'GWがDNSも兼務', 'cc-node-danger'],
    ['攻撃者インフラ', 'DNS応答を偽造', 'cc-node-plain']
  ]

  return (
    <section className="remotion-slide cc-slide">
      <div style={lift(heading, 24)}>
        <span className="slide-kicker">脅威の所在</span>
        <h1>攻撃されているのはWi-Fiではない</h1>
      </div>
      <div className="cc-flow">
        {flow.map(([label, body, tone], index) => (
          <div className="cc-flow-cell" key={label}>
            {index > 0 ? (
              <span
                className="cc-arrow"
                style={{ opacity: entrance(frame, fps, 14 + index * 14) }}
              >
                →
              </span>
            ) : null}
            <div
              className={`cc-node ${tone}`}
              style={lift(entrance(frame, fps, 20 + index * 14), 26)}
            >
              <strong>{label}</strong>
              <p>{body}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="cc-note cc-note-strong" style={lift(note, 18)}>
        侵害されたのは電波ではなくポータル機器。<b>WPA3でもパスワード付きでも関係ない。</b>
      </p>
    </section>
  )
}

function ThreePathsSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const heading = entrance(frame, fps)
  const note = entrance(frame, fps, 66)

  const paths = [
    ['01', '偽アップデート ＋ ClickFix', '接続確認を偽ページへ。ユーザーが自分で実行し CornFlake / ChocoShell が入る'],
    ['02', 'AiTM のサインインページ', 'Microsoftを模した画面へ誘導し、攻撃者インフラを経由させる'],
    ['03', 'デバイスコードフローの悪用', '本物のサインインページでコードを入力させ、攻撃者のセッションを認証させる']
  ]

  return (
    <section className="remotion-slide cc-slide">
      <div style={lift(heading, 24)}>
        <span className="slide-kicker">では、どう盗まれるのか</span>
        <h1>TLSは破られていない</h1>
      </div>
      <div className="cc-path-list">
        {paths.map(([number, label, body], index) => (
          <div key={number} style={lift(entrance(frame, fps, 20 + index * 13), 24)}>
            <span className="cc-path-num">{number}</span>
            <div>
              <strong>{label}</strong>
              <p>{body}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="cc-note cc-note-strong" style={lift(note, 18)}>
        3つとも <b>ユーザー自身に正規の操作をさせる</b>。暗号を破る必要がない。
      </p>
    </section>
  )
}

function DeviceCodeSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const heading = entrance(frame, fps)
  const note = entrance(frame, fps, 72)

  const steps = [
    ['攻撃者', 'Entra IDに認証要求を出し、表示用コードを受け取る'],
    ['偽ポータル', '「このコードを入力してください」と表示する'],
    ['被害者', '本物の microsoft.com でコードを入力する'],
    ['結果', '認証されたのは攻撃者のセッション']
  ]

  return (
    <section className="remotion-slide cc-slide">
      <div style={lift(heading, 24)}>
        <span className="slide-kicker">7月16日以降に追加された手口</span>
        <h1>
          一番厄介なのは
          <br />
          デバイスコード
        </h1>
      </div>
      <div className="cc-steps">
        {steps.map(([actor, body], index) => (
          <div
            className={index === steps.length - 1 ? 'cc-step cc-step-end' : 'cc-step'}
            key={actor}
            style={lift(entrance(frame, fps, 18 + index * 12), 22)}
          >
            <span>{actor}</span>
            <p>{body}</p>
          </div>
        ))}
      </div>
      <p className="cc-note cc-note-strong" style={lift(note, 18)}>
        偽サイトの痕跡はどこにもない。<b>「URLをよく見る」教育では原理的に防げない。</b>
      </p>
    </section>
  )
}

function VpnGapSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const heading = entrance(frame, fps)
  const left = entrance(frame, fps, 22)
  const right = entrance(frame, fps, 38)

  return (
    <section className="remotion-slide cc-slide">
      <div style={lift(heading, 24)}>
        <span className="slide-kicker">見出しに従うとどうなるか</span>
        <h1>
          「Wi-Fiを避ける」で
          <br />
          守れる範囲
        </h1>
      </div>
      <div className="cc-compare">
        <div className="cc-compare-card" style={lift(left, 30)}>
          <span className="cc-tag cc-tag-ok">効く</span>
          <strong>経路上の盗聴</strong>
          <p>通信内容を横から覗かれるタイプの攻撃。VPNで暗号化すれば守れる。</p>
        </div>
        <div className="cc-compare-card cc-compare-warn" style={lift(right, 30)}>
          <span className="cc-tag cc-tag-warn">効かない</span>
          <strong>今回の3経路すべて</strong>
          <p>
            ポータル通過<b>前</b>の通信／ユーザー自身によるマルウェア実行／デバイスコードの詐取。
          </p>
        </div>
      </div>
    </section>
  )
}

function RealPrioritySlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const heading = entrance(frame, fps)
  const top = entrance(frame, fps, 22)

  const rest = [
    'パスキー等のフィッシング耐性MFA',
    'ポータル経由の更新・証明書・診断ツールは一切入れない',
    '企業管理のトラベルルーターで社内へ暗号化トンネル',
    'ClickFix系（貼って実行）を悪性と認識させる教育'
  ]

  return (
    <section className="remotion-slide cc-slide">
      <div style={lift(heading, 24)}>
        <span className="slide-kicker">Recommendations の筆頭</span>
        <h1>最優先はネットワークの話ではない</h1>
      </div>
      <div className="cc-hero-card" style={lift(top, 30)}>
        <span className="cc-tag cc-tag-warn">最優先</span>
        <strong>
          Microsoft recommends blocking device code flow wherever possible.
        </strong>
        <p>条件付きアクセスでデバイスコードフローを塞ぐ。今回の核心を直接止められる唯一の設定。</p>
      </div>
      <div className="cc-mini-list">
        {rest.map((text, index) => (
          <div key={text} style={lift(entrance(frame, fps, 44 + index * 10), 18)}>
            {text}
          </div>
        ))}
      </div>
    </section>
  )
}

function DetectionSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const heading = entrance(frame, fps)
  const hunt = entrance(frame, fps, 22)
  const ioc = entrance(frame, fps, 42)

  return (
    <section className="remotion-slide cc-slide">
      <div style={lift(heading, 24)}>
        <span className="slide-kicker">今日から回せる</span>
        <h1>検知の着眼点とIoC</h1>
      </div>
      <div className="cc-hero-card" style={lift(hunt, 28)}>
        <span className="cc-tag cc-tag-ok">ハンティング</span>
        <strong>NCSI（接続確認）から2分以内のファイル生成を疑う</strong>
        <p>Windowsが起動時に行う接続テスト直後の落下物を洗い出す。実装しやすく、誤検知も絞りやすい。</p>
      </div>
      <div className="cc-ioc" style={lift(ioc, 24)}>
        <span>公開IoC</span>
        <code>ms365-device[.]com / m365-owa[.]com</code>
        <code>213.145.86.112 / 31.57.243.154</code>
        <p>マルウェアは CornFlake（Go製RAT）と ChocoShell（PowerShell製インフォスティーラー）。</p>
      </div>
    </section>
  )
}

function TwoMessagesSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const heading = entrance(frame, fps)
  const note = entrance(frame, fps, 60)

  const messages = [
    ['01', 'ポータルから出てくるものは、何であれ入れるな', '更新・証明書・診断ツール・セキュリティユーティリティすべて'],
    ['02', 'コードを入力させられたら、自分が始めた認証か確認しろ', '身に覚えのないデバイスコードは、その時点で攻撃']
  ]

  return (
    <section className="remotion-slide cc-slide">
      <div style={lift(heading, 24)}>
        <span className="slide-kicker">出張者への周知</span>
        <h1>伝えるのはこの2つだけ</h1>
      </div>
      <div className="cc-message-row">
        {messages.map(([number, label, body], index) => (
          <div key={number} style={lift(entrance(frame, fps, 22 + index * 14), 28)}>
            <strong>{number}</strong>
            <span>{label}</span>
            <p>{body}</p>
          </div>
        ))}
      </div>
      <p className="cc-note" style={lift(note, 18)}>
        「Wi-Fiを使うな」より実行可能で、実際に手口を塞げる。
      </p>
    </section>
  )
}

function RecapSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const heading = entrance(frame, fps)
  const punch = entrance(frame, fps, 46)

  const points = [
    '原文は「使うな」ではなく「信頼するな」',
    '侵害されたのはWi-FiではなくポータルのDNS',
    'TLSは破られていない。人に操作させている',
    '最優先はデバイスコードフローの遮断'
  ]

  return (
    <section className="remotion-slide cc-slide">
      <div style={lift(heading, 24)}>
        <span className="slide-kicker">まとめ</span>
        <h1>なぜ一次情報を読むのか</h1>
      </div>
      <div className="cc-recap">
        {points.map((text, index) => (
          <div key={text} style={lift(entrance(frame, fps, 18 + index * 10), 20)}>
            {text}
          </div>
        ))}
      </div>
      <div className="cc-punch" style={lift(punch, 26)}>
        最優先の対策が見出しから消え、条件付きの項目が命令形で残ると、
        <b>対策リソースは間違った方向に配分される。</b>
      </div>
    </section>
  )
}

function SourcesSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const heading = entrance(frame, fps)

  const sources = [
    [
      'Microsoft Security Blog（原文）',
      'CaptiveCrunch: Midnight Blizzard targets travelers worldwide',
      'https://www.microsoft.com/en-us/security/blog/2026/07/31/captivecrunch-midnight-blizzard-targets-travelers-worldwide-for-malware-delivery-and-credential-theft/'
    ],
    [
      'Tech News JP（記事版）',
      '「ホテルのWi-Fiを使うな」は誤読 ─ CaptiveCrunch警告が本当に言っていること',
      'https://www.ebisuda.net/tech/2026/08/03/captivecrunch-hotel-wifi-warning-misread/'
    ]
  ]

  return (
    <section className="remotion-slide cc-slide">
      <div style={lift(heading, 24)}>
        <span className="slide-kicker">出典と続き</span>
        <h1>
          原文は全部
          <br />
          公開されている
        </h1>
      </div>
      <div className="cc-sources">
        {sources.map(([label, title, url], index) => (
          <div key={url} style={lift(entrance(frame, fps, 22 + index * 14), 24)}>
            <span>{label}</span>
            <strong>{title}</strong>
            <a href={url} rel="noreferrer" target="_blank">
              {url}
            </a>
          </div>
        ))}
      </div>
    </section>
  )
}
