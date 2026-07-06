import type { SlideModule } from '../../../src/types'
import { DataDrivenSlide, type DataDrivenSlideSpec } from '../../../src/private-decks'

const visualSlides: DataDrivenSlideSpec[] = [
  {
    "layout": "title",
    "kicker": "AI YouTube experiment",
    "title": "AIに5つのYouTubeチャンネルを19ヶ月任せた結果",
    "subtitle": "自作プログラムから完全自律AIへ。4,807本の実験で何が起きたのか、順番に見ていきます。",
    "emphasis": "19ヶ月分の運用ログを、今日は数字で振り返ります。",
    "sourceUrl": "https://note.com/ebibibi/n/nf82abeb8a04f",
    "footer": "2026-07-06 / ebisuda.net"
  },
  {
    "layout": "cta",
    "title": "Subscribe"
  },
  {
    "layout": "split",
    "kicker": "What I built",
    "title": "作ったのは、言語学習チャンネル群",
    "subtitle": "1つの当たり外れではなく、複数の言語ペアを同時に走らせて比較した。",
    "panels": [
      {
        "title": "5つのチャンネル",
        "body": "具体名は出さずに言うと、対象はすべて言語学習。学習者の母語と学ぶ言語の組み合わせを変えて、5つ並行で動かした。",
        "tone": "teal",
        "items": [
          {
            "title": "JP→EN",
            "body": "日本語話者向け英語"
          },
          {
            "title": "EN→JP",
            "body": "英語話者向け日本語"
          },
          {
            "title": "EN→ES / JP→ZH",
            "body": "スペイン語・中国語の検証枠"
          }
        ]
      },
      {
        "title": "やったこと",
        "body": "例文生成、画像生成、音声合成、動画レンダリング、投稿、分析、改善案作成までを1つのパイプラインにした。",
        "tone": "coral",
        "items": [
          {
            "title": "Normal + Shorts",
            "body": "長めの通常動画とショートを両方生成"
          },
          {
            "title": "毎日PDCA",
            "body": "YouTube Analyticsを読んで次の施策へ反映"
          }
        ]
      }
    ]
  },
  {
    "layout": "metrics",
    "kicker": "Experiment scale",
    "title": "まず、実験の規模感",
    "subtitle": "これは思いつきの検証ではなく、19ヶ月ぶんの運用ログが残った長期実験。",
    "metrics": [
      {
        "value": "19ヶ月",
        "label": "運用期間",
        "caption": "2024-12〜2026-07",
        "tone": "teal"
      },
      {
        "value": "4,807本",
        "label": "生成・投稿動画",
        "caption": "Normal 2,542 / Shorts 2,265",
        "tone": "coral"
      },
      {
        "value": "5ch",
        "label": "YouTubeチャンネル",
        "caption": "2チャンネルは収益化達成",
        "tone": "violet"
      },
      {
        "value": "464MB",
        "label": "一次データ",
        "caption": "analytics.db に実験ログを保存",
        "tone": "mustard"
      }
    ]
  },
  {
    "layout": "timeline",
    "kicker": "Timeline",
    "title": "最初から完全自律AIではない",
    "subtitle": "重要なのは、運営主体が段階的に人間のプログラムからAIへ移っていったこと。",
    "items": [
      {
        "label": "Phase 1",
        "title": "自作プログラム中心",
        "body": "人間が作った生成パイプラインを、人間が見ながら回す。",
        "tone": "teal"
      },
      {
        "label": "Phase 2",
        "title": "AI支援を拡大",
        "body": "コード生成、テーマ生成、改善案作成を少しずつAIへ渡す。",
        "tone": "violet"
      },
      {
        "label": "Phase 3",
        "title": "運営判断を委任",
        "body": "毎晩データを読み、仮説を立て、コードを直すループへ。",
        "tone": "mustard"
      },
      {
        "label": "Phase 4",
        "title": "完全自律フェーズ",
        "body": "投稿、分析、改善、障害対応の一部までAIが担う。",
        "tone": "coral"
      },
      {
        "label": "End",
        "title": "2026-07 完結",
        "body": "収益目標に届かず、実験完了として停止。データとコードは保全。",
        "tone": "teal"
      }
    ]
  },
  {
    "layout": "metrics",
    "kicker": "Result",
    "title": "結果発表: 月の収益は約210円",
    "subtitle": "収益化できたチャンネルが2つあっても、事業としてはまったく届かなかった。",
    "metrics": [
      {
        "value": "$1.38",
        "label": "2026年6月収益",
        "caption": "日本円で約210円",
        "tone": "coral"
      },
      {
        "value": "$0.58〜$3.79",
        "label": "月次実測レンジ",
        "caption": "2026年3月以降の収益データ",
        "tone": "mustard"
      },
      {
        "value": "0.2%前後",
        "label": "目標達成率",
        "caption": "月10万円には遠い",
        "tone": "violet"
      },
      {
        "value": "約485倍",
        "label": "目標との距離",
        "caption": "再生数か単価の片方改善では届かない",
        "tone": "teal"
      }
    ]
  },
  {
    "layout": "metrics",
    "kicker": "The crash",
    "title": "伸びていた時期は、確かにあった",
    "subtitle": "2026年2月にピーク。その直後、AI主導の10倍成長戦略で崩れた。",
    "metrics": [
      {
        "value": "33.4万",
        "label": "月間views最盛期",
        "caption": "2026年2月、Shorts主体",
        "tone": "teal"
      },
      {
        "value": "月800人",
        "label": "登録者増加ペース",
        "caption": "ピーク時は成長していた",
        "tone": "violet"
      },
      {
        "value": "約1/8",
        "label": "方針転換後の落ち込み",
        "caption": "通常動画中心へ寄せた結果",
        "tone": "coral"
      },
      {
        "value": "4.1万",
        "label": "2026年6月views",
        "caption": "4ヶ月間、戻らなかった",
        "tone": "mustard"
      }
    ]
  },
  {
    "layout": "split",
    "kicker": "Structural dilemma",
    "title": "伸ばせるものは稼げず、稼げるものは伸びない",
    "subtitle": "このジレンマを最後まで突破できなかった。",
    "panels": [
      {
        "title": "Shorts",
        "body": "再生されやすい。露出装置としては強い。でも広告単価が低すぎて、月33万再生でも収益貢献は小さい。",
        "tone": "teal",
        "items": [
          {
            "title": "強み",
            "body": "視聴者に届きやすい"
          },
          {
            "title": "弱み",
            "body": "お金になりにくい"
          }
        ]
      },
      {
        "title": "Normal",
        "body": "収益単価は高い。でもクリックして長く見てもらう必要があり、平均再生数は1本あたり6〜25回から動かなかった。",
        "tone": "coral",
        "items": [
          {
            "title": "強み",
            "body": "収益化の本丸"
          },
          {
            "title": "弱み",
            "body": "伸ばす難度が高い"
          }
        ]
      }
    ]
  },
  {
    "layout": "split",
    "kicker": "Platform reality",
    "title": "敵は視聴者ではなく、レコメンドシステムだった",
    "subtitle": "動画単体の品質改善だけでは、チャンネル単位の推薦壁を越えられなかった。",
    "panels": [
      {
        "title": "改善はしていた",
        "body": "視聴維持率は24.7%から39.2%へ改善。字幕、チャプター、メタデータも最適化した。",
        "tone": "violet"
      },
      {
        "title": "でも推薦されない",
        "body": "関連動画からの流入比率は19ヶ月間ずっと0.1〜1.3%。AI量産チャンネルは静かに外されていた可能性が高い。",
        "tone": "coral"
      }
    ]
  },
  {
    "layout": "process",
    "kicker": "What AI could do",
    "title": "AIの自律PDCAは、局所最適化なら本当に回った",
    "subtitle": "毎晩データを読み、仮説を立て、コードを書き換え、翌週に答え合わせする。",
    "items": [
      {
        "label": "Retention",
        "title": "視聴維持率 +14.5pp",
        "body": "進捗カウンター、フック、構成改善の複合施策。",
        "tone": "teal"
      },
      {
        "label": "Shorts",
        "title": "平均再生数 約10倍",
        "body": "サムネ、冒頭フック、尺の最適化。",
        "tone": "violet"
      },
      {
        "label": "A/B test",
        "title": "BGM廃止をデータで判断",
        "body": "BGMが視聴維持率を14.6%下げると検出。",
        "tone": "mustard"
      },
      {
        "label": "Recovery",
        "title": "障害から自己復旧",
        "body": "API互換性破壊に対し、互換ノードを書いて復旧。",
        "tone": "coral"
      }
    ]
  },
  {
    "layout": "split",
    "kicker": "What AI could not do",
    "title": "AIに「回すこと」は任せられる。でも「降りること」は任せられない",
    "subtitle": "局所最適化の成功体験が、撤退判断をむしろ遅らせた。",
    "panels": [
      {
        "title": "AIの報告",
        "body": "維持率改善、Shorts 10倍、成功フォーマット横展開。個々の改善は本物で、報告はいつも前向き。",
        "tone": "teal"
      },
      {
        "title": "最終指標",
        "body": "収益は月数百円のまま。ゲームのルール自体が不利、という問いはループの中から出てこなかった。",
        "tone": "coral"
      }
    ]
  },
  {
    "layout": "process",
    "kicker": "Incidents",
    "title": "自動化のバグは、被害も自動で量産する",
    "subtitle": "きれいな成功談ではなく、運用で実際に踏んだ地雷も重要なデータ。",
    "items": [
      {
        "label": "1,700本",
        "title": "重複動画事件",
        "body": "同じタイトルの動画が大量投稿され、段階的に非公開化。",
        "tone": "coral"
      },
      {
        "label": "8/100",
        "title": "フレーズ打ち切り",
        "body": "100フレーズ注文が8フレーズで止まったまま投稿。",
        "tone": "mustard"
      },
      {
        "label": "14本",
        "title": "サムネ数字不一致",
        "body": "本編とサムネの数字が食い違い、APIで修正。",
        "tone": "violet"
      },
      {
        "label": "勝手に",
        "title": "目標の下方修正",
        "body": "戦略AIが100フレーズを30フレーズに変更。",
        "tone": "teal"
      }
    ]
  },
  {
    "layout": "split",
    "kicker": "Cost",
    "title": "タダで動く実験は、撤退判断を麻痺させる",
    "subtitle": "自己負担はほぼ電気代。でも実使用量と注意力コストは本物だった。",
    "panels": [
      {
        "title": "金銭コスト",
        "body": "クラウドAI費用は特典クレジット、GPUは評価機材。自費なら月1万円超のコストに対し、収入は月200円規模。",
        "tone": "coral"
      },
      {
        "title": "注意力コスト",
        "body": "完全自律に近いほど、壊れたときの調査は複雑。障害対応と方針判断で毎週確実に注意力を払っていた。",
        "tone": "mustard"
      }
    ]
  },
  {
    "layout": "closing",
    "kicker": "Lessons",
    "title": "この実験は、失敗ではなく「撤退可能な知識」になった",
    "items": [
      {
        "value": "01",
        "title": "作れると稼げるは別",
        "body": "技術的に難しいことと事業性は相関しない。",
        "tone": "coral"
      },
      {
        "value": "02",
        "title": "伸びる指標と稼げる指標を分ける",
        "body": "再生数ではなく収益指標で検算する。",
        "tone": "teal"
      },
      {
        "value": "03",
        "title": "プラットフォームの敵になると終わる",
        "body": "規約違反でなくても推薦から外される。",
        "tone": "violet"
      },
      {
        "value": "04",
        "title": "AIの改善報告を信じすぎない",
        "body": "中間指標の成功は撤退判断を鈍らせる。",
        "tone": "mustard"
      }
    ],
    "body": "収益目標には負けた。でも、自律PDCAの実証、AI進化の定点観測、464MBの一次データ、撤退基準という資産が残った。"
  },
  {
    "layout": "cta",
    "title": "Subscribe"
  }
]

export const slides: SlideModule['slides'] = visualSlides.map((spec) => ({
  render: (props) => <DataDrivenSlide spec={spec} {...props} />
}))
