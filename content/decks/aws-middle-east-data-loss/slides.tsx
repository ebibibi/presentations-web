/* eslint-disable react-refresh/only-export-components */
import {
  ArrowRight,
  Building2,
  Check,
  CircleHelp,
  CloudOff,
  Database,
  Flame,
  Globe,
  HardDrive,
  ListChecks,
  Radar,
  Scale,
  ServerCrash,
  ShieldCheck,
  TriangleAlert,
  X
} from 'lucide-react'
import { spring, useVideoConfig } from 'remotion'
import type { SlideModule, SlideRenderContext } from '../../../src/types'
import { CtaSlide, LogoMark } from '../../../src/deck-shared'

export const slides: SlideModule['slides'] = [
  { id: 'opening', render: (props) => <OpeningSlide {...props} /> },
  { id: 'profile', render: (props) => <ProfileSlide {...props} /> },
  { id: 'what-happened', render: (props) => <WhatHappenedSlide {...props} /> },
  { id: 'az-status', render: (props) => <AzStatusSlide {...props} /> },
  { id: 'timeline', render: (props) => <TimelineSlide {...props} /> },
  { id: 'section-lesson', render: (props) => <SectionLessonSlide {...props} /> },
  { id: 'multi-az-limit', render: (props) => <MultiAzLimitSlide {...props} /> },
  { id: 'blast-radius', render: (props) => <BlastRadiusSlide {...props} /> },
  { id: 'why-left-behind', render: (props) => <WhyLeftBehindSlide {...props} /> },
  { id: 'the-question', render: (props) => <TheQuestionSlide {...props} /> },
  { id: 'checklist', render: (props) => <ChecklistSlide {...props} /> },
  { id: 'not-only-aws', render: (props) => <NotOnlyAwsSlide {...props} /> },
  { id: 'recap', render: (props) => <RecapSlide {...props} /> },
  { id: 'sources', render: (props) => <SourcesSlide {...props} /> },
  { id: 'cta', render: (props) => <CtaSlide {...props} /> }
]

function entrance(frame: number, fps: number, delay = 0) {
  return spring({ frame: frame - delay, fps, config: { damping: 18, stiffness: 105 } })
}

function lift(value: number, distance = 26) {
  return { opacity: value, transform: `translateY(${(1 - value) * distance}px)` }
}

function Header({ kicker, title, frame }: { kicker: string; title: React.ReactNode; frame: number }) {
  const { fps } = useVideoConfig()
  return (
    <div className="awsme-head" style={lift(entrance(frame, fps), 22)}>
      <span className="slide-kicker">{kicker}</span>
      <h1>{title}</h1>
    </div>
  )
}

function Punch({ frame, delay = 70, children }: { frame: number; delay?: number; children: React.ReactNode }) {
  const { fps } = useVideoConfig()
  return (
    <p className="awsme-punch" style={lift(entrance(frame, fps, delay), 14)}>
      {children}
    </p>
  )
}

function OpeningSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide opening-slide awsme-slide awsme-opening">
      <div className="motion-grid" />
      <LogoMark />
      <div className="showcase-copy">
        <span className="slide-kicker awsme-alarm" style={lift(entrance(frame, fps), 18)}>
          2026.09.15 ─ AWS HEALTH DASHBOARD
        </span>
        <h1 style={lift(entrance(frame, fps, 10), 26)}>
          クラウドのデータが、
          <br />
          物理的に消えた
        </h1>
        <p style={lift(entrance(frame, fps, 26), 18)}>
          AWSがバーレーンリージョン全域とUAEの1ゾーンについて、
          <b>「復旧できない」</b>と正式に認めた。障害ではなく、永久喪失。
        </p>
      </div>
    </section>
  )
}

function ProfileSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const facts = ['Microsoft MVP 14年連続', 'Windows・Azure・M365', 'クラウド基盤を実機で検証', '著書「Windowsインフラ管理者入門」']
  return (
    <section className="remotion-slide awsme-slide">
      <Header kicker="YOUR GUIDE" title="解説する人：胡田 昌彦" frame={frame} />
      <div className="awsme-profile-layout">
        <div className="awsme-profile-mark" style={lift(entrance(frame, fps, 16), 22)}>
          <LogoMark className="awsme-profile-logo" />
          <strong>
            Masahiko
            <br />
            Ebisuda
          </strong>
          <span>えびすだ まさひこ</span>
        </div>
        <div className="awsme-profile-facts">
          {facts.map((fact, i) => (
            <div key={fact} style={lift(entrance(frame, fps, 28 + i * 10), 16)}>
              <Check size={26} />
              <strong>{fact}</strong>
            </div>
          ))}
        </div>
      </div>
      <Punch frame={frame} delay={72}>
        AWSの事例ですが、扱うのは<b>クラウド全般の設計前提</b>の話です。
      </Punch>
    </section>
  )
}

function WhatHappenedSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const quotes = [
    'インフラへの損傷は複数のアベイラビリティゾーンにおよび、リージョナルおよびマルチAZサービスが耐えうる設計範囲を超えていた',
    'このリージョンのみに保管されていたリソースとデータへのアクセスを回復することはできないと判断した'
  ]
  return (
    <section className="remotion-slide awsme-slide">
      <Header kicker="THE STATEMENT" title="発表の中身は、この2行" frame={frame} />
      <div className="awsme-quotes">
        {quotes.map((quote, i) => (
          <blockquote key={quote} style={lift(entrance(frame, fps, 18 + i * 14), 18)}>
            {quote}
          </blockquote>
        ))}
      </div>
      <Punch frame={frame} delay={70}>
        鍵は<b>「このリージョンのみに」</b>。外にコピーがあったものは、生き残っています。
      </Punch>
    </section>
  )
}

function AzStatusSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const rows: Array<{ region: string; az: string; state: 'lost' | 'working' }> = [
    { region: 'バーレーン me-south-1', az: 'リージョン全域（複数AZ）', state: 'lost' },
    { region: 'UAE me-central-1', az: 'mec1-az1', state: 'working' },
    { region: 'UAE me-central-1', az: 'mec1-az2', state: 'lost' },
    { region: 'UAE me-central-1', az: 'mec1-az3', state: 'working' }
  ]
  return (
    <section className="remotion-slide awsme-slide">
      <Header kicker="STATUS" title="どこが、どうなったのか" frame={frame} />
      <div className="awsme-table">
        {rows.map((row, i) => (
          <div
            key={`${row.region}-${row.az}`}
            className={row.state === 'lost' ? 'awsme-row is-lost' : 'awsme-row'}
            style={lift(entrance(frame, fps, 16 + i * 9), 14)}
          >
            <span className="awsme-row-region">{row.region}</span>
            <strong>{row.az}</strong>
            <span className="awsme-row-state">
              {row.state === 'lost' ? <X size={26} /> : <ArrowRight size={26} />}
              {row.state === 'lost' ? '復旧不能' : '復旧作業中'}
            </span>
          </div>
        ))}
      </div>
      <Punch frame={frame} delay={70}>
        UAEは全滅ではありません。<b>そのAZにしか置いていなかったもの</b>が消えました。
      </Punch>
    </section>
  )
}

function TimelineSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const steps = [
    { date: '3月1日', icon: <Flame size={26} />, title: 'ドローン攻撃', body: 'UAEの2施設に直撃、バーレーン1施設が近隣着弾で損傷。消火設備の作動で水損も発生' },
    { date: '3月上旬', icon: <Radar size={26} />, title: 'AWSが退避を推奨', body: '中東の運用環境を「予測不可能」と位置づけ、他リージョンへの移行を案内' },
    { date: '4月上旬', icon: <ServerCrash size={26} />, title: 'バーレーンが全損', body: '2つ目のAZが損傷し、リージョン全体が利用不能に' },
    { date: '9月15日', icon: <CloudOff size={26} />, title: '復旧不能を正式発表', body: 'そのリージョンにしか存在しなかったデータは永久に失われた' }
  ]
  return (
    <section className="remotion-slide awsme-slide">
      <Header kicker="TIMELINE" title="6ヵ月で、何が起きたか" frame={frame} />
      <div className="awsme-timeline">
        {steps.map((step, i) => (
          <article key={step.date} style={lift(entrance(frame, fps, 14 + i * 10), 16)}>
            <span className="awsme-time-date">{step.date}</span>
            <div className="awsme-time-body">
              <strong>
                {step.icon}
                {step.title}
              </strong>
              <p>{step.body}</p>
            </div>
          </article>
        ))}
      </div>
      <Punch frame={frame} delay={72}>
        勧告から全損まで、<b>逃げる時間は約1ヵ月</b>ありました。
      </Punch>
    </section>
  )
}

function SectionLessonSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide awsme-slide awsme-section">
      <div className="motion-grid" />
      <div className="showcase-copy" style={lift(entrance(frame, fps), 24)}>
        <span className="slide-kicker">SECTION</span>
        <h1>ここから、設計の話</h1>
        <p>ニュースの整理は終わり。自分のシステムに引き寄せます。</p>
      </div>
    </section>
  )
}

function MultiAzLimitSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const covered = ['停電', '火災（1拠点）', '水害', 'ハード故障', 'ネットワーク断']
  return (
    <section className="remotion-slide awsme-slide">
      <Header kicker="DESIGN ASSUMPTION" title={<>マルチAZは「1拠点が落ちる」ための設計</>} frame={frame} />
      <div className="awsme-split">
        <div className="awsme-card is-ok" style={lift(entrance(frame, fps, 16), 18)}>
          <ShieldCheck size={34} />
          <h2>想定内</h2>
          <ul>
            {covered.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="awsme-card is-ng" style={lift(entrance(frame, fps, 30), 18)}>
          <TriangleAlert size={34} />
          <h2>想定外</h2>
          <ul>
            <li>複数AZが同時に物理破壊される</li>
            <li>リージョンごと立ち入り不能になる</li>
          </ul>
        </div>
      </div>
      <Punch frame={frame} delay={72}>
        前提は<b>「同時に全部は壊れない」</b>。今回はその前提が外から壊されました。
      </Punch>
    </section>
  )
}

function BlastRadiusSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide awsme-slide">
      <Header kicker="BLAST RADIUS" title={<>リージョンは「一度に失われうる単位」</>} frame={frame} />
      <div className="awsme-radius" style={lift(entrance(frame, fps, 18), 20)}>
        <div className="awsme-radius-region">
          <span className="awsme-radius-label">
            <Globe size={24} />
            REGION
          </span>
          <div className="awsme-radius-azs">
            <span>
              <Database size={22} />
              AZ 1
            </span>
            <span>
              <Database size={22} />
              AZ 2
            </span>
            <span>
              <Database size={22} />
              AZ 3
            </span>
          </div>
          <p>同じ災害・同じ紛争・同じ規制が、一度に届く範囲</p>
        </div>
        <ArrowRight size={44} className="awsme-radius-arrow" />
        <div className="awsme-radius-out" style={lift(entrance(frame, fps, 36), 20)}>
          <Globe size={30} />
          <strong>別リージョン</strong>
          <p>この単位から抜ける唯一の方法</p>
        </div>
      </div>
      <Punch frame={frame} delay={74}>
        AZを3つに分けても、<b>影響範囲はリージョンのまま</b>縮みません。
      </Punch>
    </section>
  )
}

function WhyLeftBehindSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const reasons = [
    { icon: <Scale size={30} />, title: 'データ所在地の規制', body: '国内保存義務があると、国外への複製そのものが選べない' },
    { icon: <HardDrive size={30} />, title: 'DRのコスト判断', body: 'リージョン間の転送量と二重の保管料は「やるか」の検討対象だった' },
    { icon: <Building2 size={30} />, title: '規制業種ほど動けない', body: '銀行・金融系ITは移行先の選定が単純ではない' }
  ]
  return (
    <section className="remotion-slide awsme-slide">
      <Header kicker="WHY" title="なぜデータが残ってしまったのか" frame={frame} />
      <div className="awsme-cards">
        {reasons.map((reason, i) => (
          <article key={reason.title} style={lift(entrance(frame, fps, 16 + i * 11), 16)}>
            {reason.icon}
            <h2>{reason.title}</h2>
            <p>{reason.body}</p>
          </article>
        ))}
      </div>
      <Punch frame={frame} delay={74}>
        安全側に倒したはずの<b>「国内のみ保管」</b>が、そのまま単一障害点になりました。
      </Punch>
    </section>
  )
}

function TheQuestionSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide awsme-slide awsme-question">
      <div className="motion-grid" />
      <div className="showcase-copy">
        <span className="slide-kicker" style={lift(entrance(frame, fps), 18)}>
          THE ONE QUESTION
        </span>
        <h1 style={lift(entrance(frame, fps, 12), 24)}>
          <CircleHelp size={58} />
          そのバックアップは、
          <br />
          どこにありますか？
        </h1>
        <p style={lift(entrance(frame, fps, 30), 18)}>
          「同じリージョンの別AZ」は、<b>答えになっていません</b>。
          今回消えたデータの多くは、きちんとバックアップされていました。同じリージョンの中に。
        </p>
      </div>
    </section>
  )
}

function ChecklistSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const items = [
    {
      title: 'そのリージョンにしか無いものを洗い出す',
      body: 'データだけでなく、鍵・証明書・コンテナイメージ・IaCの状態ファイル・復旧手順書まで'
    },
    {
      title: 'リージョン外のコピーから、実際に戻してみる',
      body: '年1回でいい。戻して初めてバックアップになる'
    },
    {
      title: '退避の判断基準を、先に決めておく',
      body: '動けた組織と動けなかった組織を分けたのは、技術ではなく意思決定の速さ'
    }
  ]
  return (
    <section className="remotion-slide awsme-slide">
      <Header kicker="ACTION" title="明日、確認する3つ" frame={frame} />
      <div className="awsme-checklist">
        {items.map((item, i) => (
          <article key={item.title} style={lift(entrance(frame, fps, 16 + i * 12), 16)}>
            <span className="awsme-check-no">{i + 1}</span>
            <div>
              <strong>{item.title}</strong>
              <p>{item.body}</p>
            </div>
          </article>
        ))}
      </div>
      <Punch frame={frame} delay={76}>
        <ListChecks size={30} /> 見るのは<b>バックアップの有無ではなく、置き場所</b>です。
      </Punch>
    </section>
  )
}

function NotOnlyAwsSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const points = [
    'Google Cloud・Microsoft Azureも中東でリージョンを運営している',
    '物理的に破壊されれば、どの事業者でも結果は同じ',
    'IRGCはMicrosoft・Google・Oracle・NVIDIAの中東拠点も攻撃対象と宣言'
  ]
  return (
    <section className="remotion-slide awsme-slide">
      <Header kicker="NOT A VENDOR STORY" title="これはAWS固有の話ではない" frame={frame} />
      <ul className="awsme-list">
        {points.map((point, i) => (
          <li key={point} style={lift(entrance(frame, fps, 16 + i * 11), 14)}>
            <ArrowRight size={28} />
            <span>{point}</span>
          </li>
        ))}
      </ul>
      <Punch frame={frame} delay={74}>
        <b>クラウドには物理的な場所がある。</b>それを最も過酷な形で突きつけられました。
      </Punch>
    </section>
  )
}

function RecapSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const points = [
    'マルチAZは1拠点の障害用。リージョンごと失われる事態は設計範囲外',
    '影響範囲の単位はリージョン。抜けるにはリージョンをまたぐしかない',
    '問うべきはバックアップの有無ではなく、置き場所と、戻せるかどうか'
  ]
  return (
    <section className="remotion-slide awsme-slide">
      <Header kicker="RECAP" title="覚えるのは、この3つ" frame={frame} />
      <ul className="awsme-recap">
        {points.map((point, i) => (
          <li key={point} style={lift(entrance(frame, fps, 16 + i * 12), 14)}>
            <Check size={30} />
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

function SourcesSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const sources: Array<[string, string]> = [
    ['AWS Health Dashboard（一次情報）', 'https://health.aws.amazon.com/health/status'],
    ['ITmedia NEWS ─ 一部データは回復不能', 'https://www.itmedia.co.jp/news/article/2609/17/2000001590/'],
    ['GIGAZINE ─ 顧客データが永久に失われる', 'https://gigazine.net/news/20260917-aws-middle-east-data-center-unable-to-restore/'],
    ['サーバーワークス ─ 障害の状況整理と地政学リスク', 'https://blog.serverworks.co.jp/aws-uae-bahrain-outage-2026'],
    ['情報の灯台 ─ 中東データ永久喪失', 'https://joho-todai.com/aws-middle-east-data-permanently-lost/']
  ]
  return (
    <section className="remotion-slide awsme-slide">
      <Header kicker="REFERENCES" title="出典" frame={frame} />
      <div className="awsme-source-list">
        {sources.map(([label, href], i) => (
          <a key={href} href={href} target="_blank" rel="noreferrer" style={lift(entrance(frame, fps, 12 + i * 8), 14)}>
            <strong>{label}</strong>
            <span>{href.replace('https://', '')}</span>
          </a>
        ))}
      </div>
      <Punch frame={frame} delay={64}>
        判断の前に、<b>必ず一次情報の最新状態</b>を確認してください。
      </Punch>
    </section>
  )
}
