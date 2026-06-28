# Routine Tracker

日々のルーティンを時間ベースで記録・管理するPWAアプリ。

**本番URL**: https://corec7.github.io/routine-tracker/

## 機能

- 目標時間 vs 実績時間の入力方式（達成率70%以上で「達成」判定）
- 英語・Code・運動のカテゴリ別チェックリスト
- 週間スコアボード（平日/週末分割表示）
- 連続達成ストリークカウンター
- X投稿用テキスト自動生成
- Push通知リマインド
- Supabase連携（複数デバイス同期）
- PWA対応（Androidホーム画面に追加でアプリ化）

## 技術構成

React + TypeScript + Vite + vite-plugin-pwa + Supabase

## ローカル開発

```bash
npm install
npm run dev
```

## Supabaseセットアップ手順

### 1. プロジェクト作成

1. https://supabase.com にアクセスし、GitHubアカウントでログイン
2. 「New Project」をクリック
3. 以下を入力して作成:
   - **Name**: `routine-tracker`
   - **Region**: `Northeast Asia (Tokyo)`
   - **Database Password**: 任意のパスワード（控えておく）

### 2. データベーステーブル作成

1. Supabaseダッシュボードの左メニューから **SQL Editor** を開く
2. 「New Query」をクリック
3. `supabase-schema.sql` の内容を貼り付けて **Run** を実行

### 3. APIキー取得

1. 左メニューの **Settings** → **API** を開く
2. 以下の2つの値をコピー:
   - **Project URL** → `https://xxxxx.supabase.co` の形式
   - **anon public** キー → `eyJhbGciOi...` の形式

### 4. GitHub Repository Variablesに登録

1. GitHubリポジトリの **Settings** → **Secrets and variables** → **Actions** を開く
2. **Variables** タブを選択
3. 「New repository variable」で以下を追加:
   - **Name**: `VITE_SUPABASE_URL` / **Value**: コピーしたProject URL
   - **Name**: `VITE_SUPABASE_ANON_KEY` / **Value**: コピーしたanon publicキー
4. pushするか、Actionsから手動で再デプロイすると本番環境に反映される

### 5. ローカル開発用（任意）

プロジェクトルートに `.env` ファイルを作成:

```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
```

> Supabase未接続でもlocalStorageにデータが保存されるため、単一デバイスでの利用は可能です。
