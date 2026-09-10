/* eslint-disable react-refresh/only-export-components */
import {
  Activity,
  ArrowRight,
  Bot,
  Boxes,
  Check,
  Clock,
  Cloud,
  FileCheck,
  Guitar,
  HardDrive,
  KeyRound,
  Languages,
  ListChecks,
  MonitorCheck,
  RotateCcw,
  Server,
  ShieldCheck,
  Terminal,
  TriangleAlert,
  Users,
  X,
  Zap
} from 'lucide-react'
import { spring, useVideoConfig } from 'remotion'
import type { SlideModule, SlideRenderContext } from '../../../src/types'
import { LogoMark } from '../../../src/deck-shared'

export const slides: SlideModule['slides'] = [
  { render: (props) => <OpeningSlide {...props} /> },
  { render: (props) => <AgendaSlide {...props} /> },
  { render: (props) => <ProfileSlide {...props} /> },
  { render: (props) => <Recap76Slide {...props} /> },
  { render: (props) => <TheLabSlide {...props} /> },
  { render: (props) => <InventorySlide {...props} /> },
  { render: (props) => <ProofSlide {...props} /> },
  { render: (props) => <ThreeQuestionsSlide {...props} /> },
  { render: (props) => <McVsPolicySlide {...props} /> },
  { render: (props) => <TwoNetsSlide {...props} /> },
  { render: (props) => <ExperimentSlide {...props} /> },
  { render: (props) => <ResultAgentSlide {...props} /> },
  { render: (props) => <ResultMcSlide {...props} /> },
  { render: (props) => <GhostSlide {...props} /> },
  { render: (props) => <ResultPolicySlide {...props} /> },
  { render: (props) => <TimezoneTrapSlide {...props} /> },
  { render: (props) => <RecoveryRunbookSlide {...props} /> },
  { render: (props) => <UpdateManagerSlide {...props} /> },
  { render: (props) => <HotpatchSlide {...props} /> },
  { render: (props) => <AiCoversSlide {...props} /> },
  { render: (props) => <ConclusionSlide {...props} /> },
  { render: (props) => <NextSessionSlide {...props} /> },
  { render: (props) => <QaSlide {...props} /> },
  { render: (props) => <Promo1003Slide {...props} /> },
  { render: (props) => <ClosingSlide {...props} /> }
]

function entrance(frame: number, fps: number, delay = 0) {
  return spring({ frame: frame - delay, fps, config: { damping: 18, stiffness: 105 } })
}

function lift(value: number, distance = 26) {
  return { opacity: value, transform: `translateY(${(1 - value) * distance}px)` }
}

function Head({ kicker, title, frame }: { kicker: string; title: React.ReactNode; frame: number }) {
  const { fps } = useVideoConfig()
  return (
    <div className="h77-head" style={lift(entrance(frame, fps), 20)}>
      <span className="h77-kicker">{kicker}</span>
      <h1>{title}</h1>
    </div>
  )
}

// Marks a slide where the presenter leaves the deck for a real screen. The
// label is the screen to open, so it works as a cue for the room and for the
// presenter at the same time. Full steps live in the slide notes.
function LiveCue({ label }: { label: string }) {
  return (
    <span className="h77-live">
      <span className="h77-live-dot" />
      LIVE {label}
    </span>
  )
}

function Source({ href, label }: { href: string; label: string }) {
  return (
    <a className="h77-source" href={href} target="_blank" rel="noreferrer">
      {label}
    </a>
  )
}

function OpeningSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const drift = Math.sin(frame / 20) * 6
  return (
    <section className="remotion-slide h77-slide h77-opening">
      <div className="h77-grid" />
      <LogoMark className="h77-logo" />
      <div className="h77-opening-copy" style={lift(entrance(frame, fps), 40)}>
        <span className="h77-kicker">HCCJP 第77回勉強会 ・ 2026.9.11</span>
        <h1>
          サーバーが
          <br />
          巻き戻ったとき、
          <br />
          <em>Azureはどうなる？</em>
        </h1>
        <p>Azure Arc ─ エージェント・マシン構成・Policy を、実機で戻してみた</p>
      </div>
      <div className="h77-opening-visual" style={{ transform: `translateY(${drift}px)` }}>
        <div className="h77-orbit" style={lift(entrance(frame, fps, 24), 20)}>
          <Cloud size={150} className="h77-ic-cloud" />
          <div className="h77-dash" />
          <Server size={140} className="h77-ic-server" />
          <RotateCcw size={92} className="h77-ic-rewind" />
        </div>
      </div>
      <p className="h77-speaker" style={lift(entrance(frame, fps, 44), 16)}>
        胡田 昌彦 ／ 日本ビジネスシステムズ株式会社・Microsoft MVP
      </p>
    </section>
  )
}

function AgendaSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const rows = [
    ['14:00', '5分', 'オープニング', '胡田 昌彦'],
    ['14:05', '45分', 'サーバーが巻き戻ったとき、Azureはどうなる？', '胡田 昌彦'],
    ['14:50', '10分', 'Q&A', '胡田 昌彦'],
    ['15:00', '20分', 'Microsoft "Adaptive Cloud" 最新動向', '高添 修 氏'],
    ['15:20', '5分', 'Q&A', '高添 修 氏'],
    ['15:25', '5分', 'クロージング', '胡田 昌彦']
  ]
  return (
    <section className="remotion-slide h77-slide">
      <div className="h77-grid" />
      <Head kicker="AGENDA" title="本日の流れ" frame={frame} />
      <table className="h77-table h77-agenda">
        <tbody>
          {rows.map((row, index) => (
            <tr key={row[0] + row[2]} style={lift(entrance(frame, fps, 10 + index * 6), 16)}>
              <td className="h77-time">{row[0]}</td>
              <td className="h77-dur">{row[1]}</td>
              <td className="h77-title">{row[2]}</td>
              <td className="h77-who">{row[3]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

function ProfileSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide h77-slide">
      <div className="h77-grid" />
      <Head kicker="SPEAKER" title="話す人" frame={frame} />
      <div className="h77-two">
        <div className="h77-card" style={lift(entrance(frame, fps, 12), 20)}>
          <h2>胡田 昌彦</h2>
          <p>日本ビジネスシステムズ株式会社</p>
          <ul>
            <li>Microsoft MVP ─ Cloud and Datacenter Management / Microsoft Azure（14年連続）</li>
            <li>ハイブリッドクラウド研究会（HCCJP）主幹事</li>
            <li>YouTube で Azure・Microsoft 365・生成AI を解説</li>
          </ul>
        </div>
        <div className="h77-card h77-card-quiet" style={lift(entrance(frame, fps, 26), 20)}>
          <h2>HCCJP について</h2>
          <ul>
            <li>毎月第2金曜 14:00〜、7年以上続けているコミュニティ</li>
            <li>Azure ／ ハイブリッドクラウド ／ 生成AI が柱</li>
            <li>企業・個人を問わず、どなたでも参加できます</li>
            <li>事例共有・構成相談・ご登壇も歓迎です</li>
          </ul>
        </div>
      </div>
    </section>
  )
}

function Recap76Slide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide h77-slide">
      <div className="h77-grid" />
      <Head kicker="RECAP ─ 第76回" title="Arcで繋ぐと、ここまで楽になる" frame={frame} />
      <div className="h77-recap">
        <div className="h77-recap-main" style={lift(entrance(frame, fps, 10), 20)}>
          <p className="h77-lead">
            オンプレのサーバーをその場で壊し、<strong>AIエージェントに直してもらいました</strong>。
          </p>
          <div className="h77-chips">
            <span>
              <X size={26} /> VPN なし
            </span>
            <span>
              <X size={26} /> 踏み台なし
            </span>
            <span>
              <X size={26} /> インバウンド開放なし
            </span>
            <span>
              <Check size={26} /> アウトバウンド 443 のみ
            </span>
          </div>
          <p className="h77-note">
            誰もそのサーバーにログインしないまま、調査から復旧まで Azure 経由で完結しました。
          </p>
        </div>
        <div className="h77-recap-side" style={lift(entrance(frame, fps, 26), 20)}>
          <Terminal size={44} />
          <p>
            Azure 側の入口が <code>az</code> に統一されている
            <br />
            ＝ AIエージェントがそのまま運用の手を持てる
          </p>
        </div>
      </div>
    </section>
  )
}

function TheLabSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const layers = [
    {
      tag: 'L0',
      name: 'nestedhyperv',
      body: '事務所の物理サーバー（Windows Server 2025）',
      note: '一番外側。ここは今日は触らない'
    },
    {
      tag: 'L1',
      name: 'nested-lab-01',
      body: 'ネストされた Hyper-V ホスト',
      note: 'チェックポイントを持っているのは、この層'
    },
    {
      tag: 'L2',
      name: 'arcwin01 ／ arclnx01',
      body: 'Windows Server 2025 ／ Ubuntu 24.04',
      note: 'Arc に繋いである。今日巻き戻すのは、この2台'
    }
  ]
  return (
    <section className="remotion-slide h77-slide">
      <div className="h77-grid" />
      <Head kicker="THE LAB" title="今日の登場人物 ─ どこにいるサーバーなのか" frame={frame} />
      <div className="h77-layers">
        {layers.map((layer, index) => (
          <div
            className={`h77-layer${index === 2 ? ' h77-layer-target' : ''}`}
            key={layer.tag}
            style={lift(entrance(frame, fps, 12 + index * 10), 18)}
          >
            <span className="h77-layer-tag">{layer.tag}</span>
            <div className="h77-layer-body">
              <strong>{layer.name}</strong>
              <p>{layer.body}</p>
            </div>
            <span className="h77-layer-note">{layer.note}</span>
          </div>
        ))}
      </div>
      <p className="h77-note h77-center" style={lift(entrance(frame, fps, 48), 14)}>
        <strong>戻す人と、戻される人は別の層にいる。</strong>
        Azure から見えているのは L2 だけで、チェックポイントの操作は Azure の外側で起きる。
      </p>
      <LiveCue label="Hyper-V マネージャー ─ nested-lab-01" />
    </section>
  )
}

function InventorySlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const cards = [
    {
      icon: <ListChecks size={40} />,
      head: '統制',
      items: ['マシン構成（OS設定をコードで監査・適用）', 'Azure Policy', 'タグと RBAC']
    },
    {
      icon: <ShieldCheck size={40} />,
      head: '保護',
      items: ['Defender for Servers / Endpoint', 'Microsoft Sentinel への連携']
    },
    {
      icon: <Boxes size={40} />,
      head: '構成',
      items: ['Azure Update Manager', 'VM拡張機能の配布', 'リモートでのコマンド実行', '変更履歴とインベントリ']
    },
    {
      icon: <Activity size={40} />,
      head: '監視',
      items: ['VM Insights', 'Azure Monitor Agent でログ・メトリック収集']
    }
  ]
  return (
    <section className="remotion-slide h77-slide">
      <div className="h77-grid" />
      <Head kicker="INVENTORY" title="まず棚卸し ─ Arc経由で何が手に入るのか" frame={frame} />
      <div className="h77-quad">
        {cards.map((card, index) => (
          <div className="h77-card" key={card.head} style={lift(entrance(frame, fps, 12 + index * 8), 18)}>
            <div className="h77-card-head">
              {card.icon}
              <h2>{card.head}</h2>
            </div>
            <ul>
              {card.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="h77-note h77-center" style={lift(entrance(frame, fps, 52), 14)}>
        エージェント1本入れるだけで、この全部が使えるようになる。
      </p>
      <Source
        href="https://learn.microsoft.com/azure/azure-arc/servers/overview"
        label="Microsoft Learn ─ Azure Arc-enabled servers overview"
      />
      <LiveCue label="ポータル ─ arcwin01 の左メニュー" />
    </section>
  )
}

function ProofSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const rows = [
    { icon: <Terminal size={34} />, what: 'Arc経由のコマンド実行（Run Command）', got: '42秒で結果が返る' },
    { icon: <KeyRound size={34} />, what: 'マネージドID でトークン取得', got: 'ゲスト内から取得成功・有効 24時間' },
    { icon: <Boxes size={34} />, what: '拡張機能の配布・設定更新', got: '2分以内に実機へ反映' },
    { icon: <MonitorCheck size={34} />, what: 'マシン構成（Guest Configuration）', got: '5分ごとに割当取得・15分ごとに評価' },
    { icon: <KeyRound size={34} />, what: 'Arc 経由の SSH（az ssh arc）', got: 'NAT内側の 10.10.0.41 へ、穴なしで到達' }
  ]
  return (
    <section className="remotion-slide h77-slide">
      <div className="h77-grid" />
      <Head kicker="PROOF" title="実際に動かして確かめた" frame={frame} />
      <div className="h77-rows">
        {rows.map((row, index) => (
          <div className="h77-row" key={row.what} style={lift(entrance(frame, fps, 12 + index * 8), 16)}>
            <div className="h77-row-ic">{row.icon}</div>
            <div className="h77-row-what">{row.what}</div>
            <ArrowRight size={28} className="h77-row-arrow" />
            <div className="h77-row-got">{row.got}</div>
          </div>
        ))}
      </div>
      <p className="h77-note h77-center" style={lift(entrance(frame, fps, 52), 14)}>
        すべて、インバウンドのポートを1つも開けずに。ここまで課金はゼロ。
      </p>
      <LiveCue label="" />
    </section>
  )
}

function ThreeQuestionsSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const questions = [
    {
      no: '①',
      icon: <Cloud size={38} />,
      head: 'エージェントはどうなるのか',
      body: 'Azure との繋がりは切れるのか。切れたら、現地に行かずに戻せるのか。'
    },
    {
      no: '②',
      icon: <MonitorCheck size={38} />,
      head: 'マシン構成はどうなるのか',
      body: '配ったOS設定は巻き戻る。Azure は気づいて、自分で直してくれるのか。'
    },
    {
      no: '③',
      icon: <FileCheck size={38} />,
      head: 'Policy はどうなるのか',
      body: '割り当ては残るのか。ポータルの準拠／非準拠は、いつ本当のことを言うのか。'
    }
  ]
  return (
    <section className="remotion-slide h77-slide h77-wall">
      <div className="h77-grid" />
      <Head kicker="TODAY'S FOCUS" title="今日確認する3つのこと" frame={frame} />
      <p className="h77-big-q" style={lift(entrance(frame, fps, 8), 20)}>
        スナップショットで巻き戻した。バックアップから復元した。Azure Arcで接続されたサーバーはどうなる？
      </p>
      <div className="h77-q3">
        {questions.map((q, index) => (
          <div className="h77-q3-item" key={q.no} style={lift(entrance(frame, fps, 18 + index * 10), 18)}>
            <span className="h77-q3-no">{q.no}</span>
            {q.icon}
            <strong>{q.head}</strong>
            <p>{q.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function McVsPolicySlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const rows: Array<[string, string, string]> = [
    ['何を見るか', 'Azure リソースの形', 'OS の中身'],
    ['例', '「この Arc マシンに拡張機能が入っているか」', '「タイムゾーンが東京か」「TLS 1.2 が有効か」'],
    ['どこで動くか', 'Azure Policy の評価エンジン', 'Arcエージェント内蔵の Machine Configuration agent'],
    ['直せるか', 'Modify / DeployIfNotExists で修復可能', 'ApplyAndAutoCorrect なら直す。Audit は直さない'],
    ['準拠の更新', '標準評価は24時間ごと ＋ 変更時トリガー・手動スキャン', '割当取得5分 ／ OS内の評価15分（実測: 監査型は60分）']
  ]
  return (
    <section className="remotion-slide h77-slide">
      <div className="h77-grid" />
      <Head kicker="THE CONFUSION" title="「Azure Policy」と「マシン構成」は、評価するレイヤーが違う" frame={frame} />
      <table className="h77-table h77-compare">
        <thead>
          <tr style={lift(entrance(frame, fps, 8), 14)}>
            <th />
            <th>
              <FileCheck size={30} /> Azure Policy
            </th>
            <th>
              <MonitorCheck size={30} /> マシン構成
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row[0]} style={lift(entrance(frame, fps, 14 + index * 7), 14)}>
              <td className="h77-th">{row[0]}</td>
              <td>{row[1]}</td>
              <td>{row[2]}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="h77-note h77-center" style={lift(entrance(frame, fps, 48), 14)}>
        Azure VM では拡張機能が要るが、<strong>Arc では Connected Machine agent に内蔵</strong>されている
        ─ 実測でも arcwin01 の拡張機能一覧に Guest Configuration は無い。
      </p>
      <p className="h77-punch-line" style={lift(entrance(frame, fps, 54), 16)}>
        <TriangleAlert size={38} />
        <span>
          マシン構成は旧称 <strong>Azure Policy Guest Configuration</strong>。別サービスではなく、
          <strong>Policy から配って、結果を Policy が読み取る</strong>。
          <br />
          だから準拠状態は<strong>両方に出る</strong>。しかも<strong>同じタイミングでは更新されない</strong> ─ ここが今日の伏線です。
        </span>
      </p>
    </section>
  )
}

function TwoNetsSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const rows: Array<[string, string, string]> = [
    ['置き場所', '同じホスト・同じストレージ', '別媒体・別サイト'],
    ['ホストが死んだら', '一緒に消える', '残る'],
    ['ランサムウェア', 'ほぼ無力', '対策になる'],
    ['戻す速さ', '数分', '時間単位'],
    ['復元先', '元のVMに戻るだけ', '元の場所ならサポート内／別ホストは管理対象外VMになる']
  ]
  return (
    <section className="remotion-slide h77-slide">
      <div className="h77-grid" />
      <Head kicker="SAFETY NETS" title="戻す手段は、二段構え" frame={frame} />
      <table className="h77-table h77-compare">
        <thead>
          <tr style={lift(entrance(frame, fps, 8), 14)}>
            <th />
            <th>
              <RotateCcw size={30} /> チェックポイント
            </th>
            <th>
              <HardDrive size={30} /> バックアップ（MABS）
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row[0]} style={lift(entrance(frame, fps, 14 + index * 7), 14)}>
              <td className="h77-th">{row[0]}</td>
              <td>{row[1]}</td>
              <td>{row[2]}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="h77-punch-line" style={lift(entrance(frame, fps, 52), 16)}>
        <TriangleAlert size={38} />
        <span>
          公式は「更新を当てる前にチェックポイントを取るとよい」と書いている。
          ダメなのは<strong>バックアップの代用にすること</strong>。
        </span>
      </p>
      <Source
        href="https://learn.microsoft.com/windows-server/virtualization/hyper-v/manage/choose-between-standard-or-production-checkpoints-in-hyper-v"
        label="Microsoft Learn ─ Choose between standard or production checkpoints"
      />
    </section>
  )
}

function ExperimentSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const steps = [
    ['D1', 'いまの姿を見る', 'OSの実値と、5つの割り当て'],
    ['D2', 'Hyper-V で巻き戻す', 'T7-demo-start を適用 → 起動'],
    ['D3', 'ここが山場', 'Azureは緑。OSはもう壊れている'],
    ['D5 / D6', '赤くなる。でも直らない', '10〜20分後。ログで順番待ちを見る'],
    ['D7', '詰まりを解消する', 'エージェントを再起動する']
  ]
  return (
    <section className="remotion-slide h77-slide">
      <div className="h77-grid" />
      <Head kicker="LIVE DEMO" title="これから、この順番で見ます" frame={frame} />
      <div className="h77-steps">
        {steps.map((step, index) => (
          <div
            className={`h77-step${step[0] === 'D3' ? ' h77-step-now' : ''}`}
            key={step[0]}
            style={lift(entrance(frame, fps, 10 + index * 8), 18)}
          >
            <span className="h77-step-no">{step[0]}</span>
            <p>{step[1]}</p>
            <small>{step[2]}</small>
          </div>
        ))}
      </div>
      <p className="h77-note h77-center" style={lift(entrance(frame, fps, 50), 14)}>
        <strong>「バックアップから復元した」と同じ状態</strong>を、いま作ります。
        戻りきるまで待てなくても大丈夫 ─ <strong>実測した数字は、このあとのスライドに全部あります</strong>。
      </p>
      <div className="h77-env" style={lift(entrance(frame, fps, 56), 16)}>
        <Server size={30} /> arcwin01 ─ Windows Server 2025（Nested Hyper-V ラボ L2）
      </div>
      <LiveCue label="Hyper-V ─ arcwin01 を T7-demo-start へ復元" />
    </section>
  )
}

function ResultAgentSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide h77-slide h77-blind">
      <div className="h77-grid" />
      <Head kicker="事前テスト ① AGENT" title="エージェントは ─ 落ちませんでした" frame={frame} />
      <div className="h77-split">
        <div className="h77-split-side" style={lift(entrance(frame, fps, 10), 20)}>
          <span className="h77-side-label">Azure ポータル</span>
          <div className="h77-status-ok">
            <Check size={40} />
            <strong>Connected</strong>
          </div>
          <p>70分間、一度も Disconnected にならず</p>
        </div>
        <div className="h77-split-vs" style={lift(entrance(frame, fps, 20), 12)}>
          <span>実機は</span>
          <RotateCcw size={54} />
          <span>4日前に戻っている</span>
        </div>
        <div className="h77-split-side h77-split-real" style={lift(entrance(frame, fps, 28), 20)}>
          <span className="h77-side-label">実機</span>
          <p>復元＋起動 ＝ 11.5秒</p>
          <p>OSは再起動し、設定は過去のもの</p>
        </div>
      </div>
      <p className="h77-punch-line" style={lift(entrance(frame, fps, 40), 16)}>
        <TriangleAlert size={38} />
        <span>
          <strong>巻き戻してもエージェントはそのまま動作し続けます。</strong>
          再接続コマンドの出番はありません。
          <br />
          再接続が必要になるのは <strong>Azure側のリソースを消したとき</strong>。
        </span>
      </p>
      <p className="h77-note h77-center" style={lift(entrance(frame, fps, 50), 14)}>
        ハートビートは5分ごと・15分途切れて初めて Disconnected。巻き戻しはその猶予に収まる。
        <code>lastStatusChange</code> だけが変化するが、状態は Connected のまま。
      </p>
      <LiveCue label="ポータル ─ arcwin01 概要（Connected のまま）" />
    </section>
  )
}

function ResultMcSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide h77-slide">
      <div className="h77-grid" />
      <Head kicker="事前テスト ② MACHINE CONFIG" title="適用型は直る。監査型は、直さない" frame={frame} />
      <div className="h77-two">
        <div className="h77-card h77-card-good" style={lift(entrance(frame, fps, 10), 20)}>
          <div className="h77-card-head">
            <Check size={36} />
            <h2>ApplyAndAutoCorrect</h2>
          </div>
          <p>SetSecureProtocol ／ SetWindowsTimeZone</p>
          <p className="h77-metric">再起動後 4〜6分で復旧</p>
          <p>
            実機のレジストリに <strong>TLS 1.2 が書き戻された</strong>（Enabled=1）。
            表示が戻っただけではなく、<strong>本当に直っている</strong>。
          </p>
        </div>
        <div className="h77-card h77-card-warn" style={lift(entrance(frame, fps, 24), 20)}>
          <div className="h77-card-head">
            <TriangleAlert size={36} />
            <h2>Audit</h2>
          </div>
          <p>WindowsDefenderExploitGuard ／ AuditSecureProtocol</p>
          <p className="h77-metric h77-metric-bad">永久に非準拠</p>
          <p>
            <strong>監査型は Set を持たない。</strong>元から何も適用しない仕組みなので、
            「自己修復に失敗した」のではなく<strong>直す気がない</strong>。
          </p>
        </div>
      </div>
      <p className="h77-punch-line" style={lift(entrance(frame, fps, 40), 16)}>
        <TriangleAlert size={38} />
        <span>
          ただし、その数分に辿り着くまで <strong>40分以上かかりました</strong>。
          最初はずっと非準拠のままで、「適用型も復元後は直らない」と結論しかけた。
          <br />
          犯人は、この構成の外にいました ─ 次のスライド。
        </span>
      </p>
      <LiveCue label="ポータル ─ arcwin01 / マシン構成" />
    </section>
  )
}

function GhostSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const rows: Array<[string, string, string]> = [
    ['AzureWindowsBaseline', '★ 実行中', '1周 2321秒（38分41秒）'],
    ['SetSecureProtocol', '順番待ち', 'タイマーは鳴っている'],
    ['SetWindowsTimeZone', '順番待ち', 'タイマーは鳴っている'],
    ['AuditSecureProtocol', '順番待ち', 'タイマーは鳴っている']
  ]
  return (
    <section className="remotion-slide h77-slide">
      <div className="h77-grid" />
      <Head
        kicker="事前テスト ─ THE CULPRIT"
        title="5つ目の割り当ては、自分で入れたものではない"
        frame={frame}
      />
      <div className="h77-two h77-two-tight">
        <div className="h77-card h77-card-quiet" style={lift(entrance(frame, fps, 8), 18)}>
          <h2>自分で入れた割り当て</h2>
          <p className="h77-metric">4件</p>
        </div>
        <div className="h77-card h77-card-bad" style={lift(entrance(frame, fps, 14), 18)}>
          <h2>Azure が既定で入れていた割り当て</h2>
          <p className="h77-metric h77-metric-bad">＋1件</p>
          <p>重いベースライン監査</p>
        </div>
      </div>
      <div className="h77-cmp" style={lift(entrance(frame, fps, 24), 16)}>
        {rows.map((row, index) => (
          <div
            className={`h77-cmp-row${index === 0 ? ' h77-cmp-bad' : ' h77-cmp-stale'}`}
            key={row[0]}
          >
            <span>{row[0]}</span>
            <span>{row[1]}</span>
            <span>{row[2]}</span>
          </div>
        ))}
      </div>
      <p className="h77-punch-line" style={lift(entrance(frame, fps, 46), 16)}>
        <TriangleAlert size={38} />
        <span>
          マシン構成の評価は<strong>1台につき1本ずつの順番待ち</strong>。
          重い監査が1件居座るだけで、<strong>他の構成は自己修復すらできない</strong>。
          <br />
          出どころは <strong>Tenant Root Group の「Azure セキュリティ ベンチマーク」</strong>。
          テナントに既定で入っていて、<strong>割り当てを消しても作り直されます</strong>。
        </span>
      </p>
    </section>
  )
}

function ResultPolicySlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide h77-slide">
      <div className="h77-grid" />
      <Head kicker="事前テスト ③ POLICY" title="緑には、2種類あります" frame={frame} />
      <div className="h77-two">
        <div className="h77-card h77-card-good" style={lift(entrance(frame, fps, 10), 20)}>
          <div className="h77-card-head">
            <Check size={36} />
            <h2>無事な緑</h2>
          </div>
          <p>復元後に評価され、本当に準拠している</p>
        </div>
        <div className="h77-card h77-card-bad" style={lift(entrance(frame, fps, 22), 20)}>
          <div className="h77-card-head">
            <TriangleAlert size={36} />
            <h2>誰も見ていない緑</h2>
          </div>
          <p>
            <strong>巻き戻す前の判定が残っているだけ。</strong>
            復元後に一度も評価されていない
          </p>
        </div>
      </div>
      <div className="h77-cmp" style={lift(entrance(frame, fps, 34), 16)}>
        <div className="h77-cmp-row h77-cmp-stale">
          <span>起動から 10〜20分</span>
          <span>4つとも「準拠」</span>
          <span>復元後まだ一度も評価されていない</span>
        </div>
        <div className="h77-cmp-row h77-cmp-bad">
          <span>最初の非準拠まで</span>
          <span>9分 ／ 17分 ／ 18分</span>
          <span>3回やって、毎回ちがう</span>
        </div>
      </div>
      <p className="h77-punch-line" style={lift(entrance(frame, fps, 46), 16)}>
        <TriangleAlert size={38} />
        <span>
          <strong>画面上、この2つの緑は見分けがつきません。</strong>
          復元後に見るのは「緑かどうか」ではなく「<strong>いつ評価されたか</strong>」。
          <br />
          評価の周期も違う ─ 適用型は15分、<strong>監査型は60分</strong>、Azure Policy は既定で24時間。
        </span>
      </p>
      <LiveCue label="ポータル ─ Policy / コンプライアンス" />
    </section>
  )
}

function TimezoneTrapSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide h77-slide">
      <div className="h77-grid" />
      <Head
        kicker="THE LANDMINE"
        title={
          <>
            日本語Windowsでは、
            <br />
            組み込みポリシーが原理的に動かない
          </>
        }
        frame={frame}
      />
      <div className="h77-code-quote" style={lift(entrance(frame, fps, 10), 20)}>
        <code>
          $timezoneId = Get-TimeZone -ListAvailable | % {'{'} if($_.<strong>DisplayName</strong> -ieq
          $TimeZone) {'{'}$_.Id{'}'} {'}'}
          <br />
          Set-TimeZone -Id $timezoneId
        </code>
        <span className="h77-code-note">組み込み DSC リソースの中身</span>
      </div>
      <div className="h77-two h77-two-tight">
        <div className="h77-card h77-card-bad" style={lift(entrance(frame, fps, 24), 18)}>
          <div className="h77-card-head">
            <Languages size={34} />
            <h2>実機（日本語）の DisplayName</h2>
          </div>
          <p className="h77-mono">(UTC+09:00) 大阪、札幌、東京</p>
        </div>
        <div className="h77-card h77-card-quiet" style={lift(entrance(frame, fps, 32), 18)}>
          <div className="h77-card-head">
            <FileCheck size={34} />
            <h2>ポリシーの許容値（英語）</h2>
          </div>
          <p className="h77-mono">(UTC+09:00) Osaka, Sapporo, Tokyo</p>
        </div>
      </div>
      <p className="h77-punch-line" style={lift(entrance(frame, fps, 42), 16)}>
        <TriangleAlert size={38} />
        <span>
          一致しないので <code>$timezoneId</code> は null。<code>Set-TimeZone -Id $null</code> で落ちる。
          <strong>ApplyAndAutoCorrect でも永久に直らない。</strong>
          <br />
          「Policyが効かない」の原因が、<strong>Policyの外</strong>にあった例。カスタム定義で回避しました。
        </span>
      </p>
    </section>
  )
}

function RecoveryRunbookSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const items: Array<[string, React.ReactNode]> = [
    [
      'Arc の接続を見る（たぶん無事）',
      <>巻き戻しでは切れなかった。切れるのは Azure 側を消したとき ─ そのときだけ再接続2コマンド</>
    ],
    [
      '緑を見ずに「最終評価時刻」を見る',
      <>
        復元後<strong>10〜20分は、壊れていても全部グリーン</strong>。時計は3つ ─ 15分／60分／24時間
      </>
    ],
    [
      '割り当てモードで期待値を分ける',
      <>
        <strong>適用型は直る。監査型は直さない。</strong>どちらかは実機の設定ファイルに書いてある
      </>
    ],
    [
      '直らないなら、順番待ちを疑う',
      <>
        評価は<strong>1台に1本ずつ</strong>。詰まっていたら
        <strong>エージェントを再起動</strong>する
      </>
    ],
    [
      'Policy とパッチは再評価してから判断',
      <>再評価を先に打ってから判断する ─ <code>az policy state trigger-scan</code></>
    ]
  ]
  return (
    <section className="remotion-slide h77-slide h77-checklist">
      <div className="h77-grid" />
      <Head kicker="TAKE THIS HOME" title="復元・巻き戻しのあとに回す、5つの手順" frame={frame} />
      <ol className="h77-check">
        {items.map((item, index) => (
          <li key={item[0]} style={lift(entrance(frame, fps, 10 + index * 8), 18)}>
            <span className="h77-check-no">{index + 1}</span>
            <div>
              <strong>{item[0]}</strong>
              <p>{item[1]}</p>
            </div>
          </li>
        ))}
      </ol>
      <p className="h77-note h77-center" style={lift(entrance(frame, fps, 54), 14)}>
        <strong>4番だけが今回の新発見です。</strong>ここを飛ばすと、1〜5を全部やっても直りません。
      </p>
      <LiveCue label="巻き戻した arcwin01 が、戻ってきたか" />
    </section>
  )
}

function UpdateManagerSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const paid: Array<[string, string]> = [
    ['Arc に繋ぐ・拡張機能・Run Command', '無料'],
    ['Azure Update Manager', '$5 / 台 / 月'],
    ['マシン構成（Azure Policy）', '$6 / 台 / 月']
  ]
  return (
    <section className="remotion-slide h77-slide">
      <div className="h77-grid" />
      <Head kicker="SO ─ PATCH AWAY" title="だから、ガンガン当てていい" frame={frame} />
      <div className="h77-two">
        <div className="h77-card" style={lift(entrance(frame, fps, 12), 20)}>
          <div className="h77-card-head">
            <Boxes size={38} />
            <h2>Azure Update Manager</h2>
          </div>
          <ul>
            <li>Windows / Linux、Azure / オンプレを同じ画面で一覧</li>
            <li>メンテナンス時間を決めて定期適用（動的スコープ）</li>
            <li>適用の前後にスクリプトを挟める（pre / post イベント）</li>
            <li>オンプレ側は Arc で繋ぐだけ。通信はアウトバウンド443のみ</li>
          </ul>
        </div>
        <div className="h77-card h77-card-accent" style={lift(entrance(frame, fps, 24), 20)}>
          <div className="h77-card-head">
            <Zap size={38} />
            <h2>いくらかかるのか</h2>
          </div>
          <table className="h77-mini">
            <tbody>
              {paid.map((row) => (
                <tr key={row[0]}>
                  <td>{row[0]}</td>
                  <td>{row[1]}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="h77-note">
            いずれも <strong>Azure VM なら無料</strong>。オンプレを混ぜた瞬間に有料になる。
          </p>
        </div>
      </div>
      <p className="h77-punch-line" style={lift(entrance(frame, fps, 40), 16)}>
        <Check size={40} />
        <span>
          <strong>壊れても戻せる手順がある</strong>から、当てるのを先延ばしにしなくていい。
          当てないことのほうが、いまはリスクです。
        </span>
      </p>
      <LiveCue label="ポータル ─ Update Manager / マシン" />
    </section>
  )
}

function HotpatchSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide h77-slide h77-hotpatch">
      <div className="h77-grid" />
      <Head kicker="HOTPATCH" title="そもそも再起動を減らす、という手もあります" frame={frame} />
      <div className="h77-timeline2" style={lift(entrance(frame, fps, 12), 20)}>
        <div className="h77-tl-item">
          <span className="h77-tl-date">2025.7.16</span>
          <p>Arc接続マシンでの Hotpatch が GA</p>
          <strong className="h77-muted">$1.50 / コア / 月</strong>
        </div>
        <ArrowRight size={44} className="h77-tl-arrow" />
        <div className="h77-tl-item h77-tl-now">
          <span className="h77-tl-date">2026.5.19</span>
          <p>per-core メーターごと廃止</p>
          <strong>追加費用ゼロ</strong>
        </div>
      </div>
      <div className="h77-punch" style={lift(entrance(frame, fps, 34), 18)}>
        <Zap size={46} />
        <p>
          Windows Server 2025 を Arc に繋ぐだけで、
          <strong>再起動を伴わないパッチ</strong>が使える。請求明細に行は出ない。
        </p>
      </div>
      <Source
        href="https://techcommunity.microsoft.com/blog/azurearcblog/simplified-access-to-hotpatching-enabled-by-azure-arc-for-windows-server-2025/4521251"
        label="Microsoft Community Hub ─ Simplified access to Hotpatching enabled by Azure Arc"
      />
    </section>
  )
}

function AiCoversSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const items = [
    {
      head: '調べる',
      body: '割り当て・準拠状態・拡張機能の状態を、ポータルを開かずに横断で取る'
    },
    {
      head: '切り分ける',
      body: '「効かない」の原因を、DSC リソースの中身まで降りて特定する'
    },
    {
      head: '直す',
      body: 'Run Command とカスタムポリシー定義を書いて、当てて、準拠を確認する'
    },
    {
      head: '手順書にする',
      body: '今日お見せした5つの手順は、この検証からそのまま起こしたもの'
    }
  ]
  return (
    <section className="remotion-slide h77-slide">
      <div className="h77-grid" />
      <Head kicker="AND ─ AI" title="ここまで全部、AIにやらせています" frame={frame} />
      <div className="h77-quad">
        {items.map((item, index) => (
          <div className="h77-card" key={item.head} style={lift(entrance(frame, fps, 12 + index * 8), 18)}>
            <div className="h77-card-head">
              <Bot size={38} />
              <h2>{item.head}</h2>
            </div>
            <p>{item.body}</p>
          </div>
        ))}
      </div>
      <p className="h77-punch-line" style={lift(entrance(frame, fps, 46), 16)}>
        <TriangleAlert size={38} />
        <span>
          ただし ─ <strong>今日いちばんの学びは、前回の私が間違っていたこと</strong>です。
          そもそも適用できていない構成を見て「機能が使えない」と結論していました。
          <br />
          <strong>AIも人も、実機で測るまでは間違えます。</strong>だから測りに行く。
        </span>
      </p>
    </section>
  )
}

function ConclusionSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide h77-slide h77-conclusion">
      <div className="h77-grid" />
      <Head kicker="CONCLUSION" title="だから、運用に入れていい" frame={frame} />
      <div className="h77-conc">
        <div style={lift(entrance(frame, fps, 10), 20)}>
          <Check size={44} />
          <p>
            巻き戻しても、<strong>Azure側の割り当ては消えない</strong>。戻すのは実機の側だけ。
          </p>
        </div>
        <div style={lift(entrance(frame, fps, 22), 20)}>
          <Clock size={44} />
          <p>
            ただし<strong>時計が3つある</strong>。エージェント15分・マシン構成15分・Policy 24時間。
          </p>
        </div>
        <div style={lift(entrance(frame, fps, 34), 20)}>
          <ListChecks size={44} />
          <p>
            <strong>5つの手順を手元に持つ</strong>。それだけで、怖さは作業に変わる。
          </p>
        </div>
      </div>
      <p className="h77-big-q h77-center" style={lift(entrance(frame, fps, 48), 16)}>
        Azure Update Manager、使っていきましょう。
      </p>
    </section>
  )
}

function NextSessionSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide h77-slide h77-section-break">
      <div className="h77-grid" />
      <div className="h77-break-body" style={lift(entrance(frame, fps), 26)}>
        <span className="h77-kicker">NEXT SESSION</span>
        <h1>
          Microsoft &quot;Adaptive Cloud&quot;
          <br />
          最新動向
        </h1>
        <p>高添 修 氏 ─ 日本マイクロソフト株式会社</p>
      </div>
    </section>
  )
}

function QaSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide h77-slide h77-section-break">
      <div className="h77-grid" />
      <div className="h77-break-body" style={lift(entrance(frame, fps), 26)}>
        <span className="h77-kicker">Q &amp; A</span>
        <h1>質疑応答</h1>
        <p>チャットからどうぞ ─ #HCCJP</p>
      </div>
    </section>
  )
}

function Promo1003Slide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const drift = Math.sin(frame / 16) * 5
  return (
    <section className="remotion-slide h77-slide h77-promo">
      <div className="h77-promo-glow" />
      <div className="h77-promo-body" style={lift(entrance(frame, fps), 30)}>
        <span className="h77-kicker h77-kicker-warm">2026.10.3 SAT ・ 千葉県南柏</span>
        <h1>
          胡田昌彦の
          <br />
          <em>ITと音楽の文化祭 2026</em>
        </h1>
        <p className="h77-promo-lead">勉強会・セッション・バンドライブ</p>
        <ul className="h77-promo-list">
          <li>
            <Users size={30} /> 第1部 ─ IT勉強会＋交流会
          </li>
          <li>
            <Guitar size={30} /> 第2部 ─ ミニ演奏・全員セッション・バンドライブ（20:00〜）
          </li>
          <li>
            <Check size={30} /> 会場 Live Bar CheSara（南柏）／ 参加無料
          </li>
        </ul>
        <p className="h77-promo-note">
          東京事変のコピーバンドで演奏します。胡田もメンバーです。
          <br />
          ITと音楽、どちらか片方でも好きな方はぜひ。
        </p>
        <a className="h77-promo-link" href="https://ebisuda.connpass.com/event/401188/" target="_blank" rel="noreferrer">
          ebisuda.connpass.com/event/401188/
        </a>
      </div>
      <div className="h77-promo-art" style={{ transform: `translateY(${drift}px)` }}>
        <Guitar size={220} />
      </div>
    </section>
  )
}

function ClosingSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide h77-slide h77-closing">
      <div className="h77-grid" />
      <LogoMark className="h77-logo" />
      <div className="h77-break-body" style={lift(entrance(frame, fps), 26)}>
        <h1>ありがとうございました</h1>
        <p>次回 HCCJP 第78回 ─ 2026年10月9日（金）14:00〜</p>
        <div className="h77-links" style={lift(entrance(frame, fps, 20), 16)}>
          <span>hccjp.org</span>
          <span>connpass: hybridcloud</span>
          <span>YouTube: @hccjp</span>
        </div>
      </div>
    </section>
  )
}
