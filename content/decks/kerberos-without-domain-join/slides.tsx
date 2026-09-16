/* eslint-disable react-refresh/only-export-components */
import type { ReactNode } from 'react'
import {
  ArrowRight,
  CheckCircle2,
  CircleAlert,
  Clock3,
  FileKey2,
  Globe2,
  HelpCircle,
  KeyRound,
  Laptop,
  Network,
  ServerCog,
  ShieldOff,
  Ticket,
  XCircle,
} from 'lucide-react'
import { LogoMark } from '../../../src/deck-shared'
import type { SlideModule } from '../../../src/types'
import './styles.css'

export const slides: SlideModule['slides'] = [
  { id: 'opening', render: () => <OpeningSlide /> },
  { id: 'conditions', render: () => <ConditionsSlide /> },
  { id: 'why-no', render: () => <WhyNoSlide /> },
  { id: 'lab', render: () => <LabSlide /> },
  { id: 'demo-access', render: () => <DemoAccessSlide /> },
  { id: 'demo-klist', render: () => <DemoKlistSlide /> },
  { id: 'answer', render: () => <AnswerSlide /> },
  { id: 'kdc-proof', render: () => <KdcProofSlide /> },
  { id: 'ntlm-off', render: () => <NtlmOffSlide /> },
  { id: 'requirements', render: () => <RequirementsSlide /> },
  { id: 'ip-trap', render: () => <IpTrapSlide /> },
  { id: 'next', render: () => <NextSlide /> },
  { id: 'recap', render: () => <RecapSlide /> },
]

const REPO = 'https://github.com/ebibibi/hyperv-nestlab'

function Shell({ children, eyebrow, footer, title }: { children: ReactNode; eyebrow: string; footer?: ReactNode; title: ReactNode }) {
  return (
    <section className="remotion-slide krb-slide krb-standard">
      <div className="krb-grid" />
      <LogoMark className="krb-logo" />
      <header className="krb-head">
        <span>{eyebrow}</span>
        <h1>{title}</h1>
      </header>
      <main className="krb-body">{children}</main>
      <footer className="krb-foot">
        <span>非ドメイン参加と Kerberos</span>
        <div>{footer}</div>
      </footer>
    </section>
  )
}

function Console({ lines }: { lines: { text: string; tone?: 'cmd' | 'hit' | 'muted' | 'plain' }[] }) {
  return (
    <div className="krb-console">
      {lines.map((line, index) => (
        <div className={`krb-line is-${line.tone ?? 'plain'}`} key={index}>
          {line.text}
        </div>
      ))}
    </div>
  )
}

function OpeningSlide() {
  return (
    <section className="remotion-slide krb-slide krb-opening">
      <div className="krb-grid" />
      <LogoMark className="krb-logo" />
      <div className="krb-opening-copy">
        <span>ACTIVE DIRECTORY · KERBEROS</span>
        <h1>
          ドメイン未参加のPCで<br />
          <strong>Kerberos認証、できる？</strong>
        </h1>
        <p>できる／できない。<br />答えは最後に、実機で。</p>
      </div>
      <div className="krb-opening-quiz" aria-hidden="true">
        <HelpCircle />
        <b>Q</b>
      </div>
    </section>
  )
}

function ConditionsSlide() {
  const rows = [
    { icon: <Laptop />, label: 'クライアント', body: 'ワークグループ。ドメインに参加していない' },
    { icon: <Network />, label: 'ネットワーク', body: 'ドメインコントローラーには普通に届く。DNSもDCを向いている' },
    { icon: <ServerCog />, label: 'やること', body: 'ドメインのファイルサーバーへ、ドメインアカウントでアクセスする' },
  ]
  return (
    <Shell eyebrow="問いの条件" title={<>特別な設定はしていない</>}>
      <div className="krb-rows">
        {rows.map((row) => (
          <article className="krb-row" key={row.label}>
            <div className="krb-row-icon">{row.icon}</div>
            <div>
              <span>{row.label}</span>
              <p>{row.body}</p>
            </div>
          </article>
        ))}
      </div>
      <div className="krb-callout">
        <CheckCircle2 />
        <strong>普通のADと普通のクライアント。違うのは「参加していない」ことだけ。</strong>
      </div>
    </Shell>
  )
}

function WhyNoSlide() {
  return (
    <Shell eyebrow="なぜ迷うのか" title={<>「できない」と書かれている</>}>
      <div className="krb-quote">
        <p>
          KerberosはKDCからTGTを取得する必要がある。TGTを取得できるのはドメイン参加マシンだけで、
          ワークグループのクライアントは<strong>コンピューターアカウントも信頼関係も持たない</strong>ため、
          チケットを要求も受領もできない。
        </p>
        <span>— 実際に出回っている説明</span>
      </div>
      <div className="krb-two">
        <article className="krb-card is-red">
          <XCircle />
          <h2>だから「できない」</h2>
          <p>非ドメイン参加＝NTLM一択、という理解は広く共有されている。</p>
        </article>
        <article className="krb-card is-amber">
          <CircleAlert />
          <h2>でも引っかかる</h2>
          <p>Azure Filesなど、参加していない端末からKerberosを使う話も実在する。</p>
        </article>
      </div>
    </Shell>
  )
}

function LabSlide() {
  const nodes = [
    { icon: <ServerCog />, name: 'dc01', role: 'ドメインコントローラー + DNS', tone: 'blue' },
    { icon: <FileKey2 />, name: 'srv01', role: 'ファイルサーバー（共有 labshare）', tone: 'cyan' },
    { icon: <Laptop />, name: 'cli01', role: 'ワークグループのクライアント', tone: 'green' },
  ]
  return (
    <Shell
      eyebrow="検証環境"
      title={<>3台だけ。全部コードで建つ</>}
      footer={<a href={REPO} target="_blank" rel="noreferrer">github.com/ebibibi/hyperv-nestlab</a>}
    >
      <div className="krb-nodes">
        {nodes.map((node) => (
          <article className={`krb-node is-${node.tone}`} key={node.name}>
            <div className="krb-node-icon">{node.icon}</div>
            <h2>{node.name}</h2>
            <p>{node.role}</p>
          </article>
        ))}
      </div>
      <div className="krb-callout">
        <CheckCircle2 />
        <strong>cli01 は DC に到達できるし DNS も DC。妨害は一切入れていない。</strong>
      </div>
    </Shell>
  )
}

function DemoAccessSlide() {
  return (
    <Shell eyebrow="デモ ①" title={<>まず、普通に開いてみる</>}>
      <Console
        lines={[
          { text: '\\\\srv01.corp.contoso.local\\labshare', tone: 'cmd' },
          { text: '', tone: 'muted' },
          { text: 'ユーザー名: Administrator@corp.contoso.local', tone: 'muted' },
          { text: 'パスワード: ********', tone: 'muted' },
          { text: '', tone: 'muted' },
          { text: 'hello.txt', tone: 'hit' },
        ]}
      />
      <div className="krb-callout">
        <CheckCircle2 />
        <strong>開ける。ここまでは誰も驚かない。問題は「何で認証したか」。</strong>
      </div>
    </Shell>
  )
}

function DemoKlistSlide() {
  return (
    <Shell eyebrow="デモ ②" title={<>クライアントで klist を叩く</>}>
      <Console
        lines={[
          { text: 'C:\\> klist', tone: 'cmd' },
          { text: '', tone: 'muted' },
          { text: '#0>  クライアント: Administrator @ CORP.CONTOSO.LOCAL', tone: 'plain' },
          { text: '     サーバー: krbtgt/CORP.CONTOSO.LOCAL', tone: 'hit' },
          { text: '', tone: 'muted' },
          { text: '#1>  クライアント: Administrator @ CORP.CONTOSO.LOCAL', tone: 'plain' },
          { text: '     サーバー: cifs/srv01.corp.contoso.local', tone: 'hit' },
        ]}
      />
      <div className="krb-callout is-hit">
        <Ticket />
        <strong>参加していないPCの手元に、TGTとサービスチケットがある。</strong>
      </div>
    </Shell>
  )
}

function AnswerSlide() {
  return (
    <section className="remotion-slide krb-slide krb-answer">
      <div className="krb-grid" />
      <LogoMark className="krb-logo" />
      <div className="krb-answer-copy">
        <span>ANSWER</span>
        <h1>できる。</h1>
        <p>
          マシンアカウントが要るのは<strong>マシン自身の認証</strong>であって、<br />
          ユーザーのTGT取得ではない。
        </p>
      </div>
    </section>
  )
}

function KdcProofSlide() {
  return (
    <Shell eyebrow="裏を取る" title={<>KDC 側のログも見る</>}>
      <Console
        lines={[
          { text: 'dc01 — セキュリティログ', tone: 'cmd' },
          { text: '', tone: 'muted' },
          { text: '4768  user=Administrator  svc=krbtgt   status=0x0', tone: 'hit' },
          { text: '4769  user=Administrator  svc=SRV01$   status=0x0', tone: 'hit' },
          { text: '      クライアントアドレス: 10.10.0.40', tone: 'hit' },
        ]}
      />
      <div className="krb-callout">
        <KeyRound />
        <strong>KDC自身が、参加していないマシン宛にチケットを発行している。</strong>
      </div>
    </Shell>
  )
}

function NtlmOffSlide() {
  return (
    <Shell eyebrow="駄目押し" title={<>NTLM を止めても通る</>}>
      <div className="krb-two">
        <article className="krb-card is-red">
          <ShieldOff />
          <h2>サーバー側でNTLMを拒否</h2>
          <p>受信NTLMトラフィックをすべて拒否に設定する。フォールバック先が消える。</p>
        </article>
        <article className="krb-card is-green">
          <CheckCircle2 />
          <h2>それでもアクセスできる</h2>
          <p>認証パッケージは Kerberos。たまたまNTLMで繋がっていた、ではない。</p>
        </article>
      </div>
      <div className="krb-callout is-hit">
        <ArrowRight />
        <strong>NTLMが無くなった世界でも、この経路は生き残る。</strong>
      </div>
    </Shell>
  )
}

function RequirementsSlide() {
  const items = [
    { icon: <Globe2 />, title: 'realm から KDC を引けること', body: '通常はDNSのSRVレコード' },
    { icon: <Network />, title: 'KDC に到達できること', body: '88/tcp・88/udp' },
    { icon: <ServerCog />, title: 'SPN に一致する名前で繋ぐこと', body: 'IPアドレス指定は対象外' },
    { icon: <Clock3 />, title: '時刻が大きくずれていないこと', body: '既定の許容は5分' },
    { icon: <KeyRound />, title: 'UPN 形式でログオンすること', body: 'user@domain.local' },
  ]
  return (
    <Shell eyebrow="成立条件" title={<>分かれ目は参加状態ではない</>}>
      <div className="krb-req">
        {items.map((item, index) => (
          <article className="krb-req-item" key={item.title}>
            <b>{index + 1}</b>
            <div className="krb-req-icon">{item.icon}</div>
            <div>
              <h2>{item.title}</h2>
              <p>{item.body}</p>
            </div>
          </article>
        ))}
      </div>
    </Shell>
  )
}

function IpTrapSlide() {
  return (
    <Shell eyebrow="実務の話" title={<>踏み台がNTLMに落ちる理由</>}>
      <div className="krb-two">
        <article className="krb-card is-red">
          <XCircle />
          <h2>IPアドレスで繋いでいる</h2>
          <p>WindowsはIP宛にKerberosを<strong>試行すらしない</strong>。そのままNTLMへ落ちる。</p>
        </article>
        <article className="krb-card is-green">
          <CheckCircle2 />
          <h2>名前で繋ぐ</h2>
          <p>DNS名を振って、その名前で接続する。参加状態は関係ない。</p>
        </article>
      </div>
      <div className="krb-callout is-hit">
        <CircleAlert />
        <strong>ワークグループだからNTLMなのではない。名前で繋いでいないからNTLMになる。</strong>
      </div>
    </Shell>
  )
}

function NextSlide() {
  return (
    <Shell eyebrow="今回やらないこと" title={<>DCに届かない場合は、別の話</>}>
      <div className="krb-two">
        <article className="krb-card is-amber">
          <CircleAlert />
          <h2>インターネット越しの踏み台</h2>
          <p>クライアントからDCの88番に届かない。今回の前提が崩れる。</p>
        </article>
        <article className="krb-card is-blue">
          <ArrowRight />
          <h2>KDCプロキシという仕組み</h2>
          <p>443でKerberosを中継する。ただし単体では素直に動かない。次回。</p>
        </article>
      </div>
    </Shell>
  )
}

function RecapSlide() {
  const points = [
    '非ドメイン参加のクライアントでもKerberosは使える',
    'KDCは参加していないマシンにチケットを発行する',
    'NTLMを拒否しても、この経路は生き残る',
    '落ちる原因は参加状態ではなく、名前・到達性・時刻',
  ]
  return (
    <Shell
      eyebrow="まとめ"
      title={<>思い込みを1つ捨てる</>}
      footer={<a href={REPO} target="_blank" rel="noreferrer">github.com/ebibibi/hyperv-nestlab</a>}
    >
      <ul className="krb-recap">
        {points.map((point) => (
          <li key={point}>
            <CheckCircle2 />
            <span>{point}</span>
          </li>
        ))}
      </ul>
      <div className="krb-callout">
        <CheckCircle2 />
        <strong>このラボは1コマンドで建ちます。手元で試してみてください。</strong>
      </div>
    </Shell>
  )
}
