# 自己紹介サイト

白と茶色をベースにした静的な自己紹介サイトです。プロフィール紹介、クイズ、SNSリンクで構成されています。。

## ローカルでの確認方法

```bash
python3 -m http.server 8000
```

ブラウザで <http://localhost:8000> を開き、`index.html` を表示してください。

## Render へのデプロイ

Render の Static Site としてデプロイできます。リポジトリに含まれている `render.yaml` を利用すると、自動で設定が読み込まれます。

1. Render ダッシュボードで **New +** → **Blueprint** を選択します。
2. このリポジトリを接続し、サービス名を設定します。
3. `render.yaml` により `env: static` のウェブサービスが作成され、ビルドコマンドなしでリポジトリのルート (`.`) が公開されます。
4. デプロイが完了すると、`index.html` がトップページとして公開されます。

既存のサービスへ適用する場合は、Render のサービス設定で以下の値を手動で設定してください。

- **Environment:** Static Site
- **Build Command:** *(空欄)*
- **Publish Directory:** `.`

必要に応じて独自ドメインやリダイレクト設定を追加してください。
