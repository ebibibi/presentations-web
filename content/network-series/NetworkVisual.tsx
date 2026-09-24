import { interpolate } from 'remotion'
import { DiagramFrame, Slide, SlideHeading } from '../../src/slide-kit'
import type { SlideRenderContext } from '../../src/types'
import './network-visual.css'

type VisualMode = 'route' | 'outage' | 'ip' | 'address-change' | 'next-hop' | 'arp' | 'dns' | 'nat' | 'gateway' | 'broadcast' | 'switch' | 'layers'

type VisualProps = SlideRenderContext & {
  kicker: string
  heading: string
  lead: string
  caption: string
  note: string
  mode: VisualMode
}

const linear = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

/** The same physical drawing is reused across episodes so only one concept changes at a time. */
export function NetworkVisual({ frame, kicker, heading, lead, caption, note, mode }: VisualProps) {
  const external = ['route', 'outage', 'next-hop', 'dns', 'nat', 'gateway', 'layers'].includes(mode)
  const arp = mode === 'arp' || mode === 'broadcast'
  const ip = mode === 'ip' || mode === 'address-change'
  const local = ['switch', 'arp', 'broadcast'].includes(mode)
  const progress = linear(frame, 26, 112)
  const outward = progress < 0.5 ? progress * 2 : 1
  const backward = progress < 0.5 ? 0 : (progress - 0.5) * 2
  const packetX = 150 + outward * (external ? 830 : 370)
  const packetY = 300
  const showReturn = ['route', 'nat'].includes(mode) && frame > 72
  const cut = mode === 'outage' && frame > 65

  return (
    <Slide className="net-slide">
      <SlideHeading frame={frame} kicker={kicker} heading={heading} lead={lead} />
      <DiagramFrame frame={frame} caption={caption} note={note}>
        <svg className="net-diagram" viewBox="0 0 1120 550" role="img" aria-label={caption}>
          <defs>
            <marker id="net-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="9" markerHeight="9" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="#72d8ff" /></marker>
            <marker id="net-return-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="9" markerHeight="9" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="#ffbd6a" /></marker>
          </defs>
          <rect x="40" y="55" width="590" height="435" rx="32" className="net-home" />
          <text x="75" y="110" className="net-zone">自宅のネットワーク（LAN）</text>
          <path d="M190 300 H465" className="net-link net-wifi" />
          <path d="M570 300 H780 V300 H935" className={cut ? 'net-link net-cut' : 'net-link'} style={{ opacity: external ? 1 : .18 }} />
          <path d="M535 350 V415 H265" className="net-link" style={{ opacity: local || ip ? 1 : .15 }} />
          <Node x={135} y={300} symbol="PC" label="手元のPC" />
          <Node x={520} y={300} symbol={mode === 'switch' ? 'SW' : 'GW'} label={mode === 'switch' ? 'スイッチ' : 'Wi-Fi／ルーター'} />
          <Node x={265} y={415} symbol="PH" label="スマホ" muted={!local && !ip} />
          <Node x={780} y={300} symbol="ISP" label="回線事業者" muted={!external} />
          <Node x={980} y={300} symbol="WEB" label="Webサイト" muted={!external} />
          {cut ? <g><path d="M685 277 l38 46 M723 277 l-38 46" className="net-cross" /><text x="615" y="385" className="net-bad">ここで停止</text></g> : null}
          {!cut && frame >= 26 && !['arp', 'broadcast', 'switch', 'dns', 'layers'].includes(mode) ? <g transform={`translate(${packetX} ${packetY})`}><circle className="net-packet" r="21" /><circle r="8" fill="#101f35" /></g> : null}
          {showReturn ? <g><path d="M945 365 H520 V390 H160" className="net-return" markerEnd="url(#net-return-arrow)" style={{ opacity: backward }} /><circle cx={945 - backward * 785} cy={365 + backward * 25} r="15" fill="#ffbd6a" /></g> : null}
          {ip ? <g className="net-labels"><Tag x={52} y={192} text={mode === 'ip' ? '192.168.1.10' : '192.168.1.24'} color="#72d8ff" opacity={linear(frame, 12, 38)} /><Tag x={420} y={192} text="192.168.1.1" color="#72d8ff" opacity={linear(frame, 44, 66)} /><Tag x={915} y={192} text="203.0.113.10" color="#72d8ff" opacity={linear(frame, 78, 101)} /></g> : null}
          {mode === 'next-hop' || mode === 'gateway' ? <g><Tag x={40} y={190} text="宛先IP：203.0.113.10" color="#72d8ff" opacity={linear(frame, 20, 40)} /><Tag x={398} y={192} text={mode === 'gateway' ? '家の外 → ゲートウェイへ' : 'この区間：ルーターのMAC'} color="#ffbd6a" opacity={linear(frame, 58, 78)} /></g> : null}
          {mode === 'dns' ? <g><path d="M180 225 H460" className="net-query" markerEnd="url(#net-arrow)" style={{ opacity: linear(frame, 20, 42) }} /><path d="M460 255 H180" className="net-return" markerEnd="url(#net-return-arrow)" style={{ opacity: linear(frame, 65, 84) }} /><Tag x={145} y={172} text="example.com のIPは？" color="#72d8ff" opacity={linear(frame, 20, 42)} /><Tag x={390} y={390} text="203.0.113.10" color="#ffbd6a" opacity={linear(frame, 65, 84)} /></g> : null}
          {mode === 'nat' ? <g><Tag x={40} y={190} text="送信元：192.168.1.10" color="#72d8ff" opacity={linear(frame, 15, 35)} /><Tag x={620} y={145} text="外では：ルーターの公開IP" color="#ffbd6a" opacity={linear(frame, 56, 78)} /><Tag x={650} y={435} text="戻りは元のPCへ" color="#ffbd6a" opacity={linear(frame, 94, 116)} /></g> : null}
          {mode === 'layers' ? <g><Tag x={48} y={192} text="Wi-Fi → 家の中" color="#72d8ff" opacity={linear(frame, 18, 36)} /><Tag x={453} y={192} text="回線 → 家の外" color="#ffbd6a" opacity={linear(frame, 58, 78)} /></g> : null}
          {mode === 'broadcast' ? <g><path d="M180 240 H435" className="net-query" markerEnd="url(#net-arrow)" style={{ opacity: linear(frame, 20, 45) }} /><path d="M180 330 V405 H225" className="net-query" markerEnd="url(#net-arrow)" style={{ opacity: linear(frame, 42, 65) }} /><Tag x={130} y={180} text="全員へ：誰のIP？" color="#72d8ff" opacity={linear(frame, 20, 42)} /><Tag x={635} y={425} text="答えるのは該当端末だけ" color="#ffbd6a" opacity={linear(frame, 76, 95)} /></g> : null}
          {mode === 'switch' ? <g><path d="M180 240 H440" className="net-query" markerEnd="url(#net-arrow)" style={{ opacity: linear(frame, 20, 42) }} /><Tag x={75} y={180} text="送信元MACを覚える" color="#72d8ff" opacity={linear(frame, 22, 43)} /><Tag x={440} y={185} text="宛先のポートだけへ" color="#ffbd6a" opacity={linear(frame, 75, 100)} /></g> : null}
          {arp && mode === 'arp' ? <g><path d="M180 235 H440" className="net-query" markerEnd="url(#net-arrow)" style={{ opacity: linear(frame, 20, 45) }} /><path d="M440 260 H180" className="net-return" markerEnd="url(#net-return-arrow)" style={{ opacity: linear(frame, 64, 86) }} /><Tag x={255} y={182} text="192.168.1.1 は誰？" color="#72d8ff" opacity={linear(frame, 20, 40)} /><Tag x={260} y={395} text="私のMACは…" color="#ffbd6a" opacity={linear(frame, 64, 86)} /></g> : null}
        </svg>
      </DiagramFrame>
    </Slide>
  )
}

function Node({ x, y, symbol, label, muted = false }: { x: number; y: number; symbol: string; label: string; muted?: boolean }) {
  return <g opacity={muted ? .35 : 1}><rect x={x - 52} y={y - 50} width="104" height="100" rx="23" className="net-node" /><text x={x} y={y + 9} textAnchor="middle" className="net-symbol">{symbol}</text><text x={x} y={y + 86} textAnchor="middle" className="net-node-label">{label}</text></g>
}

function Tag({ x, y, text, color, opacity }: { x: number; y: number; text: string; color: string; opacity: number }) {
  return <g opacity={opacity}><rect x={x} y={y - 27} width={Math.max(170, [...text].reduce((width, character) => width + (character.charCodeAt(0) > 255 ? 24 : 14), 0) + 35)} height="54" rx="12" fill="#142a3c" stroke={color} strokeWidth="2" /><text x={x + 16} y={y + 8} fill={color} className="net-tag">{text}</text></g>
}
