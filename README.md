# MediaShifter - 動画変換アプリ

MediaShifterは、ブラウザ上で動画ファイルを様々な形式に変換できるWebアプリケーションです。

## 🌐 デモサイト

https://aratama.github.io/mediashifter/

## ✨ 機能

- **動画形式変換**: 動画ファイルを以下の形式に変換できます
  - GIFアニメーション
  - H.264 (MP4)
  - VP8 (WebM)
  - VP9 (WebM)

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
  - WebCodecs API（H.264、VP8、VP9変換）
  - gif.js（GIF変換）
  - mediabunny（動画処理ライブラリ）
- **言語**: TypeScript

## 📋 対応ブラウザ

- **GIF変換**: すべてのモダンブラウザ
- **動画変換（H.264、VP8、VP9）**: WebCodecs API対応ブラウザ
  - Chrome 94+
  - Edge 94+
  - Opera 80+

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

- GIF変換は最大10秒の動画に制限されています
- 大きなファイルや高解像度の動画は変換に時間がかかる場合があります
- WebCodecs APIを使用した変換は対応ブラウザでのみ利用可能です

## 🤝 コントリビューション

プルリクエストやイシューの報告を歓迎します。

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 🔗 関連リンク

- [Next.js Documentation](https://nextjs.org/docs)
- [WebCodecs API](https://developer.mozilla.org/en-US/docs/Web/API/WebCodecs_API)
- [gif.js](https://github.com/jnordberg/gif.js)
- [mediabunny](https://github.com/ThaUnknown/mediabunny)
