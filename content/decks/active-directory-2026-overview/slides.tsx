/* eslint-disable react-refresh/only-export-components */
import type { ReactNode } from 'react'
import {
  ArrowRight,
  Boxes,
  Cable,
  CheckCircle2,
  CircleAlert,
  Clock3,
  Database,
  FileKey2,
  FolderInput,
  FolderTree,
  Globe2,
  HardDrive,
  KeyRound,
  Laptop,
  Link2,
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
  Wrench,
} from 'lucide-react'
import { LogoMark } from '../../../src/deck-shared'
import type { SlideModule } from '../../../src/types'
import './styles.css'

export const slides: SlideModule['slides'] = [
  { render: () => <OpeningSlide /> },
  { render: () => <GoalSlide /> },
  { render: () => <OriginalMapSlide /> },
  { render: () => <StructureSlide /> },
  { render: () => <AdAndDnsHistorySlide /> },
  { render: () => <ForestDomainSlide /> },
  { render: () => <ForestPatternsSlide /> },
  { render: () => <SiteSlide /> },
  { render: () => <SiteLinkSlide /> },
  { render: () => <ContainerOuSlide /> },
  { render: () => <AdIntegratedDnsSlide /> },
  { render: () => <SrvSlide /> },
  { render: () => <DirectoryServiceSlide /> },
  { render: () => <LdapSlide /> },
  { render: () => <AuthenticationSlide /> },
  { render: () => <GpoSlide /> },
  { render: () => <DomainJoinSlide /> },
  { render: () => <UserProfileSlide /> },
  { render: () => <DatabasePartitionsSlide /> },
  { render: () => <GlobalCatalogSlide /> },
  { render: () => <ReplicationSlide /> },
  { render: () => <TombstoneSlide /> },
  { render: () => <SchemaSlide /> },
  { render: () => <FsmoSlide /> },
  { render: () => <SysvolSlide /> },
  { render: () => <TrustSlide /> },
  { render: () => <RecoverySlide /> },
  { render: () => <DiagnosticsSlide /> },
  { render: () => <Changes2026Slide /> },
  { render: () => <RecapSlide /> },
]

const SOURCES = {
  original: 'https://www.youtube.com/watch?v=lZ8Ps6U_kvY',
  overview: 'https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/get-started/virtual-dc/active-directory-domain-services-overview',
  logical: 'https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/plan/understanding-the-active-directory-logical-model',
  sites: 'https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/plan/understanding-active-directory-site-topology',
  dns: 'https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/plan/reviewing-dns-concepts',
  ldap: 'https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/ldap-signing',
  replication: 'https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/get-started/replication/active-directory-replication-concepts',
  fsmo: 'https://learn.microsoft.com/en-us/troubleshoot/windows-server/active-directory/fsmo-roles',
  recovery: 'https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/manage/ad-forest-recovery-guide',
  server2025: 'https://learn.microsoft.com/en-us/windows-server/get-started/whats-new-windows-server-2025',
  rc4: 'https://learn.microsoft.com/en-us/windows-server/security/kerberos/detect-remediate-rc4-kerberos',
}

const originalAt = (seconds: number) => `${SOURCES.original}&t=${seconds}s`

type Card = {
  body: ReactNode
  icon: ReactNode
  label?: string
  title: ReactNode
  tone?: 'blue' | 'cyan' | 'green' | 'orange' | 'violet' | 'yellow'
}

function Shell({ children, eyebrow, footer, title }: { children: ReactNode; eyebrow: string; footer?: ReactNode; title: ReactNode }) {
  return (
    <section className="remotion-slide ad26-slide ad26-standard">
      <div className="ad26-grid" />
      <LogoMark className="ad26-logo" />
      <header className="ad26-page-head"><span>{eyebrow}</span><h1>{title}</h1></header>
      <main className="ad26-page-body">{children}</main>
      <footer className="ad26-page-footer"><span>Active Directory入門 2026 · Part 1</span><div>{footer}</div></footer>
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
          <h2>{card.title}</h2><div className="ad26-card-body">{card.body}</div>
        </article>
      ))}
    </div>
  )
}

function SourceLink({ href, children }: { href: string; children: ReactNode }) {
  return <a href={href} target="_blank" rel="noreferrer">{children}</a>
}

function OriginalLink({ seconds, time }: { seconds: number; time: string }) {
  return <SourceLink href={originalAt(seconds)}>元動画 {time}</SourceLink>
}

function Callout({ children, icon = <CheckCircle2 /> }: { children: ReactNode; icon?: ReactNode }) {
  return <div className="ad26-callout">{icon}<strong>{children}</strong></div>
}

function OpeningSlide() {
  return (
    <section className="remotion-slide ad26-slide ad26-opening">
      <div className="ad26-grid" /><LogoMark className="ad26-logo" />
      <div className="ad26-opening-copy">
        <span>ACTIVE DIRECTORY DOMAIN SERVICES · 2026</span>
        <h1>Active Directory<span>入門</span></h1>
        <p>まず把握すべき要素・概念・単語を<br /><strong>元動画の流れのまま、もう一度。</strong></p>
        <div className="ad26-chip-row"><b>元動画49分39秒</b><b>内容・話順を踏襲</b><b>BGMなし</b></div>
      </div>
      <div className="ad26-opening-visual" aria-hidden="true">
        <div className="ad26-orbit orbit-a"><Users /></div><div className="ad26-orbit orbit-b"><KeyRound /></div><div className="ad26-orbit orbit-c"><FolderTree /></div>
        <div className="ad26-core"><ServerCog /><strong>AD DS</strong><span>企業のユーザーとPCを管理</span></div>
      </div>
      <div className="ad26-opening-foot"><SourceLink href={SOURCES.original}>元動画</SourceLink><span>2026年版 · 視認性と現行差分のみ更新</span></div>
    </section>
  )
}

function GoalSlide() {
  return (
    <Shell eyebrow="02 · この動画の目的" title={<>まずは、<em>単語と概念をざっと知る</em></>} footer={<OriginalLink seconds={51} time="00:51" />}>
      <div className="ad26-goal">
        <div><b>Part 1</b><h2>全体を浅く広く</h2><p>理解しておくべき項目に、どんなものがあるか把握する。</p></div>
        <ArrowRight />
        <div><b>Part 2以降</b><h2>実際の画面で深掘り</h2><p>管理ツール、操作、コマンド、トラブル対応を一つずつ試す。</p></div>
      </div>
      <Callout>この動画だけで「言葉を聞いたことがある」「大まかな位置が分かる」状態へ。</Callout>
    </Shell>
  )
}

function OriginalMapSlide() {
  const groups = [
    ['構造', 'Forest · Domain · Site · Subnet · Site Link · Container · OU'],
    ['サービス', 'DNS · SRV · LDAP · 認証 · GPO · Domain Join'],
    ['データ', 'Profile · Partition · GC · Replication · Tombstone'],
    ['運用', 'Schema · FSMO · SYSVOL · Trust · Recovery · Diagnostics'],
  ]
  return (
    <Shell eyebrow="03 · 元動画の全体図" title={<>これから出てくる<em>用語の地図</em></>} footer={<OriginalLink seconds={74} time="01:14" />}>
      <div className="ad26-original-map">
        <div className="ad26-map-core"><ServerCog /><strong>Active Directory<br />Domain Services</strong><span>Domain Controllerが提供</span></div>
        <div className="ad26-map-groups">{groups.map(([title, body], i) => <article className={`map-${i + 1}`} key={title}><b>{title}</b><p>{body}</p></article>)}</div>
      </div>
      <Callout icon={<CircleAlert />}>ここでは暗記しない。順番に「何のための言葉か」だけ置いていく。</Callout>
    </Shell>
  )
}

function StructureSlide() {
  return (
    <Shell eyebrow="04 · 構造" title={<>最初に、<em>入れ物の関係</em>をつかむ</>} footer={<OriginalLink seconds={74} time="01:14" />}>
      <div className="ad26-structure-tree">
        <div className="forest"><b>Forest</b><span>AD DS全体の大きな単位</span><div className="domain"><b>Domain</b><span>ユーザーやPCを管理する範囲</span><div><i>Container</i><i>OU</i></div></div></div>
        <div className="site"><b>Site</b><span>ネットワーク上の場所</span><div><i>Subnet</i><i>Site Link</i></div></div>
      </div>
      <Callout>Forest／Domainの論理構造と、Siteのネットワーク構造は同じ階層ではない。</Callout>
    </Shell>
  )
}

function AdAndDnsHistorySlide() {
  return (
    <Shell eyebrow="05 · ADとDNSの関係" title={<>ADの「ドメイン」は、<em>DNSより先にあった</em></>} footer={<OriginalLink seconds={172} time="02:52" />}>
      <div className="ad26-history">
        <article><span>1990年代</span><h2>Windows NT Domain</h2><p>PCとユーザーをまとめて管理する範囲。まだDNS名は使わない。</p></article>
        <ArrowRight />
        <article><span>Windows 2000〜</span><h2>Active Directory</h2><p>ドメインという管理単位を引き継ぎ、DNSの名前と仕組みを利用。</p></article>
      </div>
      <Callout icon={<CircleAlert />}>ADドメインとDNSドメインは名前が重なる。でも役割は同じではない。</Callout>
    </Shell>
  )
}

function ForestDomainSlide() {
  return (
    <Shell eyebrow="06 · フォレストとドメイン" title={<>Forestの中に、<em>1個以上のDomain</em></>} footer={<><OriginalLink seconds={289} time="04:49" /><SourceLink href={SOURCES.logical}>公式</SourceLink></>}>
      <div className="ad26-nesting">
        <div className="forest"><span>FOREST · 最上位の境界</span><div className="domain-row"><div className="domain"><span>example.com</span><small>ルートドメイン</small><div className="objects"><Users /><Laptop /><span>Objects</span></div></div><div className="domain"><span>child.example.com</span><small>子ドメイン</small><div className="objects"><Users /><Laptop /><span>別のデータ区画</span></div></div></div></div>
        <article><FolderTree /><h2>Single Forest</h2><p>ドメインは1個でも複数でも構成できる。</p><b>DNS名だけではForestの境界は分からない</b></article>
      </div>
    </Shell>
  )
}

function ForestPatternsSlide() {
  return (
    <Shell eyebrow="07 · 構成パターン" title={<>同じDNS階層でも、<em>Forestは別かもしれない</em></>} footer={<OriginalLink seconds={390} time="06:30" />}>
      <CardGrid cards={[
        { icon: <FolderTree />, label: 'PATTERN A', title: '1 Forest / 1 Domain', body: <><p>example.comだけを持つ、もっとも単純な形。</p><b>Single Forest · Single Domain</b></>, tone: 'green' },
        { icon: <Network />, label: 'PATTERN B', title: '1 Forest / 複数Domain', body: <><p>example.comとchild.example.comが同じForest。</p><b>Forest内でつながる</b></>, tone: 'blue' },
        { icon: <Globe2 />, label: 'PATTERN C', title: '複数Forest', body: <><p>DNS名が連続して見えても、AD DSは独立できる。</p><b>Forest関係を確認</b></>, tone: 'violet' },
      ]} />
    </Shell>
  )
}

function SiteSlide() {
  return (
    <Shell eyebrow="08 · Site / DC / Subnet" title={<>Siteは、<em>ネットワーク的に近い場所</em></>} footer={<><OriginalLink seconds={509} time="08:29" /><SourceLink href={SOURCES.sites}>公式</SourceLink></>}>
      <div className="ad26-site-map">
        <article><span>TOKYO SITE</span><div><b>10.10.0.0/16</b><ServerCog /><small>DC-TYO</small></div></article>
        <div className="ad26-site-link"><Cable /><strong>WAN / VPN</strong><span>拠点間ネットワーク</span></div>
        <article><span>OSAKA SITE</span><div><b>10.20.0.0/16</b><ServerCog /><small>DC-OSA</small></div></article>
      </div>
      <Callout>SubnetをSiteへ対応付け、クライアントが近いDCを優先して使えるようにする。</Callout>
    </Shell>
  )
}

function SiteLinkSlide() {
  return (
    <Shell eyebrow="09 · Site Link" title={<>Site間の<em>複製条件</em>を表す</>} footer={<OriginalLink seconds={690} time="11:30" />}>
      <CardGrid cards={[
        { icon: <Link2 />, label: 'PATH', title: '接続', body: <><p>どのSite同士を接続するか。</p><b>Site間の経路</b></>, tone: 'cyan' },
        { icon: <Network />, label: 'COST', title: 'コスト', body: <><p>どの複製経路を優先するかに影響。</p><b>小さい値を優先</b></>, tone: 'orange' },
        { icon: <Clock3 />, label: 'SCHEDULE', title: '間隔と時間帯', body: <><p>いつ、どの間隔で複製を行うか。</p><b>回線条件を反映</b></>, tone: 'violet' },
      ]} />
    </Shell>
  )
}

function ContainerOuSlide() {
  return (
    <Shell eyebrow="10 · Container / OU" title={<>Domainの中を、<em>管理しやすく分ける</em></>} footer={<OriginalLink seconds={753} time="12:33" />}>
      <div className="ad26-folder-compare">
        <article><FolderInput /><span>Container</span><h2>最初からある入れ物</h2><p>Users、Computersなど、組み込みの汎用コンテナ。</p></article>
        <article><FolderTree /><span>Organizational Unit</span><h2>管理者が作る組織単位</h2><p>オブジェクトを整理し、管理委任やGPOリンクに使う。</p></article>
      </div>
      <Callout>大きなDomainの中を、組織・拠点・役割などの単位で管理しやすくする。</Callout>
    </Shell>
  )
}

function AdIntegratedDnsSlide() {
  return (
    <Shell eyebrow="11 · DNS / AD統合ゾーン" title={<>DNSの情報も、<em>AD DSで複製できる</em></>} footer={<><OriginalLink seconds={943} time="15:43" /><SourceLink href={SOURCES.dns}>公式</SourceLink></>}>
      <div className="ad26-integrated-dns">
        <article><ServerCog /><strong>DC + DNS</strong><span>AD統合DNSゾーン</span></article>
        <div><RefreshCw /><b>AD DS Replication</b><small>複製範囲を選べる</small></div>
        <article><ServerCog /><strong>DC + DNS</strong><span>AD統合DNSゾーン</span></article>
      </div>
      <Callout>DNS Server役割はDCへ併設されることが多い。AD統合ゾーンはAD DS内へ保存される。</Callout>
    </Shell>
  )
}

function SrvSlide() {
  return (
    <Shell eyebrow="12 · SRVレコード" title={<>DNSで、<em>サービスの場所</em>を探す</>} footer={<OriginalLink seconds={1124} time="18:44" />}>
      <div className="ad26-srv-flow">
        <article><Laptop /><h2>クライアント</h2><p>このDomain／Siteで使えるDCは？</p></article><ArrowRight />
        <div><Search /><code>_ldap._tcp.dc._msdcs.example.com</code><span>SRVレコード</span></div><ArrowRight />
        <article><ServerCog /><h2>Domain Controller</h2><p>ホスト名・ポート・優先度を回答。</p></article>
      </div>
      <Callout>Aレコードは「ホストの場所」。SRVレコードは「サービスの場所」。</Callout>
    </Shell>
  )
}

function DirectoryServiceSlide() {
  return (
    <Shell eyebrow="13 · Directory Service" title={<>ユーザー・グループ・PCを<em>一元管理</em></>} footer={<OriginalLink seconds={1221} time="20:21" />}>
      <CardGrid columns={4} cards={[
        { icon: <Users />, title: 'User', body: '人を表すアカウント', tone: 'cyan' },
        { icon: <Boxes />, title: 'Group', body: '複数の対象をまとめる', tone: 'violet' },
        { icon: <Laptop />, title: 'Computer', body: '参加した端末のアカウント', tone: 'blue' },
        { icon: <Tags />, title: 'Attribute', body: '名前・所属などの項目', tone: 'green' },
      ]} />
      <Callout>Directory Serviceは、階層を持つデータとして管理対象を保存・検索する。</Callout>
    </Shell>
  )
}

function LdapSlide() {
  return (
    <Shell eyebrow="14 · LDAP" title={<>LDAPは、<em>Directoryへアクセスする約束</em></>} footer={<><OriginalLink seconds={1228} time="20:28" /><SourceLink href={SOURCES.ldap}>公式</SourceLink></>}>
      <div className="ad26-ldap">
        <article><Search /><h2>検索</h2><p>ユーザーやグループを探す。</p></article><ArrowRight />
        <div className="ad26-ldap-core"><Database /><strong>AD DS</strong><span>Directory Database</span></div><ArrowRight />
        <article><UserRoundCog /><h2>更新</h2><p>権限の範囲で属性を変更。</p></article>
      </div>
      <div className="ad26-protection"><ShieldCheck /><span><b>2026</b>署名 · TLS · Channel Bindingで保護</span><small>互換性を監査して段階的に強化</small></div>
    </Shell>
  )
}

function AuthenticationSlide() {
  return (
    <Shell eyebrow="15 · 認証" title={<>AD認証にも、<em>いくつか種類がある</em></>} footer={<OriginalLink seconds={1280} time="21:20" />}>
      <CardGrid cards={[
        { icon: <KeyRound />, label: 'MAIN', title: 'Kerberos', body: <><p>チケットを使う、AD DSの中心的な認証方式。</p><b>時刻・DNSが重要</b></>, tone: 'green' },
        { icon: <ShieldCheck />, label: 'LEGACY', title: 'NTLM', body: <><p>互換性のため残る古い認証方式。</p><b>利用を把握して縮小</b></>, tone: 'orange' },
        { icon: <FileKey2 />, label: 'DELEGATION', title: 'CredSSP', body: <><p>資格情報をリモート先へ委任する仕組み。</p><b>認証方式とは役割が違う</b></>, tone: 'violet' },
      ]} />
    </Shell>
  )
}

function GpoSlide() {
  return (
    <Shell eyebrow="16 · Group Policy" title={<>多数のPCへ、<em>組織の設定を配る</em></>} footer={<OriginalLink seconds={1364} time="22:44" />}>
      <div className="ad26-policy-examples">
        <span><KeyRound />パスワード・セキュリティ</span><span><Clock3 />ロック・スクリーンセーバー</span><span><Wrench />Windowsの構成</span><span><FolderInput />スクリプト・ドライブ割当</span>
      </div>
      <div className="ad26-gpo-order"><b>Site</b><ArrowRight /><b>Domain</b><ArrowRight /><b>OU</b><span>対象へGPOをリンク</span></div>
      <Callout>Domain参加したユーザーとPCへ、中央から同じルールを適用できる。</Callout>
    </Shell>
  )
}

function DomainJoinSlide() {
  return (
    <Shell eyebrow="17 · Domain Join" title={<>PCを、<em>AD DSの管理下へ</em></>} footer={<OriginalLink seconds={1440} time="24:00" />}>
      <div className="ad26-step-flow">
        {[
          { icon: <Laptop />, step: '01', title: 'PC', body: 'まだネットワーク上にいるだけ' },
          { icon: <FolderInput />, step: '02', title: 'Domain参加', body: 'PCアカウントを作成' },
          { icon: <ShieldCheck />, step: '03', title: '安全な関係', body: '端末とDomainを結ぶ' },
          { icon: <Settings2 />, step: '04', title: '管理開始', body: 'Domain認証・GPOを利用' },
        ].map((item, index) => <div className="ad26-step-wrap" key={item.step}><article><span>{item.step}</span>{item.icon}<h2>{item.title}</h2><p>{item.body}</p></article>{index < 3 && <ArrowRight />}</div>)}
      </div>
    </Shell>
  )
}

function UserProfileSlide() {
  return (
    <Shell eyebrow="18 · User Profile" title={<>同じ名前でも、<em>別ユーザーなら別Profile</em></>} footer={<OriginalLink seconds={1493} time="24:53" />}>
      <div className="ad26-profile-compare">
        <article><Laptop /><span>PC-A</span><h2>PC-A\aoi</h2><p>ローカルユーザーのデスクトップ、Documents、設定。</p></article>
        <b>≠</b>
        <article><Globe2 /><span>example.com</span><h2>EXAMPLE\aoi</h2><p>Domainユーザーとして初回サインイン時に作られる別Profile。</p></article>
      </div>
      <Callout icon={<CircleAlert />}>Domain参加やDomain移行で、既存Profileをそのまま自動継承するわけではない。</Callout>
    </Shell>
  )
}

function DatabasePartitionsSlide() {
  return (
    <Shell eyebrow="19 · ADのDatabase" title={<>複製する範囲ごとに、<em>Partitionがある</em></>} footer={<OriginalLink seconds={1635} time="27:15" />}>
      <CardGrid columns={4} cards={[
        { icon: <Settings2 />, label: 'FOREST', title: 'Configuration', body: <><p>SiteやServiceなど、Forest全体の構成。</p><b>全DomainのDC</b></>, tone: 'blue' },
        { icon: <Tags />, label: 'FOREST', title: 'Schema', body: <><p>ObjectとAttributeの定義。</p><b>全DomainのDC</b></>, tone: 'violet' },
        { icon: <Database />, label: 'DOMAIN', title: 'Domain', body: <><p>User、Computer、Groupなど。</p><b>同じDomainのDC</b></>, tone: 'green' },
        { icon: <Globe2 />, label: 'OPTIONAL', title: 'Application', body: <><p>DNSなど用途別データ。</p><b>複製範囲を設定</b></>, tone: 'cyan' },
      ]} />
    </Shell>
  )
}

function GlobalCatalogSlide() {
  return (
    <Shell eyebrow="20 · Global Catalog" title={<>Forest全体を探すための、<em>部分的な索引</em></>} footer={<OriginalLink seconds={1770} time="29:30" />}>
      <div className="ad26-gc-search">
        <div><Search /><strong>Forest全体から<br />aoiを探す</strong></div><ArrowRight />
        <article><Globe2 /><h2>Global Catalog</h2><p>各DomainのObjectについて、よく使うAttributeの一部を保持。</p></article><ArrowRight />
        <div><Users /><strong>候補を<br />横断検索</strong></div>
      </div>
      <Callout>完全なAttributeが必要なら、そのObjectを持つDomainのDCへ問い合わせる。</Callout>
    </Shell>
  )
}

function ReplicationSlide() {
  return (
    <Shell eyebrow="21 · 複製ロジック" title={<>書き込み可能DCは、基本<em>Multi-Master</em></>} footer={<><OriginalLink seconds={1849} time="30:49" /><SourceLink href={SOURCES.replication}>公式</SourceLink></>}>
      <div className="ad26-replication">
        <article><ServerCog /><strong>DC-01</strong><div><span><Users />Userを変更</span><span><Database />Domain Partition</span></div></article>
        <div><RefreshCw /><b>Replication</b><span>変更を相互に反映</span></div>
        <article><ServerCog /><strong>DC-02</strong><div><span><Users />Userを変更</span><span><Database />Domain Partition</span></div></article>
      </div>
      <Callout>一方だけが常にPrimaryではない。Site構成や競合解決を含む複製ルールがある。</Callout>
    </Shell>
  )
}

function TombstoneSlide() {
  return (
    <Shell eyebrow="22 · Tombstone" title={<>「削除した」という情報にも、<em>保存期間がある</em></>} footer={<OriginalLink seconds={1923} time="32:03" />}>
      <div className="ad26-tombstone-flow">
        <div><Users /><span>User A</span></div><ArrowRight /><div><Trash2 /><span>削除状態</span><small>他のDCへ複製</small></div><ArrowRight /><div><Clock3 /><span>保持期間</span><small>Tombstone lifetime</small></div><ArrowRight /><div><HardDrive /><span>最終的に破棄</span></div>
      </div>
      <Callout icon={<CircleAlert />}>長期間オフラインだったDCを、そのまま復帰・複製させてはいけない場合がある。</Callout>
    </Shell>
  )
}

function SchemaSlide() {
  return (
    <Shell eyebrow="23 · Schema" title={<>Schemaは、<em>Directoryの設計図</em></>} footer={<OriginalLink seconds={2178} time="36:18" />}>
      <div className="ad26-schema">
        <article><Tags /><h2>Object class</h2><p>User、Computer、Groupなど「何を保存できるか」。</p></article>
        <span>＋</span>
        <article><Boxes /><h2>Attribute</h2><p>名前、メールアドレスなど「どんな項目を持つか」。</p></article>
        <ArrowRight />
        <article><Database /><h2>Forest共通</h2><p>Schema拡張はForest全体へ影響する。</p></article>
      </div>
      <Callout>Exchange Serverなど、製品導入時にAttributeが追加されることがある。</Callout>
    </Shell>
  )
}

function FsmoSlide() {
  return (
    <Shell eyebrow="24 · FSMO / 操作マスター" title={<>競合させたくない<em>5つの処理だけ単一担当</em></>} footer={<><OriginalLink seconds={2243} time="37:23" /><SourceLink href={SOURCES.fsmo}>公式</SourceLink></>}>
      <div className="ad26-fsmo">
        <section><span>FORESTに1つずつ</span><b>Schema Master</b><b>Domain Naming Master</b></section>
        <section><span>DOMAINごとに1つずつ</span><b>RID Master</b><b>PDC Emulator</b><b>Infrastructure Master</b></section>
      </div>
      <Callout>普段はMulti-Master。それでも単一の調整役が必要な操作をFSMOが担当する。</Callout>
    </Shell>
  )
}

function SysvolSlide() {
  return (
    <Shell eyebrow="25 · SYSVOL / FRS / DFSR" title={<>SYSVOLは、<em>Fileとして別に複製</em></>} footer={<OriginalLink seconds={2362} time="39:22" />}>
      <div className="ad26-two-repl">
        <article><Database /><h2>AD DS Database</h2><p>User、Computer、Group、Attribute。</p><b>AD DS Replication</b></article>
        <article><HardDrive /><h2>SYSVOL</h2><p>GPO Template、サインインスクリプト。</p><b>DFSRで複製</b></article>
      </div>
      <Callout icon={<CircleAlert />}>FRSは旧方式。2026年の新しい構成ではDFSRを前提にする。</Callout>
    </Shell>
  )
}

function TrustSlide() {
  return (
    <Shell eyebrow="26 · 信頼関係" title={<>別DomainのUserを、<em>認証対象として受け入れる</em></>} footer={<OriginalLink seconds={2476} time="41:16" />}>
      <div className="ad26-cross-domain">
        <article><Globe2 /><span>DOMAIN A</span></article>
        <div><Link2 /><strong>Trust</strong><p>方向は一方向／双方向</p><b>認証経路を作る</b></div>
        <article><Globe2 /><span>DOMAIN B</span></article>
      </div>
      <div className="ad26-gc"><FolderInput /><div><h2>例：Domain AのFile Server</h2><p>信頼するDomain BのUser／Groupを、アクセス権の対象として指定できる。</p></div></div>
    </Shell>
  )
}

function RecoverySlide() {
  return (
    <Shell eyebrow="27 · 災害対策" title={<>DC 1台の故障と、<em>Forest全損は別</em></>} footer={<><OriginalLink seconds={2628} time="43:48" /><SourceLink href={SOURCES.recovery}>公式</SourceLink></>}>
      <div className="ad26-recovery-cases">
        <article><ServerCog /><span>DC 1台が故障</span><h2>残るDCから再構築</h2><p>新しいServerをDCへ昇格し、データを複製する。</p></article>
        <article><HardDrive /><span>全DC／Forestを喪失</span><h2>BackupからForest Recovery</h2><p>Directory Services Restore Modeや権威復元を理解して復旧。</p></article>
      </div>
      <Callout icon={<CircleAlert />}>複数DCは可用性。Backupと復旧手順の検証は別に必要。</Callout>
    </Shell>
  )
}

function DiagnosticsSlide() {
  return (
    <Shell eyebrow="28 · 診断コマンド" title={<>管理者が知っておく<em>代表コマンド</em></>} footer={<OriginalLink seconds={2746} time="45:46" />}>
      <CardGrid columns={4} cards={[
        { icon: <ServerCog />, title: <code>dcdiag</code>, body: <><p>DCの状態を診断。</p><b>DNS等のTestも実行</b></>, tone: 'green' },
        { icon: <RefreshCw />, title: <code>repadmin</code>, body: <><p>複製状態や失敗を確認。</p><b>Replication診断</b></>, tone: 'cyan' },
        { icon: <Network />, title: <code>netdiag</code>, body: <><p>元動画で紹介された旧Support Tools。</p><b>現在はlegacy</b></>, tone: 'orange' },
        { icon: <FolderInput />, title: <code>csvde</code>, body: <><p>Directory ObjectをCSVへ出力／入力。</p><b>診断ではなく入出力</b></>, tone: 'violet' },
      ]} />
    </Shell>
  )
}

function Changes2026Slide() {
  return (
    <Shell eyebrow="29 · 2026年版の補足" title={<>元動画に足すのは、<em>現行差分だけ</em></>} footer={<><SourceLink href={SOURCES.server2025}>Server 2025</SourceLink><SourceLink href={SOURCES.rc4}>RC4対応</SourceLink></>}>
      <CardGrid columns={4} cards={[
        { icon: <ServerCog />, label: 'AD DS', title: 'Server 2025', body: <><p>新しいForest／Domain機能レベル。</p><b>32K page機能</b></>, tone: 'blue' },
        { icon: <RefreshCw />, label: 'SYSVOL', title: 'DFSR', body: <><p>FRSではなくDFSRを前提にする。</p><b>旧構成は移行確認</b></>, tone: 'green' },
        { icon: <KeyRound />, label: 'KERBEROS', title: 'RC4 → AES', body: <><p>RC4依存を監査し、AES対応へ。</p><b>互換性を先に確認</b></>, tone: 'orange' },
        { icon: <ShieldCheck />, label: 'LDAP', title: '通信を保護', body: <><p>署名、TLS、Channel Binding。</p><b>段階的に強化</b></>, tone: 'cyan' },
      ]} />
    </Shell>
  )
}

function RecapSlide() {
  return (
    <Shell eyebrow="30 · まとめ" title={<>まずは、<em>これらの言葉を知っておく</em></>} footer={<SourceLink href={SOURCES.original}>元動画を見る</SourceLink>}>
      <div className="ad26-recap-list">
        <section><b>構造</b><p>Forest · Domain · Site · Subnet · Site Link · Container · OU</p></section>
        <section><b>利用</b><p>DNS · SRV · LDAP · Kerberos · NTLM · GPO · Domain Join · Profile</p></section>
        <section><b>内部</b><p>Partition · GC · Replication · Tombstone · Schema · FSMO · SYSVOL</p></section>
        <section><b>運用</b><p>Trust · Recovery · dcdiag · repadmin · csvde</p></section>
      </div>
      <div className="ad26-ending"><strong>細かい画面と実際の操作は、Part 2以降で。</strong><span>BGMなしで収録</span></div>
    </Shell>
  )
}
