/* eslint-disable react-refresh/only-export-components */
import {
  ArrowRight,
  Check,
  CirclePlay,
  ClipboardList,
  Cookie,
  Globe,
  Hand,
  KeyRound,
  Landmark,
  Laptop,
  ListChecks,
  Lock,
  MonitorSmartphone,
  ScanFace,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  ThumbsUp,
  TriangleAlert,
  User,
  UserX,
  X
} from 'lucide-react'
import { spring, useVideoConfig } from 'remotion'
import type { SlideModule, SlideRenderContext } from '../../../src/types'
import { LogoMark } from '../../../src/deck-shared'

export const slides: SlideModule['slides'] = [
  { render: (props) => <OpeningSlide {...props} /> },
  { render: (props) => <ProfileSlide {...props} /> },
  { render: (props) => <SectionKindsSlide {...props} /> },
  { render: (props) => <NotOneThingSlide {...props} /> },
  { render: (props) => <MethodsSlide {...props} /> },
  { render: (props) => <StrengthsSlide {...props} /> },
  { render: (props) => <SectionWhatSlide {...props} /> },
  { render: (props) => <DefinitionSlide {...props} /> },
  { render: (props) => <HandoffSlide {...props} /> },
  { render: (props) => <SectionWhySlide {...props} /> },
  { render: (props) => <PremiseSlide {...props} /> },
  { render: (props) => <ProxySlide {...props} /> },
  { render: (props) => <AitmFlowSlide {...props} /> },
  { render: (props) => <NumberMatchingSlide {...props} /> },
  { render: (props) => <PrizeSlide {...props} /> },
  { render: (props) => <WhatLosesSlide {...props} /> },
  { render: (props) => <SectionFidoSlide {...props} /> },
  { render: (props) => <WhyFidoSlide {...props} /> },
  { render: (props) => <TheThreeSlide {...props} /> },
  { render: (props) => <CaveatsSlide {...props} /> },
  { render: (props) => <NotSilverBulletSlide {...props} /> },
  { render: (props) => <SharedDevicesSlide {...props} /> },
  { render: (props) => <HowToStartSlide {...props} /> },
  { render: (props) => <RecapSlide {...props} /> },
  { render: (props) => <RelatedVideosSlide {...props} /> },
  { render: (props) => <EbiStudySlide {...props} /> },
  { render: (props) => <SourcesSlide {...props} /> },
  { render: (props) => <ThanksSlide {...props} /> }
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
    <div className="phr-head" style={lift(entrance(frame, fps), 22)}>
      <span className="slide-kicker">{kicker}</span>
      <h1>{title}</h1>
    </div>
  )
}

function Punch({ frame, delay = 70, children }: { frame: number; delay?: number; children: React.ReactNode }) {
  const { fps } = useVideoConfig()
  return (
    <p className="phr-punch" style={lift(entrance(frame, fps, delay), 14)}>
      {children}
    </p>
  )
}

function SourceLine({ href, label }: { href: string; label: string }) {
  return (
    <a className="phr-source-line" href={href} target="_blank" rel="noreferrer">
      Source: {label}
    </a>
  )
}

function SectionSlide({ frame, number, title, lead }: { frame: number; number: string; title: string; lead: string }) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide phr-slide phr-section">
      <div className="phr-grid-bg" />
      <div className="phr-section-body">
        <span className="phr-section-number" style={lift(entrance(frame, fps), 30)}>
          {number}
        </span>
        <h1 style={lift(entrance(frame, fps, 12), 26)}>{title}</h1>
        <p style={lift(entrance(frame, fps, 26), 20)}>{lead}</p>
      </div>
    </section>
  )
}

function OpeningSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const drift = Math.sin(frame / 16) * 6
  return (
    <section className="remotion-slide phr-slide phr-opening">
      <div className="phr-grid-bg" />
      <LogoMark className="phr-logo" />
      <div className="phr-opening-copy" style={lift(entrance(frame, fps), 44)}>
        <span className="slide-kicker">PHISHING-RESISTANT MFA</span>
        <h1>
          そのMFA、
          <br />
          <em>中継されて終わりです</em>
        </h1>
        <p>攻撃者はMFAを破らない。あなたに代行させる。</p>
      </div>
      <div className="phr-opening-visual">
        <div className="phr-relay" style={{ transform: `translateY(${drift}px)` }}>
          <div className="phr-relay-node">
            <User size={30} />
            <span>あなた</span>
          </div>
          <div className="phr-relay-arrow">
            <ArrowRight size={30} />
          </div>
          <div className="phr-relay-node phr-relay-bad">
            <ShieldAlert size={30} />
            <span>偽サイト</span>
          </div>
          <div className="phr-relay-arrow">
            <ArrowRight size={30} />
          </div>
          <div className="phr-relay-node">
            <Landmark size={30} />
            <span>本物</span>
          </div>
        </div>
        <div className="phr-opening-cookie" style={lift(entrance(frame, fps, 40), 20)}>
          <Cookie size={34} />
          <strong>盗まれるのはセッション</strong>
        </div>
      </div>
      <SourceLine
        href="https://learn.microsoft.com/entra/identity/authentication/concept-authentication-strengths"
        label="Microsoft Learn ─ Authentication strengths"
      />
    </section>
  )
}

function ProfileSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const facts = ['Microsoft MVP 14年連続', 'Windows・Azure・M365', '生成AIを実機で検証', '著書「Windowsインフラ管理者入門」']
  return (
    <section className="remotion-slide phr-slide">
      <Header kicker="YOUR GUIDE" title="解説する人：胡田 昌彦" frame={frame} />
      <div className="phr-profile-layout">
        <div className="phr-profile-mark" style={lift(entrance(frame, fps, 16), 22)}>
          <LogoMark />
          <strong>
            Masahiko
            <br />
            Ebisuda
          </strong>
          <span>えびすだ まさひこ</span>
        </div>
        <div className="phr-profile-facts">
          {facts.map((fact, i) => (
            <div key={fact} style={lift(entrance(frame, fps, 28 + i * 10), 16)}>
              <Check size={26} />
              <strong>{fact}</strong>
            </div>
          ))}
        </div>
      </div>
      <Punch frame={frame} delay={72}>
        今日は<b>認証方式の「強さの差」</b>だけに絞ります。
      </Punch>
    </section>
  )
}

function SectionKindsSlide(props: SlideRenderContext) {
  return (
    <SectionSlide
      frame={props.frame}
      number="SECTION 1"
      title="MFAには種類がある"
      lead="多要素認証を一つのものとして扱うのをやめる。"
    />
  )
}

function NotOneThingSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide phr-slide">
      <Header kicker="KINDS ─ 01" title="「MFAを入れた」の中身は、同じではない" frame={frame} />
      <div className="phr-versus">
        <div className="phr-versus-card" style={lift(entrance(frame, fps, 16), 22)}>
          <Smartphone size={38} />
          <strong>SMSで6桁を受け取る</strong>
          <span>これもMFA</span>
        </div>
        <div className="phr-versus-eq" style={lift(entrance(frame, fps, 30), 12)}>
          =?
        </div>
        <div className="phr-versus-card phr-versus-strong" style={lift(entrance(frame, fps, 44), 22)}>
          <ScanFace size={38} />
          <strong>パスキーで指紋を使う</strong>
          <span>これもMFA</span>
        </div>
      </div>
      <Punch frame={frame} delay={64}>
        同じ言葉で呼ばれているが、<b>攻撃に対する強さは同じではない</b>。ここを一緒にすると穴が残る。
      </Punch>
    </section>
  )
}

function MethodsSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const rows: [string, string][] = [
    ['パスキー（FIDO2）／Authenticatorのパスキー', '単独でも / 2要素目でも'],
    ['Windows Hello for Business', '単独 ／ 2要素目はパスキー登録が前提'],
    ['証明書ベース認証（CBA）', '単独でも / 2要素目でも'],
    ['Authenticator（電話サインイン / プッシュ承認）', '単独 ／ プッシュ承認は2要素目'],
    ['Temporary Access Pass', '単独でも / 2要素目でも'],
    ['OATH トークン（ハードウェアはプレビュー）', '2要素目のみ'],
    ['SMS / 音声通話', 'SMSは単独可 / 音声は2要素目のみ']
  ]
  return (
    <section className="remotion-slide phr-slide">
      <Header kicker="KINDS ─ 02" title="Entra IDが対応する認証方式" frame={frame} />
      <div className="phr-method-table">
        {rows.map((row, i) => (
          <div key={row[0]} className="phr-method-row" style={lift(entrance(frame, fps, 12 + i * 7), 14)}>
            <strong>{row[0]}</strong>
            <span>{row[1]}</span>
          </div>
        ))}
      </div>
      <Punch frame={frame} delay={70}>
        選択肢は<b>スマホのアプリだけではない</b>。まずここを知らないまま「うちはMFAできない」となりがち。
      </Punch>
      <SourceLine
        href="https://learn.microsoft.com/entra/identity/authentication/overview-authentication"
        label="Microsoft Learn ─ Authentication methods"
      />
    </section>
  )
}

function StrengthsSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const rows: [string, boolean, boolean, boolean][] = [
    ['FIDO2セキュリティキー／パスキー', true, true, true],
    ['Windows Hello for Business / プラットフォーム資格情報', true, true, true],
    ['証明書ベース認証（多要素）', true, true, true],
    ['Authenticator（電話サインイン）', true, true, false],
    ['Temporary Access Pass', true, false, false],
    ['パスワード ＋ 所持要素', true, false, false],
    ['証明書ベース認証（単一要素）', false, false, false],
    ['SMSサインイン / パスワードのみ', false, false, false]
  ]
  return (
    <section className="remotion-slide phr-slide">
      <Header kicker="KINDS ─ 03" title="公式には、強さが3段階ある" frame={frame} />
      <div className="phr-strength-table">
        <div className="phr-strength-head" style={lift(entrance(frame, fps, 10), 14)}>
          <span />
          <b>MFA</b>
          <b>パスワードレス</b>
          <b>フィッシング耐性</b>
        </div>
        {rows.map((row, i) => (
          <div key={row[0]} className="phr-strength-row" style={lift(entrance(frame, fps, 18 + i * 6), 12)}>
            <strong>{row[0]}</strong>
            <span className={row[1] ? 'phr-yes' : 'phr-no'}>{row[1] ? '✓' : '—'}</span>
            <span className={row[2] ? 'phr-yes' : 'phr-no'}>{row[2] ? '✓' : '—'}</span>
            <span className={row[3] ? 'phr-yes' : 'phr-no'}>{row[3] ? '✓' : '—'}</span>
          </div>
        ))}
      </div>
      <Punch frame={frame} delay={72}>
        所持要素＝SMS / 音声 / プッシュ通知 / ソフトウェアOATH / ハードウェアOATH。
        <b>まとめて一番左の段にしか入らない。</b>
      </Punch>
      <SourceLine
        href="https://learn.microsoft.com/entra/identity/authentication/concept-authentication-strengths"
        label="Microsoft Learn ─ Authentication strengths"
      />
    </section>
  )
}

function SectionWhatSlide(props: SlideRenderContext) {
  return (
    <SectionSlide
      frame={props.frame}
      number="SECTION 2"
      title="フィッシング耐性とは何か"
      lead="定義を押さえると、一気に分かる。"
    />
  )
}

function DefinitionSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide phr-slide">
      <Header kicker="DEFINITION" title="定義は、たった一行" frame={frame} />
      <div className="phr-quote" style={lift(entrance(frame, fps, 16), 26)}>
        <p>
          認証方式と<b>サインイン画面そのもの</b>が
          <br />
          直接やりとりする方式
        </p>
        <cite>Microsoft Learn ─ Phishing-resistant MFA strength の定義</cite>
      </div>
      <div className="phr-gap" style={lift(entrance(frame, fps, 44), 20)}>
        <MonitorSmartphone size={34} />
        <p>
          つまり、<b>人が画面を見て、コードを読んで、別のところへ入力する</b>——
          この「人間を経由する部分」が存在しない、という意味。
        </p>
      </div>
      <SourceLine
        href="https://learn.microsoft.com/entra/identity/authentication/concept-authentication-strengths"
        label="Microsoft Learn ─ Authentication strengths"
      />
    </section>
  )
}

function HandoffSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide phr-slide">
      <Header kicker="THE CORE IDEA" title="「手で渡せる秘密」があるか、ないか" frame={frame} />
      <div className="phr-split">
        <div className="phr-split-card phr-split-weak" style={lift(entrance(frame, fps, 16), 22)}>
          <Hand size={38} />
          <strong>渡せる ＝ 代行させられる</strong>
          <ul>
            <li>6桁のコード</li>
            <li>承認のタップ</li>
            <li>SMSの数字</li>
          </ul>
          <i>利用者が誰かに渡せてしまう</i>
        </div>
        <div className="phr-split-card phr-split-strong" style={lift(entrance(frame, fps, 36), 22)}>
          <Lock size={38} />
          <strong>渡せない ＝ 代行させられない</strong>
          <ul>
            <li>パスキーの秘密鍵</li>
            <li>TPMの中の鍵</li>
            <li>スマートカードの鍵</li>
          </ul>
          <i>渡そうと思っても渡せない</i>
        </div>
      </div>
      <Punch frame={frame} delay={66}>
        この差が、そのまま<b>攻撃への強さの差</b>になる。
      </Punch>
    </section>
  )
}

function SectionWhySlide(props: SlideRenderContext) {
  return (
    <SectionSlide
      frame={props.frame}
      number="SECTION 3"
      title="なぜ突破できるのか"
      lead="実際の攻撃がどう動くのか。ここが今日の中心。"
    />
  )
}

function PremiseSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const items = [
    { icon: <X size={30} />, label: '暗号を解いている', bad: true },
    { icon: <X size={30} />, label: '総当たりしている', bad: true },
    { icon: <Check size={30} />, label: '本人に代行させている', bad: false }
  ]
  return (
    <section className="remotion-slide phr-slide">
      <Header kicker="WHY ─ 01" title="MFAを破っているのではない" frame={frame} />
      <div className="phr-premise-row">
        {items.map((item, i) => (
          <div
            key={item.label}
            className={`phr-premise ${item.bad ? 'phr-premise-no' : 'phr-premise-yes'}`}
            style={lift(entrance(frame, fps, 18 + i * 14), 20)}
          >
            {item.icon}
            <strong>{item.label}</strong>
          </div>
        ))}
      </div>
      <div className="phr-alert" style={lift(entrance(frame, fps, 66), 16)}>
        <TriangleAlert size={34} />
        <p>
          だから<b>利用者が正しく操作するほど、攻撃が成立する</b>。教育で止まる種類のものではない。
        </p>
      </div>
    </section>
  )
}

function ProxySlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide phr-slide">
      <Header kicker="WHY ─ 02" title="偽サイトの正体は「中継プロキシ」" frame={frame} />
      <div className="phr-then-now">
        <div className="phr-then" style={lift(entrance(frame, fps, 16), 22)}>
          <span className="phr-era">かつて</span>
          <strong>入力を溜めるだけの箱</strong>
          <p>IDとパスワードを保存して、後で使う</p>
        </div>
        <div className="phr-now" style={lift(entrance(frame, fps, 34), 22)}>
          <span className="phr-era phr-era-now">いま</span>
          <strong>リアルタイムの中継プロキシ</strong>
          <p>入力をその場で本物へ渡し、本物の応答をそのまま返す</p>
        </div>
      </div>
      <div className="phr-alert" style={lift(entrance(frame, fps, 58), 16)}>
        <TriangleAlert size={34} />
        <p>
          画面は<b>本物と完全に同じもの</b>が出る。見た目で見破るのはほぼ不可能。
        </p>
      </div>
    </section>
  )
}

function AitmFlowSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const steps = [
    { n: '1', who: 'あなた → 偽サイト', what: 'パスワードを入力', tone: 'user' },
    { n: '2', who: '偽サイト → 本物', what: 'そのまま即座に中継', tone: 'bad' },
    { n: '3', who: '本物 → 偽サイト', what: 'MFAを要求', tone: 'real' },
    { n: '4', who: '偽サイト → あなた', what: '本物と同じMFA画面。あなたが承認', tone: 'user' },
    { n: '5', who: '本物 → 偽サイト', what: 'セッションのクッキーを発行', tone: 'bad' }
  ]
  return (
    <section className="remotion-slide phr-slide">
      <Header kicker="WHY ─ 03" title="中間者攻撃の5ステップ" frame={frame} />
      <div className="phr-steps">
        {steps.map((step, i) => (
          <div
            key={step.n}
            className={`phr-step phr-step-${step.tone}`}
            style={lift(entrance(frame, fps, 14 + i * 16), 18)}
          >
            <span className="phr-step-n">{step.n}</span>
            <span className="phr-step-who">{step.who}</span>
            <ArrowRight size={20} />
            <strong>{step.what}</strong>
          </div>
        ))}
      </div>
      <div className="phr-alert phr-alert-hot" style={lift(entrance(frame, fps, 100), 16)}>
        <Cookie size={34} />
        <p>
          以後、攻撃者は<b>再認証すら必要ない</b>。
        </p>
      </div>
      <SourceLine
        href="https://www.microsoft.com/en-us/security/blog/2026/03/04/inside-tycoon2fa-how-a-leading-aitm-phishing-kit-operated-at-scale/"
        label="Microsoft Security Blog ─ Inside Tycoon2FA"
      />
    </section>
  )
}

function NumberMatchingSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide phr-slide">
      <Header kicker="WHY ─ 04" title="番号一致も、そのまま中継される" frame={frame} />
      <div className="phr-quote phr-quote-hot" style={lift(entrance(frame, fps, 14), 24)}>
        <p>
          フィッシングページは<b>同じMFA画面（たとえば番号一致やコード入力）</b>を表示した
        </p>
        <cite>Microsoft Security Blog ─ Inside Tycoon2FA</cite>
      </div>
      <div className="phr-two-col" style={lift(entrance(frame, fps, 42), 20)}>
        <div className="phr-col-good">
          <Check size={30} />
          <strong>番号一致が防ぐもの</strong>
          <span>身に覚えのない通知をうっかり承認する「MFA疲労攻撃」</span>
        </div>
        <div className="phr-col-bad">
          <X size={30} />
          <strong>防がないもの</strong>
          <span>中間者攻撃。番号は偽サイトがそのまま表示できる</span>
        </div>
      </div>
      <SourceLine
        href="https://www.microsoft.com/en-us/security/blog/2026/03/04/inside-tycoon2fa-how-a-leading-aitm-phishing-kit-operated-at-scale/"
        label="Microsoft Security Blog ─ Inside Tycoon2FA"
      />
    </section>
  )
}

function PrizeSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide phr-slide">
      <Header kicker="WHY ─ 05" title="盗まれるのはパスワードではない" frame={frame} />
      <div className="phr-prize">
        <div className="phr-prize-no" style={lift(entrance(frame, fps, 16), 22)}>
          <KeyRound size={36} />
          <strong>パスワード</strong>
          <span>変えれば無効にできる</span>
        </div>
        <ArrowRight size={40} />
        <div className="phr-prize-yes" style={lift(entrance(frame, fps, 34), 22)}>
          <Cookie size={36} />
          <strong>セッションのクッキー / トークン</strong>
          <span>認証が完了した「後」に発行されるもの</span>
        </div>
      </div>
      <div className="phr-alert" style={lift(entrance(frame, fps, 58), 16)}>
        <TriangleAlert size={34} />
        <p>
          <b>パスワードを変えても、そのセッションは生きたまま。</b>
          対処はセッションの明示的な失効。
        </p>
      </div>
      <SourceLine
        href="https://www.microsoft.com/en-us/security/blog/2026/03/04/inside-tycoon2fa-how-a-leading-aitm-phishing-kit-operated-at-scale/"
        label="Microsoft Security Blog ─ Inside Tycoon2FA"
      />
    </section>
  )
}

function WhatLosesSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const losers = ['SMS', '音声通話', 'プッシュ通知の承認', 'ソフトウェアOATH', 'ハードウェアOATH']
  return (
    <section className="remotion-slide phr-slide">
      <Header kicker="WHY ─ 06" title="だから、この方式は全部負ける" frame={frame} />
      <div className="phr-loser-row">
        {losers.map((loser, i) => (
          <div key={loser} className="phr-loser" style={lift(entrance(frame, fps, 16 + i * 10), 18)}>
            <X size={28} />
            <strong>{loser}</strong>
          </div>
        ))}
      </div>
      <div className="phr-quote phr-quote-hot" style={lift(entrance(frame, fps, 66), 20)}>
        <p>
          SMSコード、ワンタイムパスコード、プッシュ通知を含む
          <b>一般に展開されているほぼすべてのMFA方式</b>を回避できた
        </p>
        <cite>Microsoft Security Blog ─ Inside Tycoon2FA</cite>
      </div>
      <Punch frame={frame} delay={90}>
        共通点は1つ。<b>人が中継できる情報に依存している。</b>
      </Punch>
    </section>
  )
}

function SectionFidoSlide(props: SlideRenderContext) {
  return (
    <SectionSlide
      frame={props.frame}
      number="SECTION 4"
      title="なぜFIDO2は負けないのか"
      lead="耐えられる方式は、何が違うのか。"
    />
  )
}

function WhyFidoSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide phr-slide">
      <Header kicker="FIDO ─ 01" title="2つの性質で成立している" frame={frame} />
      <div className="phr-reasons">
        <div className="phr-reason" style={lift(entrance(frame, fps, 16), 22)}>
          <span className="phr-reason-n">01</span>
          <Lock size={34} />
          <strong>秘密鍵が認証器から出ない</strong>
          <p>渡そうと思っても渡せない。だから代行させられない。</p>
        </div>
        <div className="phr-reason" style={lift(entrance(frame, fps, 36), 22)}>
          <span className="phr-reason-n">02</span>
          <Globe size={34} />
          <strong>鍵が「ドメイン」に束縛されている</strong>
          <p>本物のドメイン用の鍵は、偽サイトからの要求に<b>そもそも応答しない</b>。</p>
        </div>
      </div>
      <Punch frame={frame} delay={62}>
        利用者が<b>完全にだまされていても成立しない</b>。人間の注意力に依存しないのが本質。
      </Punch>
    </section>
  )
}

function TheThreeSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const three = [
    { icon: <KeyRound size={34} />, title: 'FIDO2セキュリティキー', note: 'パスキー / Authenticatorのパスキーを含む' },
    { icon: <Laptop size={34} />, title: 'Windows Hello for Business', note: 'macOSのプラットフォーム資格情報も同じ枠' },
    { icon: <ClipboardList size={34} />, title: '証明書ベース認証（多要素）', note: 'スマートカード等' }
  ]
  return (
    <section className="remotion-slide phr-slide">
      <Header kicker="FIDO ─ 02" title="公式のフィッシング耐性MFAは、この3つ" frame={frame} />
      <div className="phr-three-row">
        {three.map((item, i) => (
          <div key={item.title} className="phr-three-card" style={lift(entrance(frame, fps, 18 + i * 12), 22)}>
            {item.icon}
            <strong>{item.title}</strong>
            <span>{item.note}</span>
          </div>
        ))}
      </div>
      <Punch frame={frame} delay={62}>
        Authenticatorの<b>電話サインインはパスワードレスだが、フィッシング耐性には入らない</b>。
      </Punch>
      <SourceLine
        href="https://learn.microsoft.com/entra/identity/authentication/concept-authentication-strengths"
        label="Microsoft Learn ─ Authentication strengths"
      />
    </section>
  )
}

function CaveatsSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const caveats = [
    { title: '単一要素のCBAは、どの強度にも入らない', body: '多要素として構成する必要がある' },
    { title: '認証強度は、最初の認証を制限しない', body: 'CAは初回認証の後に評価される。パスワードは入力できてしまう' },
    { title: 'WHfBは自動で求められるとは限らない', body: '別の方式でサインインしていると、サインインオプションから選び直しになる' }
  ]
  return (
    <section className="remotion-slide phr-slide">
      <Header kicker="FIDO ─ 03" title="3つの落とし穴" frame={frame} />
      <div className="phr-caveats">
        {caveats.map((c, i) => (
          <div key={c.title} style={lift(entrance(frame, fps, 16 + i * 14), 18)}>
            <TriangleAlert size={30} />
            <div>
              <strong>{c.title}</strong>
              <span>{c.body}</span>
            </div>
          </div>
        ))}
      </div>
      <SourceLine
        href="https://learn.microsoft.com/entra/identity/authentication/concept-authentication-strengths"
        label="Microsoft Learn ─ Authentication strengths"
      />
    </section>
  )
}

function NotSilverBulletSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide phr-slide">
      <Header kicker="FIDO ─ 04" title="フィッシング耐性でも、止まらないもの" frame={frame} />
      <div className="phr-quote" style={lift(entrance(frame, fps, 14), 24)}>
        <p>
          利用者の資格情報が簡単にフィッシングできなくなると、攻撃者は
          <b>端末からトークンを盗み出す方向へ移る</b>ことがある
        </p>
        <cite>Microsoft Learn ─ フィッシング耐性パスワードレス展開ガイド</cite>
      </div>
      <div className="phr-next" style={lift(entrance(frame, fps, 42), 20)}>
        <ShieldCheck size={34} />
        <div>
          <strong>次の一手：トークン保護</strong>
          <span>トークンを、発行先の端末のハードウェアに結び付ける</span>
        </div>
      </div>
      <Punch frame={frame} delay={64}>
        認証を強くしたら、次は<b>トークンの持ち出し</b>を見る。攻撃者は必ず次に安い経路へ移る。
      </Punch>
      <SourceLine
        href="https://learn.microsoft.com/entra/identity/authentication/how-to-deploy-phishing-resistant-passwordless-authentication"
        label="Microsoft Learn ─ Plan a phishing-resistant passwordless deployment"
      />
    </section>
  )
}

function SharedDevicesSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const rules = [
    { icon: <UserX size={30} />, title: '共有アカウントのキオスクにWHfBを使わない', body: '各自が自分としてサインインする場合にだけ使う、と公式に明記' },
    { icon: <ListChecks size={30} />, title: '1台あたり10ユーザーまで', body: '超えるならセキュリティキーなどポータブルな資格情報へ' },
    { icon: <KeyRound size={30} />, title: '端末を共有するなら', body: 'Windows上のEntraパスキー、またはポータブルな資格情報だけを使う' }
  ]
  return (
    <section className="remotion-slide phr-slide">
      <Header kicker="IN PRACTICE ─ 01" title="共有端末は、ここに注意" frame={frame} />
      <div className="phr-caveats">
        {rules.map((r, i) => (
          <div key={r.title} style={lift(entrance(frame, fps, 16 + i * 14), 18)}>
            {r.icon}
            <div>
              <strong>{r.title}</strong>
              <span>{r.body}</span>
            </div>
          </div>
        ))}
      </div>
      <SourceLine
        href="https://learn.microsoft.com/entra/identity/authentication/how-to-deploy-phishing-resistant-passwordless-authentication"
        label="Microsoft Learn ─ Plan a phishing-resistant passwordless deployment"
      />
    </section>
  )
}

function HowToStartSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const steps = [
    ['01', 'レポート専用でポリシーを作る', '「フィッシング耐性MFA」の認証強度。登録キャンペーンより前に作る'],
    ['02', '利用者をペルソナで分ける', '管理者・高規制ユーザー / それ以外'],
    ['03', '持ち運べる資格情報を1つ', 'パスキー、FIDO2キー、スマートカード'],
    ['04', '端末ごとのローカル資格情報', 'WHfB、macOSのプラットフォーム資格情報'],
    ['05', '準備できた組から強制', '利用者と端末の組み合わせ単位で段階的に']
  ]
  return (
    <section className="remotion-slide phr-slide">
      <Header kicker="IN PRACTICE ─ 02" title="どこから始めるか" frame={frame} />
      <div className="phr-howto">
        {steps.map(([n, title, body], i) => (
          <div key={n} style={lift(entrance(frame, fps, 14 + i * 11), 16)}>
            <span>{n}</span>
            <div>
              <strong>{title}</strong>
              <em>{body}</em>
            </div>
          </div>
        ))}
      </div>
      <Punch frame={frame} delay={80}>
        レポート専用を<b>先に</b>作るのが肝。<b>強制したら誰が止まるか</b>の履歴が貯まる。
      </Punch>
      <SourceLine
        href="https://learn.microsoft.com/entra/identity/authentication/how-to-deploy-phishing-resistant-passwordless-authentication"
        label="Microsoft Learn ─ Plan a phishing-resistant passwordless deployment"
      />
    </section>
  )
}

function RecapSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const items = [
    ['01', 'MFAには強さの段階がある', '公式には MFA / パスワードレス / フィッシング耐性 の3段階'],
    ['02', '人が中継できる方式は突破される', '番号一致も中継される。防げるのはMFA疲労攻撃だけ'],
    ['03', '耐えるのは「渡せない鍵」だけ', '秘密鍵が外に出ず、ドメインに束縛されている方式']
  ]
  return (
    <section className="remotion-slide phr-slide">
      <Header kicker="RECAP" title="覚えるのは、この3つ" frame={frame} />
      <div className="phr-recap">
        {items.map(([num, title, body], i) => (
          <div key={num} style={lift(entrance(frame, fps, 18 + i * 14), 22)}>
            <span>{num}</span>
            <strong>{title}</strong>
            <p>{body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function RelatedVideosSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const videos = [
    { id: 'CGEWsDgdFvk', title: '認証パターンを基礎から理解', note: 'トークン・SP・マネージドIDの全体像' },
    { id: 'u3DmYibZgwE', title: '条件付きアクセス「全リソース＋除外」の挙動', note: '除外設計の落とし穴' },
    { id: 'n2RodbBpzeo', title: 'なぜアプリにもIDが必要？', note: 'アプリ登録と権限・同意の基礎' },
    { id: 'SkqRmdStxnQ', title: '「リソースURL」の正体', note: 'トークンが誰宛かを理解する' }
  ]
  return (
    <section className="remotion-slide phr-slide">
      <Header kicker="GO DEEPER" title="関連する解説動画" frame={frame} />
      <div className="phr-video-list">
        {videos.map((video, i) => (
          <a
            key={video.id}
            className="phr-video-row"
            href={`https://www.youtube.com/watch?v=${video.id}`}
            target="_blank"
            rel="noreferrer"
            style={lift(entrance(frame, fps, 14 + i * 10), 16)}
          >
            <CirclePlay size={30} />
            <div>
              <strong>{video.title}</strong>
              <span>{video.note}</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}

function EbiStudySlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const courses = [
    { path: 'microsoft-identity-foundations', label: 'Microsoft ID・アカウント・テナント基礎', note: 'まずここから' },
    { path: 'entra-auth', label: 'Entra ID認証と自動化', note: 'SP・マネージドID・トークン' },
    { path: 'pki', label: '証明書・PKI入門', note: '証明書認証の前提' }
  ]
  return (
    <section className="remotion-slide phr-slide phr-ebistudy">
      <Header kicker="EBI STUDY" title="体系的に、順番に学びたい方へ" frame={frame} />
      <div className="phr-course-row">
        {courses.map((course, i) => (
          <a
            key={course.path}
            className="phr-course-card"
            href={`https://study.ebisuda.net/${course.path}/`}
            target="_blank"
            rel="noreferrer"
            style={lift(entrance(frame, fps, 18 + i * 12), 22)}
          >
            <ClipboardList size={34} />
            <strong>{course.label}</strong>
            <span>{course.note}</span>
          </a>
        ))}
      </div>
      <Punch frame={frame} delay={64}>
        <b>study.ebisuda.net</b> ─ Microsoft資格・Windows Server・Azure・Claude Code。月額990円。
      </Punch>
    </section>
  )
}

function SourcesSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const sources = [
    ['認証強度の概要', 'https://learn.microsoft.com/entra/identity/authentication/concept-authentication-strengths'],
    ['認証方式の一覧', 'https://learn.microsoft.com/entra/identity/authentication/overview-authentication'],
    [
      'フィッシング耐性パスワードレスの展開ガイド',
      'https://learn.microsoft.com/entra/identity/authentication/how-to-deploy-phishing-resistant-passwordless-authentication'
    ],
    [
      'Inside Tycoon2FA（Microsoft Security Blog）',
      'https://www.microsoft.com/en-us/security/blog/2026/03/04/inside-tycoon2fa-how-a-leading-aitm-phishing-kit-operated-at-scale/'
    ]
  ]
  return (
    <section className="remotion-slide phr-slide">
      <Header kicker="REFERENCES" title="出典" frame={frame} />
      <div className="phr-source-list">
        {sources.map(([label, href], i) => (
          <a key={href} href={href} target="_blank" rel="noreferrer" style={lift(entrance(frame, fps, 14 + i * 10), 14)}>
            <strong>{label}</strong>
            <span>{href.replace('https://', '')}</span>
          </a>
        ))}
      </div>
      <Punch frame={frame} delay={64}>
        設定を変える前に、<b>必ず最新の公式ドキュメント</b>を確認してください。
      </Punch>
    </section>
  )
}

function ThanksSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide phr-slide phr-thanks">
      <div className="phr-grid-bg" />
      <div style={lift(entrance(frame, fps), 34)}>
        <ThumbsUp size={78} />
        <h1>ご視聴ありがとうございました！</h1>
        <p>高評価・チャンネル登録をお願いします。</p>
      </div>
    </section>
  )
}
