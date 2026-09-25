/* eslint-disable react-refresh/only-export-components */
import type { SlideModule, SlideRenderContext } from '../../../src/types'
import {
  Callout,
  CodeSlide,
  ComparisonTable,
  CtaSlide,
  DiagramFrame,
  FlowDiagram,
  SectionDivider,
  Slide,
  SlideHeading,
  Timeline,
  TitleSlide,
} from '../../../src/slide-kit'

const GUIDE_URL =
  'https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-5-5'

export const slides: SlideModule['slides'] = [
  { id: 'opening', render: (props) => <OpeningSlide {...props} /> },
  { id: 'what-changed', render: (props) => <WhatChangedSlide {...props} /> },
  { id: 'effort', render: (props) => <EffortSlide {...props} /> },
  { id: 'effort-tips', render: (props) => <EffortTipsSlide {...props} /> },
  { id: 'delete-think', render: (props) => <DeleteThinkSlide {...props} /> },
  { id: 'thinking-disabled', render: (props) => <ThinkingDisabledSlide {...props} /> },
  { id: 'section-harness', render: (props) => <SectionHarnessSlide {...props} /> },
  { id: 'unattended', render: (props) => <UnattendedSlide {...props} /> },
  { id: 'early-stops', render: (props) => <EarlyStopsSlide {...props} /> },
  { id: 'progress', render: (props) => <ProgressSlide {...props} /> },
  { id: 'explore', render: (props) => <ExploreSlide {...props} /> },
  { id: 'time-budget', render: (props) => <TimeBudgetSlide {...props} /> },
  { id: 'pasted', render: (props) => <PastedSlide {...props} /> },
  { id: 'visual-frontend', render: (props) => <VisualFrontendSlide {...props} /> },
  { id: 'refusals', render: (props) => <RefusalsSlide {...props} /> },
  { id: 'recap', render: (props) => <RecapSlide {...props} /> },
  { id: 'sources', render: (props) => <SourcesSlide {...props} /> },
  { id: 'cta', render: (props) => <CtaSlide {...props} /> },
]

function OpeningSlide({ frame }: SlideRenderContext) {
  return (
    <TitleSlide
      frame={frame}
      kicker="Anthropic 公式ガイド ─ Prompting Claude Opus 5.5"
      heading={'「よく考えて」は\n消していい'}
      lead="思考量はeffortで決める。後半はハーネスの設計の話"
      points={[
        { step: '01', heading: 'effortが主役', body: '既定のmediumでOpus 5のhigh相当' },
        { step: '02', heading: '止まらせない仕組み', body: 'チェックリストと続行の促し' },
        { step: '03', heading: '環境を設計する', body: '探索・時間予算・貼り付けの印' },
      ]}
    />
  )
}

function WhatChangedSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading
        frame={frame}
        kicker="前提"
        heading={'Opus 5 から\n何が変わったか'}
        lead="Opus 5 向けのプロンプトは、そのままでもよく動く"
      />
      <ComparisonTable
        frame={frame}
        columns={[{ label: 'Opus 5' }, { label: 'Opus 5.5', accent: true }]}
        rows={[
          { label: '既定のeffort', cells: ['high', 'medium'] },
          { label: 'thinking', cells: ['無効にもできる', '常にオン'] },
          { label: '途中経過', cells: ['textブロック', 'thinkingブロックで返る'] },
          { label: '出力速度', cells: ['─', '30%以上速い・少ないトークン'] },
        ]}
      />
    </Slide>
  )
}

function EffortSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="Calibrate effort" heading={'思考量のダイヤルは\neffort'} />
      <DiagramFrame frame={frame} caption="Anthropicのテスト（コーディング・知識労働）" note="レベル名はモデル間で同じ思考量を意味しない">
        <FlowDiagram
          frame={frame}
          items={[
            { heading: 'Opus 5 の high', body: '従来の既定' },
            { heading: 'Opus 5.5 の medium', body: '並ぶか上回る', accent: true },
            { heading: 'Opus 5.5 の low', body: '一部の評価で近い・大幅に安い' },
          ]}
        />
      </DiagramFrame>
      <Callout frame={frame} tone="good" icon="📏" label="設定を持ち越さない">
        <p>mediumから始めて明示的に指定し、自分の評価で複数レベルを試す</p>
      </Callout>
    </Slide>
  )
}

function EffortTipsSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="effortの運用" heading={'同じレベルでも\n1ターンで多く考える'} />
      <Timeline
        frame={frame}
        orientation="vertical"
        steps={[
          { label: '1', heading: 'max_tokensに思考の余裕を取る', body: '長いエージェントコーディングは上限の128,000が好成績' },
          { label: '2', heading: 'xhigh・maxは品質向上を測れたときだけ' },
          { label: '3', heading: '思考を減らすなら、まずeffortを下げる', body: 'プロンプトで頼むより確実', accent: true },
          { label: '!', heading: 'effortの途中変更はキャッシュを無効化', body: 'メッセージ単位のeffort変更（ベータ）を使う' },
        ]}
      />
    </Slide>
  )
}

function DeleteThinkSlide({ frame }: SlideRenderContext) {
  return (
    <CodeSlide
      frame={frame}
      kicker="チャットのシステムプロンプト"
      heading={'「よく考えて」は\n消していい'}
      caption="system prompt 末尾に2文（公式例）"
      lines={[
        { kind: 'output', body: 'Once you have answered something,' },
        { kind: 'output', body: 'treat that answer as done. On' },
        { kind: 'output', body: 'later turns, focus your thinking' },
        { kind: 'output', body: 'on what the user is asking now,' },
        { kind: 'output', body: "and don't go back over an earlier" },
        { kind: 'output', body: 'answer unless the user asks about' },
        { kind: 'output', body: 'it or points out a problem with it.' },
      ]}
    >
      <Callout frame={frame} tone="good" icon="⚡" label="削除した結果">
        <p>返答の開始が早まり、品質の明確な低下なし</p>
      </Callout>
      <Callout frame={frame} tone="warn" icon="⚠️" label="入れない場面">
        <p>長い分析や、後で誤りに気づいてほしいエージェント作業</p>
      </Callout>
    </CodeSlide>
  )
}

function ThinkingDisabledSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading
        frame={frame}
        kicker="移行"
        heading={'thinking無効で\n動かしていた人へ'}
        lead="Opus 5.5 では thinking を無効にできない"
      />
      <Timeline
        frame={frame}
        orientation="vertical"
        steps={[
          { label: '1', heading: 'lowから始めて、遅延と品質を測る' },
          { label: '2', heading: '本文に推論を書かせる指示を外す', body: 'reasoning_extraction で拒否されうる。summarized thinking を読む', accent: true },
          { label: '3', heading: 'thinking無効時向けの回避策を再テスト' },
          { label: '4', heading: '先頭をtextと決めつけず、ブロックの種類で読む' },
        ]}
      />
    </Slide>
  )
}

function SectionHarnessSlide({ frame }: SlideRenderContext) {
  return (
    <SectionDivider
      frame={frame}
      step="後半"
      kicker="Harness"
      heading={'ここからは\nハーネスの設計'}
      lead="プロンプトの一文より、モデルが働く環境の話"
    />
  )
}

function UnattendedSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading
        frame={frame}
        kicker="Unattended agentic runs"
        heading={'テキストで終わったターンは\n「完了」ではなく「報告」'}
      />
      <Timeline
        frame={frame}
        orientation="vertical"
        steps={[
          { label: '1', heading: 'タスクをチェックリストで持たせる', body: 'to-doツールやファイルで、モデル自身に更新させる' },
          { label: '2', heading: '未完了なら項目名を挙げて続行を促す', body: '小さいモデルに完了条件を判定させてもいい', accent: true },
          { label: '3', heading: '自動続行は2〜3回で打ち止め', body: '本当に詰まった実行は人がレビュー' },
          { label: '4', heading: 'バックグラウンド処理の完了を待つ' },
        ]}
      />
    </Slide>
  )
}

function EarlyStopsSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading
        frame={frame}
        kicker="システムプロンプトで名指しする"
        heading={'避けたい「早すぎる停止」\n4パターン'}
      />
      <Timeline
        frame={frame}
        orientation="vertical"
        steps={[
          { label: '1', heading: '次の一歩を宣言して終わる長い要約' },
          { label: '2', heading: '「よければ続けます」という申し出' },
          { label: '3', heading: '実は何もブロックしていない判断事項の列挙' },
          { label: '4', heading: '「区切りがいいから報告しよう」という判断' },
        ]}
      />
      <Callout frame={frame} tone="warn" icon="🛑" label="止まっていいのは">
        <p>ユーザーなしで何も進まないときだけ。危険な操作の確認は別に残す</p>
      </Callout>
    </Slide>
  )
}

function ProgressSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading
        frame={frame}
        kicker="User-facing progress updates"
        heading={'黙って見える\nエージェントを直す'}
        lead="途中経過は thinking ブロックで返る"
      />
      <Timeline
        frame={frame}
        orientation="vertical"
        steps={[
          { label: '1', heading: 'display: "updates" で要約を受け取る', body: 'textだけ描画するクライアントは無言に見える' },
          { label: '2', heading: 'そのまま渡す内容には送信用ツールを', body: 'tools には最初のリクエストから定義' },
          { label: '3', heading: '更新の頻度はシステムプロンプトで頼む' },
          { label: '4', heading: '無言が5ステップ続いたらハーネスが一言促す', body: '長い無言区間のあるタスクが約半分に', accent: true },
        ]}
      />
    </Slide>
  )
}

function ExploreSlide({ frame }: SlideRenderContext) {
  return (
    <CodeSlide
      frame={frame}
      kicker="Multi-app workflows"
      heading={'複数アプリでは\n「先に見回せ」'}
      lead="Opus 5.5 はすぐ作業に取りかかる"
      caption="system prompt に一文（公式例・抜粋）"
      lines={[
        { kind: 'output', body: 'Before taking any action, explore' },
        { kind: 'output', body: 'broadly with tool calls: list and' },
        { kind: 'output', body: 'open the emails, documents,' },
        { kind: 'output', body: 'spreadsheet tabs and records …' },
        { kind: 'output', body: 'including ones the task does not' },
        { kind: 'output', body: 'explicitly mention, and use what' },
        { kind: 'output', body: 'you find.' },
      ]}
    >
      <Callout frame={frame} tone="good" icon="📈" label="効果">
        <p>mediumでもmaxでも正答が目に見えて増加</p>
      </Callout>
      <Callout frame={frame} tone="warn" icon="⚠️" label="条件">
        <p>見つけたものに従うので、信頼できない内容を置かない</p>
      </Callout>
    </CodeSlide>
  )
}

function TimeBudgetSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading
        frame={frame}
        kicker="Time signals for multiagent harnesses"
        heading={'マルチエージェントに\n時間予算を渡す'}
        lead="各メッセージの末尾に「elapsed 340s / 1200s」"
      />
      <ComparisonTable
        frame={frame}
        columns={[{ label: 'effortを下げる' }, { label: '時間予算を絞る', accent: true }]}
        rows={[
          { label: '効き方', cells: ['仕事そのものが減る', '並列に動くエージェントが増える'] },
          { label: '予算の決め方', cells: ['─', '使いたい時間より少し多め'] },
          { label: '決められないとき', cells: ['─', '経過時間だけ見せ「時間が大事」と一文'] },
        ]}
      />
      <Callout frame={frame} tone="warn" icon="⏱️" label="予算は助言にすぎない">
        <p>ハードな打ち切りは自前のタイムアウトで。検証が少し減ることもある</p>
      </Callout>
    </Slide>
  )
}

function PastedSlide({ frame }: SlideRenderContext) {
  return (
    <CodeSlide
      frame={frame}
      kicker="Prompt injection"
      heading={'貼り付けたテキストに\n印を付ける'}
      lead="間接プロンプトインジェクション耐性は歴代Opusで最高"
      caption="user message（IDはアプリがランダム生成）"
      lines={[
        { kind: 'output', body: 'Summarize the main complaints' },
        { kind: 'output', body: 'in this thread.' },
        { kind: 'output', body: '<pasted_content id="ab12">' },
        { kind: 'comment', body: 'ユーザーがメールやWebから貼った文章' },
        { kind: 'output', body: '</pasted_content id="ab12">' },
      ]}
    >
      <Callout frame={frame} icon="📝" label="system prompt 側">
        <p>タグ内の指示は、ユーザー自身が頼んだ範囲でしか従わない</p>
      </Callout>
      <Callout frame={frame} tone="warn" icon="⚠️" label="タグは偽装できる">
        <p>防御の一枚として扱う</p>
      </Callout>
    </CodeSlide>
  )
}

function VisualFrontendSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="画像入力・フロントエンド" heading={'以前の足場は\n外せるかもしれない'} />
      <ComparisonTable
        frame={frame}
        columns={[{ label: '画像・図表の入力' }, { label: 'フロントエンド', accent: true }]}
        rows={[
          { label: '変化', cells: ['最低effortでもOpus 5の最高より正確', '指示がないと既定のスタイルに戻る'] },
          { label: 'やること', cells: ['以前の補助の要否を再テスト', '避けたいパターンを具体的に名指し'] },
          { label: 'まだ効く', cells: ['高解像度・切り抜き/拡大ツール', '結果を見てリストを足していく'] },
        ]}
      />
      <Callout frame={frame} icon="🎨" label="「AIっぽさを避けて」は効かない">
        <p>別の既定値に入れ替わるだけ</p>
      </Callout>
    </Slide>
  )
}

function RefusalsSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading
        frame={frame}
        kicker="Safeguard refusals"
        heading={'安全分類器による\n拒否'}
        lead={'stop_reason: "refusal" で返る'}
      />
      <ComparisonTable
        frame={frame}
        columns={[{ label: '範囲' }, { label: '注意点', accent: true }]}
        rows={[
          { label: '生物', cells: ['Fable 5.1 と同じ', 'Opus 5 から来ると新しい'] },
          { label: 'サイバー', cells: ['脆弱性の発見は可', '高リスクなデュアルユースは不可'] },
          { label: '推論抽出', cells: ['本文への推論の再現', 'フォールバックで再試行されない'] },
        ]}
      />
    </Slide>
  )
}

function RecapSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading
        frame={frame}
        kicker="チェックリスト"
        heading="今日見直す5つ"
        lead="プロンプトを磨く時代から、環境を設計する時代へ"
      />
      <Timeline
        frame={frame}
        orientation="vertical"
        steps={[
          { label: '1', heading: 'effortを明示し、複数レベルで測る' },
          { label: '2', heading: '「よく考えて」系の指示を消す' },
          { label: '3', heading: 'ターン終了を完了とみなさず、チェックリストで続行' },
          { label: '4', heading: '途中経過が利用者に見えているか確かめる' },
          { label: '5', heading: 'マルチエージェントには時間予算を渡す', accent: true },
        ]}
      />
    </Slide>
  )
}

function SourcesSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="Sources" heading="出典" />
      <Callout frame={frame} icon="📘" label="Anthropic 公式ドキュメント">
        <p>
          <a href={GUIDE_URL} target="_blank" rel="noreferrer">
            Prompting Claude Opus 5.5
          </a>
        </p>
      </Callout>
      <Callout frame={frame} tone="warn" icon="🧪" label="数字の扱い">
        <p>数値はすべてAnthropic自身のテスト。自分のワークロードで測ってから採用する</p>
      </Callout>
    </Slide>
  )
}
