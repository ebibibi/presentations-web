/* eslint-disable react-refresh/only-export-components */
import type { SlideModule, SlideRenderContext } from '../../../src/types'
import {
  Callout,
  CodeSlide,
  ComparisonTable,
  HookSlide,
  KineticTitle,
  Slide,
  SlideHeading,
  Timeline,
} from '../../../src/slide-kit'

export const slides: SlideModule['slides'] = [
  { id: 'opening', render: (props) => <OpeningSlide {...props} /> },
  { id: 'mc1540258', render: (props) => <NoticeSlide {...props} /> },
  { id: 'same-direction', render: (props) => <SameDirectionSlide {...props} /> },
  { id: 'plugin', render: (props) => <PluginSlide {...props} /> },
  { id: 'claim-role-ending', render: (props) => <RoleEndingSlide {...props} /> },
  { id: 'claim-words', render: (props) => <WordsSlide {...props} /> },
  { id: 'claim-code-schedule', render: (props) => <CodeScheduleSlide {...props} /> },
  { id: 'claim-absorbed', render: (props) => <AbsorbedSlide {...props} /> },
  { id: 'claim-rpa', render: (props) => <RpaSlide {...props} /> },
  { id: 'what-remains', render: (props) => <WhatRemainsSlide {...props} /> },
  { id: 'sources', render: (props) => <SourcesSlide {...props} /> },
]

const SOURCES = [
  {
    label: 'メッセージセンター MC1540258：デザイナー内Copilotのサポート終了（2026年11月5日）',
    url: 'https://mc.merill.net/message/MC1540258',
  },
  {
    label: 'メッセージセンター MC1537406：Describe it to design it のサポート終了（2026年11月3日）',
    url: 'https://mc.merill.net/message/MC1537406',
  },
  {
    label: 'メッセージセンター MC1183604：キャンバスアプリのMaker Copilot廃止',
    url: 'https://mc.merill.net/message/MC1183604',
  },
  {
    label: 'メッセージセンター MC1215683：プレビューのCopilotコントロール削除',
    url: 'https://mc.merill.net/message/MC1215683',
  },
  {
    label: 'メッセージセンター MC1532421：Power Fx の式アシスト機能の廃止',
    url: 'https://mc.merill.net/message/MC1532421',
  },
  {
    label: 'GitHub：microsoft/power-platform-skills（Power Automate プラグイン）',
    url: 'https://github.com/microsoft/power-platform-skills/tree/main/plugins/power-automate',
  },
  {
    label: 'X：胡田の投稿（2026年11月7日）',
    url: 'https://x.com/ebi/status/2118861932023406636',
  },
]

function OpeningSlide({ frame }: SlideRenderContext) {
  return (
    <HookSlide
      frame={frame}
      kicker="2026年11月5日 Microsoft公式告知（MC1540258）"
      heading={'Power Automateから\nCopilotが消える'}
      lead="AIでフローを作る場所は、外のAIエージェントへ"
    >
      <ComparisonTable
        frame={frame}
        columns={[{ label: '事実', accent: true }]}
        rows={[
          { label: '11月30日', cells: ['デザイナー内のCopilotがサポート終了'] },
          { label: '既存フロー', cells: ['消えない。Copilotで作ったものも残る'] },
          { label: 'Microsoftの案内', cells: ['GitHub Copilot等のプラグインで作る'] },
        ]}
      />
    </HookSlide>
  )
}

function NoticeSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading
        frame={frame}
        kicker="MC1540258 の中身"
        heading={'止まるのはCopilotだけ\n作る場所が外に移る'}
      />
      <ComparisonTable
        frame={frame}
        columns={[{ label: '内容', accent: true }]}
        rows={[
          { label: '終わるもの', cells: ['クラウドフロー／エージェントフローのデザイナー内Copilot'] },
          { label: '残るもの', cells: ['既存フロー、手作業の編集、テンプレート、式エディタ、実行履歴'] },
          { label: '推奨①', cells: ['対応AIアシスタント（GitHub Copilot等）の Power Automate プラグイン'] },
          { label: '推奨②', cells: ['MCPで Microsoft Copilot Studio に接続'] },
        ]}
      />
    </Slide>
  )
}

function SameDirectionSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading
        frame={frame}
        kicker="単発ではない"
        heading={'作る画面から\nCopilotが消えていく'}
      />
      <Timeline
        frame={frame}
        orientation="vertical"
        steps={[
          { label: '2026年1月', heading: 'Power Apps：Maker Copilot廃止', body: 'MC1183604' },
          { label: '2026年2月', heading: 'Power Apps：Copilotコントロール削除', body: 'MC1215683' },
          { label: '2026年11月30日', heading: 'Power Automate：デザイナー内Copilot終了', body: 'MC1540258 / MC1537406', accent: true },
          { label: '2026年12月11日', heading: 'Power Apps：Power Fx 式のCopilot終了', body: 'MC1532421' },
        ]}
      />
    </Slide>
  )
}

function PluginSlide({ frame }: SlideRenderContext) {
  return (
    <CodeSlide
      frame={frame}
      kicker="代わりに案内されたもの"
      heading={'AIエージェントから\n操作する'}
      caption="Claude Code / GitHub Copilot CLI"
      lines={[
        { kind: 'comment', body: 'Microsoft公式（2026年1月〜 power-platform-skills）' },
        { kind: 'prompt', body: '/plugin marketplace add microsoft/power-platform-skills' },
        { kind: 'prompt', body: '/plugin install power-automate@power-platform-skills' },
      ]}
    >
      <Callout frame={frame} icon="🔌" label="FlowAgent MCPサーバー">
        <p>フローの作成・編集・公開、実行履歴、再実行、失敗の診断、接続の管理まで言葉で。</p>
      </Callout>
    </CodeSlide>
  )
}

function ClaimSlide({ frame, heading, lead }: SlideRenderContext & { heading: string; lead?: string }) {
  return (
    <Slide tone="ink" center>
      <KineticTitle frame={frame} kicker="胡田の主張" heading={heading} lead={lead} start={1} enter={['slide', 'pop']} />
    </Slide>
  )
}

function RoleEndingSlide(props: SlideRenderContext) {
  return <ClaimSlide {...props} heading={'Power Automateは\nもう 役割を\n終えつつある'} />
}

function WordsSlide(props: SlideRenderContext) {
  return (
    <ClaimSlide
      {...props}
      heading={'ロジックを 組むな\n言葉で 伝えろ'}
      lead="Azureサブスクを作って、やりたいことをAIに言う。わざわざローコードを使う必要がない"
    />
  )
}

function CodeScheduleSlide(props: SlideRenderContext) {
  return (
    <ClaimSlide
      {...props}
      heading={'定型なら\nコード ＋ スケジュール'}
      lead="AIを定期的に呼びたいなら、そうしてもらえばいい"
    />
  )
}

function AbsorbedSlide(props: SlideRenderContext) {
  return (
    <ClaimSlide
      {...props}
      heading={'良いところは\n言葉に 吸収された'}
      lead="残っているのは、悪いところだけ"
    />
  )
}

function RpaSlide(props: SlideRenderContext) {
  return <ClaimSlide {...props} heading={'RPAは\nはじめから 筋悪'} lead="問題外" />
}

function WhatRemainsSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading
        frame={frame}
        kicker="それでも"
        heading={'素敵な部分はある'}
        lead="残る価値は「ロジックを書く道具」ではなく「組織で管理する基盤」"
      />
      <ComparisonTable
        frame={frame}
        columns={[{ label: '残る価値', accent: true }]}
        rows={[
          { label: '共有', cells: ['フローをチームで共有できる'] },
          { label: '接続', cells: ['接続の権限を管理できる'] },
          { label: '承認', cells: ['承認ワークフロー'] },
        ]}
      />
    </Slide>
  )
}

function SourcesSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="Sources" heading="出典" lead="日付は自分のテナントのメッセージセンターで確認" />
      <Callout frame={frame} icon="📘" label="一次情報">
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
