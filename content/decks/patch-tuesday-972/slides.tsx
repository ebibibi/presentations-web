/* eslint-disable react-refresh/only-export-components */
import type { ReactNode } from 'react'
import {
  AlertTriangle,
  Boxes,
  Bug,
  CalendarDays,
  ClipboardList,
  Database,
  FileWarning,
  Globe,
  KeyRound,
  Mail,
  MonitorSmartphone,
  Ruler,
  ScanSearch,
  ShieldAlert,
  Siren,
  Timer,
  Users,
  Worm,
} from 'lucide-react'
import { LogoMark } from '../../../src/deck-shared'
import type { SlideModule } from '../../../src/types'
import './styles.css'

export const slides: SlideModule['slides'] = [
  { render: () => <OpeningSlide /> },
  { render: () => <NumbersSlide /> },
  { render: () => <YearChartSlide /> },
  { render: () => <MonthChartSlide /> },
  { render: () => <WhySlide /> },
  { render: () => <LetterSlide /> },
  { render: () => <NotYetSlide /> },
  { render: () => <NotableSlide /> },
  { render: () => <WormableSlide /> },
  { render: () => <TriageSlide /> },
  { render: () => <CountingSlide /> },
  { render: () => <RecapSlide /> },
]

const SOURCES = {
  ars: 'https://arstechnica.com/security/2026/09/microsoft-patches-a-record-972-vulnerabilities-112-of-them-critical/',
  zdi: 'https://www.zerodayinitiative.com/blog/2026/9/8/the-september-2026-security-update-review',
  msrc: 'https://msrc.microsoft.com/update-guide/',
  letter: 'https://openai.com/collective-cyberdefense',
}

/** 数えた条件は1か所に書いて、両方のグラフで同じ文言を使う。 */
const COUNT_NOTE =
  'MSRCのCVRF APIを月ごとに取得し、Microsoft Edge (Chromium-based) と Azure Linux (Mariner) のCVEを除いて数えた件数'

function Shell({
  children,
  eyebrow,
  footer,
  title,
}: {
  children: ReactNode
  eyebrow: string
  footer?: ReactNode
  title: ReactNode
}) {
  return (
    <section className="remotion-slide pt972-slide pt972-standard">
      <div className="pt972-grid" />
      <LogoMark className="pt972-logo" />
      <header className="pt972-page-head">
        <span>{eyebrow}</span>
        <h1>{title}</h1>
      </header>
      <main className="pt972-page-body">{children}</main>
      <footer className="pt972-page-footer">
        <span>2026年9月 Microsoft月例更新</span>
        <div>{footer}</div>
      </footer>
    </section>
  )
}

function Src({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer">
      {children}
    </a>
  )
}

type Bar = { label: string; value: number; accent?: boolean; valueLabel?: string }

/**
 * 単系列の棒グラフ。値は棒の上に直接置くので凡例も目盛りも要らない。
 * 強調色は「記録を更新した期間」だけに使い、系列の色分けには使わない。
 */
function BarChart({
  bars,
  caption,
  height = 470,
}: {
  bars: Bar[]
  caption: string
  height?: number
}) {
  const width = 1120
  const top = 54
  const bottom = 62
  const plot = height - top - bottom
  const max = Math.max(...bars.map((b) => b.value))
  const slot = width / bars.length
  const barWidth = Math.min(96, slot * 0.56)

  return (
    <figure className="pt972-chart">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={caption}>
        <line
          className="pt972-axis"
          x1={0}
          x2={width}
          y1={height - bottom}
          y2={height - bottom}
        />
        {bars.map((bar, index) => {
          const barHeight = Math.max(4, (bar.value / max) * plot)
          const x = index * slot + (slot - barWidth) / 2
          const y = height - bottom - barHeight
          return (
            <g key={bar.label}>
              <rect
                className={bar.accent ? 'pt972-bar is-accent' : 'pt972-bar'}
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                rx={6}
              />
              <text
                className={bar.accent ? 'pt972-bar-value is-accent' : 'pt972-bar-value'}
                x={x + barWidth / 2}
                y={y - 14}
                textAnchor="middle"
              >
                {bar.valueLabel ?? bar.value.toLocaleString('en-US')}
              </text>
              <text
                className="pt972-bar-label"
                x={x + barWidth / 2}
                y={height - bottom + 34}
                textAnchor="middle"
              >
                {bar.label}
              </text>
            </g>
          )
        })}
      </svg>
      <figcaption>{caption}</figcaption>
    </figure>
  )
}

const YEAR_BARS: Bar[] = [
  { label: '2021', value: 871 },
  { label: '2022', value: 944 },
  { label: '2023', value: 948 },
  { label: '2024', value: 1069 },
  { label: '2025', value: 1242 },
  { label: '2026*', value: 2871, accent: true },
]

const MONTH_BARS: Bar[] = [
  { label: '1月', value: 125 },
  { label: '2月', value: 61 },
  { label: '3月', value: 97 },
  { label: '4月', value: 183 },
  { label: '5月', value: 156 },
  { label: '6月', value: 221 },
  { label: '7月', value: 606 },
  { label: '8月', value: 449 },
  { label: '9月', value: 973, accent: true },
]

function OpeningSlide() {
  return (
    <section className="remotion-slide pt972-slide pt972-opening">
      <div className="pt972-grid" />
      <LogoMark className="pt972-logo" />
      <div className="pt972-opening-copy">
        <span>SECURITY / PATCH TUESDAY</span>
        <h1>
          1か月で
          <br />
          <em>972件</em>
        </h1>
        <p>
          2026年9月のMicrosoft月例更新は、新規CVEが過去最多の972件になりました。
          去年1年分に迫る量が、1回のPatch Tuesdayで出ています。
        </p>
      </div>
      <div className="pt972-opening-side">
        <article className="pt972-open-card is-red">
          <Siren />
          <strong>先月の約1.5倍</strong>
          <small>8月は約620件。7月の570件が当時の最多だった</small>
        </article>
        <article className="pt972-open-card is-blue">
          <Bug />
          <strong>2026年は9月時点で約2,800件</strong>
          <small>2025年1年間の2倍以上をすでに超えている</small>
        </article>
      </div>
    </section>
  )
}

function NumbersSlide() {
  return (
    <Shell
      eyebrow="今月の数字"
      title="972 / 997 / 114 / 2"
      footer={<Src href={SOURCES.zdi}>Zero Day Initiative「The September 2026 Security Update Review」</Src>}
    >
      <div className="pt972-stat-row">
        <article className="pt972-stat">
          <strong>972</strong>
          <span>新規CVE</span>
          <small>Microsoft製品として今月新たに公開されたもの</small>
        </article>
        <article className="pt972-stat">
          <strong>997</strong>
          <span>総数</span>
          <small>Edgeに取り込まれるChromium等を含めた数え方</small>
        </article>
        <article className="pt972-stat is-red">
          <strong>114</strong>
          <span>Critical</span>
          <small>残りはImportant。Ars Technicaは112としている</small>
        </article>
        <article className="pt972-stat is-red">
          <strong>2</strong>
          <span>悪用中のゼロデイ</span>
          <small>いずれも権限昇格。単体では侵入経路にならない</small>
        </article>
      </div>
      <p className="pt972-note">
        <Ruler />
        同じ月の同じ更新でも、集計元によって数十件ずれます。数え方が違うだけで、増えたという事実は同じです。
      </p>
    </Shell>
  )
}

function YearChartSlide() {
  return (
    <Shell
      eyebrow="年別"
      title="5年ぶん横ばいだったものが、今年だけ跳ねた"
      footer={<Src href={SOURCES.msrc}>データ: Microsoft Security Update Guide (CVRF)</Src>}
    >
      <BarChart
        bars={YEAR_BARS}
        caption={`年ごとのMicrosoft CVE件数。* 2026年は1月〜9月の合計。${COUNT_NOTE}。`}
      />
      <p className="pt972-note">
        <CalendarDays />
        2021年から2025年までは年900〜1,200件台。2026年は9月の時点で、その2倍以上に達しています。
      </p>
    </Shell>
  )
}

function MonthChartSlide() {
  return (
    <Shell
      eyebrow="月別"
      title="変化が起きたのは今年の夏から"
      footer={<Src href={SOURCES.msrc}>データ: Microsoft Security Update Guide (CVRF)</Src>}
    >
      <BarChart
        bars={MONTH_BARS}
        caption={`2026年の月ごとのMicrosoft CVE件数。${COUNT_NOTE}。`}
      />
      <p className="pt972-note">
        <Timer />
        6月まで月100〜200件台。7月に跳ね、9月に1,000件近くへ。月ごとの値は集計元で違いますが、跳ねた時期は一致します。
      </p>
    </Shell>
  )
}

function WhySlide() {
  return (
    <Shell
      eyebrow="原因"
      title="製品が急に脆くなったわけではない"
      footer={<Src href={SOURCES.ars}>Ars Technica「Why this month's Microsoft patch release is a doozy」</Src>}
    >
      <div className="pt972-flow">
        <article className="pt972-flow-card">
          <ScanSearch />
          <strong>AIが脆弱性を探す</strong>
          <small>人手では追えない量のコードを、機械が継続的に読む</small>
        </article>
        <span className="pt972-flow-arrow">→</span>
        <article className="pt972-flow-card">
          <Bug />
          <strong>見つかる数が増える</strong>
          <small>元からあった不具合が、先に発見されるようになった</small>
        </article>
        <span className="pt972-flow-arrow">→</span>
        <article className="pt972-flow-card is-blue">
          <ShieldAlert />
          <strong>修正の数が増える</strong>
          <small>公開されるCVEの件数は、その結果として跳ね上がる</small>
        </article>
      </div>
      <p className="pt972-note">
        <AlertTriangle />
        件数の増加は「危険が増えた」ではなく「見つかるようになった」の指標です。ただし公開された瞬間から、攻撃側もその情報を読めます。
      </p>
    </Shell>
  )
}

function LetterSlide() {
  return (
    <Shell
      eyebrow="業界の動き"
      title="猶予が縮む、と業界が自分で言っている"
      footer={<Src href={SOURCES.letter}>OpenAI「Collective cyberdefense」共同書簡</Src>}
    >
      <div className="pt972-two">
        <article className="pt972-panel">
          <Users />
          <strong>100を超える企業・団体の共同書簡</strong>
          <p>
            OpenAI、Anthropic、AWS、Google、Microsoftらが2026年8月下旬に署名。
            AIを使った攻撃が来る前提で、パッチ適用に使える時間が短くなると警告しました。
          </p>
        </article>
        <article className="pt972-panel is-red">
          <Timer />
          <strong>「公開されてから直すまで」の勝負になる</strong>
          <p>
            見つける側も攻める側も同じ道具を持ちます。修正が出ていること自体は守りにならず、
            自分の環境に入っているかどうかだけが結果を決めます。
          </p>
        </article>
      </div>
    </Shell>
  )
}

function NotYetSlide() {
  return (
    <section className="remotion-slide pt972-slide pt972-punch">
      <div className="pt972-grid" />
      <LogoMark className="pt972-logo" />
      <span className="pt972-punch-eyebrow">まだ起きていないこと</span>
      <h1>
        件数は跳ねた。
        <br />
        <em>悪用の急増は、まだ来ていない。</em>
      </h1>
      <p>
        Zero Day InitiativeのDustin Childs氏は、AI支援の脆弱性発見に減速の兆しはないとしながら、
        それに比例した実際の悪用の急増はまだ見えていない、と書いています。
      </p>
      <p className="pt972-punch-note">
        だから今は、慌てて全部読む時間ではなく、選び方の仕組みを整える時間です。
      </p>
    </section>
  )
}

function NotableSlide() {
  return (
    <Shell
      eyebrow="今月の要注意"
      title="番号ではなく、持っている資産で覚える"
      footer={<Src href={SOURCES.zdi}>個別のCVE番号と評価はZDIの解説へ</Src>}
    >
      <div className="pt972-list">
        <article className="pt972-item is-red">
          <Siren />
          <div>
            <strong>悪用中のゼロデイ2件（Windows）</strong>
            <small>Windows Updateのスタックと、ALPCの権限昇格。他の不具合と組み合わせて使われる形</small>
          </div>
        </article>
        <article className="pt972-item">
          <Mail />
          <div>
            <strong>Exchange Server</strong>
            <small>細工した添付ファイル付きのメールを送るだけで、認証なしにコード実行に至りうるもの</small>
          </div>
        </article>
        <article className="pt972-item">
          <Globe />
          <div>
            <strong>SharePoint</strong>
            <small>今月だけで17件。インターネットに露出しているサーバーから先に当てる</small>
          </div>
        </article>
        <article className="pt972-item">
          <Database />
          <div>
            <strong>SQL Server</strong>
            <small>権限昇格が60件。Copilot経由の指示から引ける経路も含まれる</small>
          </div>
        </article>
        <article className="pt972-item">
          <MonitorSmartphone />
          <div>
            <strong>リモートデスクトップサービス</strong>
            <small>深刻度9.8のリモートコード実行。外から届く位置にあるなら最優先</small>
          </div>
        </article>
        <article className="pt972-item">
          <KeyRound />
          <div>
            <strong>Microsoft Authenticator</strong>
            <small>認証の仕組み自体の権限昇格。守りの土台側が対象になっている</small>
          </div>
        </article>
      </div>
    </Shell>
  )
}

function WormableSlide() {
  return (
    <section className="remotion-slide pt972-slide pt972-punch">
      <div className="pt972-grid" />
      <LogoMark className="pt972-logo" />
      <span className="pt972-punch-eyebrow">性質の話</span>
      <h1>
        ワーム性のあるものが多すぎて
        <br />
        <em>20件で数えるのをやめた</em>
      </h1>
      <p>
        利用者の操作を必要とせず、端末から端末へ自分で広がりうる種類の脆弱性です。
        1台入られた時点で止めにくくなるため、件数ではなくこの性質で優先順位が決まります。
      </p>
      <p className="pt972-punch-note">
        DHCP、DNS、SMB、Netlogon、Active Directoryのドメインサービス — 社内ネットワークの土台が並んでいます。
      </p>
    </section>
  )
}

function TriageSlide() {
  return (
    <Shell
      eyebrow="運用"
      title="全部読む運用は、もう成り立たない"
      footer={<span>優先順位は毎月同じ順番で機械的に付ける</span>}
    >
      <div className="pt972-steps">
        <article className="pt972-step">
          <span>1</span>
          <div>
            <strong>悪用が確認されているもの</strong>
            <small>今月なら2件。ここだけは件数に関係なく即日で判断する</small>
          </div>
        </article>
        <article className="pt972-step">
          <span>2</span>
          <div>
            <strong>インターネットから届く資産</strong>
            <small>公開しているExchange、SharePoint、リモートデスクトップの入口</small>
          </div>
        </article>
        <article className="pt972-step">
          <span>3</span>
          <div>
            <strong>ワーム性のあるもの</strong>
            <small>1台で止まらない種類。社内の土台サービスが対象なら格上げする</small>
          </div>
        </article>
        <article className="pt972-step">
          <span>4</span>
          <div>
            <strong>自分が実際に持っている製品</strong>
            <small>資産の一覧が先。持っていない製品のCVEは読む必要がない</small>
          </div>
        </article>
      </div>
      <p className="pt972-note">
        <ClipboardList />
        CVEを1件ずつ読む運用から、資産の一覧を起点に絞る運用へ。件数が3倍になっても、この順番なら読む量は増えません。
      </p>
    </Shell>
  )
}

function CountingSlide() {
  return (
    <Shell
      eyebrow="指標"
      title="件数そのものを、報告の指標にしない"
      footer={<span>見るべきは件数ではなく、適用までの時間</span>}
    >
      <div className="pt972-two">
        <article className="pt972-panel is-red">
          <FileWarning />
          <strong>件数は数え方で動く</strong>
          <p>
            972件、997件、私の集計では973件。年間で見ても2,760件と2,871件の差が出ます。
            Chromiumを含めるか、Azure Linuxを含めるかで結果が変わるためです。
          </p>
        </article>
        <article className="pt972-panel is-blue">
          <Boxes />
          <strong>動かない指標を持つ</strong>
          <p>
            公開から適用までの日数、未適用の資産の台数、外部に露出している資産の数。
            これらは数え方が変わっても意味が変わりません。
          </p>
        </article>
      </div>
      <p className="pt972-note">
        <Worm />
        件数をそのまま経営報告に載せると、集計の条件が変わっただけで「急増した」と読まれます。
      </p>
    </Shell>
  )
}

function RecapSlide() {
  return (
    <Shell
      eyebrow="まとめ"
      title="読む量ではなく、選び方を変える"
      footer={<Src href={SOURCES.ars}>元記事: Ars Technica</Src>}
    >
      <div className="pt972-recap">
        <article>
          <strong>1</strong>
          <p>2026年9月の月例更新は新規CVE 972件、Critical 114件、悪用中のゼロデイ2件。過去最多です。</p>
        </article>
        <article>
          <strong>2</strong>
          <p>増えた原因はAI支援の脆弱性発見。件数は跳ねましたが、悪用の急増はまだ観測されていません。</p>
        </article>
        <article>
          <strong>3</strong>
          <p>悪用中 → 外部公開 → ワーム性 → 保有製品の順で絞る。件数は指標にしない。</p>
        </article>
      </div>
      <div className="pt972-links">
        <Src href={SOURCES.zdi}>ZDI: The September 2026 Security Update Review</Src>
        <Src href={SOURCES.ars}>Ars Technica: Why this month's Microsoft patch release is a doozy</Src>
        <Src href={SOURCES.msrc}>Microsoft Security Update Guide</Src>
      </div>
    </Shell>
  )
}
