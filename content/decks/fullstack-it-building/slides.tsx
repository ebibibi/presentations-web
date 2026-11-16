/* eslint-disable react-refresh/only-export-components */
import { Easing, interpolate } from 'remotion'
import type { SlideModule, SlideRenderContext } from '../../../src/types'
import { ComparisonTable, HookSlide, Slide, SlideHeading, useEnter, useStagger } from '../../../src/slide-kit'
import './styles.css'

/*
 * A 16-floor "IT building", B2 (facilities) up to the 14F business rooftop,
 * 64 items. The presenter scores every item on camera and the editor overlays
 * the result, so judgment boxes and map cells are drawn empty on purpose.
 * The lower right of each slide stays light: the mascot is added there in editing.
 */

type FloorItem = {
  /** The item as approved, before the parenthetical. */
  heading: string
  /** The parenthetical of the approved item, shown in （）. */
  body?: string
  /** Short label for the 64-cell map. */
  label: string
}

type Floor = {
  id: string
  badge: string
  /** Japanese floor name, read aloud. */
  kicker: string
  heading: string
  lead?: string
  items: FloorItem[]
}

/** Bottom to top: the order the elevator rides. */
const FLOORS: Floor[] = [
  {
    id: 'floor-b2',
    badge: 'B2',
    kicker: '地下2階',
    heading: '建物・電気',
    lead: 'ファシリティ',
    items: [
      {
        heading: 'データセンターの選定・契約',
        body: '場所・電力・床荷重',
        label: 'DCの選定・契約'
      },
      {
        heading: '電源設計',
        body: 'UPS・発電機・電源容量の計算',
        label: '電源設計'
      },
      {
        heading: '空調・ラック配置の設計',
        body: 'ホットアイル／コールドアイル',
        label: '空調・ラック配置'
      },
      {
        heading: 'ラックマウントとケーブリング',
        body: 'サーバーを差して、配線を束ねる',
        label: 'ラックマウント'
      }
    ]
  },
  {
    id: 'floor-b1',
    badge: 'B1',
    kicker: '地下1階',
    heading: 'ハードウェア',
    items: [
      {
        heading: 'サーバーの組み立て・部品交換',
        body: 'CPU・メモリ・ディスク',
        label: 'サーバー組立・交換'
      },
      {
        heading: 'ストレージ装置',
        body: 'SAN・RAID・ファイバーチャネル',
        label: 'ストレージ装置'
      },
      {
        heading: 'ファームウェア・BIOS の更新、障害部品のメーカー対応',
        label: 'FW・BIOS・保守'
      },
      { heading: '自作PC・GPUマシン', label: '自作PC・GPU' }
    ]
  },
  {
    id: 'floor-1f',
    badge: '1F',
    kicker: '1階',
    heading: '社内ネットワーク',
    items: [
      {
        heading: 'スイッチ・ルーターの設定',
        body: 'CLIで VLAN・ルーティング',
        label: 'スイッチ・ルーター'
      },
      {
        heading: 'ファイアウォール・UTM の設計と導入',
        label: 'ファイアウォール'
      },
      {
        heading: '無線LANの設計',
        body: '電波・アクセスポイントの配置',
        label: '無線LAN'
      },
      {
        heading: 'LANケーブル・光ファイバーの敷設と成端',
        label: 'LAN・光ファイバー'
      }
    ]
  },
  {
    id: 'floor-2f',
    badge: '2F',
    kicker: '2階',
    heading: 'インターネット・キャリア',
    items: [
      {
        heading: 'インターネット回線・専用線の契約',
        body: 'キャリアとの交渉',
        label: '回線・専用線契約'
      },
      {
        heading: 'IPアドレス・AS番号の取得、BGP でのマルチホーム',
        label: 'IP・AS・BGP'
      },
      { heading: 'IX・相互接続（ピアリング）の設計', label: 'IX・ピアリング' },
      {
        heading: '権威DNSサーバー・メールの配送（MX・SPF・DKIM）を自前で運用',
        label: 'DNS・メール配送'
      }
    ]
  },
  {
    id: 'floor-3f',
    badge: '3F',
    kicker: '3階',
    heading: 'サーバーOS',
    items: [
      { heading: 'Windows Server の設計・構築', label: 'Windows Server' },
      { heading: 'Linux サーバーの構築・運用', label: 'Linux サーバー' },
      {
        heading: 'UNIX・メインフレーム',
        body: 'Solaris・AIX・汎用機',
        label: 'UNIX・汎用機'
      },
      {
        heading: 'OSの深い障害解析',
        body: 'ダンプ解析・カーネルデバッグ',
        label: 'OSの障害解析'
      }
    ]
  },
  {
    id: 'floor-4f',
    badge: '4F',
    kicker: '4階',
    heading: '仮想化・コンテナ',
    items: [
      { heading: 'Hyper-V', label: 'Hyper-V' },
      { heading: 'VMware', label: 'VMware' },
      {
        heading: 'ハイパーコンバージド',
        body: 'Storage Spaces Direct・Azure Stack HCI など',
        label: 'ハイパーコンバージド'
      },
      { heading: 'コンテナ・Kubernetes', label: 'コンテナ・K8s' }
    ]
  },
  {
    id: 'floor-5f',
    badge: '5F',
    kicker: '5階',
    heading: 'Windows 基盤サービス',
    items: [
      {
        heading: 'Active Directory',
        body: '設計・移行・障害対応',
        label: 'Active Directory'
      },
      {
        heading: 'DNS・DHCP・ファイルサーバー・印刷',
        label: 'DNS・DHCPほか'
      },
      { heading: 'Exchange・メール基盤', label: 'Exchange' },
      { heading: 'PKI・証明書基盤', label: 'PKI・証明書' }
    ]
  },
  {
    id: 'floor-6f',
    badge: '6F',
    kicker: '6階',
    heading: 'クライアント管理',
    items: [
      {
        heading: 'Windows クライアントの展開',
        body: 'イメージ作成・キッティング',
        label: 'クライアント展開'
      },
      { heading: 'グループポリシーでの管理', label: 'グループポリシー' },
      {
        heading: '配布・パッチ管理',
        body: 'WSUS・SCCM・Intune',
        label: '配布・パッチ管理'
      },
      {
        heading: 'ヘルプデスク・利用者からの問い合わせ対応',
        label: 'ヘルプデスク'
      }
    ]
  },
  {
    id: 'floor-7f',
    badge: '7F',
    kicker: '7階',
    heading: 'クラウド・SaaS',
    items: [
      { heading: 'Azure', label: 'Azure' },
      { heading: 'AWS・Google Cloud', label: 'AWS・GCP' },
      {
        heading: 'Microsoft 365',
        body: 'Exchange Online・SharePoint・Teams',
        label: 'Microsoft 365'
      },
      {
        heading: 'Cloudflare など、そのほかのクラウドサービス',
        label: 'そのほかのクラウド'
      }
    ]
  },
  {
    id: 'floor-8f',
    badge: '8F',
    kicker: '8階',
    heading: 'ID・セキュリティ',
    items: [
      {
        heading: 'ID・認証',
        body: 'Entra ID・SSO・多要素認証',
        label: 'ID・認証'
      },
      {
        heading: '監視・SOC',
        body: 'ログを見て攻撃を見つける',
        label: '監視・SOC'
      },
      {
        heading: '脆弱性診断・ペネトレーションテスト',
        body: '攻める側',
        label: '脆弱性診断'
      },
      {
        heading: 'インシデント対応・フォレンジック',
        label: 'インシデント対応'
      }
    ]
  },
  {
    id: 'floor-9f',
    badge: '9F',
    kicker: '9階',
    heading: 'データ',
    items: [
      { heading: 'データベースの設計・SQL', label: 'DB設計・SQL' },
      {
        heading: 'バックアップと復元の設計',
        body: '実際に戻したことがあるか',
        label: 'バックアップ・復元'
      },
      {
        heading: 'データ移行',
        body: '古いシステムから新しいシステムへ',
        label: 'データ移行'
      },
      { heading: 'データ分析・BI', label: 'データ分析・BI' }
    ]
  },
  {
    id: 'floor-10f',
    badge: '10F',
    kicker: '10階',
    heading: '低レイヤー開発',
    items: [
      { heading: 'アセンブラ', label: 'アセンブラ' },
      { heading: 'C・C++', label: 'C・C++' },
      {
        heading: '組み込み・マイコン',
        body: '電子工作も含む',
        label: '組み込み・マイコン'
      },
      { heading: 'OS・ドライバ・コンパイラを作る', label: 'OS・ドライバ' }
    ]
  },
  {
    id: 'floor-11f',
    badge: '11F',
    kicker: '11階',
    heading: 'アプリ開発',
    items: [
      {
        heading: 'スクリプト',
        body: 'PowerShell・Bash・Python',
        label: 'スクリプト'
      },
      { heading: '業務アプリ', body: 'C#・Java・VB など', label: '業務アプリ' },
      { heading: 'Web アプリ', body: '画面とサーバー', label: 'Web アプリ' },
      { heading: 'スマホアプリ・ゲーム', label: 'スマホ・ゲーム' }
    ]
  },
  {
    id: 'floor-12f',
    badge: '12F',
    kicker: '12階',
    heading: '自動化・DevOps',
    items: [
      { heading: 'Git・GitHub', label: 'Git・GitHub' },
      {
        heading: 'CI/CD',
        body: 'GitHub Actions・Azure Pipelines',
        label: 'CI/CD'
      },
      {
        heading: 'インフラのコード化',
        body: 'Bicep・Terraform・Ansible',
        label: 'インフラのコード化'
      },
      {
        heading: 'AI・機械学習',
        body: 'モデルを作る・動かす・AIエージェントで仕事を回す',
        label: 'AI・機械学習'
      }
    ]
  },
  {
    id: 'floor-13f',
    badge: '13F',
    kicker: '13階',
    heading: '運用',
    items: [
      {
        heading: '監視の設計',
        body: '何を見て、いつ人を起こすか',
        label: '監視の設計'
      },
      { heading: '障害対応・夜間の呼び出し・復旧', label: '障害対応' },
      { heading: '変更管理・運用ルール', body: 'ITIL など', label: '変更管理' }
    ]
  },
  {
    id: 'floor-14f',
    badge: '14F',
    kicker: '屋上（14階）',
    heading: 'ビジネス',
    items: [
      {
        heading: '要件定義・設計',
        body: 'お客さんの話を聞いて、何を作るか決める',
        label: '要件定義・設計'
      },
      { heading: '提案・見積もり・営業', label: '提案・営業' },
      { heading: 'プロジェクトマネジメント', label: 'PM' },
      {
        heading: '調達・ライセンス・契約',
        body: 'ハードやソフトを買う、Microsoft のライセンス',
        label: '調達・契約'
      },
      {
        heading: '教える・書く・話す',
        body: '研修・書籍・登壇・YouTube',
        label: '教える・書く・話す'
      }
    ]
  }
]

/** The widest floor sets the column count, so every cell is drawn at one size. */
const MAP_COLUMNS = Math.max(...FLOORS.map((floor) => floor.items.length))

/** 1-based item numbers running bottom to top, 1..64. */
const FIRST_NUMBER = FLOORS.map((_, index) =>
  FLOORS.slice(0, index).reduce((sum, floor) => sum + floor.items.length, 1)
)

const TOTAL_ITEMS = FLOORS.reduce((sum, floor) => sum + floor.items.length, 0)

/** Index of the first floor above ground, where the ground line is drawn. */
const GROUND_INDEX = FLOORS.findIndex((floor) => floor.id === 'floor-1f')

const pad2 = (value: number) => String(value).padStart(2, '0')

const JUDGMENTS = [
  {
    mark: '◎',
    tone: 'top',
    label: '仕事で責任を持った',
    points: '3点',
    body: '仕事として設計・構築・運用のどれかを任された'
  },
  {
    mark: '○',
    tone: 'hand',
    label: '自分の手でやった',
    points: '2点',
    body: '業務の手伝い・検証・自宅で、実際に手を動かした'
  },
  {
    mark: '△',
    tone: 'seen',
    label: '見た・触った',
    points: '1点',
    body: '横で見た、研修や講義でやった、少し触った'
  },
  { mark: '×', tone: 'none', label: 'やってない', points: '0点', body: 'ない' }
]

export const slides: SlideModule['slides'] = [
  { id: 'opening', render: (props) => <OpeningSlide {...props} /> },
  { id: 'declaration', render: (props) => <DeclarationSlide {...props} /> },
  { id: 'rules', render: (props) => <RulesSlide {...props} /> },
  { id: 'building', render: (props) => <BuildingSlide {...props} /> },
  ...FLOORS.map((floor, index) => ({
    id: floor.id,
    render: ({ frame }: SlideRenderContext) => <FloorSlide frame={frame} index={index} />
  })),
  { id: 'map', render: (props) => <MapSlide {...props} /> },
  { id: 'with-ai', render: (props) => <WithAiSlide {...props} /> },
  { id: 'summary', render: (props) => <SummarySlide {...props} /> }
]

function OpeningSlide({ frame }: SlideRenderContext) {
  const stats = useStagger(frame, 3, { start: 40, step: 8 })
  const facts = [
    { heading: '16階', body: '地下2階〜屋上' },
    { heading: `${TOTAL_ITEMS}項目`, body: 'ITの全部' },
    { heading: '192点', body: '満点' }
  ]
  return (
    <HookSlide
      frame={frame}
      kicker="本当のフルスタックエンジニアとは？"
      heading={'あなたは、ITの\n何マスを\n埋められますか？'}
      lead="データセンターの床から、お客さんとの契約まで"
    >
      <div className="fsb-facts">
        {facts.map((fact, index) => (
          <div className="fsb-fact" key={fact.heading} style={stats[index]}>
            <strong>{fact.heading}</strong>
            <span>{fact.body}</span>
          </div>
        ))}
      </div>
    </HookSlide>
  )
}

/** A slim 16-floor tower; `lit` floors are filled, the rest are outlines. */
function Tower({ lit, label }: { lit: (index: number) => boolean; label: string }) {
  return (
    <figure className="fsb-tower">
      <div className="fsb-tower-body">
        {[...FLOORS].reverse().map((floor) => {
          const index = FLOORS.indexOf(floor)
          return (
            <div className={`fsb-tower-floor${lit(index) ? ' is-lit' : ''}`} key={floor.id}>
              <span>{floor.badge}</span>
            </div>
          )
        })}
      </div>
      <figcaption>{label}</figcaption>
    </figure>
  )
}

function DeclarationSlide({ frame }: SlideRenderContext) {
  const left = useEnter(frame, 22)
  const right = useEnter(frame, 34)
  const appIndex = FLOORS.findIndex((floor) => floor.id === 'floor-11f')
  return (
    <Slide>
      <SlideHeading
        frame={frame}
        kicker="この動画の「フルスタック」"
        heading={'フルスタック＝\nWeb開発だけ、ではない'}
        lead="データセンターの床から、お客さんとの契約まで"
      />
      <div className="fsb-declare">
        <div className="fsb-declare-side" style={left}>
          <Tower lit={(index) => index === appIndex} label="よく言うフルスタック" />
          <p className="fsb-declare-note">
            画面＋サーバー＋DB
            <br />
            11F アプリ開発の階だけ
          </p>
        </div>
        <div className="fsb-declare-side is-accent" style={right}>
          <Tower lit={() => true} label="この動画のフルスタック" />
          <p className="fsb-declare-note">
            B2 の電気とラックから
            <br />
            14F のビジネスまで全部
          </p>
        </div>
      </div>
    </Slide>
  )
}

function RulesSlide({ frame }: SlideRenderContext) {
  const rows = useStagger(frame, JUDGMENTS.length, { start: 20, step: 8 })
  const total = useEnter(frame, 60)
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="判定ルール" heading="1項目ずつ、4段階で判定" />
      <div className="fsb-rules">
        {JUDGMENTS.map((judgment, index) => (
          <div className={`fsb-rule is-${judgment.tone}`} key={judgment.mark} style={rows[index]}>
            <span className="fsb-rule-mark">{judgment.mark}</span>
            <div className="fsb-rule-text">
              <strong>{judgment.label}</strong>
              <span>{judgment.body}</span>
            </div>
            <span className="fsb-rule-points">{judgment.points}</span>
          </div>
        ))}
      </div>
      <p className="fsb-rules-total" style={total}>
        {TOTAL_ITEMS}項目 × 3点 ＝ <b>192点満点</b> ／ 点数は自己申告
      </p>
    </Slide>
  )
}

function BuildingSlide({ frame }: SlideRenderContext) {
  const head = useEnter(frame, 0)
  const floors = useStagger(frame, FLOORS.length, {
    start: 14,
    step: 3,
    distance: 14
  })
  return (
    <Slide className="fsb-building-slide">
      <header className="fsb-compact-head" style={head}>
        <span className="slide-kicker sk-kicker">ITビルの地図</span>
        <h1>16階建て・{TOTAL_ITEMS}項目</h1>
      </header>
      <div className="fsb-section">
        <div className="fsb-roof" />
        {FLOORS.map((floor, index) => ({ floor, index }))
          .reverse()
          .map(({ floor, index }) => (
            <div key={floor.id}>
              <div className="fsb-section-floor" style={floors[FLOORS.length - 1 - index]}>
                <span className="fsb-badge">{floor.badge}</span>
                <span className="fsb-section-name">{floor.heading}</span>
                <span className="fsb-section-cells">
                  {floor.items.map((item) => (
                    <i key={item.label} />
                  ))}
                </span>
              </div>
              {index === GROUND_INDEX ? (
                <div className="fsb-ground">
                  <span>地上</span>
                  <span>地下</span>
                </div>
              ) : null}
            </div>
          ))}
      </div>
    </Slide>
  )
}

/** The elevator car rides up from the floor below as the slide opens. */
function ElevatorShaft({ frame, index }: { frame: number; index: number }) {
  const from = Math.max(0, index - 1)
  const position = interpolate(frame, [4, 34], [from, index], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic)
  })
  const stepPercent = 100 / FLOORS.length
  return (
    <div className="fsb-shaft" aria-hidden="true">
      {[...FLOORS].reverse().map((floor) => {
        const floorIndex = FLOORS.indexOf(floor)
        const state = floorIndex === index ? ' is-here' : floorIndex < index ? ' is-passed' : ''
        return (
          <div className={`fsb-shaft-floor${state}`} key={floor.id}>
            {floor.badge}
          </div>
        )
      })}
      <div
        className="fsb-car"
        style={{
          bottom: `${position * stepPercent}%`,
          height: `${stepPercent}%`
        }}
      />
    </div>
  )
}

function FloorSlide({ frame, index }: { frame: number; index: number }) {
  const floor = FLOORS[index]
  const head = useEnter(frame, 6)
  const rows = useStagger(frame, floor.items.length, { start: 22, step: 7 })
  return (
    <Slide className="fsb-floor-slide">
      <div className="fsb-floor-layout">
        <ElevatorShaft frame={frame} index={index} />
        <div className="fsb-floor-main">
          <header className="fsb-floor-head" style={head}>
            <span className="fsb-floor-badge">{floor.badge}</span>
            <div className="fsb-floor-title">
              <span className="slide-kicker sk-kicker">{floor.kicker}</span>
              <h1>
                {floor.heading}
                {floor.lead ? <small>（{floor.lead}）</small> : null}
              </h1>
            </div>
          </header>
          <ol className={`fsb-items${floor.items.length > 4 ? ' is-dense' : ''}`}>
            {floor.items.map((item, itemIndex) => (
              <li className="fsb-item" key={item.label} style={rows[itemIndex]}>
                <span className="fsb-item-no">{pad2(FIRST_NUMBER[index] + itemIndex)}</span>
                <span className="fsb-judge" aria-label="判定欄" />
                <div className="fsb-item-text">
                  <strong>{item.heading}</strong>
                  {item.body ? <span>（{item.body}）</span> : null}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Slide>
  )
}

function MapSlide({ frame }: SlideRenderContext) {
  const head = useEnter(frame, 0)
  const grid = useEnter(frame, 14, 18)
  return (
    <Slide className="fsb-map-slide">
      <header className="fsb-map-head" style={head}>
        <div>
          <span className="slide-kicker sk-kicker">地図を見る</span>
          <h1>どこが埋まって、どこが空白か</h1>
        </div>
        <div className="fsb-map-legend">
          <span className="fsb-legend is-filled">埋まった所</span>
          <span className="fsb-legend is-blank">空白</span>
        </div>
      </header>
      <div className="fsb-map" style={grid}>
        {FLOORS.map((floor, index) => ({ floor, index }))
          .reverse()
          .map(({ floor, index }) => (
            <div
              className={`fsb-map-row${index === GROUND_INDEX ? ' is-ground' : ''}`}
              key={floor.id}
              style={{
                gridTemplateColumns: `236px repeat(${MAP_COLUMNS}, minmax(0, 1fr))`
              }}
            >
              <span className="fsb-map-floor">
                <b>{floor.badge}</b>
                {floor.heading}
              </span>
              {Array.from({ length: MAP_COLUMNS }, (_, cell) => {
                const item = floor.items[cell]
                return item ? (
                  <span className="fsb-map-cell" key={item.label}>
                    <i>{FIRST_NUMBER[index] + cell}</i>
                    {item.label}
                  </span>
                ) : (
                  <span className="fsb-map-cell is-void" key={`void-${cell}`} />
                )
              })}
            </div>
          ))}
      </div>
    </Slide>
  )
}

function WithAiSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="AI込みなら？" heading={'相棒のAIも乗せたら\nどの階まで届く？'} />
      <ComparisonTable
        frame={frame}
        columns={[{ label: 'AIで届くようになった階', accent: true }, { label: 'AIでも届かない階' }]}
        rows={[
          {
            label: 'たとえば',
            cells: ['書いたことのない言語は？', 'ラックマウントは？']
          },
          {
            label: 'もうひとつ',
            cells: ['触ったことのないクラウドは？', 'お客さんとの契約は？']
          },
          { label: '自分の答え', cells: ['', ''] }
        ]}
      />
    </Slide>
  )
}

function SummarySlide({ frame }: SlideRenderContext) {
  const template = useEnter(frame, 30)
  return (
    <Slide tone="ink" logo className="fsb-summary-slide">
      <SlideHeading
        frame={frame}
        kicker="まとめ"
        heading={'あなたは何マス？\nコメントで教えてください'}
        lead="データセンターの床から、お客さんとの契約まで"
      />
      <p className="fsb-summary-template" style={template}>
        ◎＿ ○＿ △＿ ×＿ ／ ＿＿点
      </p>
    </Slide>
  )
}
