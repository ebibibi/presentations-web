/* eslint-disable react-refresh/only-export-components */
import type { ReactNode } from 'react'
import {
  ArrowRight,
  Ban,
  CalendarClock,
  CheckCircle2,
  CircleAlert,
  Clock3,
  Database,
  HardDrive,
  Hash,
  KeyRound,
  Laptop,
  ListChecks,
  Network,
  Route,
  ScanSearch,
  ServerCog,
  ShieldAlert,
  ShieldCheck,
  Siren,
  TriangleAlert,
  Users,
  Wrench,
} from 'lucide-react'
import { LogoMark } from '../../../src/deck-shared'
import type { SlideModule } from '../../../src/types'
import './styles.css'

export const slides: SlideModule['slides'] = [
  { render: () => <OpeningSlide /> },
  { render: () => <WhyNowSlide /> },
  { render: () => <MisunderstandingSlide /> },
  { render: () => <PhasesSlide /> },
  { render: () => <Phase3Slide /> },
  { render: () => <TwoKnobsSlide /> },
  { render: () => <BitsSlide /> },
  { render: () => <WhoBreaksSlide /> },
  { render: () => <IntermittentSlide /> },
  { render: () => <InventorySlide /> },
  { render: () => <RemediationSlide /> },
  { render: () => <RecapSlide /> },
]

const SOURCES = {
  kb: 'https://support.microsoft.com/en-us/topic/how-to-manage-kerberos-kdc-usage-of-rc4-for-service-account-ticket-issuance-changes-related-to-cve-2026-20833-1ebcda33-720a-4da8-93c1-b0496e1910dc',
  detect: 'https://learn.microsoft.com/en-us/windows-server/security/kerberos/detect-remediate-rc4-kerberos',
  guide: 'https://techcommunity.microsoft.com/blog/coreinfrastructureandsecurityblog/how-to-manage-rc4-hardening-%E2%80%93-definitive-guide/4515923',
  event4769: 'https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-4769',
  scripts: 'https://github.com/microsoft/Kerberos-Crypto',
  azfiles: 'https://techcommunity.microsoft.com/blog/azurestorageblog/action-required-kerberos-rc4-hardening-may-affect-azure-files-active-directory-d/4518577',
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
    <section className="remotion-slide rc4-slide rc4-standard">
      <div className="rc4-grid" />
      <LogoMark className="rc4-logo" />
      <header className="rc4-page-head">
        <span>{eyebrow}</span>
        <h1>{title}</h1>
      </header>
      <main className="rc4-page-body">{children}</main>
      <footer className="rc4-page-footer">
        <span>Kerberos RC4ハードニング 2026</span>
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

function OpeningSlide() {
  return (
    <section className="remotion-slide rc4-slide rc4-opening">
      <div className="rc4-grid" />
      <LogoMark className="rc4-logo" />
      <div className="rc4-opening-copy">
        <span>ACTIVE DIRECTORY / KERBEROS</span>
        <h1>
          ADのRC4が
          <br />
          <em>「既定で」</em>
          <br />
          使えなくなった
        </h1>
        <p>
          CVE-2026-20833に対応するKDCの変更は、2026年7月14日の更新で
          最終フェーズに入りました。禁止されたわけではありません。
          <strong>既定値が変わり、戻す手段が消えた</strong>のです。
        </p>
      </div>
      <div className="rc4-opening-side">
        <article className="rc4-open-card is-red">
          <Ban />
          <strong>消えた</strong>
          <small>既定でRC4を許す動作／レジストリによるロールバック／監査モード</small>
        </article>
        <article className="rc4-open-card is-green">
          <ShieldCheck />
          <strong>残った</strong>
          <small>DC単位・アカウント単位の明示設定によるRC4の例外</small>
        </article>
        <article className="rc4-open-card is-amber">
          <Siren />
          <strong>危ない</strong>
          <small>SPN付きサービスアカウント／非Windows実装／古いパスワード</small>
        </article>
      </div>
    </section>
  )
}

function WhyNowSlide() {
  return (
    <Shell
      eyebrow="背景"
      title={
        <>
          チケットが<em>持ち帰られて</em>解析される
        </>
      }
      footer={<Src href={SOURCES.kb}>Microsoft サポート KB</Src>}
    >
      <div className="rc4-flow">
        <article>
          <Users />
          <strong>攻撃者は普通のドメインユーザー</strong>
          <small>特権は要りません。認証済みなら誰でもサービスチケットを要求できます</small>
        </article>
        <ArrowRight className="rc4-arrow" />
        <article>
          <KeyRound />
          <strong>RC4のサービスチケットを取得</strong>
          <small>チケットはサービスアカウントのパスワード由来の鍵で暗号化されています</small>
        </article>
        <ArrowRight className="rc4-arrow" />
        <article className="is-danger">
          <ShieldAlert />
          <strong>オフラインで総当たり</strong>
          <small>ADに一切アクセスせず、手元でパスワードを復元しにいく（Kerberoasting）</small>
        </article>
      </div>
      <div className="rc4-note">
        <CircleAlert />
        <p>
          RC4依存は「古いOSだけの問題」ではありません。
          <em>msDS-SupportedEncryptionTypesが未設定のアカウント</em>、
          <em>長期間パスワードを変えておらずAES鍵を持たないアカウント</em>、
          非WindowsのKerberos実装、NASや業務アプライアンスにも残ります。
          だからMicrosoftは一度に挙動を変えず、先に監査イベントを配ってから既定値を変えました。
        </p>
      </div>
    </Shell>
  )
}

function MisunderstandingSlide() {
  const items = [
    {
      wrong: 'RC4は完全に使えなくなった',
      right: '明示設定すれば今も使える',
      body: 'DCのDefaultDomainSupportedEncTypes、またはアカウントのmsDS-SupportedEncryptionTypesにRC4のビットを立てれば発行されます。公式FAQも「管理者が明示設定した構成は尊重する」と明記しています。',
    },
    {
      wrong: '影響が大きいので延期された',
      right: '予定どおり実施済み',
      body: '2026年7月14日のセキュリティ更新でフェーズ3に入りました。それ以降の月次更新はすべてこの変更を含みます。「まだ来ていない」という前提で計画を組むと、更新した瞬間に本番で発覚します。',
    },
    {
      wrong: 'DCを更新しなければ関係ない',
      right: '棚卸しは今すぐできる／すべき',
      body: '未更新のDCでもイベント4769からRC4の利用実態は取れます。そして未更新のまま置くことは、CVE-2026-20833が未対処のまま残るという意味でもあります。',
    },
  ]
  return (
    <Shell
      eyebrow="前提の整理"
      title={
        <>
          先に潰しておきたい<em>3つの誤解</em>
        </>
      }
      footer={<Src href={SOURCES.kb}>公式KB / FAQ</Src>}
    >
      <div className="rc4-myths">
        {items.map((item) => (
          <article key={item.wrong}>
            <div className="rc4-myth-head">
              <span className="rc4-x">
                <Ban /> {item.wrong}
              </span>
              <span className="rc4-o">
                <CheckCircle2 /> {item.right}
              </span>
            </div>
            <p>{item.body}</p>
          </article>
        ))}
      </div>
    </Shell>
  )
}

function PhasesSlide() {
  const phases = [
    {
      date: '2026-01-13',
      name: 'Initial Deployment',
      tone: 'blue' as const,
      kdc: '既定動作は変えない。KDCSVCのイベント201〜209で依存関係を可視化する監査期間',
      you: '監査ログを集めてRC4依存の一覧を作る',
    },
    {
      date: '2026-04-14',
      name: 'Enforcement（ロールバック可）',
      tone: 'amber' as const,
      kdc: '明示設定のないドメインの既定を0x18（AES-SHA1のみ）へ変更。レジストリで監査モードへ戻せる',
      you: '本番で試して、壊れたら一時的に戻す',
    },
    {
      date: '2026-07-14',
      name: 'Enforcement（ハード強制）',
      tone: 'red' as const,
      kdc: '監査モードを削除し、RC4DefaultDisablementPhaseを無視。強制のみをサポート',
      you: '戻せない。明示設定で例外を作るしかない',
    },
  ]
  return (
    <Shell
      eyebrow="ロールアウト"
      title={
        <>
          半年かけた<em>3段階</em>。猶予ではなく移行期間
        </>
      }
      footer={<Src href={SOURCES.guide}>How to Manage RC4 Hardening – Definitive Guide</Src>}
    >
      <div className="rc4-timeline">
        {phases.map((phase) => (
          <article className={`rc4-phase is-${phase.tone}`} key={phase.date}>
            <div className="rc4-phase-head">
              <CalendarClock />
              <b>{phase.date}</b>
            </div>
            <strong>{phase.name}</strong>
            <p>{phase.kdc}</p>
            <span>
              <Wrench /> {phase.you}
            </span>
          </article>
        ))}
      </div>
      <div className="rc4-note">
        <Clock3 />
        <p>
          長期間更新していないDCへ後から累積更新をまとめて当てても、
          <em>組織側の監査・検証期間だけがゼロに圧縮されます</em>。
          「まず警告だけ出して様子を見る」期間はもう存在しません。新規に構築したDCも、
          最新の更新を当てた時点でいきなり変更後の動作から始まります。
        </p>
      </div>
    </Shell>
  )
}

function Phase3Slide() {
  return (
    <Shell
      eyebrow="フェーズ3の中身"
      title={
        <>
          消えたのは<em>3つだけ</em>。設定の口は生きている
        </>
      }
      footer={<Src href={SOURCES.kb}>公式KB</Src>}
    >
      <div className="rc4-split">
        <section className="rc4-col is-red">
          <h2>
            <Ban /> 7月に消えたもの
          </h2>
          <ul>
            <li>
              <code>RC4DefaultDisablementPhase</code>
              <span>読まれなくなりました。0や1を書いても無視されます</span>
            </li>
            <li>
              監査モード
              <span>「警告は出すがブロックはしない」状態が廃止され、強制のみになりました</span>
            </li>
            <li>
              暗黙のRC4許可
              <span>明示設定のないドメインの既定は0x18（AES-128 / AES-256のみ）として扱われます</span>
            </li>
          </ul>
        </section>
        <section className="rc4-col is-green">
          <h2>
            <ShieldCheck /> 引き続き有効なもの
          </h2>
          <ul>
            <li>
              <code>DefaultDomainSupportedEncTypes</code>
              <span>DCのレジストリ。明示設定済みの値をパッチが上書きすることはありません</span>
            </li>
            <li>
              <code>msDS-SupportedEncryptionTypes</code>
              <span>ADの属性。アカウント単位で暗号方式を指定します</span>
            </li>
            <li>
              GPO「Kerberosで許可する暗号化の種類」
              <span>ここがAESのみだと、属性でRC4を立ててもKDCが解釈できず失敗します</span>
            </li>
          </ul>
        </section>
      </div>
    </Shell>
  )
}

function TwoKnobsSlide() {
  return (
    <Shell
      eyebrow="設定モデル"
      title={
        <>
          つまみは2つ。<em>効く範囲</em>がまったく違う
        </>
      }
      footer={<Src href={SOURCES.guide}>レジストリパスとビットの詳細</Src>}
    >
      <div className="rc4-knobs">
        <article className="is-blue">
          <div className="rc4-knob-head">
            <ServerCog />
            <span>DC単位</span>
          </div>
          <strong>DefaultDomainSupportedEncTypes</strong>
          <p>
            設定したDCにしか効きません。DCごとに挙動が変わります。
            更新済みDCと未更新DCが混在すると、そのまま挙動の食い違いになります。
          </p>
          <div className="rc4-paths">
            <div>
              <span>Windows Server 2016〜2022</span>
              <code>HKLM\System\CurrentControlSet\Services\KDC</code>
            </div>
            <div>
              <span>Windows Server 2025</span>
              <code>
                HKLM\Software\Microsoft\Windows\CurrentVersion\Policies\System\Kerberos\Parameters
              </code>
            </div>
          </div>
        </article>
        <article className="is-violet">
          <div className="rc4-knob-head">
            <Database />
            <span>アカウント単位</span>
          </div>
          <strong>msDS-SupportedEncryptionTypes</strong>
          <p>
            AD DSの属性なので<em>全DCへ複製されます</em>。
            どのDCが更新済みかに関係なく効くため、例外を作るならこちらのほうが挙動が読めます。
          </p>
          <ul className="rc4-cautions">
            <li>
              <TriangleAlert /> 一律に上書きしない。現在値を読んでRC4ビット（0x4）を足す
            </li>
            <li>
              <TriangleAlert /> 属性を変えてもAES鍵は生成されない。作るにはパスワード変更が必要
            </li>
            <li>
              <TriangleAlert /> コンピューターアカウントは自動設定されるが、ユーザーとgMSAはされない
            </li>
          </ul>
        </article>
      </div>
    </Shell>
  )
}

function BitsSlide() {
  return (
    <Shell
      eyebrow="値の読み方"
      title={
        <>
          同じ<em>0x18</em>が、場所によって別の意味になる
        </>
      }
      footer={<Src href={SOURCES.event4769}>イベント4769 Ticket Encryption Type</Src>}
    >
      <div className="rc4-tables">
        <section>
          <h2>
            <Hash /> 設定値（EncryptionTypes系）
          </h2>
          <table>
            <tbody>
              <tr>
                <th>0x18</th>
                <td>AES-128 + AES-256 のみ</td>
                <td className="rc4-tag is-green">7月以降の既定</td>
              </tr>
              <tr>
                <th>0x1C</th>
                <td>RC4 + AES-128 + AES-256</td>
                <td className="rc4-tag is-amber">セッションキーまでRC4を許す</td>
              </tr>
              <tr>
                <th>0x24</th>
                <td>RC4（チケット暗号化）+ AES-SHA1セッションキー</td>
                <td className="rc4-tag is-blue">公式KBが最終手段として挙げる値</td>
              </tr>
            </tbody>
          </table>
        </section>
        <section>
          <h2>
            <ScanSearch /> イベント4769のTicket Encryption Type
          </h2>
          <table>
            <tbody>
              <tr>
                <th>0x17</th>
                <td>RC4-HMAC</td>
                <td className="rc4-tag is-red">これを数えるのが棚卸し</td>
              </tr>
              <tr>
                <th>0x11 / 0x12</th>
                <td>AES-128 / AES-256</td>
                <td className="rc4-tag is-green">健全</td>
              </tr>
              <tr>
                <th>0x18</th>
                <td>RC4-HMAC-EXP</td>
                <td className="rc4-tag is-red">設定値の0x18とは無関係</td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
      <div className="rc4-note is-warn">
        <TriangleAlert />
        <p>
          <em>ここが実務でいちばん事故ります。</em>
          設定値の0x18は「AESのみ」、イベントの0x18は「輸出グレードのRC4」。
          真逆の意味です。集計スクリプトを書くときは、どちらの表を見ているかを必ず明示してください。
        </p>
      </div>
    </Shell>
  )
}

function WhoBreaksSlide() {
  const cards = [
    {
      icon: <ServerCog />,
      tone: 'red' as const,
      title: 'SPN付きサービスアカウント',
      body: 'サービスチケットの対象になるアカウントが主役です。ユーザーアカウントとgMSAはmsDS-SupportedEncryptionTypesが自動設定されないため、特に確認が要ります。',
    },
    {
      icon: <HardDrive />,
      tone: 'amber' as const,
      title: '非Windowsの実装',
      body: 'AES非対応のアプライアンス、NAS、Linux / SambaなどのKerberos実装。監査イベントに出ないことがあるため、相互運用性は実機で検証するようMicrosoftも求めています。',
    },
    {
      icon: <Network />,
      tone: 'violet' as const,
      title: 'フォレスト間の信頼',
      body: '同一フォレスト内の信頼は2022年11月の更新以降AESを使うため影響しません。外部フォレストとの信頼がある場合は、相手側のAES対応状況の検証が必要です。',
    },
    {
      icon: <Database />,
      tone: 'blue' as const,
      title: 'Azure Files（AD DS認証）',
      body: 'ADオブジェクトとストレージアカウントのKerberosキーがRC4依存だと、認証に失敗してファイル共有をマウントできなくなります。AES-256への更新用コマンドが用意されています。',
    },
    {
      icon: <Laptop />,
      tone: 'green' as const,
      title: '（主役ではない）一般ユーザーのログオン',
      body: '新規にドメイン参加した最近のWindowsクライアントは通常問題になりません。危ないのは古いサービスアカウントと非Windows側です。ここを取り違えると調査範囲が的外れになります。',
    },
  ]
  return (
    <Shell
      eyebrow="影響範囲"
      title={
        <>
          壊れるのは<em>「利用者」ではなくサービス</em>
        </>
      }
      footer={<Src href={SOURCES.azfiles}>Azure Files への影響</Src>}
    >
      <div className="rc4-cards">
        {cards.map((card) => (
          <article className={`is-${card.tone}`} key={card.title}>
            <div className="rc4-card-icon">{card.icon}</div>
            <h2>{card.title}</h2>
            <p>{card.body}</p>
          </article>
        ))}
      </div>
    </Shell>
  )
}

function IntermittentSlide() {
  return (
    <Shell
      eyebrow="障害の見え方"
      title={
        <>
          全部落ちるのではなく<em>「たまに失敗する」</em>
        </>
      }
      footer={<Src href={SOURCES.guide}>DC単位の挙動</Src>}
    >
      <div className="rc4-dcmap">
        <article className="rc4-client">
          <Laptop />
          <strong>クライアント</strong>
          <small>ADサイトとサブネットの設計に従って、自分でDCを選びます</small>
        </article>
        <div className="rc4-fan">
          <Route />
        </div>
        <div className="rc4-dcs">
          <article className="is-green">
            <ServerCog />
            <strong>未更新DC</strong>
            <small>従来どおりRC4のチケットを発行 → 成功する</small>
          </article>
          <article className="is-red">
            <ServerCog />
            <strong>更新済みDC</strong>
            <small>既定がAESのみ → 同じ認証が失敗する</small>
          </article>
        </div>
      </div>
      <div className="rc4-note is-warn">
        <Siren />
        <p>
          症状は「特定の端末だけ落ちる」「日によって通ったり通らなかったり」になります。
          <em>認証はサービスチケットを発行したDCの設定で決まる</em>ため、
          サイトを分けたり資産を分離したりしても、そのDCを引いた経路は必ず影響を受けます。
          サイトは「近いDCを優先させる」仕組みであって、強制的な境界ではありません。
        </p>
      </div>
    </Shell>
  )
}

function InventorySlide() {
  return (
    <Shell
      eyebrow="棚卸し"
      title={
        <>
          先に<em>数える</em>。話はそれからです
        </>
      }
      footer={
        <>
          <Src href={SOURCES.detect}>Detect and Remediate RC4</Src>
          <Src href={SOURCES.scripts}>microsoft/Kerberos-Crypto</Src>
        </>
      }
    >
      <div className="rc4-steps">
        <article>
          <b>1</b>
          <div>
            <strong>セキュリティログのイベント4769を集計する</strong>
            <p>
              Ticket Encryption Typeが<code>0x17</code>のものがRC4です。
              未更新のDCでも取得できるので、更新計画を決める前に実態を掴めます。
              4768（TGT要求）も併せて見ます。
            </p>
          </div>
        </article>
        <article>
          <b>2</b>
          <div>
            <strong>監査の有効化とログ保持期間を確認する</strong>
            <p>
              全DCでKerberosの成功監査が有効か。そして保持期間が十分か。
              <em>月次・四半期でしか動かないジョブは、短いログには現れません。</em>
            </p>
          </div>
        </article>
        <article>
          <b>3</b>
          <div>
            <strong>KDCSVCのイベント201〜209を補助的に使う</strong>
            <p>
              201 / 203はクライアントがAES非対応、202 / 204はアカウントがAES鍵を持たない
              （パスワードが古い）ことを示します。
            </p>
          </div>
        </article>
        <article>
          <b>4</b>
          <div>
            <strong>公式スクリプトで裏を取る</strong>
            <p>
              <code>Get-KerbEncryptionUsage.ps1</code>でRC4利用を洗い出し、
              <code>List-AccountKeys.ps1</code>でアカウントが実際に持つ鍵を確認します。
            </p>
          </div>
        </article>
      </div>
      <div className="rc4-note is-warn">
        <CircleAlert />
        <p>
          Microsoft自身が明記しています。
          <em>「201〜209が出ていないことは、強制後に問題が起きないことの保証にはならない」。</em>
          これらのイベントは既定動作に依存するサービスチケット要求が中心で、
          明示設定済みアカウント・TGT要求・非WindowsのKerberos実装は捕捉されません。
        </p>
      </div>
    </Shell>
  )
}

function RemediationSlide() {
  const lanes = [
    {
      rank: '本線',
      tone: 'green' as const,
      title: 'AESへ寄せる',
      body: 'サービスアカウントのパスワードを更新してAES鍵を作り、製品を更新または交換します。属性を変えるだけではAES鍵は生成されません。',
      caution: '保存された資格情報（サービス、タスクスケジューラ、アプリケーションプール、アプライアンス）を同時に更新しないと、そこで止まります。',
    },
    {
      rank: '次善',
      tone: 'amber' as const,
      title: 'アカウント単位で例外',
      body: '対象アカウントのmsDS-SupportedEncryptionTypesにRC4ビットを追加します。複製されるので全DCで一貫して効きます。',
      caution: '現在値を読んでからビットを足すこと。0x1Cで一律上書きすると、FASTやclaimsのビットを落とします。',
    },
    {
      rank: '最終手段',
      tone: 'red' as const,
      title: 'DCの既定を戻す',
      body: 'DefaultDomainSupportedEncTypesに0x24を設定します。ベンダー対応が現実的でない場合の値として公式KBが挙げているものです。',
      caution: '影響が広い代わりに、レジストリ1値で済みます。対象・理由・期限・撤去条件をセットで管理しないと、暫定のまま居座ります。',
    },
  ]
  return (
    <Shell
      eyebrow="対処"
      title={
        <>
          <em>例外は「戻す条件」とセット</em>でしか置かない
        </>
      }
      footer={<Src href={SOURCES.kb}>公式KB（0x24 と FAQ）</Src>}
    >
      <div className="rc4-lanes">
        {lanes.map((lane) => (
          <article className={`is-${lane.tone}`} key={lane.title}>
            <span className="rc4-rank">{lane.rank}</span>
            <strong>{lane.title}</strong>
            <p>{lane.body}</p>
            <small>
              <TriangleAlert /> {lane.caution}
            </small>
          </article>
        ))}
      </div>
      <div className="rc4-note">
        <ListChecks />
        <p>
          例外を入れたあとも<em>棚卸しは続けられます</em>。
          0x24を設定した状態でもイベント4769は記録されるので、
          障害を止めながらRC4依存のデータを集め、そのまま恒久対策の材料にできます。
        </p>
      </div>
    </Shell>
  )
}

function RecapSlide() {
  return (
    <Shell
      eyebrow="まとめ"
      title={
        <>
          RC4は<em>禁止されていない</em>。既定でなくなっただけ
        </>
      }
      footer={<span>2026-08-28 時点</span>}
    >
      <div className="rc4-recap">
        <article>
          <b>01</b>
          <strong>戻す手段はもうない</strong>
          <p>
            2026年7月14日以降、RC4DefaultDisablementPhaseは無視されます。
            残る手は明示設定だけです。
          </p>
        </article>
        <article>
          <b>02</b>
          <strong>壊れるのはサービスと非Windows</strong>
          <p>
            SPN付きサービスアカウント、gMSA、AES非対応のアプライアンス。
            一般ユーザーのログオンではありません。
          </p>
        </article>
        <article>
          <b>03</b>
          <strong>イベント4769の0x17から始める</strong>
          <p>
            未更新のDCでも取れます。イベントが出ないことは、安全であることの証明にはなりません。
          </p>
        </article>
      </div>
      <div className="rc4-links">
        <span>一次情報</span>
        <Src href={SOURCES.kb}>Microsoft サポート KB（CVE-2026-20833）</Src>
        <Src href={SOURCES.detect}>Detect and Remediate RC4 Usage in Kerberos</Src>
        <Src href={SOURCES.guide}>How to Manage RC4 Hardening – Definitive Guide</Src>
        <Src href={SOURCES.scripts}>microsoft/Kerberos-Crypto</Src>
      </div>
    </Shell>
  )
}
