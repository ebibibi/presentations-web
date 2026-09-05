/* eslint-disable react-refresh/only-export-components */
import {
  Activity,
  ArrowRight,
  Boxes,
  Check,
  Clock,
  Cloud,
  Guitar,
  HardDrive,
  KeyRound,
  Laptop,
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
  { render: (props) => <TheWallSlide {...props} /> },
  { render: (props) => <InventorySlide {...props} /> },
  { render: (props) => <ProofSlide {...props} /> },
  { render: (props) => <UpdateManagerSlide {...props} /> },
  { render: (props) => <HotpatchSlide {...props} /> },
  { render: (props) => <TwoNetsSlide {...props} /> },
  { render: (props) => <CheckpointDocSlide {...props} /> },
  { render: (props) => <ExperimentSlide {...props} /> },
  { render: (props) => <ResultExtSlide {...props} /> },
  { render: (props) => <ResultBlindSlide {...props} /> },
  { render: (props) => <ResultMcSlide {...props} /> },
  { render: (props) => <ByproductsSlide {...props} /> },
  { render: (props) => <BackupLineSlide {...props} /> },
  { render: (props) => <ChecklistSlide {...props} /> },
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
          Azure Arc、
          <br />
          便利なのはわかった。
          <br />
          <em>で、壊れたら？</em>
        </h1>
        <p>運用で気になることを、実機で試してみた</p>
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
    ['14:05', '45分', 'Azure Arc、便利なのはわかった。で、壊れたら？', '胡田 昌彦'],
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
            誰もそのサーバーにログインしないまま、調査から復旧まで Azure 越しに通りました。
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

function TheWallSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const items = [
    'パッチを当てて壊れた。巻き戻したら Azure 側はどうなる？',
    'バックアップから復元した。Arc の登録は残っている？',
    'Azure が配った拡張機能や構成は、自動で戻ってくる？',
    'ポータルの緑の「正常」は、実機の何を保証している？',
    'エージェントが繋がらなくなったら、現地に行かずに直せる？'
  ]
  return (
    <section className="remotion-slide h77-slide h77-wall">
      <div className="h77-grid" />
      <Head kicker="THE WALL" title="でも、本番に入れるとなると" frame={frame} />
      <p className="h77-big-q" style={lift(entrance(frame, fps, 10), 20)}>
        何かあったとき、どうなるのか。
      </p>
      <ul className="h77-qlist">
        {items.map((text, index) => (
          <li key={text} style={lift(entrance(frame, fps, 20 + index * 8), 16)}>
            <TriangleAlert size={30} />
            <span>{text}</span>
          </li>
        ))}
      </ul>
      <p className="h77-note h77-center" style={lift(entrance(frame, fps, 70), 14)}>
        ここを潰しておけば、Arc は安心して運用に入れられるはず。
      </p>
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
    </section>
  )
}

function ProofSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const rows = [
    { icon: <Terminal size={34} />, what: 'Arc経由のコマンド実行（Run Command）', got: '42秒で結果が返る', ok: true },
    { icon: <KeyRound size={34} />, what: 'マネージドID でトークン取得', got: 'ゲスト内から取得成功・有効 24時間', ok: true },
    { icon: <Boxes size={34} />, what: '拡張機能の配布・設定更新', got: '2分以内に実機へ反映', ok: true },
    { icon: <MonitorCheck size={34} />, what: 'マシン構成（Guest Configuration）', got: '5分ごとに割当取得・15分ごとに評価', ok: true }
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
        すべて、インバウンドのポートを1つも開けずに。
      </p>
    </section>
  )
}

function UpdateManagerSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide h77-slide">
      <div className="h77-grid" />
      <Head kicker="AZURE UPDATE MANAGER" title="オンプレもクラウドも、1画面で当てる" frame={frame} />
      <div className="h77-two">
        <div className="h77-card" style={lift(entrance(frame, fps, 12), 20)}>
          <h2>できること</h2>
          <ul>
            <li>Windows / Linux、Azure / オンプレを同じ画面で評価</li>
            <li>メンテナンス時間を決めて定期適用（動的スコープ）</li>
            <li>適用の前後にスクリプトを挟める（pre / post イベント）</li>
            <li>オンプレ側は Arc で繋ぐだけ・通信はアウトバウンド443のみ</li>
          </ul>
        </div>
        <div className="h77-card h77-card-accent" style={lift(entrance(frame, fps, 26), 20)}>
          <h2>課金の線引き</h2>
          <div className="h77-price">
            <div>
              <span>Azure VM</span>
              <strong>無料</strong>
            </div>
            <div>
              <span>Arc 対応サーバー</span>
              <strong>$5 / 台 / 月</strong>
            </div>
          </div>
          <p className="h77-note">
            日割 $0.162 / 台 / 日。オンプレを混ぜた瞬間に有料になる。200台なら年間 $12,000。
          </p>
        </div>
      </div>
      <Source
        href="https://learn.microsoft.com/azure/update-manager/update-manager-faq"
        label="Microsoft Learn ─ Azure Update Manager FAQ（価格）"
      />
    </section>
  )
}

function HotpatchSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide h77-slide h77-hotpatch">
      <div className="h77-grid" />
      <Head kicker="HOTPATCH" title="再起動しないパッチが、無料になっていました" frame={frame} />
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

function TwoNetsSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const rows: Array<[string, string, string]> = [
    ['置き場所', '同じホスト・同じストレージ', '別媒体・別サイト'],
    ['ホストが死んだら', '一緒に消える', '残る'],
    ['長期保持', '差分が伸びて性能劣化', '世代管理される'],
    ['ランサムウェア', 'ほぼ無力', '対策になる'],
    ['戻す速さ', '数分', '時間単位']
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
              <HardDrive size={30} /> バックアップ
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
      <p className="h77-note h77-center" style={lift(entrance(frame, fps, 56), 14)}>
        役割が違う。どちらか一方では足りない。
      </p>
    </section>
  )
}

function CheckpointDocSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide h77-slide">
      <div className="h77-grid" />
      <Head kicker="MYTH" title="「スナップショットはダメ」は、半分だけ正しい" frame={frame} />
      <blockquote className="h77-quote" style={lift(entrance(frame, fps, 10), 20)}>
        You may want to create a virtual machine checkpoint before making software
        configuration changes, <strong>applying a software update</strong>, or installing new
        software.
      </blockquote>
      <div className="h77-two h77-two-tight">
        <div className="h77-card h77-card-good" style={lift(entrance(frame, fps, 24), 18)}>
          <h2>本番チェックポイント（既定）</h2>
          <p>VSS ／ Linux は File System Freeze でデータ整合を取る。適用後は停止状態から起動。</p>
        </div>
        <div className="h77-card h77-card-bad" style={lift(entrance(frame, fps, 34), 18)}>
          <h2>標準チェックポイント</h2>
          <p>
            メモリごと保存。公式に「AD のようにノード間で複製する仕組みでは
            <strong>データ不整合を起こしうる</strong>」と明記。
          </p>
        </div>
      </div>
      <p className="h77-note h77-center" style={lift(entrance(frame, fps, 46), 14)}>
        <code>Set-VM -CheckpointType ProductionOnly</code> ─ 明示しないと、失敗時に黙って標準へ落ちる。
      </p>
      <Source
        href="https://learn.microsoft.com/windows-server/virtualization/hyper-v/manage/choose-between-standard-or-production-checkpoints-in-hyper-v"
        label="Microsoft Learn ─ Using checkpoints"
      />
    </section>
  )
}

function ExperimentSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const steps = [
    ['T0', '拡張機能と構成ポリシーを配る', 'marker = T0'],
    ['T1', 'チェックポイントを取る', '戻る先'],
    ['T2', 'Azure 側から変更を進める', 'marker = T2 / 構成値も変更'],
    ['T3', '巻き戻す', 'ローカルだけ過去へ'],
    ['T4', '何分で何が戻るかを測る', '─']
  ]
  return (
    <section className="remotion-slide h77-slide">
      <div className="h77-grid" />
      <Head kicker="EXPERIMENT" title="Azureが先へ進んだあとに、ローカルだけ巻き戻す" frame={frame} />
      <div className="h77-steps">
        {steps.map((step, index) => (
          <div className="h77-step" key={step[0]} style={lift(entrance(frame, fps, 10 + index * 8), 18)}>
            <span className="h77-step-no">{step[0]}</span>
            <p>{step[1]}</p>
            <small>{step[2]}</small>
          </div>
        ))}
      </div>
      <div className="h77-env" style={lift(entrance(frame, fps, 52), 16)}>
        <Server size={30} /> arcwin01 ─ Windows Server 2025 ／ arclnx01 ─ Ubuntu 24.04（Nested Hyper-V ラボ）
      </div>
    </section>
  )
}

function ResultExtSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide h77-slide">
      <div className="h77-grid" />
      <Head kicker="RESULT 1" title="拡張機能は、自力で追いついた" frame={frame} />
      <div className="h77-two">
        <div className="h77-card h77-card-good" style={lift(entrance(frame, fps, 10), 20)}>
          <div className="h77-card-head">
            <Laptop size={38} />
            <h2>Ubuntu 24.04</h2>
          </div>
          <p className="h77-metric">約 80 秒</p>
          <p>
            巻き戻し直後に <code>has new settings</code> を検知し、
            Azure の最新設定でそのまま再実行。
          </p>
        </div>
        <div className="h77-card h77-card-warn" style={lift(entrance(frame, fps, 24), 20)}>
          <div className="h77-card-head">
            <Server size={38} />
            <h2>Windows Server 2025</h2>
          </div>
          <p className="h77-metric">約 9 分・2段階</p>
          <p>
            まず<strong>巻き戻した古い設定（Seq 0）で1回実行</strong>し、
            その約8分後に最新（Seq 1）を取り直した。
          </p>
        </div>
      </div>
      <p className="h77-note h77-center" style={lift(entrance(frame, fps, 40), 14)}>
        つまり Windows では、一時的に「古い状態」が復活する窓が開く。
      </p>
    </section>
  )
}

function ResultBlindSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide h77-slide h77-blind">
      <div className="h77-grid" />
      <Head kicker="RESULT 2" title="Azureは、巻き戻しに気づかない" frame={frame} />
      <div className="h77-split">
        <div className="h77-split-side" style={lift(entrance(frame, fps, 10), 20)}>
          <span className="h77-side-label">Azure ポータル</span>
          <div className="h77-status-ok">
            <Check size={40} />
            <strong>Connected</strong>
          </div>
          <div className="h77-status-ok">
            <Check size={40} />
            <strong>拡張機能: Succeeded</strong>
          </div>
        </div>
        <div className="h77-split-vs" style={lift(entrance(frame, fps, 20), 12)}>
          <span>実機は</span>
          <RotateCcw size={54} />
          <span>過去に戻っている</span>
        </div>
        <div className="h77-split-side h77-split-real" style={lift(entrance(frame, fps, 28), 20)}>
          <span className="h77-side-label">実機</span>
          <p>巻き戻し・再起動を実施</p>
          <p>配布物の中身は古い状態</p>
        </div>
      </div>
      <p className="h77-note h77-center" style={lift(entrance(frame, fps, 44), 14)}>
        ハートビートは5分ごと・15分途切れて初めて Disconnected。その猶予に収まってしまう。
      </p>
    </section>
  )
}

function ResultMcSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide h77-slide">
      <div className="h77-grid" />
      <Head kicker="RESULT 3" title="構成ポリシーは、直りませんでした" frame={frame} />
      <div className="h77-mc">
        <div className="h77-mc-expect" style={lift(entrance(frame, fps, 10), 20)}>
          <span className="h77-side-label">公式の説明</span>
          <p>
            <code>ApplyAndAutoCorrect</code> ─ ドリフトしたら
            <strong>次の評価で修正する</strong>
          </p>
        </div>
        <div className="h77-mc-real" style={lift(entrance(frame, fps, 22), 20)}>
          <span className="h77-side-label">実測</span>
          <p className="h77-metric h77-metric-bad">35分待っても、直らず</p>
          <p>
            15分ごとに <code>NonCompliant</code> が記録され続けた。
            評価は動いている。修正だけが効いていない。
          </p>
        </div>
      </div>
      <p className="h77-note h77-center" style={lift(entrance(frame, fps, 38), 14)}>
        原因は特定できていません。<strong>未解明のまま、事実としてお伝えします。</strong>
      </p>
    </section>
  )
}

function ByproductsSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const items = [
    {
      head: 'Azure側を消すと、自力では戻れない',
      body: 'RGを消して以後22日間、両OSとも Disconnected のまま「トークンが取得できない」を出し続けた。復旧はコマンド2つで1〜2分。'
    },
    {
      head: 'Linux の本番チェックポイントが作れない',
      body: 'ゲストに hv_vss_daemon が無いと失敗する。しかもパッケージは稼働カーネル版と一致していないと動かない。'
    },
    {
      head: '同じ種類の拡張は1台に1つまで',
      body: '同じ publisher / type の拡張を2つ入れようとすると HCRP409 で弾かれる。'
    }
  ]
  return (
    <section className="remotion-slide h77-slide">
      <div className="h77-grid" />
      <Head kicker="BYPRODUCTS" title="ついでに分かったこと" frame={frame} />
      <div className="h77-rows h77-rows-tall">
        {items.map((item, index) => (
          <div className="h77-row h77-row-block" key={item.head} style={lift(entrance(frame, fps, 12 + index * 10), 18)}>
            <TriangleAlert size={34} />
            <div>
              <strong>{item.head}</strong>
              <p>{item.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function BackupLineSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide h77-slide">
      <div className="h77-grid" />
      <Head kicker="BACKUP / RESTORE" title="サポート内と、その外" frame={frame} />
      <table className="h77-table h77-support">
        <thead>
          <tr style={lift(entrance(frame, fps, 8), 14)}>
            <th>復元先</th>
            <th>公式の扱い</th>
          </tr>
        </thead>
        <tbody>
          <tr style={lift(entrance(frame, fps, 16), 14)}>
            <td className="h77-th">元のVMインスタンス</td>
            <td className="h77-ok">works as expected ─ サポート内。ここが本線</td>
          </tr>
          <tr style={lift(entrance(frame, fps, 24), 14)}>
            <td className="h77-th">別ホスト（ALR）</td>
            <td className="h77-ng">管理対象外のVMとして復元。Azure Local VM への変換は非サポート</td>
          </tr>
        </tbody>
      </table>
      <p className="h77-punch-line" style={lift(entrance(frame, fps, 34), 18)}>
        <Check size={40} />
        <span>
          <strong>「元の場所に戻す」設計にすれば、全部サポート内で回る。</strong>
          <br />
          パッチ失敗のロールバックは、まさにこのケース。
        </span>
      </p>
      <Source
        href="https://learn.microsoft.com/azure/backup/back-up-azure-stack-hyperconverged-infrastructure-virtual-machines"
        label="Microsoft Learn ─ Back up Azure Local virtual machines with MABS"
      />
    </section>
  )
}

function ChecklistSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const items = [
    ['Arc の接続状態', 'ポータルで Connected か。Disconnected なら disconnect --force-local-only → connect'],
    ['拡張機能', '最新の設定で再適用されたか。ログの Sequence Number を見る'],
    ['構成ポリシー', '自動では直らないことがある。NonCompliant なら手で是正を回す'],
    ['パッチのコンプライアンス', '表示は実機の真値とズレる。再評価をかけてから判断する']
  ]
  return (
    <section className="remotion-slide h77-slide h77-checklist">
      <div className="h77-grid" />
      <Head kicker="TAKE THIS HOME" title="復元・巻き戻しのあとに確認する4つ" frame={frame} />
      <ol className="h77-check">
        {items.map((item, index) => (
          <li key={item[0]} style={lift(entrance(frame, fps, 12 + index * 10), 18)}>
            <span className="h77-check-no">{index + 1}</span>
            <div>
              <strong>{item[0]}</strong>
              <p>{item[1]}</p>
            </div>
          </li>
        ))}
      </ol>
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
            Azure 側のオブジェクトは<strong>巻き戻しでは消えない</strong>。
            拡張機能は自力で追いつく。
          </p>
        </div>
        <div style={lift(entrance(frame, fps, 22), 20)}>
          <Clock size={44} />
          <p>
            ただし<strong>時間差がある</strong>。その間、ポータルは緑のまま。
          </p>
        </div>
        <div style={lift(entrance(frame, fps, 34), 20)}>
          <ListChecks size={44} />
          <p>
            <strong>戻し方を手元に持つ</strong>。それだけで、怖さは運用手順に変わる。
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
