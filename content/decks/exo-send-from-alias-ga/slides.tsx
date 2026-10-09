/* eslint-disable react-refresh/only-export-components */
import type { SlideModule, SlideRenderContext } from '../../../src/types'
import {
  Callout,
  CodeSlide,
  ComparisonTable,
  CtaSlide,
  Slide,
  SlideHeading,
  Timeline,
  TitleSlide,
} from '../../../src/slide-kit'

export const slides: SlideModule['slides'] = [
  { id: 'opening', render: (props) => <OpeningSlide {...props} /> },
  { id: 'cta-intro', render: (props) => <CtaSlide {...props} /> },
  { id: 'what-is-alias', render: (props) => <WhatIsAliasSlide {...props} /> },
  { id: 'enable', render: (props) => <EnableSlide {...props} /> },
  { id: 'clients', render: (props) => <ClientsSlide {...props} /> },
  { id: 'rules', render: (props) => <RulesSlide {...props} /> },
  { id: 'limits', render: (props) => <LimitsSlide {...props} /> },
  { id: 'roadmap', render: (props) => <RoadmapSlide {...props} /> },
  { id: 'checklist', render: (props) => <ChecklistSlide {...props} /> },
  { id: 'sources', render: (props) => <SourcesSlide {...props} /> },
  { id: 'cta-outro', render: (props) => <CtaSlide {...props} /> },
]

const SOURCES = [
  {
    label: 'Exchange Online でエイリアスからのメール送信が一般提供開始（日本マイクロソフト）',
    url: 'https://jpmessaging.github.io/blog/sending-from-email-aliases-general-availability/',
  },
  {
    label: 'Sending From Email Aliases – General Availability（Exchange Team Blog）',
    url: 'https://techcommunity.microsoft.com/blog/exchange/sending-from-email-aliases-%E2%80%93-general-availability/4562543',
  },
  {
    label: 'Set-AcceptedDomain',
    url: 'https://learn.microsoft.com/powershell/module/exchangepowershell/set-accepteddomain?view=exchange-ps',
  },
]

function OpeningSlide({ frame }: SlideRenderContext) {
  return (
    <TitleSlide
      frame={frame}
      kicker="Exchange Online ─ 一般提供（GA）"
      heading={'エイリアスから\n送信できる'}
      lead="便利。でもルールとトレースの前提が変わる"
      points={[
        { step: '01', heading: '何ができる', body: '別名のアドレスを送信元に' },
        { step: '02', heading: '誰が有効化', body: '管理者がテナント単位で' },
        { step: '03', heading: '注意点', body: 'ルール・トレース・共有メールボックス' },
      ]}
    />
  )
}

function WhatIsAliasSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="エイリアスとは" heading={'1つのメールボックスに\n付いた別のアドレス'} />
      <ComparisonTable
        frame={frame}
        columns={[{ label: '機能の提供前' }, { label: 'GA後', accent: true }]}
        rows={[
          { label: '受信', cells: ['エイリアス宛ても届く', 'エイリアス宛ても届く'] },
          { label: '送信元', cells: ['常にプライマリアドレス', '任意のエイリアスを選べる'] },
          { label: '返信', cells: ['プライマリから', '届いたエイリアスから自動'] },
          { label: '別名で送るには', cells: ['共有メールボックスや配布グループなどで回避', 'そのまま送れる'] },
        ]}
      />
      <Callout frame={frame} icon="📌" label="経緯">
        <p>パブリックプレビューを経て、今回一般提供になった</p>
      </Callout>
    </Slide>
  )
}

function EnableSlide({ frame }: SlideRenderContext) {
  return (
    <CodeSlide
      frame={frame}
      kicker="管理者がテナント単位で"
      heading="有効にする"
      caption="Exchange Online PowerShell"
      lines={[
        { kind: 'comment', body: '管理センターなら Mail Flow の' },
        { kind: 'comment', body: 'Sending from Aliases をオン' },
        { kind: 'prompt', body: 'Set-OrganizationConfig' },
        { kind: 'output', body: '  -SendFromAliasEnabled $True' },
      ]}
    >
      <Callout frame={frame} icon="🚫" label="送信させたくないドメイン">
        <p>そのドメインを「受信のみ」に設定する。エイリアス自体は Microsoft 365 管理センターで管理する</p>
      </Callout>
    </CodeSlide>
  )
}

function ClientsSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="利用者の操作" heading="どこで選ぶ？" />
      <ComparisonTable
        frame={frame}
        columns={[{ label: '操作', accent: true }]}
        rows={[
          { label: 'Outlook on the web', cells: ['設定 → 作成と返信 でエイリアスを表示して選ぶ'] },
          { label: 'Outlook（Windows / Mac）', cells: ['差出人欄のドロップダウン、または手入力'] },
          { label: 'Outlook モバイル', cells: ['差出人欄をタップして選ぶ'] },
        ]}
      />
      <Callout frame={frame} tone="good" icon="↩️" label="返信">
        <p>届いたメールの宛先に使われたエイリアスが、自動で送信元になる</p>
      </Callout>
    </Slide>
  )
}

function RulesSlide({ frame }: SlideRenderContext) {
  return (
    <Slide center>
      <SlideHeading
        frame={frame}
        kicker="公式の既知の制限（私が最重要と見るもの）"
        heading={'ルールが\n効かないことがある'}
        lead="特定のアドレスを参照するルールは、エイリアスから送ったメールに一致しない場合がある"
      />
      <Callout frame={frame} tone="warn" icon="⚠️" label="該当する機能">
        <p>スパム対策・ジャーナリング・メールフロールール</p>
      </Callout>
    </Slide>
  )
}

function LimitsSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="既知の制限と動作の変更" heading="そのほかに効いてくるもの" />
      <ComparisonTable
        frame={frame}
        columns={[{ label: '起きること', accent: true }]}
        rows={[
          { label: 'メッセージトレース', cells: ['プライマリで検索してもエイリアス送信分は出ない → エイリアスを指定する'] },
          { label: '共有メールボックス', cells: ['エイリアスから送れるのは Outlook on the web で「別のメールボックスを開く」ときだけ'] },
          { label: 'ハイブリッド', cells: ['オンプレから mail.～.onmicrosoft.com 宛てに届いた宛先が保持され、自動応答もそこから出ることがある'] },
          { label: '差出人の表示', cells: ['表示名やアドレスがこれまでと変わることがある'] },
        ]}
      />
    </Slide>
  )
}

function RoadmapSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="今後" heading="検討中の機能" lead="実装の確約ではない" />
      <Timeline
        frame={frame}
        steps={[
          { label: '検討中', heading: 'エイリアスごとの表示名' },
          { label: '検討中', heading: 'フィルター・既定値の制御' },
          { label: '検討中', heading: 'カレンダーのサポート' },
        ]}
      />
      <Callout frame={frame} icon="📨" label="想定外のケース">
        <p>既知の制限にない問題は、サポートチケットを、と案内されている</p>
      </Callout>
    </Slide>
  )
}

function ChecklistSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="チェックリスト（私の提案）" heading="有効化の前に確認する4つ" />
      <Timeline
        frame={frame}
        orientation="vertical"
        steps={[
          { label: '1', heading: 'メールフロールール・ジャーナリングがアドレスを条件にしていないか', accent: true },
          { label: '2', heading: 'メッセージトレースの手順に「エイリアスでも検索する」を足す' },
          { label: '3', heading: '送信させたくないドメインを「受信のみ」にしておく' },
          { label: '4', heading: '共有メールボックス・ハイブリッドの制限を利用者へ伝える' },
        ]}
      />
    </Slide>
  )
}

function SourcesSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="Sources" heading="出典" lead="2026年10月9日時点の公式情報" />
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
