# Excel 関数総選挙 (Next.js & Vercel Postgres デモ)

このプロジェクトは、Vercel Postgres (Hobby プラン) と Next.js 15 を使用した、シンプルかつ視覚的に優れた投票アプリです。

## 🚀 デプロイ手順

このアプリを自分の Vercel アカウントで動かすには、以下の手順に従ってください。

### 1. Vercel へのデプロイ
1. このコードを GitHub リポジトリにプッシュします。
2. Vercel ダッシュボードで [Add New Project] を選択し、リポジトリをインポートします。
3. デプロイ設定はそのままで [Deploy] をクリックします。

### 2. Vercel Postgres のセットアップ
1. Vercel プロジェクトのダッシュボードで [Storage] タブをクリックします。
2. [Create Database] -> [Postgres] を選択します。
3. リージョンを選択して [Create] をクリックします。
4. [Connect] をクリックして、データベースの環境変数をプロジェクトに連携させます。
5. プロジェクトを再デプロイするか、ローカルで `vercel pull` を実行して環境変数を取得します。

## 🛠 技術的バックグラウンド

### 1. 動作の仕組み
- **Next.js App Router**: サーバーコンポーネント (`page.tsx`) で初期データを直接 Postgres から取得し、クライアントコンポーネント (`VoteList.tsx`) でアニメーションとユーザー操作を処理します。
- **Server Actions**: 投票ボタンをクリックすると、`app/actions.ts` で定義されたサーバー側の関数が直接呼び出されます。API エンドポイントを個別に作成する必要はありません。
- **@vercel/postgres**: Vercel が提供する SDK を使用して、SQL 経由でデータベースを操作します。

### 2. 制約と注意点 (Hobby プラン)
- **接続数**: Hobby プランでは同時接続数に制限があります。
- **コールドスタート**: しばらくアクセスがない場合、データベースの起動に数秒かかることがあります（アプリ側でローディングやエラー処理が必要です）。
- **ストレージ容量**: 256MB までのデータ保存が可能です。

### 3. 最適化のポイント
- **Optimistic Updates**: `useOptimistic` フックを使用することで、サーバーのレスポンスを待たずに画面上のカウントを即座に更新し、ユーザーにストレスのない体験を提供しています。
- **Revalidation**: 投票完了後に `revalidatePath('/')` を呼び出すことで、キャッシュを無効化し、最新の投票結果を全ユーザーに共有します。

## 📝 SQL スキーマ
アプリ内で自動的に実行されますが、手動で作成する場合は以下の通りです。

```sql
CREATE TABLE votes (
  id SERIAL PRIMARY KEY,
  option TEXT UNIQUE NOT NULL,
  count INTEGER DEFAULT 0
);

INSERT INTO votes (option, count) VALUES ('VLOOKUP関数', 0);
INSERT INTO votes (option, count) VALUES ('XLOOKUP関数', 0);
INSERT INTO votes (option, count) VALUES ('INDEX/MATCH関数', 0);
```
