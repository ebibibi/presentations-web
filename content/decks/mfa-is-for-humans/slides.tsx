/* eslint-disable react-refresh/only-export-components */
import {
  ArrowDown,
  ArrowRight,
  Brain,
  Check,
  CirclePlay,
  CircleQuestionMark,
  ClipboardList,
  Cloud,
  Cpu,
  FingerprintPattern,
  GitBranch,
  Hand,
  HardDrive,
  KeyRound,
  Laptop,
  ScanFace,
  Server,
  ShieldCheck,
  Smartphone,
  ThumbsUp,
  TriangleAlert,
  User,
  Vault,
  X
} from 'lucide-react'
import { spring, useVideoConfig } from 'remotion'
import type { SlideModule, SlideRenderContext } from '../../../src/types'
import { LogoMark } from '../../../src/deck-shared'

export const slides: SlideModule['slides'] = [
  { render: (props) => <OpeningSlide {...props} /> },
  { render: (props) => <ProfileSlide {...props} /> },
  { render: (props) => <ThreeQuestionsSlide {...props} /> },
  { render: (props) => <SectionFactorSlide {...props} /> },
  { render: (props) => <FactorIsCategorySlide {...props} /> },
  { render: (props) => <ThreeCategoriesSlide {...props} /> },
  { render: (props) => <PasswordPinSlide {...props} /> },
  { render: (props) => <DefinitionSlide {...props} /> },
  { render: (props) => <SectionCountSlide {...props} /> },
  { render: (props) => <WhfbFeelsLikeOneSlide {...props} /> },
  { render: (props) => <WhfbInsideSlide {...props} /> },
  { render: (props) => <SmsVsWhfbSlide {...props} /> },
  { render: (props) => <ModernDesignSlide {...props} /> },
  { render: (props) => <SectionSystemSlide {...props} /> },
  { render: (props) => <OfficialLineSlide {...props} /> },
  { render: (props) => <NoHandsSlide {...props} /> },
  { render: (props) => <CertPlusSecretSlide {...props} /> },
  { render: (props) => <TrustBoundarySlide {...props} /> },
  { render: (props) => <WhatMattersSlide {...props} /> },
  { render: (props) => <PreferenceOrderSlide {...props} /> },
  { render: (props) => <CaStillAppliesSlide {...props} /> },
  { render: (props) => <NamingSlide {...props} /> },
  { render: (props) => <RecapSlide {...props} /> },
  { render: (props) => <RelatedDecksSlide {...props} /> },
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
    <div className="mfh-head" style={lift(entrance(frame, fps), 22)}>
      <span className="slide-kicker">{kicker}</span>
      <h1>{title}</h1>
    </div>
  )
}

function Punch({ frame, delay = 70, children }: { frame: number; delay?: number; children: React.ReactNode }) {
  const { fps } = useVideoConfig()
  return (
    <p className="mfh-punch" style={lift(entrance(frame, fps, delay), 14)}>
      {children}
    </p>
  )
}

function SourceLine({ href, label }: { href: string; label: string }) {
  return (
    <a className="mfh-source-line" href={href} target="_blank" rel="noreferrer">
      Source: {label}
    </a>
  )
}

function SectionSlide({ frame, number, title, lead }: { frame: number; number: string; title: string; lead: string }) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide mfh-slide mfh-section">
      <div className="mfh-grid-bg" />
      <div className="mfh-section-body">
        <span className="mfh-section-number" style={lift(entrance(frame, fps), 30)}>
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
  const drift = Math.sin(frame / 18) * 5
  return (
    <section className="remotion-slide mfh-slide mfh-opening">
      <div className="mfh-grid-bg" />
      <LogoMark className="mfh-logo" />
      <div className="mfh-opening-copy" style={lift(entrance(frame, fps), 44)}>
        <span className="slide-kicker">MULTI-FACTOR AUTHENTICATION</span>
        <h1>
          その &quot;factor&quot; は、
          <br />
          <em>回数ではない</em>
        </h1>
        <p>MFAは、はじめから人間だけを相手にしている。</p>
      </div>
      <div className="mfh-opening-visual" style={{ transform: `translateY(${drift}px)` }}>
        <div className="mfh-scale" style={lift(entrance(frame, fps, 26), 22)}>
          <div className="mfh-scale-row mfh-scale-bad">
            <X size={28} />
            <span>資格情報を 2個 使う</span>
          </div>
          <div className="mfh-scale-row mfh-scale-good">
            <Check size={28} />
            <span>違う 種類 を 2つ 使う</span>
          </div>
        </div>
        <div className="mfh-opening-note" style={lift(entrance(frame, fps, 46), 18)}>
          <Brain size={30} />
          <strong>factor＝種類（category）</strong>
        </div>
      </div>
      <SourceLine
        href="https://learn.microsoft.com/entra/identity/authentication/concept-mfa-howitworks"
        label="Microsoft Learn ─ How multifactor authentication works"
      />
    </section>
  )
}

function ProfileSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const facts = ['Microsoft MVP 14年連続', 'Windows・Azure・M365', '生成AIを実機で検証', '著書「Windowsインフラ管理者入門」']
  return (
    <section className="remotion-slide mfh-slide">
      <Header kicker="YOUR GUIDE" title="解説する人：胡田 昌彦" frame={frame} />
      <div className="mfh-profile-layout">
        <div className="mfh-profile-mark" style={lift(entrance(frame, fps, 16), 22)}>
          <LogoMark />
          <strong>
            Masahiko
            <br />
            Ebisuda
          </strong>
          <span>えびすだ まさひこ</span>
        </div>
        <div className="mfh-profile-facts">
          {facts.map((fact, i) => (
            <div key={fact} style={lift(entrance(frame, fps, 28 + i * 10), 16)}>
              <Check size={26} />
              <strong>{fact}</strong>
            </div>
          ))}
        </div>
      </div>
      <Punch frame={frame} delay={72}>
        今日は設定手順ではなく、<b>用語の意味そのもの</b>を扱います。
      </Punch>
    </section>
  )
}

function ThreeQuestionsSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const questions = [
    '証明書 ＋ シークレット は、二要素認証か？',
    'Windows Hello for Business は、何要素か？',
    'サービスプリンシパルに、MFAはかけられるか？'
  ]
  return (
    <section className="remotion-slide mfh-slide">
      <Header kicker="THE QUESTION" title="この3つ、答えられますか" frame={frame} />
      <div className="mfh-question-list">
        {questions.map((q, i) => (
          <div key={q} style={lift(entrance(frame, fps, 18 + i * 13), 20)}>
            <CircleQuestionMark size={34} />
            <strong>{q}</strong>
          </div>
        ))}
      </div>
      <Punch frame={frame} delay={78}>
        この3つは、<b>同じ一行</b>から答えが出ます。
      </Punch>
    </section>
  )
}

function SectionFactorSlide(props: SlideRenderContext) {
  return (
    <SectionSlide
      frame={props.frame}
      number="SECTION 1"
      title="factor とは何か"
      lead="ここが曖昧なままだと、あとの話が全部ずれる。"
    />
  )
}

function FactorIsCategorySlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide mfh-slide">
      <Header kicker="DEFINITION" title="factor＝「認証材料の個数」ではない" frame={frame} />
      <div className="mfh-versus">
        <div className="mfh-versus-card mfh-bad" style={lift(entrance(frame, fps, 18), 22)}>
          <span className="mfh-versus-tag">よくある誤解</span>
          <strong>いくつ使ったか</strong>
          <p>資格情報を2個以上要求すれば多要素、という読み方。</p>
        </div>
        <div className="mfh-versus-card mfh-good" style={lift(entrance(frame, fps, 32), 22)}>
          <span className="mfh-versus-tag">実際の意味</span>
          <strong>どの種類を使ったか</strong>
          <p>本人確認のカテゴリが違うものを組み合わせているか。</p>
        </div>
      </div>
      <Punch frame={frame} delay={76}>
        英語の factor が「要素」とも「要因」とも読めるので、<b>個数っぽく見えてしまう</b>。
      </Punch>
    </section>
  )
}

function ThreeCategoriesSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const boxes = [
    { icon: <Brain size={40} />, en: 'Knowledge', ja: '知っているもの', ex: 'パスワード / PIN' },
    { icon: <Smartphone size={40} />, en: 'Possession', ja: '持っているもの', ex: 'スマホ / FIDO2キー / そのPC' },
    { icon: <ScanFace size={40} />, en: 'Inherence', ja: '本人そのもの', ex: '顔 / 指紋' }
  ]
  return (
    <section className="remotion-slide mfh-slide">
      <Header kicker="THREE BOXES" title="種類は、この3つしかない" frame={frame} />
      <div className="mfh-box-row">
        {boxes.map((b, i) => (
          <div key={b.en} className="mfh-box" style={lift(entrance(frame, fps, 16 + i * 13), 24)}>
            {b.icon}
            <span className="mfh-box-en">{b.en}</span>
            <strong>{b.ja}</strong>
            <em>{b.ex}</em>
          </div>
        ))}
      </div>
      <Punch frame={frame} delay={76}>
        MFA＝この<b>違う箱から2つ以上</b>を組み合わせること。
      </Punch>
      <SourceLine href="https://pages.nist.gov/800-63-3/sp800-63b.html" label="NIST SP 800-63B ─ Authentication factors" />
    </section>
  )
}

function PasswordPinSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide mfh-slide">
      <Header kicker="COUNTER-EXAMPLE" title="パスワード ＋ PIN は、MFAではない" frame={frame} />
      <div className="mfh-samebox" style={lift(entrance(frame, fps, 16), 24)}>
        <div className="mfh-samebox-frame">
          <span className="mfh-samebox-label">Knowledge ─ 知っているもの</span>
          <div className="mfh-samebox-items">
            <div>
              <KeyRound size={30} />
              <strong>パスワード</strong>
            </div>
            <div>
              <KeyRound size={30} />
              <strong>PIN</strong>
            </div>
          </div>
        </div>
        <div className="mfh-samebox-verdict" style={lift(entrance(frame, fps, 40), 18)}>
          <X size={34} />
          <div>
            <strong>材料は 2個</strong>
            <span>でも箱は 1つ</span>
          </div>
        </div>
      </div>
      <Punch frame={frame} delay={78}>
        パスワードを盗んだ攻撃者は、<b>たいてい同じ手口でPINも盗める</b>。壁の種類が増えていない。
      </Punch>
    </section>
  )
}

function DefinitionSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide mfh-slide mfh-oneline">
      <div className="mfh-grid-bg" />
      <div className="mfh-oneline-body">
        <span className="slide-kicker" style={lift(entrance(frame, fps), 20)}>
          THE ONE LINE
        </span>
        <h1 style={lift(entrance(frame, fps, 14), 28)}>
          MFAとは、<em>異なる種類</em>の
          <br />
          本人確認要素を組み合わせること。
        </h1>
        <p style={lift(entrance(frame, fps, 34), 20)}>「複数の認証情報を使うこと」ではない。</p>
      </div>
    </section>
  )
}

function SectionCountSlide(props: SlideRenderContext) {
  return (
    <SectionSlide
      frame={props.frame}
      number="SECTION 2"
      title="操作の回数と、要素の数は別"
      lead="顔を見せるだけなのに、2要素が成立している。"
    />
  )
}

function WhfbFeelsLikeOneSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide mfh-slide">
      <Header kicker="WINDOWS HELLO FOR BUSINESS" title="顔を見せるだけなのに、2要素" frame={frame} />
      <div className="mfh-feel">
        <div className="mfh-feel-card" style={lift(entrance(frame, fps, 16), 24)}>
          <span className="mfh-versus-tag">体験</span>
          <ScanFace size={54} />
          <strong>PCを開いて、顔を見せる</strong>
          <p>操作は1回。MFAをしている感覚がない。</p>
        </div>
        <div className="mfh-feel-arrow" style={lift(entrance(frame, fps, 30), 0)}>
          <ArrowRight size={44} />
        </div>
        <div className="mfh-feel-card mfh-good" style={lift(entrance(frame, fps, 38), 24)}>
          <span className="mfh-versus-tag">中身</span>
          <ShieldCheck size={54} />
          <strong>Possession ＋ Inherence</strong>
          <p>端末の鍵と、顔。違う箱が2つ成立している。</p>
        </div>
      </div>
      <SourceLine
        href="https://learn.microsoft.com/windows/security/identity-protection/hello-for-business/"
        label="Microsoft Learn ─ Windows Hello for Business"
      />
    </section>
  )
}

function WhfbInsideSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const steps = [
    { icon: <ScanFace size={30} />, title: '顔を見せる', body: '生体、またはPINを入力する' },
    { icon: <Laptop size={30} />, title: 'ローカルで本人確認', body: 'このPCを使っている本人だと確認される' },
    { icon: <Cpu size={30} />, title: 'TPM内の秘密鍵が解錠', body: '端末から出ない、その端末固有の鍵' },
    { icon: <Cloud size={30} />, title: 'その鍵でEntra IDへ認証', body: '顔がクラウドへ飛ぶわけではない' }
  ]
  return (
    <section className="remotion-slide mfh-slide">
      <Header kicker="INSIDE" title="中で起きていること" frame={frame} />
      <div className="mfh-flow">
        {steps.map((s, i) => (
          <div key={s.title} className="mfh-flow-item" style={lift(entrance(frame, fps, 14 + i * 11), 18)}>
            <span className="mfh-flow-icon">{s.icon}</span>
            <div>
              <strong>{s.title}</strong>
              <em>{s.body}</em>
            </div>
            {i < steps.length - 1 ? (
              <span className="mfh-flow-arrow">
                <ArrowDown size={22} />
              </span>
            ) : null}
          </div>
        ))}
      </div>
      <Punch frame={frame} delay={80}>
        <b>持っているもの</b>（TPMの鍵）＋ <b>本人であること</b>（顔）。PINなら Possession ＋ Knowledge。
      </Punch>
    </section>
  )
}

function SmsVsWhfbSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const rows = [
    { method: 'パスワード ＋ SMSコード', ops: '操作 2回', factors: '2要素', tone: 'plain' },
    { method: 'Windows Hello for Business', ops: '操作 1回', factors: '2要素', tone: 'good' },
    { method: 'Passkey（FIDO2）', ops: '操作 1回', factors: '2要素', tone: 'good' },
    { method: 'パスワード ＋ PIN', ops: '操作 2回', factors: '1要素', tone: 'bad' }
  ]
  return (
    <section className="remotion-slide mfh-slide">
      <Header kicker="OPERATIONS ≠ FACTORS" title="操作2回でも、操作1回でも、要素は2" frame={frame} />
      <div className="mfh-table">
        <div className="mfh-table-head">
          <span>方式</span>
          <span>体感</span>
          <span>要素数</span>
        </div>
        {rows.map((r, i) => (
          <div key={r.method} className={`mfh-table-row mfh-${r.tone}`} style={lift(entrance(frame, fps, 16 + i * 11), 16)}>
            <span>{r.method}</span>
            <span>{r.ops}</span>
            <strong>{r.factors}</strong>
          </div>
        ))}
      </div>
      <Punch frame={frame} delay={78}>
        <b>何回操作したか</b>と<b>何要素か</b>は、まったく別の話。
      </Punch>
    </section>
  )
}

function ModernDesignSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide mfh-slide mfh-oneline">
      <div className="mfh-grid-bg" />
      <div className="mfh-oneline-body">
        <span className="slide-kicker" style={lift(entrance(frame, fps), 20)}>
          DESIGN DIRECTION
        </span>
        <h1 style={lift(entrance(frame, fps, 14), 28)}>
          強度は上げる。でも
          <br />
          <em>MFAしていると意識させない。</em>
        </h1>
        <p style={lift(entrance(frame, fps, 34), 20)}>
          使いにくさは、強度の証拠ではない。むしろSMSは操作が多いのに弱い。
        </p>
      </div>
    </section>
  )
}

function SectionSystemSlide(props: SlideRenderContext) {
  return (
    <SectionSlide
      frame={props.frame}
      number="SECTION 3"
      title="システムIDに、MFAは無い"
      lead="制限や未実装ではなく、そもそも適用対象ではない。"
    />
  )
}

function OfficialLineSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide mfh-slide">
      <Header kicker="OFFICIAL" title="公式に、こう書いてある" frame={frame} />
      <div className="mfh-quote" style={lift(entrance(frame, fps, 18), 26)}>
        <span>Microsoft Learn ─ Conditional Access for workload identities</span>
        <blockquote>Can&apos;t perform multifactor authentication.</blockquote>
        <em>ワークロードID（アプリ・サービスプリンシパル・マネージドID）について</em>
      </div>
      <Punch frame={frame} delay={70}>
        「まだ対応していない」ではなく、<b>概念として噛み合わない</b>という意味です。
      </Punch>
      <SourceLine
        href="https://learn.microsoft.com/entra/identity/conditional-access/workload-identity"
        label="Microsoft Learn ─ Conditional Access for workload identities"
      />
    </section>
  )
}

function NoHandsSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const boxes = [
    { icon: <Brain size={34} />, label: '知っているもの', why: 'アプリは「覚えて」いない。設定値を読むだけ' },
    { icon: <Smartphone size={34} />, label: '持っているもの', why: 'サービスプリンシパルはスマホを持てない' },
    { icon: <ScanFace size={34} />, label: '本人そのもの', why: '顔も指紋もない' }
  ]
  return (
    <section className="remotion-slide mfh-slide">
      <Header kicker="WHY" title="承認ボタンを押す人が、いない" frame={frame} />
      <div className="mfh-nohands">
        {boxes.map((b, i) => (
          <div key={b.label} style={lift(entrance(frame, fps, 16 + i * 12), 20)}>
            <span className="mfh-nohands-icon">{b.icon}</span>
            <div>
              <strong>{b.label}</strong>
              <em>{b.why}</em>
            </div>
            <X size={30} className="mfh-nohands-x" />
          </div>
        ))}
      </div>
      <Punch frame={frame} delay={78}>
        3つの箱は<b>全部、人間を前提にしている</b>。機械のIDには、最初から当てはまらない。
      </Punch>
    </section>
  )
}

function CertPlusSecretSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide mfh-slide">
      <Header kicker="BACK TO Q1" title="証明書 ＋ シークレットは、2要素か" frame={frame} />
      <div className="mfh-samebox" style={lift(entrance(frame, fps, 16), 24)}>
        <div className="mfh-samebox-frame">
          <span className="mfh-samebox-label">どちらも「アプリが保持する秘密」</span>
          <div className="mfh-samebox-items">
            <div>
              <FingerprintPattern size={30} />
              <strong>クライアント証明書</strong>
            </div>
            <div>
              <KeyRound size={30} />
              <strong>クライアントシークレット</strong>
            </div>
          </div>
        </div>
        <div className="mfh-samebox-verdict" style={lift(entrance(frame, fps, 40), 18)}>
          <X size={34} />
          <div>
            <strong>MFAとは呼ばない</strong>
            <span>多層防御に近い</span>
          </div>
        </div>
      </div>
      <Punch frame={frame} delay={78}>
        パスワード ＋ PIN と<b>まったく同じ構造</b>です。
      </Punch>
    </section>
  )
}

function TrustBoundarySlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide mfh-slide">
      <Header kicker="THE REAL PROBLEM" title="しかも「2個だから2倍強い」ではない" frame={frame} />
      <div className="mfh-boundary">
        <div className="mfh-boundary-host" style={lift(entrance(frame, fps, 16), 24)}>
          <span className="mfh-boundary-label">
            <Server size={24} /> 同じ実行環境 / 同じ Key Vault
          </span>
          <div className="mfh-boundary-items">
            <div>
              <FingerprintPattern size={26} />
              <span>証明書</span>
            </div>
            <div>
              <KeyRound size={26} />
              <span>シークレット</span>
            </div>
          </div>
          <div className="mfh-boundary-breach">
            <TriangleAlert size={26} />
            <strong>ここを奪われたら、両方まとめて盗まれる</strong>
          </div>
        </div>
        <div className="mfh-boundary-human" style={lift(entrance(frame, fps, 40), 24)}>
          <span className="mfh-boundary-label">
            <User size={24} /> 人間のMFAが強い理由
          </span>
          <div className="mfh-boundary-split">
            <div>
              <Brain size={26} />
              <span>パスワード</span>
            </div>
            <div className="mfh-boundary-wall">
              <HardDrive size={20} />
            </div>
            <div>
              <ShieldCheck size={26} />
              <span>FIDO2キー</span>
            </div>
          </div>
          <div className="mfh-boundary-ok">
            <Check size={26} />
            <strong>攻撃に必要なものが、独立している</strong>
          </div>
        </div>
      </div>
      <Punch frame={frame} delay={82}>
        個数は2でも、<b>突破すべき壁は1枚</b>ということが起きる。
      </Punch>
    </section>
  )
}

function WhatMattersSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const axes = [
    { icon: <Vault size={38} />, title: '盗みにくいか', body: 'そもそも長期の秘密を保存しない設計か' },
    { icon: <GitBranch size={38} />, title: '境界が分かれているか', body: '同じ場所からまとめて取れてしまわないか' },
    { icon: <Hand size={38} />, title: '短命で再利用できないか', body: '発行のたびに変わり、盗んでも使い回せないか' }
  ]
  return (
    <section className="remotion-slide mfh-slide">
      <Header kicker="THE RIGHT AXES" title="システムIDで見るべきは、この3つ" frame={frame} />
      <div className="mfh-box-row">
        {axes.map((a, i) => (
          <div key={a.title} className="mfh-box" style={lift(entrance(frame, fps, 16 + i * 13), 24)}>
            {a.icon}
            <strong>{a.title}</strong>
            <em>{a.body}</em>
          </div>
        ))}
      </div>
      <Punch frame={frame} delay={76}>
        <b>個数を数えるのをやめて</b>、この3つを見る。これが正しい読み替えです。
      </Punch>
    </section>
  )
}

function PreferenceOrderSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const steps = [
    { rank: '1', label: 'マネージドID', body: '保存する秘密がない。資格情報の管理をAzureが持つ', tone: 'good' },
    { rank: '2', label: 'ワークロードIDフェデレーション（FIC）', body: 'GitHub Actions等からOIDCで。ここも秘密を保存しない', tone: 'good' },
    { rank: '3', label: 'クライアント証明書', body: '秘密は残るが、鍵ストアで保護でき有効期限も明確', tone: 'plain' },
    { rank: '4', label: 'クライアントシークレット', body: '文字列がそのまま鍵。漏れたら即その場で使える', tone: 'bad' }
  ]
  return (
    <section className="remotion-slide mfh-slide">
      <Header kicker="PREFERENCE" title="だから、望ましい順番はこうなる" frame={frame} />
      <div className="mfh-ladder">
        {steps.map((s, i) => (
          <div key={s.rank} className={`mfh-ladder-row mfh-${s.tone}`} style={lift(entrance(frame, fps, 14 + i * 11), 16)}>
            <span className="mfh-ladder-rank">{s.rank}</span>
            <div>
              <strong>{s.label}</strong>
              <em>{s.body}</em>
            </div>
          </div>
        ))}
      </div>
      <Punch frame={frame} delay={78}>
        個数を増やすより、<b>この階段を一段上がる</b>ほうが効きます。
      </Punch>
      <SourceLine
        href="https://learn.microsoft.com/entra/workload-id/workload-identity-federation"
        label="Microsoft Learn ─ Workload identity federation"
      />
    </section>
  )
}

function CaStillAppliesSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const items = [
    { icon: <ShieldCheck size={32} />, title: '場所で絞る', body: '指定したIP以外からのアクセスをブロックする' },
    { icon: <TriangleAlert size={32} />, title: 'リスクで止める', body: 'ワークロードIDリスクが高いときにブロックする' },
    { icon: <X size={32} />, title: 'ただし要求できないもの', body: 'ユーザー向けの「MFAを要求する」は使えない' }
  ]
  return (
    <section className="remotion-slide mfh-slide">
      <Header kicker="STILL PROTECTED" title="MFAが無い＝無防備、ではない" frame={frame} />
      <div className="mfh-ca-list">
        {items.map((it, i) => (
          <div key={it.title} style={lift(entrance(frame, fps, 16 + i * 12), 20)}>
            <span className="mfh-ca-icon">{it.icon}</span>
            <div>
              <strong>{it.title}</strong>
              <em>{it.body}</em>
            </div>
          </div>
        ))}
      </div>
      <Punch frame={frame} delay={78}>
        ワークロードID向けの<b>条件付きアクセス</b>は、ちゃんと存在します。
      </Punch>
      <SourceLine
        href="https://learn.microsoft.com/entra/identity/conditional-access/workload-identity"
        label="Microsoft Learn ─ Conditional Access for workload identities"
      />
    </section>
  )
}

function NamingSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const names = [
    { name: 'Multi-Factor Authentication', note: '実際の名前。factor が「種類」だと読み取れない', tone: 'bad' },
    { name: 'Multi-Category Authentication', note: '違う「箱」から選ぶ、が伝わる', tone: 'good' },
    { name: 'Independent-Factor Authentication', note: '独立していることが本質、が伝わる', tone: 'good' }
  ]
  return (
    <section className="remotion-slide mfh-slide">
      <Header kicker="NAMING" title="名前が、悪い" frame={frame} />
      <div className="mfh-naming">
        {names.map((n, i) => (
          <div key={n.name} className={`mfh-naming-row mfh-${n.tone}`} style={lift(entrance(frame, fps, 16 + i * 12), 18)}>
            <strong>{n.name}</strong>
            <em>{n.note}</em>
          </div>
        ))}
      </div>
      <Punch frame={frame} delay={78}>
        用語ができた背景は<b>人間の本人確認</b>だった。機械のIDまで含めて読むと、急に名前の悪さが目立つ。
      </Punch>
    </section>
  )
}

function RecapSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const items = [
    ['01', 'factor は個数ではなく種類', '違う箱から2つ以上そろって、はじめてMFA'],
    ['02', '操作の回数と、要素の数は別', '顔を見せるだけのWHfBも、中身は2要素'],
    ['03', 'システムIDにMFAは無い', '盗みにくさ・信頼境界・短命性で強度を考える']
  ]
  return (
    <section className="remotion-slide mfh-slide">
      <Header kicker="RECAP" title="覚えるのは、この3つ" frame={frame} />
      <div className="mfh-recap">
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

function RelatedDecksSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const decks = [
    { slug: 'phishing-resistant-mfa', title: 'そのMFA、中継されて終わりです', note: '人にどうMFAをかけるか。フィッシング耐性とは何か' },
    { slug: 'mfa-service-identity', title: 'サービスIDの棚卸しと移行', note: '人のIDで動く自動化を見つけて、ワークロードIDへ移す' },
    { slug: 'mfa-exempt-identities', title: 'MFAをかけられない機器をどう守るか', note: 'Teams Rooms・ROPC・デバイスコードフロー' }
  ]
  return (
    <section className="remotion-slide mfh-slide">
      <Header kicker="RELATED" title="関連するスライド" frame={frame} />
      <div className="mfh-decks">
        {decks.map((d, i) => (
          <a
            key={d.slug}
            href={`https://presentations.ebisuda.net/decks/${d.slug}`}
            target="_blank"
            rel="noreferrer"
            style={lift(entrance(frame, fps, 18 + i * 12), 22)}
          >
            <ClipboardList size={34} />
            <strong>{d.title}</strong>
            <span>{d.note}</span>
          </a>
        ))}
      </div>
    </section>
  )
}

function RelatedVideosSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const videos = [
    { id: 'CGEWsDgdFvk', title: '認証パターンを基礎から理解', note: 'トークン・SP・マネージドIDの全体像' },
    { id: 'n2RodbBpzeo', title: 'なぜアプリにもIDが必要？', note: 'アプリ登録と権限・同意の基礎' },
    { id: 'SkqRmdStxnQ', title: '「リソースURL」の正体', note: 'トークンが誰宛かを理解する' },
    { id: 'u3DmYibZgwE', title: '条件付きアクセス「全リソース＋除外」の挙動', note: '除外設計の落とし穴' }
  ]
  return (
    <section className="remotion-slide mfh-slide">
      <Header kicker="GO DEEPER" title="関連する解説動画" frame={frame} />
      <div className="mfh-video-list">
        {videos.map((video, i) => (
          <a
            key={video.id}
            className="mfh-video-row"
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
    <section className="remotion-slide mfh-slide mfh-ebistudy">
      <Header kicker="EBI STUDY" title="体系的に、順番に学びたい方へ" frame={frame} />
      <div className="mfh-course-row">
        {courses.map((course, i) => (
          <a
            key={course.path}
            className="mfh-course-card"
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
    ['多要素認証の仕組み', 'https://learn.microsoft.com/entra/identity/authentication/concept-mfa-howitworks'],
    ['ワークロードID向けの条件付きアクセス', 'https://learn.microsoft.com/entra/identity/conditional-access/workload-identity'],
    ['ワークロードIDの概要', 'https://learn.microsoft.com/entra/workload-id/workload-identities-overview'],
    ['マネージドIDの概要', 'https://learn.microsoft.com/entra/identity/managed-identities-azure-resources/overview'],
    ['ワークロードIDフェデレーション', 'https://learn.microsoft.com/entra/workload-id/workload-identity-federation'],
    ['NIST SP 800-63B（認証要素の定義）', 'https://pages.nist.gov/800-63-3/sp800-63b.html']
  ]
  return (
    <section className="remotion-slide mfh-slide">
      <Header kicker="REFERENCES" title="出典" frame={frame} />
      <div className="mfh-source-list">
        {sources.map(([label, href], i) => (
          <a key={href} href={href} target="_blank" rel="noreferrer" style={lift(entrance(frame, fps, 12 + i * 8), 14)}>
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
    <section className="remotion-slide mfh-slide mfh-thanks">
      <div className="mfh-grid-bg" />
      <div style={lift(entrance(frame, fps), 34)}>
        <ThumbsUp size={78} />
        <h1>ご視聴ありがとうございました！</h1>
        <p>高評価・チャンネル登録をお願いします。</p>
      </div>
    </section>
  )
}
