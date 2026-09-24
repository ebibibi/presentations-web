import type { SlideModule } from '../../../src/types'
import { Callout, CodeSlide, ComparisonTable, Slide, SlideHeading, TitleSlide, VideoSlide } from '../../../src/slide-kit'
import { NetworkVisual } from '../../network-series/NetworkVisual'

export const slides: SlideModule['slides'] = [
  { id: 'opening', render: ({ frame }) => <TitleSlide frame={frame} kicker="ネットワーク超基礎 · 第3話" heading={'WebサイトのIPは分かった。\nでは、最初の一歩は？'} lead="本の問いを追って、PCとルーターの会話を再現しよう" points={[{ step: '01', heading: 'フレーム', body: '近くの相手へ渡す' }, { step: '02', heading: 'ARP', body: 'そのMACを調べる' }, { step: '03', heading: 'スイッチ', body: '行き先を覚える' }]} /> },
  { id: 'two-labels', render: ({ frame }) => <Slide><SlideHeading frame={frame} kicker="まず封筒を二重に見る" heading="外の宛先IP／家の中の宛先MAC" lead="同じ送信でも、見る相手が違う" /><ComparisonTable frame={frame} columns={[{ label: '内側：IPパケット' }, { label: '外側：LANのフレーム', accent: true }]} rows={[{ label: 'この例の宛先', cells: ['Webサイト 203.0.113.10', '家のルーターのMAC'] }, { label: 'どこまで？', cells: ['ネットワークを越える', 'このリンクの受け渡し'] }]} /><Callout frame={frame} label="二つの住所ではなく二つの役割" icon="📦"><p>PCはWebサイトのMACを知らなくても、まずルーターへフレームを送れる。</p></Callout></Slide> },
  { id: 'next-hop', render: (props) => <NetworkVisual {...props} mode="next-hop" kicker="本の問い①：誰に渡す？" heading="Webサイト宛てを、ルーターに手渡す" lead="宛先IP＝Webサイト ／ この区間の宛先MAC＝ルーター" caption="IPパケットを、LAN上のフレームで運ぶ" note="ひとつの送信に、二種類の宛先。" /> },
  { id: 'arp', render: (props) => <NetworkVisual {...props} mode="broadcast" kicker="本の問い②：MACが分からない" heading="『192.168.1.1 は誰？』を全員へ" lead="IPv4のARP要求は、同じリンクでブロードキャスト" caption="宛先MACが不明なため、まず同じリンクの全員に尋ねる" note="一度覚えたMACは、毎回聞き直さない。" /> },
  { id: 'changing-links', render: (props) => <NetworkVisual {...props} mode="arp" kicker="本の問い③：誰が返す？" heading="該当するIPの機器だけが返答" lead="ルーターのMACを知ったら、PCは宛先欄に書ける" caption="要求は全員へ／返信は通常、問い合わせ元へ" note="返事は通常、質問したPCに直接届く。" /> },
  { id: 'compare', render: (props) => <NetworkVisual {...props} mode="switch" kicker="本の問い④：線をつなぐ箱は？" heading="スイッチは送信元MACから学ぶ" lead="宛先MACのあるポートだけへ、次のフレームを渡す" caption="MAC→ポートの表と、IP→MACのARP表は別物" note="ARP表と、スイッチのMAC表は別物。" /> },
  { id: 'recap', render: ({ frame }) => <CodeSlide frame={frame} kicker="実機で確かめる" heading="自分のPCが覚えた相手を見る" lead="Windowsで、利用中のネットワークを確認してから" caption="PowerShell／コマンドプロンプト" lines={[{ kind: 'prompt', body: 'arp -a' }, { kind: 'output', body: '192.168.1.1    aa-bb-cc-dd-ee-ff' }]}><Callout frame={frame} label="これがIP→MACの表" icon="🔎"><p>値は架空の例。先に通信していなければ表示されない場合もある。実画面を公開するときは実アドレスを隠す。</p></Callout></CodeSlide> },
  { id: 'sources', render: ({ frame }) => <VideoSlide frame={frame} kicker="本の第3章 → 実物へ" heading="ARP・ICMPをWiresharkで追う" lead="原稿の問いを、本物のパケットで検証する" videoId="DKt20AyCinI" caption="無料動画 · 原稿：『Windowsインフラ管理者入門』第3章／仕様：RFC 826" /> }
]
