import type { SlideModule } from '../../../src/types'
import { Callout, Slide, SlideHeading, TitleSlide } from '../../../src/slide-kit'
import { NetworkVisual } from '../../network-series/NetworkVisual'

export const slides: SlideModule['slides'] = [
  { id: 'opening', render: ({ frame }) => <TitleSlide frame={frame} kicker="ネットワーク超基礎 · 第1話" heading={'Wi-Fiにつないだだけで、\nなぜWebページが開く？'} lead="自分のPCから出発して、何が起こるか追跡しよう" points={[{ step: '01', heading: '家の中', body: 'Wi-Fiとルーター' }, { step: '02', heading: '家の外', body: 'IPで経路をつなぐ' }, { step: '03', heading: '往復', body: '返事をPCに届ける' }]} /> },
  { id: 'two-connections', render: (props) => <NetworkVisual {...props} mode="layers" kicker="本の説明①：まず線を見る" heading="Wi-Fiは家の中の、最初の一区間" lead="電波が届いても、インターネットの道が開通したとは限らない" caption="PC → Wi-Fi／ルーター → 回線 → Webサイト" note="Wi-Fi接続と外の回線は別々。" /> },
  { id: 'route', render: (props) => <NetworkVisual {...props} mode="dns" kicker="本の説明②：URLの次に何をする？" heading="名前だけでは届けられない" lead="example.com のIPアドレスをDNSで調べる" caption="まずWebサイトの名前 → IPアドレスへ変換" note="203.0.113.10 は資料用の番号。" /> },
  { id: 'return', render: (props) => <NetworkVisual {...props} mode="gateway" kicker="本の説明③：次は誰に渡す？" heading="外の宛先なら、まず家の出口へ" lead="PCは世界の道順を知らない。デフォルトゲートウェイに頼む" caption="目的地のIPと、最初に渡す相手は別" note="PCは世界中の道順を知らない。" /> },
  { id: 'outage', render: (props) => <NetworkVisual {...props} mode="nat" kicker="本の説明④：帰りはどう戻る？" heading="家の中のIPのまま、外へ出ない" lead="ルーターが送信元を書き換え、返事を元のPCへ戻す" caption="典型的な家庭のIPv4：NATの行きと帰り" note="複数のPCの区別にはポート番号も使う。" /> },
  { id: 'checklist', render: (props) => <NetworkVisual {...props} mode="outage" kicker="本の説明⑤：開けなかったら？" heading="どの段階で止まったかを調べる" lead="Wi-Fi → IP設定 → DNS → 接続先 → ページの中身" caption="Wi-Fi表示だけで原因を決めつけない" note="図は回線断の例。ほかにも原因はある。" /> },
  { id: 'recap', render: ({ frame }) => <Slide tone="ink" logo><SlideHeading frame={frame} kicker="今日の答え" heading={'PC一台の通信も、\n段階を踏んで往復する'} lead="Wi-Fiで家へ → DNSで宛先IP → ルーターから外へ → 返事を受け取る" /><Callout frame={frame} label="次の疑問" icon="🔍"><p>住所のような「IP」があるのに、なぜゲートウェイが必要なのか？</p></Callout></Slide> },
  { id: 'sources', render: ({ frame }) => <Slide><SlideHeading frame={frame} kicker="出典と次の話" heading="次は『IPアドレス』を解体する" lead="どこまで届ける住所なのか、実際の道筋で見る" /><Callout frame={frame} label="今回の構成の出発点" icon="📖"><p>胡田昌彦『Windowsインフラ管理者入門』（カットシステム、2014年）第3章「TCP/IPとプロトコル」・第5章「インターネット接続トラブルシューティング」。本文・図の転載ではなく、著者の問いから順に考える解説を動画向けに再構成。</p></Callout><p><a href="https://www.rfc-editor.org/rfc/rfc1918" target="_blank" rel="noreferrer">RFC 1918 · プライベートIPv4 ↗</a> <a href="https://www.rfc-editor.org/rfc/rfc5737" target="_blank" rel="noreferrer">RFC 5737 · 文書用IPv4 ↗</a></p></Slide> }
]
