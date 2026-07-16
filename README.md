# 化学シミュレーター｜Interactive Lab

高校／IB化学の授業投影用インタラクティブ教材（PWA）。スライダーを動かすとグラフ・数値・粒子モデルが同時に変化する。単一HTML＋素のJS＋SVG文字列生成、依存ライブラリなし・オフライン動作。

## 収録

| ファイル | 内容 |
|---|---|
| [`index.html`](index.html) | ハブ（入口）。2つのシミュレーターへのリンク＋PWAインストール導線 |
| [`gas-laws.html`](gas-laws.html) | **気体の法則**（8タブ）: ボイル／シャルル／ゲイリュサック／理想気体／ボイル＋蒸気圧／シャルル＋蒸気圧／圧縮係数 Z–P（van der Waals）／ゲイリュサック＋蒸気圧 |
| [`solutions.html`](solutions.html) | **希薄溶液・コロイド**（7タブ）: 蒸気圧降下・沸点上昇／凝固点降下／浸透圧／疎水コロイド（DLVO・凝析）／電気泳動／親水コロイド（塩析）／保護コロイド |

物理の要点・設計判断は Notion「化学シミュレーター教材（希薄溶液・気体の法則）開発ログ」を正本とする。

## ローカルで動かす

Service Worker は `file://` では動かないため、ローカルHTTPサーバー経由で開く。

```bash
python -m http.server 8137
# → http://localhost:8137/
```

（このリポジトリを含む作業環境では `.claude/launch.json` の `chemistry-simulator` を preview_start で起動できる。）

## PWA

- `manifest.webmanifest` ＋ `sw.js`（cache-first でアプリシェルをプリキャッシュ）＋ `icons/`。
- **⚠️ HTML/JS/アイコンを変更したら `sw.js` の `CACHE`（現 `chem-sim-v1`）のバージョンを必ず上げる。** 上げ忘れると利用者端末に旧版が残り続ける。

## GitHub Pages で公開

1. このフォルダを独立リポジトリとして push（`git init` 済み）。
2. GitHub の Settings → Pages で `main` ブランチ／ルートを公開元に設定。
3. 公開URL（`https://<user>.github.io/chemistry-simulator/`）を開くとインストール可能になる。

`.nojekyll` を置いているので Jekyll 処理はスキップされる。

## 技術メモ

- 共通アーキテクチャ: SVGは `innerHTML` にテンプレートリテラルで文字列生成→`input` イベントで全再描画。決定的疑似乱数（LCG・seed固定）で粒子配置が再描画で飛ばない。共通部品 `frame()` / `polyline` / `attachHover()` / `setReadout()`。
- 全画面授業モード（`requestFullscreen` → `body.is-fullscreen` でレイアウト組み替え）、グラフ⇄粒子モデルのスワップを装備。
