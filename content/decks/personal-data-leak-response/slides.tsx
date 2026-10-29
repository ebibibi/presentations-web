/* eslint-disable react-refresh/only-export-components */
import type { SlideModule, SlideRenderContext } from '../../../src/types'
import {
  Callout,
  ComparisonTable,
  DiagramFrame,
  FlowDiagram,
  Slide,
  SlideHeading,
  Timeline,
  TitleSlide,
} from '../../../src/slide-kit'

export const slides: SlideModule['slides'] = [
  { id: 'opening', render: (props) => <OpeningSlide {...props} /> },
  { id: 'why-now', render: (props) => <WhyNowSlide {...props} /> },
  { id: 'first-step', render: (props) => <FirstStepSlide {...props} /> },
  { id: 'by-type', render: (props) => <ByTypeSlide {...props} /> },
  { id: 'why-reuse', render: (props) => <WhyReuseSlide {...props} /> },
  { id: 'infostealer', render: (props) => <InfostealerSlide {...props} /> },
  { id: 'password-manager', render: (props) => <PasswordManagerSlide {...props} /> },
  { id: 'passkey', render: (props) => <PasskeySlide {...props} /> },
  { id: 'auto-update', render: (props) => <AutoUpdateSlide {...props} /> },
  { id: 'priority', render: (props) => <PrioritySlide {...props} /> },
  { id: 'checklist', render: (props) => <ChecklistSlide {...props} /> },
  { id: 'sources', render: (props) => <SourcesSlide {...props} /> },
]

const SOURCES = [
  {
    label: 'IPA：自分の個人情報等が漏えいした際の「対処」と「日頃の対策」（2026年10月26日）',
    url: 'https://www.ipa.go.jp/security/anshin/attention/2026/mgdayori20261026.html',
  },
  {
    label: 'CNET Japan：もしあなたの免許証画像が漏洩したら？ 対処法をIPAが公開',
    url: 'https://japan.cnet.com/article/35254062/',
  },
  {
    label: 'INTERNET Watch：パッチ当てはもう自動化するしかない――日本ハッカー協会・杉浦隆幸代表理事【Security Days Fall 2026】',
    url: 'https://internet.watch.impress.co.jp/docs/event/2151590.html',
  },
  {
    label: 'IPA 情報セキュリティ安心相談窓口',
    url: 'https://www.ipa.go.jp/security/anshin/about.html',
  },
]

function OpeningSlide({ frame }: SlideRenderContext) {
  return (
    <TitleSlide
      frame={frame}
      kicker="「あなたの情報が漏えいしました」と連絡が来たら"
      heading={'漏れたら\n「何が漏れたか」で動く'}
      lead="本当の対策は、漏れても困らない状態にしておくこと"
      points={[
        { step: '01', heading: '漏れた直後', body: '種類ごとに決まった手を打つ' },
        { step: '02', heading: '漏れる前提で備える', body: '使い回しをやめる・更新を自動に' },
        { step: '03', heading: 'パスワードを使わない', body: 'パスキーに移る' },
      ]}
    />
  )
}

function WhyNowSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading
        frame={frame}
        kicker="なぜ今か"
        heading={'大情報漏洩時代\nAIで攻撃が速く、多くなった'}
        lead="自分が気をつけても、サービス側から漏れることは避けられない"
      />
      <ComparisonTable
        frame={frame}
        columns={[{ label: '講演で語られた現状', accent: true }]}
        rows={[
          { label: '攻撃の量', cells: ['AIは普通の攻撃者の100倍近い'] },
          { label: '脆弱性探し', cells: ['人なら2週間 → AIなら数時間'] },
          { label: '攻撃開始まで', cells: ['脆弱性の公開から約1日'] },
        ]}
      />
      <Callout frame={frame} icon="🎤" label="日本ハッカー協会 杉浦隆幸氏（Security Days Fall 2026）">
        <p>だから「漏れたらどうするか」と「漏れても困らない状態」の両方を用意しておく。</p>
      </Callout>
    </Slide>
  )
}

function FirstStepSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="最初の5分" heading={'まず「何が漏れたか」を\n確かめる'} />
      <FlowDiagram
        frame={frame}
        items={[
          { heading: '事業者からの連絡', body: '漏れた項目を読む' },
          { heading: '公式サイトのお知らせ', body: '自分で検索して開く' },
          { heading: 'サポート窓口', body: '分からなければ聞く', accent: true },
        ]}
      />
      <Callout frame={frame} tone="warn" icon="⚠️" label="通知メールのリンクからは行かない">
        <p>「漏えいのお知らせ」を装った偽メールもあり得る。公式サイトはブックマークか検索から開く。</p>
      </Callout>
    </Slide>
  )
}

function ByTypeSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="漏れた直後" heading="漏れた情報ごとにやること" />
      <ComparisonTable
        frame={frame}
        columns={[{ label: '起きること' }, { label: 'やること', accent: true }]}
        rows={[
          {
            label: 'ID・パスワード',
            cells: ['不正ログイン・勝手な購入・不正送金', 'すぐ変更。使い回し先も全部変える'],
          },
          {
            label: 'クレジットカード',
            cells: ['不正な決済', 'カード会社に連絡して停止・再発行を相談。明細を当面チェック'],
          },
          {
            label: 'メール・電話・住所・氏名',
            cells: ['本名入りの詐欺メール・SMS・電話', 'リンクは開かない。不審な着払いは受け取らない'],
          },
          {
            label: '免許証などの画像',
            cells: ['なりすましでカード・ローン契約', '信用情報機関（JICC・CIC・KSC）に本人申告'],
          },
        ]}
      />
    </Slide>
  )
}

function WhyReuseSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading
        frame={frame}
        kicker="そもそもの対策"
        heading={'一番効くのは\n「使い回しをやめる」'}
        lead="漏れたID・パスワードは、ほかのサービスでも試される（リスト型攻撃）"
      />
      <DiagramFrame frame={frame} caption="使い回していると" note="使い回していなければ、被害は漏れたサービス1つで止まる。">
        <FlowDiagram
          frame={frame}
          items={[
            { heading: 'A社から漏れる', body: 'IDとパスワードの一覧' },
            { heading: '別のサービスで試す', body: '通販・銀行・SNS' },
            { heading: '同じなら入られる', body: '被害が広がる', accent: true },
          ]}
        />
      </DiagramFrame>
    </Slide>
  )
}

function InfostealerSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading
        frame={frame}
        kicker="もう1つの漏れ方"
        heading={'自分のPCから\nまるごと抜かれることもある'}
        lead="インフォスティーラー：ブラウザに保存したID・パスワード・カード情報を盗むマルウェア"
      />
      <Callout frame={frame} tone="warn" icon="🕵️" label="講演で紹介された実態">
        <p>1人で1000近いIDがまるごと漏れる例も。肌感覚で3000人に1人が被害に遭っている。</p>
      </Callout>
      <ComparisonTable
        frame={frame}
        columns={[{ label: 'やること', accent: true }]}
        rows={[
          { label: '感染させない', cells: ['更新を止めない。出所の分からないソフト・拡張機能を入れない'] },
          { label: '感染したら', cells: ['端末を初期化。きれいな別の端末からパスワード変更とログアウト'] },
        ]}
      />
    </Slide>
  )
}

function PasswordManagerSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading
        frame={frame}
        kicker="使い回しをやめる道具"
        heading={'パスワードは\nマネージャーに覚えさせる'}
      />
      <Timeline
        frame={frame}
        orientation="vertical"
        steps={[
          { label: '作る', heading: 'サービスごとに長いランダムな文字列', body: '自分で考えないので使い回さない' },
          { label: '覚える', heading: '覚えるのはマネージャーの鍵1つだけ', body: 'ここは長く、多要素認証も付ける' },
          {
            label: '守る',
            heading: '偽サイトでは自動入力されない',
            body: 'ドメインが違うと出てこない ＝ 気づくきっかけ',
            accent: true,
          },
        ]}
      />
      <Callout frame={frame} tone="good" icon="✅" label="標準のもので十分">
        <p>Google パスワードマネージャー、Apple のパスワード、Microsoft Edge など、いま使っているブラウザやOSのものから始めればよい。</p>
      </Callout>
    </Slide>
  )
}

function PasskeySlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading
        frame={frame}
        kicker="パスワードを使わない"
        heading={'パスキーなら\nそもそもパスワードが無い'}
        lead="指紋・顔・PINで端末のロックを解除するだけでログイン"
      />
      <ComparisonTable
        frame={frame}
        columns={[{ label: 'パスワード＋SMSコード' }, { label: 'パスキー', accent: true }]}
        rows={[
          { label: 'サービスから漏れたら', cells: ['ログインに使われる', '公開鍵だけ。使い道が無い'] },
          { label: '偽サイトに誘導されたら', cells: ['両方入力して盗まれ得る', '本物のサイトでしか動かない'] },
          { label: '覚えるもの', cells: ['サービスの数だけ', '無し'] },
        ]}
      />
    </Slide>
  )
}

function AutoUpdateSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading
        frame={frame}
        kicker="人が判断していたら間に合わない"
        heading="更新は自動にしておく"
        lead="脆弱性の公開から約1日で攻撃が始まる"
      />
      <FlowDiagram
        frame={frame}
        items={[
          { heading: 'PC・スマホ', body: 'OSとアプリ' },
          { heading: 'ブラウザ', body: '拡張機能も' },
          { heading: 'ルーター・NAS', body: '家の機器も', accent: true },
        ]}
      />
      <Callout frame={frame} tone="warn" icon="🗑️" label="サポートが切れた機器は使わない">
        <p>更新が来ない機器は、穴が見つかっても塞がらない。買い替えるか、ネットから外す。</p>
      </Callout>
    </Slide>
  )
}

function PrioritySlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="強い順" heading={'大事なアカウントから\n上に上げていく'} />
      <Timeline
        frame={frame}
        orientation="vertical"
        steps={[
          {
            label: '◎',
            heading: 'パスキー（パスワードは消す）',
            body: '消せないサービスでも、パスワードは長いランダムにしておく',
            accent: true,
          },
          { label: '○', heading: 'マネージャーのランダムなパスワード＋多要素認証', body: 'パスキー非対応のサービスはここ' },
          { label: '×', heading: '覚えやすいパスワードの使い回し', body: '1か所漏れたら芋づる' },
        ]}
      />
    </Slide>
  )
}

function ChecklistSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="チェックリスト" heading="今日やる4つ" />
      <Timeline
        frame={frame}
        orientation="vertical"
        steps={[
          {
            label: '1',
            heading: 'メールと大事なアカウントにパスキーを登録',
            body: 'メール・Apple/Google/Microsoft・銀行・カード・通販。メールが最優先',
            accent: true,
          },
          {
            label: '2',
            heading: 'パスワードマネージャーで使い回しを潰す',
            body: '使い回し・漏えいの警告が出たものから変える',
          },
          {
            label: '3',
            heading: '登録は最小限、使わないアカウントは削除',
            body: '削除しても事業者側に残ることがある。規約を確認',
          },
          {
            label: '4',
            heading: '自動更新がオンか確認、サポート切れの機器は外す',
            body: 'PC・スマホ・ブラウザ・ルーター・NAS',
          },
        ]}
      />
    </Slide>
  )
}

function SourcesSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="Sources" heading="出典と相談先" lead="困ったらIPAの安心相談窓口（電話・メール）へ" />
      <Callout frame={frame} icon="📘" label="公式ページ">
        <ul>
          {SOURCES.map((s) => (
            <li key={s.url}>
              <a href={s.url} target="_blank" rel="noreferrer">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </Callout>
    </Slide>
  )
}
