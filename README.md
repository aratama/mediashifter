# MediaShifter - 動画変換アプリ

MediaShifterは、ブラウザ上で動画ファイルを様々な形式に変換できるWebアプリケーションです。

## 🌐 デモサイト

https://aratama.github.io/mediashifter/

## ✨ 機能

- **動画形式変換**: 動画ファイルを以下の形式に変換できます
  
  **アニメーション形式**:
  - GIFアニメーション
  
  **動画形式**:
  - H.264 (MP4) - 最も一般的な動画形式
  - H.265/HEVC (MP4) - 高効率動画圧縮
  - VP8 (WebM) - オープンソース動画コーデック
  - VP9 (WebM) - VP8の後継、高品質圧縮
  - AV1 (MP4) - 次世代動画コーデック（MP4コンテナ）
  - AV1 (WebM) - 次世代動画コーデック（WebMコンテナ）
  
  **音声形式**:
  - AAC (MP4) - 高品質音声圧縮
  - MP3 - 最も普及している音声形式
  - Opus (WebM) - 低遅延・高品質音声
  - Vorbis (Ogg) - オープンソース音声コーデック
  - FLAC - 可逆圧縮音声形式
  - PCM (WAV) - 非圧縮音声
  - WAV - Windows標準音声形式
  - OGG - オープンソースコンテナ
  - ADTS - AAC音声ストリーム

- **カスタマイズ可能な設定**:
  - 解像度の変更（幅・高さ）
  - ビットレートの調整
  - フレームレート設定（GIF用）
  - 品質設定（GIF用）
  - アスペクト比の維持

- **リアルタイムプレビュー**: 変換前後の動画をプレビュー表示
- **進捗表示**: 変換処理の進捗をリアルタイムで表示
- **ダウンロード機能**: 変換後のファイルを直接ダウンロード

## 🚀 使い方

1. **ファイル選択**: 「ファイルを選択」ボタンをクリックして動画ファイルを選択
2. **設定調整**: 変換形式、解像度、ビットレートなどを設定
3. **変換実行**: 「変換開始」ボタンをクリックして変換を開始
4. **ダウンロード**: 変換完了後、「ダウンロード」ボタンで変換済みファイルを保存

## 🛠️ 技術仕様

- **フレームワーク**: Next.js 15.5.3 (React 19.1.0)
- **スタイリング**: Tailwind CSS
- **動画処理**: 
  - gif.js（GIF変換）
  - mediabunny（動画処理ライブラリ）
- **言語**: TypeScript

## 📋 対応ブラウザ

- すべてのモダンブラウザ

## 🔧 開発環境のセットアップ

### 前提条件

- Node.js 18以上
- npm、yarn、pnpm、またはbun

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/aratama/mediashifter.git
cd mediashifter

# 依存関係をインストール
npm install
# または
yarn install
# または
pnpm install
# または
bun install
```

### 開発サーバーの起動

```bash
npm run dev
# または
yarn dev
# または
pnpm dev
# または
bun dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いて確認してください。

### ビルド

```bash
npm run build
# または
yarn build
# または
pnpm build
# または
bun build
```

## 📝 注意事項

- 大きなファイルや高解像度の動画は変換に時間がかかる場合があります
- 長時間の動画をGIFに変換する場合、ファイルサイズが非常に大きくなる可能性があります

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 🔗 関連リンク

- [Next.js Documentation](https://nextjs.org/docs)
- [gif.js](https://github.com/jnordberg/gif.js)
- [mediabunny](https://github.com/ThaUnknown/mediabunny)
