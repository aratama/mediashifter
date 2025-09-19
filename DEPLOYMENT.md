# GitHub Pages デプロイメント設定

このプロジェクトはGitHub Pagesに静的サイトとして自動デプロイされるように設定されています。

## 設定内容

### 1. Next.js設定 (`next.config.ts`)
- `output: 'export'` - 静的エクスポートを有効化
- `trailingSlash: true` - URLの末尾にスラッシュを追加
- `images: { unoptimized: true }` - 画像最適化を無効化（静的エクスポート用）
- `basePath` と `assetPrefix` - GitHub Pagesのサブパス対応

### 2. GitHub Actions ワークフロー (`.github/workflows/deploy.yml`)
- `main` ブランチへのプッシュ時に自動デプロイ
- Node.js 18を使用
- 依存関係のインストール、ビルド、デプロイを自動実行

### 3. ビルドスクリプト
- `npm run build` - 本番用ビルドを実行
- `npm run export` - ビルドとエクスポートを同時実行

## デプロイ手順

1. **GitHub Pagesを有効化**
   - GitHubリポジトリの Settings > Pages
   - Source を "GitHub Actions" に設定

2. **コードをプッシュ**
   ```bash
   git add .
   git commit -m "Setup GitHub Pages deployment"
   git push origin main
   ```

3. **デプロイ確認**
   - GitHub Actions タブでワークフローの実行状況を確認
   - デプロイ完了後、`https://aratama.github.io/mediashifter/` でアクセス可能

## ローカルでのテスト

```bash
# 静的ビルドをテスト
npm run build

# 生成されたファイルを確認
ls -la out/
```

## 注意事項

- 本番環境では `/mediashifter` のサブパスが追加されます
- 開発環境では通常通り `npm run dev` で動作します
- 画像やアセットは最適化されずに配信されます（静的エクスポートの制限）
