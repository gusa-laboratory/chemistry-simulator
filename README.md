# 化学シミュレーター｜Interactive Lab

高校／IB化学の授業投影用インタラクティブ教材。スライダーやドラッグで動かすと、グラフ・数値・粒子モデル・3D構造が同時に変化する。各シミュレーターは**単一HTML・依存ライブラリの外部読み込みなし**で、ブラウザで開くだけ・オフラインでも動く。PC／タブレット／スマホのブラウザに対応（レスポンシブ）。

## 収録

| ファイル | 内容 |
|---|---|
| [`index.html`](index.html) | ハブ（入口）。3つのシミュレーターへのリンク |
| [`crystals.html`](crystals.html) | **結晶格子**（6タブ）: 体心立方(BCC)／面心立方(FCC)／六方最密(HCP)／ダイヤモンド構造／NaCl 型／CsCl 型。単位格子で「切り取った」本物の3D断面（頂点＝1/8球・面＝半球）、充填率、ダイヤの4分割による1辺の導出、イオン結晶の限界半径比まで |
| [`gas-laws.html`](gas-laws.html) | **気体の法則**（8タブ）: ボイル／シャルル／ゲイリュサック／理想気体／ボイル＋蒸気圧／シャルル＋蒸気圧／圧縮係数 Z–P（van der Waals）／ゲイリュサック＋蒸気圧 |
| [`solutions.html`](solutions.html) | **希薄溶液・コロイド**（7タブ）: 蒸気圧降下・沸点上昇／凝固点降下／浸透圧／疎水コロイド（DLVO・凝析）／電気泳動／親水コロイド（塩析）／保護コロイド |

物理の要点・設計判断は Notion「化学シミュレーター教材（希薄溶液・気体の法則）開発ログ」を正本とする。

## ローカルで動かす

各HTMLはブラウザで直接開いても動くが、相対リンク（ハブ↔各ページ）を含むためローカルHTTPサーバー経由が安全。

```bash
python -m http.server 8137
# → http://localhost:8137/
```

（このリポジトリを含む作業環境では `.claude/launch.json` の `chemistry-simulator` を preview_start で起動できる。）

## GitHub Pages で公開

1. このフォルダを独立リポジトリとして push。
2. GitHub の Settings → Pages で `main` ブランチ／ルートを公開元に設定。
3. 公開URL（`https://<user>.github.io/chemistry-simulator/`）を開く。
   - 公開中: <https://gusa-laboratory.github.io/chemistry-simulator/>

`.nojekyll` を置いているので Jekyll 処理はスキップされる。ファイル追加・変更は push すればそのまま反映される（キャッシュ版管理は不要）。

## 技術メモ

- **共通アーキテクチャ（2Dグラフ系）**: SVG を `innerHTML` にテンプレートリテラルで文字列生成→`input` イベントで全再描画。決定的疑似乱数（LCG・seed固定）で粒子配置が再描画で飛ばない。共通部品 `frame()` / `polyline` / `attachHover()` / `setReadout()`。
- **結晶格子（3D）**: three.js（r128）＋ OrbitControls を**HTMLにインライン埋め込み**（CDN不要・オフライン可）。原子球を単位格子の面でクリッピング（頂点1/8球・面半球）し、各面にキャップ円盤を貼って平らな断面を作る。
- **全画面授業モード**（`requestFullscreen` → `body.is-fullscreen` でレイアウト組み替え）、2Dグラフ⇄粒子モデルのスワップを装備。
- **レスポンシブ**: 各ページ `@media` でタブレット／スマホに対応（ヘッダー圧縮、全画面ボタンのアイコン化、タブ・操作ボタンの小型化、模式図の高さ制限、3D はタッチ回転対応）。
- **配布物**: 各シミュレーターHTML＋ハブ `index.html`＋`icons/icon-192.png`（favicon）。※PWA（Service Worker・manifest・インストール導線）は方針変更により撤去済み。
