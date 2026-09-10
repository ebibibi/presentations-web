/* eslint-disable react-refresh/only-export-components */
import type { ReactNode } from 'react'
import { CalendarClock, Network, ScanSearch, ShieldAlert, ShieldCheck, Wrench } from 'lucide-react'
import { LogoMark } from '../../../src/deck-shared'
import type { SlideModule } from '../../../src/types'
import './styles.css'

const SOURCES: Record<string, { href: string; label: string }> = {
  "post": {
    "href": "https://techcommunity.microsoft.com/blog/windows-itpro-blog/retiring-ntlm-frequently-asked-questions/4550522",
    "label": "Retiring NTLM: Frequently asked questions"
  },
  "roadmap": {
    "href": "https://techcommunity.microsoft.com/blog/windows-itpro-blog/advancing-windows-security-disabling-ntlm-by-default/4489526",
    "label": "Advancing Windows security: Disabling NTLM by default"
  },
  "insider": {
    "href": "https://techcommunity.microsoft.com/blog/windows-itpro-blog/reducing-ntlm-dependency-iakerb-and-localkdc-in-windows-insider-preview/4524615",
    "label": "IAKerb and LocalKDC in Windows Insider Preview"
  },
  "spn": {
    "href": "https://learn.microsoft.com/troubleshoot/windows-server/windows-security/kerberos-authentication-troubleshooting-guidance",
    "label": "Kerberos authentication troubleshooting guidance"
  },
  "kerbip": {
    "href": "https://learn.microsoft.com/windows-server/security/kerberos/configuring-kerberos-over-ip",
    "label": "Configuring Kerberos for IP Address"
  },
  "auditing": {
    "href": "https://support.microsoft.com/servicing/os/windows/2025/07/overview-of-ntlm-auditing-enhancements-in-windows-11-version-24h2-and-windows-server-2025",
    "label": "Overview of NTLM auditing enhancements"
  },
  "ntlmv1": {
    "href": "https://support.microsoft.com/servicing/os/windows/docs/2025/08/upcoming-changes-to-ntlmv1-in-windows-11-version-24h2-and-windows-server-2025",
    "label": "Upcoming changes to NTLMv1"
  },
  "klist": {
    "href": "https://learn.microsoft.com/windows-server/administration/windows-commands/klist",
    "label": "klist コマンド"
  },
  "messagecenter": {
    "href": "https://learn.microsoft.com/windows/release-health/windows-message-center",
    "label": "Windows message center"
  }
}

const SECTIONS: Record<string, { label: string; tone: string }> = {
  "strategy": {
    "label": "戦略・時期・ロードマップ",
    "tone": "indigo"
  },
  "kerberos": {
    "label": "NTLMを置き換えるKerberos強化",
    "tone": "cyan"
  },
  "scope": {
    "label": "影響範囲と互換性",
    "tone": "amber"
  },
  "audit": {
    "label": "監査・可視化",
    "tone": "violet"
  },
  "today": {
    "label": "今日からできること",
    "tone": "green"
  },
  "support": {
    "label": "サポートと問い合わせ",
    "tone": "slate"
  }
}

type QaItem = {
  id: string
  section: string
  question: string
  verdict: string
  answer: string
  points: string[]
  source: string
}

const QA: QaItem[] = [
  {
    "id": "what-is-ntlmless",
    "section": "strategy",
    "question": "「NTLMless」とは何ですか？",
    "verdict": "機能ではなく方針",
    "answer": "既定のフォールバック先からNTLMを外し、Kerberosの守備範囲を広げていく多段階の取り組みです。",
    "points": [
      "単一の機能でも1つのポリシーでもない。Windowsの認証の既定値を作り直すプラットフォーム移行として進む",
      "歴史的にNTLMを使わざるを得なかったシナリオを、Kerberos側で賄えるようにするのが中身",
      "向かう先は「既定で無効」→「任意」→「最終的にNTLM不要」"
    ],
    "source": "post"
  },
  {
    "id": "why-now",
    "section": "strategy",
    "question": "なぜ今なのですか？",
    "verdict": "実被害が続いている",
    "answer": "NTLMは非推奨で新機能開発も止まっており、いまも侵害の主要経路であり続けているからです。",
    "points": [
      "暗号が弱く、相互認証がない",
      "資格情報リレーとpass-the-hashの主要な攻撃ベクトルで、現実の侵害を生み続けている",
      "現代のID標準、および耐量子計算機暗号（PQC）への備えとも足並みをそろえる"
    ],
    "source": "post"
  },
  {
    "id": "removed-or-disabled",
    "section": "strategy",
    "question": "NTLMは削除されるのですか、無効化されるだけですか？",
    "verdict": "まずは無効化",
    "answer": "既定で無効になるだけで、コード自体は当面Windowsに残ります。",
    "points": [
      "既定無効化の後もしばらくはコードが残り、例外的なシナリオのために管理者がポリシーで再有効化できる",
      "完全な削除は長期目標。既知の依存が解消され、Kerberosへの移行経路が広く整ってから"
    ],
    "source": "post"
  },
  {
    "id": "when-disabled",
    "section": "strategy",
    "question": "既定で無効になるのはいつですか？",
    "verdict": "次期メジャー",
    "answer": "現時点の目標は、サーバーとクライアントの次期メジャーリリースです（変更の可能性あり）。",
    "points": [
      "その手前に、IAKerbとLocalKDC、強化された監査、ブロックポリシーが順に配られる",
      "この方向性自体は2026年初頭に公式ブログで announced 済み"
    ],
    "source": "roadmap"
  },
  {
    "id": "existing-windows",
    "section": "strategy",
    "question": "手元のWindows Server 2019/2022/2025やWindows 10/11でNTLMは止まりますか？",
    "verdict": "いいえ",
    "answer": "既定無効化は将来のリリース系列の話で、市場に出ている版はNTLMをサポートし続けます。",
    "points": [
      "ただしMicrosoftは「今すぐ減らし始めること」を強く推奨している",
      "強化されたNTLM監査とKerberosの改善は、すでにサポート対象のWindowsへ提供されている",
      "つまり「まだ関係ない」ではなく「まだ壊れないうちに調べられる」期間"
    ],
    "source": "post"
  },
  {
    "id": "re-enable",
    "section": "strategy",
    "question": "既定で無効になった後、再有効化できますか？",
    "verdict": "当面は可能",
    "answer": "少なくとも当初は、グループポリシーまたはレジストリで戻せます。",
    "points": [
      "レガシーアプリや例外シナリオを想定した措置",
      "環境が成熟するにつれ、再有効化できる範囲は徐々に狭められていく",
      "長期の目標はNTLMをまったく必要としないWindows"
    ],
    "source": "post"
  },
  {
    "id": "iakerb",
    "section": "kerberos",
    "question": "IAKerbとは何ですか？",
    "verdict": "DCが見えなくてもKerberos",
    "answer": "接続先サーバーが仲介役になり、DCへ直接到達できないクライアントでもKerberos認証を成立させる拡張です。",
    "points": [
      "Initial and Pass-through Authentication using Kerberos の略",
      "ターゲットのサーバーがプロキシとして、クライアントとKDCの間でKerberosメッセージを安全に中継する",
      "効くのはKDCプロキシが想定していなかった領域。マシン間のSMB、スタンドアロンサーバー、そして（LocalKDCと組めば）ドメインKDCが存在しないローカルアカウント認証"
    ],
    "source": "insider"
  },
  {
    "id": "localkdc",
    "section": "kerberos",
    "question": "LocalKDCとは何ですか？",
    "verdict": "ローカル用の小さなKDC",
    "answer": "ローカルアカウント向けにKerberosチケットを発行する、Windows組み込みの軽量KDCです。",
    "points": [
      "ワークグループ、非ドメイン参加、スタンドアロンサーバー、小規模環境、ピアツーピアが対象",
      "「ローカルアカウント＝NTLM」という長年の前提を崩す",
      "ただし企業のドメインアカウント・横展開・リレーはLocalKDCの担当ではない。そちらはIAKerb、SPNとDFSの改善、ブロックポリシー側の仕事"
    ],
    "source": "insider"
  },
  {
    "id": "ga-timing",
    "section": "kerberos",
    "question": "IAKerbとLocalKDCはいつ一般提供されますか？",
    "verdict": "数か月のうち",
    "answer": "現在はWindows Insiderプレビュー。今後数か月でWindows Server 2025とWindows 11向けにGA予定です。",
    "points": [
      "正式なリリース告知は Windows IT Pro Blog と Microsoft Learn で行われる"
    ],
    "source": "insider"
  },
  {
    "id": "spn-ip-crossdomain",
    "section": "kerberos",
    "question": "SPN・IPアドレス・クロスドメインなど、Kerberosが従来こけていた場面はどうなりますか？",
    "verdict": "半分は自分の仕事",
    "answer": "プラットフォームが直すものと、自分の環境でしか直せないものに分かれます。",
    "points": [
      "Microsoftが直す: ドメインベースのDFS名前空間、クロスドメインと信頼なしのシナリオ、ターゲット解決の挙動改善（既定無効化と同じリリースが目標）",
      "自分で直す: SPNの欠落・重複・不正。ここはディレクトリの衛生管理で、どんなプラットフォーム変更でも消えない",
      "手掛かりは `setspn -Q` と `setspn -X`。KDC_ERR_S_PRINCIPAL_UNKNOWN 等の公式トラブルシューティング手順が使える",
      "「既定無効化が来てから」ではなく、今から始めるべき作業"
    ],
    "source": "spn"
  },
  {
    "id": "blocking-policies",
    "section": "kerberos",
    "question": "新しいNTLMブロックポリシーとは何ですか？",
    "verdict": "中央集権化",
    "answer": "散らばっていたNTLMブロックの設定を、ポリシー駆動の中央エンジンへ統合します。",
    "points": [
      "許可／監査／SSOのみブロック／完全ブロック を一貫した操作で選べる",
      "アカウント種別、デバイスの状態、ターゲットの性質、SSOか資格情報かを考慮して判定する",
      "詳細は近く公開予定"
    ],
    "source": "post"
  },
  {
    "id": "what-breaks",
    "section": "scope",
    "question": "NTLMを無効にすると、どのシナリオが壊れますか？",
    "verdict": "4種類",
    "answer": "よくある失敗は大きく4つのパターンに分かれます。",
    "points": [
      "ハードコードされたNTLM: アプリが明示的にNTLMを要求しNegotiateを試さない → Auto-Redirectとアプリ更新で大半は解決",
      "Kerberosの前提不足: SPN欠落・IPアドレス・DCへの到達性なしでKerberosが失敗し、NTLMが拾っていた → IAKerb / LocalKDC / SPN・IP対応で解消",
      "レガシープロトコルや機器の依存: NTLMしか話せないサーバー、組込み機器、サードパーティ製アプライアンス → ベンダー更新が必要",
      "ローカルアカウント等の特殊な認証: 大半はLocalKDCで解決。ローカル対話ログオンなど一部は対象外"
    ],
    "source": "post"
  },
  {
    "id": "windows-only",
    "section": "scope",
    "question": "NTLMを使うのはWindows端末だけですか？",
    "verdict": "主にはそう",
    "answer": "NTLMはWindowsの認証プロトコルですが、非Windowsクライアントも接続先がWindowsならNTLMを使います。",
    "points": [
      "macOS・Linux・Android・iOS・ネットワーク機器が、SMBファイル共有、オンプレExchange、Windows上のWebアプリへ接続する場面",
      "サードパーティ製SMBクライアント、Outlook for Mac、MDM関連で特に多い",
      "Windowsサーバーとの間でKerberosをネゴシエートできれば動き続ける。IAKerbとLocalKDCはその可能性を広げるための施策"
    ],
    "source": "post"
  },
  {
    "id": "trustless-crossdomain",
    "section": "scope",
    "question": "信頼関係のないクロスドメイン認証はどうなりますか？",
    "verdict": "同じリリースで対応",
    "answer": "今日はNTLMが必要なシナリオですが、既定無効化と同じWindowsリリースで手当てされます。",
    "points": [
      "ランサムウェア封じ込めのためにフォレスト間の信頼を張らない運用が実在することを、Microsoftも認識している",
      "信頼なしのクロスドメイン認証をKerberosで成立させるのが目標"
    ],
    "source": "post"
  },
  {
    "id": "ip-auth",
    "section": "scope",
    "question": "IPアドレスでの認証はどうなりますか？",
    "verdict": "待つな",
    "answer": "KerberosはIPアドレスを解さないためNTLMに落ちます。プラットフォームの修正を待たず、今から潰すべき領域です。",
    "points": [
      "① 監査する: 強化されたNTLM監査は「どのプロセスが」IPを使ったかまで出す。それが担当者を割り当てられる作業リストになる",
      "② アプリのハードコードIPを直す: 一貫して最大の塊。接続文字列・設定ファイル・スクリプトをDNS名へ。多くは書き換えではなく設定変更で済む",
      "③ 利用者の習慣を変える: ブックマークやマップドライブの `\\\\10.1.2.30\\share` をやめる。番号ではなく名前",
      "④ どうしても相手を変えられない場合だけ TryIPSPN: クライアントのレジストリ値と `Setspn -s host/<ip.address> <account>` の登録。クライアントごとの設定が必要で、IPは静的リースにする",
      "残るのは本当に手が届かない相手だけ。その小ささが、既定無効化を迎えたときの安全余裕になる"
    ],
    "source": "kerbip"
  },
  {
    "id": "ms-apps",
    "section": "scope",
    "question": "無効化後も、MicrosoftのアプリはNTLMを使い続けますか？",
    "verdict": "いいえ",
    "answer": "Windows純正コンポーネントからハードコードNTLMを洗い出して外す全社的な取り組みが進行中です。",
    "points": [
      "Windows自身が黙ってNTLMを引き戻すことがないようにするため",
      "同時に、純正コンポーネント側もKerberosの恩恵を受けられるようになる"
    ],
    "source": "post"
  },
  {
    "id": "ms-app-list",
    "section": "scope",
    "question": "NTLMに依存しているMicrosoftアプリの一覧は公開されますか？",
    "verdict": "出ない",
    "answer": "公開の予定はありません。Microsoft側の依存はプラットフォーム作業として直す、というのが約束です。",
    "points": [
      "環境にとって重要なのは、自社アプリ・サードパーティ・アプライアンス・サービスの利用実態を自分で洗い出すこと",
      "強化されたNTLM監査は、まさにその作業のために設計されている"
    ],
    "source": "post"
  },
  {
    "id": "find-ntlm",
    "section": "audit",
    "question": "自分の環境のどこでNTLMが使われているか、どう調べますか？",
    "verdict": "強化監査から",
    "answer": "強化されたNTLM監査が出発点です。従来のNTLMイベントログの大幅な拡張版にあたります。",
    "points": [
      "誰が使っているか: アカウント、マシン名、マシンのIP、そしてプロセス",
      "なぜKerberosでなくNTLMになったか: SPN欠落／DCへ到達不能／ローカルアカウント／IPアドレス／ハードコード等の構造化されたフォールバック理由コード",
      "どこで起きているか: 認証の送信元と送信先の両方",
      "プロセス名まで出ることが決定的。「なんとなくNTLMがある」を、担当者を割り当てられる具体的なリストに変える"
    ],
    "source": "auditing"
  },
  {
    "id": "audit-versions",
    "section": "audit",
    "question": "強化されたNTLM監査はどのWindowsバージョンで使えますか？",
    "verdict": "24H2以降",
    "answer": "Windows 11 バージョン25H2および24H2と、Windows Server 2025で利用できます。",
    "points": [
      "Windows Server 2019 と Windows Server 2022 への提供も現在作業中"
    ],
    "source": "auditing"
  },
  {
    "id": "ntlmv1",
    "section": "audit",
    "question": "NTLMv1について、何か変わりますか？",
    "verdict": "すでに変わった",
    "answer": "Windows Server 2025とWindows 11 バージョン24H2で、NTLMv1はブロックされ機能しなくなっています。",
    "points": [
      "関連する変更は最近の更新を通じて順次展開されている",
      "NTLMv1由来の資格情報は、MS-CHAPv2経由でWi-Fi・有線・VPNといった上位プロトコルでも使われている",
      "そのためこれらのシナリオのSSOに影響が出る場合がある"
    ],
    "source": "ntlmv1"
  },
  {
    "id": "my-code",
    "section": "today",
    "question": "自分のコードがNTLMを使っているか、どうすれば分かりますか？",
    "verdict": "静的＋実行時",
    "answer": "コードに何と書いてあるかと、実行時に何が起きているかの両方を見ます。NTLMの多くは意図せず継承されるからです。",
    "points": [
      "明示的なもの: ソースを `NTLM` と `NTLMSSP` で検索する。多くは `Negotiate` に変えるだけの1行修正で済む",
      "事故で使っているもの: ホスト名でなくIPに接続している／SPNが欠落・重複・不正／SSOで足りるのに明示的な資格情報を渡している／KDCに到達できない相手へつないでいる",
      "実行時の確認: NTLM運用ログ、セキュリティイベント4624の認証パッケージ、そしてクライアントでの `klist`",
      "`klist` で期待した相手のチケットが無ければ、その時点で答えは出ている"
    ],
    "source": "klist"
  },
  {
    "id": "where-to-start",
    "section": "today",
    "question": "どこから始めればいいですか？",
    "verdict": "5段階",
    "answer": "早期に取り組んだ組織が実際に回した、現実的な段階アプローチがあります。",
    "points": [
      "監査: クライアント・サーバー・DCで強化監査を有効化し、数週間ぶんのベースラインを取って上位の呼び出し元、多いプロトコル（SMB / RPC / HTTP）、多い理由を把握する",
      "優先順位付け: 端末単位ではなく根本原因（SPN欠落／ハードコードした呼び出し元／レガシー機器）で束ね、まとめて直せる形にする",
      "簡単な勝ちから: SPNの登録、NTLMv1の廃止、NTLM決め打ちスクリプトの置換、効果の大きいワークロードでのIAKerb・LocalKDC試験導入",
      "ブロックの試験: リング方式で、特権アカウントと非クリティカルなサービスから始めて外へ広げる",
      "ベンダーに投げる: サードパーティ製品のハードコードNTLMはISVへケースを起票する"
    ],
    "source": "post"
  },
  {
    "id": "wait-for-ga",
    "section": "today",
    "question": "IAKerbとLocalKDCのGAを待つべきですか？",
    "verdict": "いいえ",
    "answer": "今の市場版Windowsで、監査と是正は今日から始められます。",
    "points": [
      "強化監査はすでに利用可能。SPN登録、Credential Guardの採用、NTLMv1の除去といったKerberos衛生作業も今できる",
      "レガシーアプリの棚卸しは、ほぼ必ず想定より長引く",
      "先に片付けておけば、IAKerbとLocalKDCが広く使えるようになった時点ですぐ採用できる"
    ],
    "source": "post"
  },
  {
    "id": "blockers",
    "section": "today",
    "question": "他の組織が挙げている、いちばん多い詰まりどころは何ですか？",
    "verdict": "上位6つ",
    "answer": "準備状況調査と顧客支援の現場から挙がった、代表的な阻害要因です。",
    "points": [
      "レガシーアプリやサードパーティ機器・アプライアンスが、NTLMをハードコードしているかKerberosに対応していない",
      "依存しているアプリの持ち主に連絡がつかない、あるいは更新が遅い",
      "どこでなぜNTLMが使われているか見えない — 顧客からの単独最大の要望が「レポートと診断」",
      "信頼のないクロスドメインや、非ドメイン参加のシナリオ",
      "互換性リスクと障害への恐怖 — だからこそ段階的ブロック、許可リスト、監査してから強制するモードが要る",
      "時間と人手の制約、他のIT優先事項との競合"
    ],
    "source": "post"
  },
  {
    "id": "success-stories",
    "section": "today",
    "question": "すでにNTLMを減らした、あるいは無くした組織はありますか？",
    "verdict": "ある",
    "answer": "90%超の削減を報告した企業が複数あり、完全にブロックした例も少数あります。",
    "points": [
      "成功例に共通する条件: Windows ServerとWindows 11の最新版で揃っている",
      "強化された監査に投資している",
      "アプリ依存に手を付けるための経営層の後押しがある",
      "一斉切替ではなく、リング方式の段階展開で進めている"
    ],
    "source": "post"
  },
  {
    "id": "feedback",
    "section": "support",
    "question": "NTLM関連の質問やフィードバックはどこへ送りますか？",
    "verdict": "専用アドレス",
    "answer": "ntlm@microsoft.com へ。製品チームがこのエイリアスを監視しています。",
    "points": [
      "Windows ServerまたはWindowsクライアントのバージョン、シナリオやブロッカーの短い説明、強化されたNTLM監査を有効にしているかどうかを添える",
      "繰り返し挙がるテーマは、公開ガイダンスの更新に優先的に反映される"
    ],
    "source": "post"
  },
  {
    "id": "product-bug",
    "section": "support",
    "question": "製品の不具合に見えるKerberos／NTLMの問題に当たったら？",
    "verdict": "ケースを起票",
    "answer": "通常のサポート窓口からMicrosoftサポートケースを開いてください。",
    "points": [
      "サポートが診断情報を収集し、必要に応じてWindows製品グループへエスカレーションする",
      "メールのやり取りではなく、シナリオ・テレメトリ・再現性を正式に追跡するために、サポートチケットの経路が重要"
    ],
    "source": "post"
  },
  {
    "id": "stay-informed",
    "section": "support",
    "question": "今後のNTLM関連の変更を、どう追いかければいいですか？",
    "verdict": "2つの窓口",
    "answer": "Windowsメッセージセンターと、M365管理センターのメッセージセンターを押さえます。",
    "points": [
      "機能の一般提供、既定無効化の日付、バックポートのリリースといった節目は、これらの経路で告知される",
      "MicrosoftとのNDAがあれば、アカウントチームにNTLMLessニュースレターやManagement Advisors Programの情報を確認できる"
    ],
    "source": "messagecenter"
  }
]

export const slides: SlideModule['slides'] = [
  { id: 'opening', render: () => <OpeningSlide /> },
  { id: 'map', render: () => <MapSlide /> },
  // Each QA item's id is the same id its deck.yaml entry uses.
  ...QA.map((item, index) => ({ id: item.id, render: () => <QaSlide index={index} item={item} /> })),
  { id: 'closing', render: () => <ClosingSlide /> },
]

function Src({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} rel="noreferrer" target="_blank">
      {children}
    </a>
  )
}

function Rich({ text }: { text: string }) {
  const parts = text.split('`')
  return (
    <>
      {parts.map((part, index) =>
        index % 2 === 1 ? <code key={index}>{part}</code> : <span key={index}>{part}</span>
      )}
    </>
  )
}

function QaSlide({ index, item }: { index: number; item: QaItem }) {
  const section = SECTIONS[item.section]
  const source = SOURCES[item.source]
  return (
    <section className={`remotion-slide ntlm-slide ntlm-qa is-${section.tone}`}>
      <div className="ntlm-grid" />
      <LogoMark className="ntlm-logo" />
      <header className="ntlm-qa-head">
        <span className="ntlm-section">{section.label}</span>
        <span className="ntlm-count">
          Q{index + 1} <small>/ {QA.length}</small>
        </span>
      </header>
      <h1 className="ntlm-question">
        <span className="ntlm-q-mark">Q</span>
        {item.question}
      </h1>
      <div className="ntlm-qa-body">
        <div className="ntlm-answer">
          <span className="ntlm-verdict">{item.verdict}</span>
          <p>{item.answer}</p>
        </div>
        <ul className="ntlm-points">
          {item.points.map((point) => (
            <li key={point}>
              <Rich text={point} />
            </li>
          ))}
        </ul>
      </div>
      <footer className="ntlm-foot">
        <span>NTLM廃止 公式FAQ</span>
        <Src href={source.href}>{source.label}</Src>
      </footer>
    </section>
  )
}

function OpeningSlide() {
  return (
    <section className="remotion-slide ntlm-slide ntlm-opening">
      <div className="ntlm-grid" />
      <LogoMark className="ntlm-logo" />
      <div className="ntlm-opening-copy">
        <span>WINDOWS AUTHENTICATION</span>
        <h1>
          NTLMは
          <br />
          <em>既定で無効</em>
          になる
        </h1>
        <p>
          1993年から働き続けたNTLMに、Microsoftが退場を告げました。
          公式FAQの28問を、日本語で<strong>1問1枚</strong>に並べ直しています。
          必要なところから読んでください。
        </p>
      </div>
      <div className="ntlm-opening-side">
        <article className="ntlm-open-card is-red">
          <ShieldAlert />
          <strong>削除ではなく既定で無効</strong>
          <small>コードは当面残り、ポリシーで再有効化できる。ただしその窓は徐々に狭まる</small>
        </article>
        <article className="ntlm-open-card is-amber">
          <CalendarClock />
          <strong>次期メジャーリリースが目標</strong>
          <small>今動いているWindows Server 2019/2022/2025やWindows 10/11は止まらない</small>
        </article>
        <article className="ntlm-open-card is-green">
          <ScanSearch />
          <strong>待つ理由はない</strong>
          <small>強化されたNTLM監査は提供済み。棚卸しと是正は今日から始められる</small>
        </article>
      </div>
    </section>
  )
}

function MapSlide() {
  const grouped = Object.entries(SECTIONS).map(([key, section]) => ({
    key,
    label: section.label,
    tone: section.tone,
    items: QA.map((item, index) => ({ item, index })).filter((entry) => entry.item.section === key),
  }))
  return (
    <section className="remotion-slide ntlm-slide ntlm-map">
      <div className="ntlm-grid" />
      <LogoMark className="ntlm-logo" />
      <header className="ntlm-map-head">
        <span>目次</span>
        <h1>
          6つの節に<em>28問</em>
        </h1>
      </header>
      <div className="ntlm-map-body">
        {grouped.map((group) => (
          <article className={`ntlm-map-card is-${group.tone}`} key={group.key}>
            <h2>
              {group.label}
              <small>Q{group.items[0].index + 1}〜Q{group.items[group.items.length - 1].index + 1}</small>
            </h2>
            <ul>
              {group.items.map((entry) => (
                <li key={entry.item.id}>{entry.item.question}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
      <footer className="ntlm-foot">
        <span>NTLM廃止 公式FAQ</span>
        <Src href={SOURCES.post.href}>{SOURCES.post.label}</Src>
      </footer>
    </section>
  )
}

function ClosingSlide() {
  const steps = [
    {
      icon: <ScanSearch />,
      title: '強化されたNTLM監査を入れる',
      body: 'クライアント・サーバー・DCで有効にし、数週間ぶんのベースラインを取る。プロセス名とフォールバック理由まで出るので、そのまま担当者を割り当てられる作業リストになる。',
    },
    {
      icon: <Network />,
      title: 'IPアドレス直打ちを消す',
      body: '接続文字列、設定ファイル、スクリプト、マップドライブ、ブックマーク。DNS名へ寄せる。多くは書き換えではなく設定変更で済む。プラットフォームの修正を待たない。',
    },
    {
      icon: <Wrench />,
      title: 'SPNの衛生管理をやる',
      body: '欠落・重複・不正なSPNはKerberosを失敗させ、NTLMがそれを黙って拾う。setspn -Q / -X で洗い出して直す。ここはMicrosoftには直せない自分の宿題。',
    },
  ]
  return (
    <section className="remotion-slide ntlm-slide ntlm-closing">
      <div className="ntlm-grid" />
      <LogoMark className="ntlm-logo" />
      <header className="ntlm-map-head">
        <span>まとめ</span>
        <h1>
          GAを待たずに<em>今日から</em>始める3つ
        </h1>
      </header>
      <div className="ntlm-closing-body">
        {steps.map((step) => (
          <article key={step.title}>
            {step.icon}
            <div>
              <strong>{step.title}</strong>
              <p>{step.body}</p>
            </div>
          </article>
        ))}
      </div>
      <div className="ntlm-closing-note">
        <ShieldCheck />
        <p>
          既定無効化は将来のリリースの話ですが、<em>棚卸しにかかる時間は今の環境の汚れ具合で決まります</em>。
          レガシーアプリの持ち主探しは、ほぼ必ず想定より長引きます。
        </p>
      </div>
      <footer className="ntlm-foot">
        <span>NTLM廃止 公式FAQ</span>
        <Src href={SOURCES.post.href}>{SOURCES.post.label}</Src>
      </footer>
    </section>
  )
}
