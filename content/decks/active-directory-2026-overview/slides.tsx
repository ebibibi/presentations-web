/* eslint-disable react-refresh/only-export-components */
import type { ReactNode } from 'react'
import {
  ArrowDown,
  ArrowRight,
  BadgeCheck,
  Boxes,
  Building2,
  Cable,
  CheckCircle2,
  CircleAlert,
  Cloud,
  Database,
  FileKey2,
  FolderTree,
  Globe2,
  HardDrive,
  KeyRound,
  Laptop,
  Link2,
  LockKeyhole,
  MapPinned,
  Network,
  RefreshCw,
  Search,
  ServerCog,
  Settings2,
  ShieldCheck,
  Tags,
  Trash2,
  UserRoundCog,
  Users,
} from 'lucide-react'
import { LogoMark } from '../../../src/deck-shared'
import type { SlideModule } from '../../../src/types'
import './styles.css'

export const slides: SlideModule['slides'] = [
  { render: () => <OpeningSlide /> },
  { render: () => <ActiveDirectoryMap /> },
  { render: () => <AdDsAndEntraSlide /> },
  { render: () => <ThreeLensesSlide /> },
  { render: () => <ObjectsSlide /> },
  { render: () => <LogicalStructureSlide /> },
  { render: () => <DnsAndDcSlide /> },
  { render: () => <PhysicalStructureSlide /> },
  { render: () => <GpoAndJoinSlide /> },
  { render: () => <AuthenticationSlide /> },
  { render: () => <LdapSlide /> },
  { render: () => <DataAndReplicationSlide /> },
  { render: () => <DeletionSchemaFsmoSlide /> },
  { render: () => <TrustAndGcSlide /> },
  { render: () => <RecoverySlide /> },
  { render: () => <Changes2026Slide /> },
  { render: () => <NextStepSlide /> },
]

const SOURCES = {
  original: 'https://www.youtube.com/watch?v=lZ8Ps6U_kvY',
  overview:
    'https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/get-started/virtual-dc/active-directory-domain-services-overview',
  entra:
    'https://learn.microsoft.com/en-us/entra/fundamentals/compare',
  logical:
    'https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/plan/understanding-the-active-directory-logical-model',
  sites:
    'https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/plan/understanding-active-directory-site-topology',
  gpo:
    'https://learn.microsoft.com/en-us/previous-versions/windows/desktop/policy/group-policy-hierarchy',
  kerberos:
    'https://learn.microsoft.com/en-us/windows-server/security/kerberos/kerberos-authentication-overview',
  ldap:
    'https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/ldap-signing',
  replication:
    'https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/get-started/replication/active-directory-replication-concepts',
  fsmo:
    'https://learn.microsoft.com/en-us/troubleshoot/windows-server/active-directory/fsmo-roles',
  recovery:
    'https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/manage/ad-forest-recovery-guide',
  server2025:
    'https://learn.microsoft.com/en-us/windows-server/get-started/whats-new-windows-server-2025',
}

type Card = {
  body: ReactNode
  icon: ReactNode
  label?: string
  title: ReactNode
  tone?: 'blue' | 'cyan' | 'green' | 'orange' | 'violet' | 'yellow'
}

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
    <section className="remotion-slide ad26-slide ad26-standard">
      <div className="ad26-grid" />
      <LogoMark className="ad26-logo" />
      <header className="ad26-page-head">
        <span>{eyebrow}</span>
        <h1>{title}</h1>
      </header>
      <main className="ad26-page-body">{children}</main>
      <footer className="ad26-page-footer">
        <span>Active Directory入門 2026 · Part 1</span>
        <div>{footer}</div>
      </footer>
    </section>
  )
}

function CardGrid({ cards, columns = 3 }: { cards: Card[]; columns?: 2 | 3 | 4 }) {
  return (
    <div className={`ad26-card-grid cols-${columns}`}>
      {cards.map((card, index) => (
        <article className={`ad26-card is-${card.tone ?? 'blue'}`} key={card.label ?? index}>
          <div className="ad26-card-icon">{card.icon}</div>
          {card.label && <span className="ad26-card-label">{card.label}</span>}
          <h2>{card.title}</h2>
          <div className="ad26-card-body">{card.body}</div>
        </article>
      ))}
    </div>
  )
}

function SourceLink({ href, children }: { href: string; children: ReactNode }) {
  return <a href={href} target="_blank" rel="noreferrer">{children}</a>
}

function OpeningSlide() {
  return (
    <section className="remotion-slide ad26-slide ad26-opening">
      <div className="ad26-grid" />
      <LogoMark className="ad26-logo" />
      <div className="ad26-opening-copy">
        <span>ACTIVE DIRECTORY DOMAIN SERVICES · 2026</span>
        <h1>Active Directory<span>入門</span></h1>
        <p>まずは把握すべき要素・概念・単語を<br /><strong>浅く、広く、つながりで理解する。</strong></p>
        <div className="ad26-chip-row">
          <b>用語の地図</b><b>全17枚</b><b>操作はPart 2以降</b>
        </div>
      </div>
      <div className="ad26-opening-visual" aria-hidden="true">
        <div className="ad26-orbit orbit-a"><Users /></div>
        <div className="ad26-orbit orbit-b"><KeyRound /></div>
        <div className="ad26-orbit orbit-c"><FolderTree /></div>
        <div className="ad26-core"><ServerCog /><strong>AD DS</strong><span>名簿・本人確認・設定配布</span></div>
      </div>
      <div className="ad26-opening-foot">
        <SourceLink href={SOURCES.original}>2019年版の元動画</SourceLink>
        <span>BGMなし · 高コントラスト · 図解中心</span>
      </div>
    </section>
  )
}

function ActiveDirectoryMap() {
  const lenses = [
    {
      icon: <FolderTree />,
      label: '論理構造',
      lead: 'Forest → Domain → OU',
      body: 'データ区画と管理単位。OUは委任とGPOリンクに使う。',
      tone: 'violet',
    },
    {
      icon: <MapPinned />,
      label: '物理構造',
      lead: 'Subnet → Site ／ Site Link＝Site間',
      body: 'サイトは高速・安定接続のサブネット集合。リンクは接続条件。',
      tone: 'blue',
    },
    {
      icon: <Settings2 />,
      label: '設定配布',
      lead: 'Local → Site → Domain → OU',
      body: '基礎となる処理順。強制・継承ブロック等で結果は変わる。',
      tone: 'orange',
    },
    {
      icon: <Database />,
      label: 'データと複製',
      lead: 'NTDS.dit ＋ SYSVOL',
      body: '同じドメインのDC間で複製。SYSVOLはDFSRで同期する。',
      tone: 'green',
    },
    {
      icon: <Network />,
      label: '横断・単一担当',
      lead: 'Trust・GC・FSMO',
      body: '認証経路、横断検索、5つの単一担当処理。',
      tone: 'cyan',
    },
  ]

  return (
    <section className="remotion-slide ad26-slide">
      <div className="ad26-grid" />
      <LogoMark className="ad26-logo" />

      <header className="ad26-header">
        <div>
          <span className="ad26-kicker">02 · THE BIG PICTURE</span>
          <h1>用語を、<br /><em>1枚の地図</em>に置く</h1>
        </div>
        <p>AD DSは「名簿・本人確認・設定配布」を<br />DNSとDCで支える仕組み</p>
      </header>

      <div className="ad26-main-flow">
        <article className="ad26-actor">
          <div><Users /><Building2 /></div>
          <span>利用者・端末</span>
          <strong>User / PC</strong>
        </article>
        <ArrowRight className="ad26-arrow" />
        <article className="ad26-discovery">
          <Search />
          <span>① DCを発見</span>
          <strong>DNS ＋ DC Locator</strong>
          <small>SRVレコードでサービスの場所を知る</small>
        </article>
        <ArrowRight className="ad26-arrow" />
        <article className="ad26-dc">
          <ServerCog />
          <span>② 利用可能なDCへ接続</span>
          <strong>Domain Controller</strong>
          <small>AD DSのデータを保持し、要求へ応答</small>
        </article>
        <ArrowRight className="ad26-arrow" />
        <article className="ad26-services">
          <div><KeyRound /><ShieldCheck /><Boxes /></div>
          <span>③ 機能を利用</span>
          <strong>認証・LDAP・GPO</strong>
          <small>Kerberos / NTLM · 検索 / 更新 · 設定配布</small>
        </article>
      </div>

      <div className="ad26-down"><ArrowDown /><span>同じ用語を、5つの観点で整理</span><ArrowDown /></div>

      <div className="ad26-lenses">
        {lenses.map((lens) => (
          <article className={`ad26-lens is-${lens.tone}`} key={lens.label}>
            <div className="ad26-lens-head">{lens.icon}<span>{lens.label}</span></div>
            <strong>{lens.lead}</strong>
            <p>{lens.body}</p>
          </article>
        ))}
      </div>

      <footer className="ad26-footer">
        <div className="ad26-now">
          <b>2026</b>
          <span><strong>Server 2025</strong> 機能レベル</span>
          <span><strong>SYSVOL</strong> はDFSR</span>
          <span><strong>Kerberos</strong> RC4を監査 → AES</span>
          <span><strong>LDAP</strong> 署名・TLS・Channel Binding</span>
        </div>
        <div className="ad26-sources">
          <SourceLink href={SOURCES.overview}>AD DS overview</SourceLink>
          <SourceLink href={SOURCES.server2025}>Windows Server 2025</SourceLink>
          <span>まず地図。詳細はこのあと。</span>
        </div>
      </footer>
    </section>
  )
}

function AdDsAndEntraSlide() {
  return (
    <Shell eyebrow="03 · START HERE" title={<>AD DSとEntra IDは、<em>別の仕組み</em></>} footer={<SourceLink href={SOURCES.entra}>Microsoft Learn</SourceLink>}>
      <div className="ad26-compare">
        <article className="is-blue">
          <ServerCog /><span>オンプレミス中心</span><h2>Active Directory<br />Domain Services</h2>
          <ul><li>Windows Server上で動く</li><li>Kerberos / NTLM / LDAP</li><li>ドメイン参加・GPO</li></ul>
        </article>
        <div className="ad26-not-equal">≠<small>併用できる</small></div>
        <article className="is-cyan">
          <Cloud /><span>クラウドのIDaaS</span><h2>Microsoft<br />Entra ID</h2>
          <ul><li>Microsoftのクラウドサービス</li><li>OAuth / OIDC / SAML</li><li>条件付きアクセス・MFA</li></ul>
        </article>
      </div>
      <div className="ad26-callout"><CircleAlert /><strong>「AD」とだけ言われたら、どちらを指すか確認する。</strong><span>旧称Azure ADはMicrosoft Entra IDへ。</span></div>
    </Shell>
  )
}

function ThreeLensesSlide() {
  return (
    <Shell eyebrow="04 · HOW TO READ THE MAP" title={<>用語は<em>3つの視点</em>で置いてみる</>}>
      <CardGrid cards={[
        { icon: <FolderTree />, label: 'LOGICAL', title: '論理構造', body: <><p>組織とデータをどう区切るか</p><b>Forest · Domain · OU · Object</b></>, tone: 'violet' },
        { icon: <MapPinned />, label: 'PHYSICAL', title: '物理構造', body: <><p>ネットワーク上でどう配置するか</p><b>Subnet · Site · Site Link · DC</b></>, tone: 'blue' },
        { icon: <ShieldCheck />, label: 'SERVICES', title: '提供する機能', body: <><p>利用者と端末へ何を提供するか</p><b>認証 · LDAP · GPO · 複製</b></>, tone: 'green' },
      ]} />
      <div className="ad26-callout"><Link2 /><strong>分類は“箱”ではなく“視点”。</strong><span>DCや複製のように、複数へまたがる用語もある。</span></div>
    </Shell>
  )
}

function ObjectsSlide() {
  return (
    <Shell eyebrow="05 · DIRECTORY DATA" title={<>AD DSは<em>オブジェクトの名簿</em></>} footer={<SourceLink href={SOURCES.overview}>AD DS overview</SourceLink>}>
      <div className="ad26-object-layout">
        <CardGrid columns={4} cards={[
          { icon: <Users />, title: 'ユーザー', body: '名前、部署、UPN…', tone: 'cyan' },
          { icon: <Laptop />, title: 'コンピューター', body: 'OS、DNS名…', tone: 'blue' },
          { icon: <Boxes />, title: 'グループ', body: '種類、メンバー…', tone: 'violet' },
          { icon: <ServerCog />, title: 'その他', body: 'プリンター、サービス…', tone: 'green' },
        ]} />
        <div className="ad26-definition">
          <div><Tags /><span><b>Object</b>＝1件の情報</span><span><b>Attribute</b>＝その項目</span></div>
          <code>CN=Aoi,OU=Sales,DC=example,DC=com</code>
          <p><b>DN</b>（Distinguished Name）は、ディレクトリ内の現在位置を含む“住所”。</p>
        </div>
      </div>
    </Shell>
  )
}

function LogicalStructureSlide() {
  return (
    <Shell eyebrow="06 · LOGICAL STRUCTURE" title={<>大きい順に、<em>Forest → Domain → OU</em></>} footer={<SourceLink href={SOURCES.logical}>Logical model</SourceLink>}>
      <div className="ad26-nesting">
        <div className="forest"><span>FOREST · 最上位構造／スキーマ共有</span>
          <div className="domain"><span>DOMAIN · DNS名を持つデータ区画</span>
            <div className="ou"><span>OU · 委任とGPOリンクの管理単位</span>
              <div className="objects"><Users /><Laptop /><span>Objects</span></div>
            </div>
          </div>
        </div>
        <article><Boxes /><h2>Group</h2><p>複数のユーザーやPCをまとめ、<strong>権限を付与</strong>する。</p><b>OUとグループは用途が違う</b></article>
      </div>
    </Shell>
  )
}

function DnsAndDcSlide() {
  return (
    <Shell eyebrow="07 · DISCOVERY" title={<>ログオンの前に、まず<em>DCを見つける</em></>} footer={<SourceLink href={SOURCES.overview}>AD DS overview</SourceLink>}>
      <div className="ad26-step-flow">
        {[
          { icon: <Laptop />, step: '01', title: 'クライアント', body: 'ドメインのサービスを探す' },
          { icon: <Search />, step: '02', title: 'DNS', body: 'SRVレコードを問い合わせる' },
          { icon: <MapPinned />, step: '03', title: 'DC Locator', body: 'サイト等を考慮して選ぶ' },
          { icon: <ServerCog />, step: '04', title: '利用可能なDC', body: '認証・LDAP要求へ応答' },
        ].map((item, index) => <div className="ad26-step-wrap" key={item.step}><article><span>{item.step}</span>{item.icon}<h2>{item.title}</h2><p>{item.body}</p></article>{index < 3 && <ArrowRight />}</div>)}
      </div>
      <div className="ad26-callout"><CircleAlert /><strong>DNSは“おまけ”ではない。</strong><span>AD DSの正常動作を支える中心要素。</span></div>
    </Shell>
  )
}

function PhysicalStructureSlide() {
  return (
    <Shell eyebrow="08 · PHYSICAL STRUCTURE" title={<>ネットワークの現実を<em>Site</em>で表す</>} footer={<SourceLink href={SOURCES.sites}>Site topology</SourceLink>}>
      <div className="ad26-site-map">
        <article><span>TOKYO SITE</span><div><b>10.10.0.0/16</b><ServerCog /><small>DC-01</small></div></article>
        <div className="ad26-site-link"><Cable /><strong>Site Link</strong><span>コスト・間隔・スケジュール</span></div>
        <article><span>OSAKA SITE</span><div><b>10.20.0.0/16</b><ServerCog /><small>DC-02</small></div></article>
      </div>
      <div className="ad26-three-defs"><span><b>Subnet</b>IPネットワーク</span><span><b>Site</b>高速・安定接続のSubnet集合</span><span><b>Site Link</b>Site間の接続条件</span></div>
    </Shell>
  )
}

function GpoAndJoinSlide() {
  return (
    <Shell eyebrow="09 · DEVICE MANAGEMENT" title={<>端末を仲間にし、<em>設定を配る</em></>} footer={<SourceLink href={SOURCES.gpo}>Group Policy hierarchy</SourceLink>}>
      <div className="ad26-split">
        <article className="ad26-join"><Laptop /><ArrowRight /><ShieldCheck /><h2>ドメイン参加</h2><p>PCアカウントを作り、端末とドメインの安全な関係を作る。</p></article>
        <article className="ad26-gpo"><Settings2 /><h2>Group Policy</h2><div><b>Local</b><ArrowRight /><b>Site</b><ArrowRight /><b>Domain</b><ArrowRight /><b>OU</b></div><p>基本の処理順。強制、継承ブロック、セキュリティフィルター等で最終結果は変わる。</p></article>
      </div>
      <div className="ad26-callout"><BadgeCheck /><strong>ログオン制御、セキュリティ設定、端末構成を集中管理。</strong></div>
    </Shell>
  )
}

function AuthenticationSlide() {
  return (
    <Shell eyebrow="10 · AUTHENTICATION" title={<>“ログイン”の中にも<em>別の役割</em>がある</>} footer={<SourceLink href={SOURCES.kerberos}>Kerberos overview</SourceLink>}>
      <CardGrid cards={[
        { icon: <KeyRound />, label: 'PRIMARY', title: 'Kerberos', body: <><p>チケットを使う、ドメインの標準的な認証方式。</p><b>時刻と名前解決が重要</b></>, tone: 'green' },
        { icon: <LockKeyhole />, label: 'COMPATIBILITY', title: 'NTLM', body: <><p>古い環境やKerberosを使えない場面で残る方式。</p><b>依存を把握して縮小</b></>, tone: 'orange' },
        { icon: <FileKey2 />, label: 'DELEGATION', title: 'CredSSP', body: <><p>資格情報をリモート先へ委任する仕組み。</p><b>認証方式と同じ分類ではない</b></>, tone: 'violet' },
      ]} />
    </Shell>
  )
}

function LdapSlide() {
  return (
    <Shell eyebrow="11 · DIRECTORY ACCESS" title={<>LDAPは<em>ディレクトリへの入口</em></>} footer={<SourceLink href={SOURCES.ldap}>LDAP signing guidance</SourceLink>}>
      <div className="ad26-ldap">
        <article><Search /><h2>検索</h2><p>ユーザーやグループを条件で探す。</p></article>
        <ArrowRight />
        <div className="ad26-ldap-core"><Database /><strong>AD DS</strong><span>bind · search · modify</span></div>
        <ArrowRight />
        <article><UserRoundCog /><h2>更新</h2><p>権限を持つ主体が属性を変更する。</p></article>
      </div>
      <div className="ad26-protection"><ShieldCheck /><span><b>保護する</b>LDAP署名 · TLS · Channel Binding</span><small>互換性を確認しながら段階的に強化</small></div>
    </Shell>
  )
}

function DataAndReplicationSlide() {
  return (
    <Shell eyebrow="12 · DATA & REPLICATION" title={<>2種類のデータを、<em>DC間でそろえる</em></>} footer={<SourceLink href={SOURCES.replication}>Replication concepts</SourceLink>}>
      <div className="ad26-replication">
        <article><ServerCog /><strong>DC-01</strong><div><span><Database />NTDS.dit</span><span><HardDrive />SYSVOL</span></div></article>
        <div><RefreshCw /><b>複製</b><span>変更を相互に反映</span></div>
        <article><ServerCog /><strong>DC-02</strong><div><span><Database />NTDS.dit</span><span><HardDrive />SYSVOL</span></div></article>
      </div>
      <div className="ad26-two-notes"><span><b>ディレクトリデータ</b>AD DSの複製エンジン</span><span><b>SYSVOL</b>GPO等をDFSRで同期</span></div>
    </Shell>
  )
}

function DeletionSchemaFsmoSlide() {
  return (
    <Shell eyebrow="13 · DEEPER TERMS, LIGHTLY" title={<>3つの“少し難しい用語”も<em>置き場所だけ</em></>} footer={<SourceLink href={SOURCES.fsmo}>FSMO roles</SourceLink>}>
      <CardGrid cards={[
        { icon: <Trash2 />, label: 'STATE', title: '削除も複製される', body: <><p>削除は即座に全痕跡が消える操作ではなく、削除状態がDC間へ伝わる。</p><b>復元可能期間を設計</b></>, tone: 'orange' },
        { icon: <Tags />, label: 'DEFINITION', title: 'Schema', body: <><p>どんなオブジェクトと属性を持てるかを決める、フォレスト共通の型定義。</p><b>変更は慎重に</b></>, tone: 'violet' },
        { icon: <ServerCog />, label: 'OWNER', title: 'FSMO', body: <><p>競合を避けるため、特定DCが単独で担当する5つの処理。</p><b>Forest 2 · Domain 3</b></>, tone: 'blue' },
      ]} />
    </Shell>
  )
}

function TrustAndGcSlide() {
  return (
    <Shell eyebrow="14 · ACROSS DOMAINS" title={<>別ドメインを越える<em>2つの仕組み</em></>}>
      <div className="ad26-cross-domain">
        <article><Globe2 /><span>DOMAIN A</span></article>
        <div><Link2 /><strong>Trust</strong><p>別ドメインの認証結果を受け入れる“経路”</p><b>権限の自動付与ではない</b></div>
        <article><Globe2 /><span>DOMAIN B</span></article>
      </div>
      <div className="ad26-gc"><Search /><div><h2>Global Catalog（GC）</h2><p>フォレスト内の各オブジェクトについて、一部の属性を保持して横断検索を助けるDCの役割。</p></div></div>
    </Shell>
  )
}

function RecoverySlide() {
  return (
    <Shell eyebrow="15 · OPERATIONS MINDSET" title={<>複製は<em>バックアップではない</em></>} footer={<SourceLink href={SOURCES.recovery}>Forest recovery guide</SourceLink>}>
      <div className="ad26-not-backup">
        <div><RefreshCw /><h2>Replication</h2><p>可用性を高め、変更をそろえる。</p><span>誤削除や侵害も複製する</span></div>
        <b>≠</b>
        <div><HardDrive /><h2>Backup / Recovery</h2><p>過去の正常な状態へ戻す。</p><span>復旧手順まで検証する</span></div>
      </div>
      <div className="ad26-health-row">{['DNS', 'DC探索', '複製', '時刻', 'バックアップ', '復旧性'].map((item) => <span key={item}><CheckCircle2 />{item}</span>)}</div>
    </Shell>
  )
}

function Changes2026Slide() {
  return (
    <Shell eyebrow="16 · WHAT CHANGED" title={<>2026年版で<em>追加して覚える4点</em></>} footer={<SourceLink href={SOURCES.server2025}>Windows Server 2025</SourceLink>}>
      <CardGrid columns={4} cards={[
        { icon: <ServerCog />, label: 'PLATFORM', title: 'Server 2025', body: <><p>新しいドメイン／フォレスト機能レベル。</p><b>更新機能を確認</b></>, tone: 'blue' },
        { icon: <RefreshCw />, label: 'SYSVOL', title: 'DFSR', body: <><p>新しい構成ではSYSVOLの標準複製方式。</p><b>FRS前提を捨てる</b></>, tone: 'green' },
        { icon: <KeyRound />, label: 'KERBEROS', title: 'RC4 → AES', body: <><p>RC4依存を監査し、AES対応へ移行。</p><b>互換性を先に把握</b></>, tone: 'orange' },
        { icon: <ShieldCheck />, label: 'LDAP', title: '保護を強化', body: <><p>署名、TLS、Channel Bindingを検討。</p><b>段階的に強制</b></>, tone: 'cyan' },
      ]} />
    </Shell>
  )
}

function NextStepSlide() {
  return (
    <Shell eyebrow="17 · RECAP" title={<>Part 1は、<em>地図が読めれば成功</em></>}>
      <div className="ad26-recap">
        <div className="ad26-recap-map">
          <span><FolderTree />論理構造</span><span><MapPinned />物理構造</span><span><ShieldCheck />提供機能</span>
          <strong>DNS → DC → 認証・LDAP・GPO</strong>
          <small>NTDS.dit · SYSVOL · 複製 · Trust · GC · FSMO</small>
        </div>
        <div className="ad26-part2"><span>NEXT · PART 2以降</span><h2>実物を見て、確かめる</h2><ul><li>管理GUIとPowerShell</li><li>DNSのSRVレコード</li><li>GPOの適用結果</li><li>複製状態と健全性</li></ul></div>
      </div>
      <div className="ad26-ending"><strong>用語を暗記する前に、地図へ置く。</strong><SourceLink href={SOURCES.original}>元動画を見る</SourceLink></div>
    </Shell>
  )
}
