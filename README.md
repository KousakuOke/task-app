# タスク管理ツール
taskapp

## 制作背景

アプリケーション開発自体が初めての経験だったため、まず要件定義・設計・実装・テスト・デプロイまでの全体の流れを把握することを目的として本アプリを制作しました。  
バックエンド・フロントエンド・インフラまでを一人で担当し、実際のWeb開発の流れを体系的に学ぶことができました。

## 概要

個人のタスク・プロジェクトを一元管理するWebアプリケーションです。  
JWT認証を用いたREST APIをバックエンドに持ち、Reactによるシングルページアプリケーションとして実装しました。

## デモ

- **URL**：https://task-app-pied-one.vercel.app

> 無料プランのため、初回アクセス時に起動まで数秒かかる場合があります。

---

## 技術スタック

### バックエンド

| 技術 | バージョン | 用途 |
|------|-----------|------|
| Java | 21 | 実装言語 |
| Spring Boot | 4.1.0 | Webフレームワーク |
| Spring Security | 6.x | 認証・認可 |
| Spring Data JPA | 3.x | DBアクセス |
| Hibernate | 7.4.1 | ORM |
| MySQL | 8.x | データベース |
| jjwt | 0.11.5 | JWT認証 |
| Lombok | 最新 | ボイラープレート削減 |
| JUnit5 | 5.x | 単体テスト |
| Mockito | 5.x | モックテスト |

### フロントエンド

| 技術 | バージョン | 用途 |
|------|-----------|------|
| React | 19.x | UIフレームワーク |
| Vite | 8.x | ビルドツール |
| Tailwind CSS | 4.x | スタイリング |
| Axios | 最新 | HTTPクライアント |
| Zustand | 最新 | 状態管理 |
| React Router | 7.x | ルーティング |
| FullCalendar | 最新 | カレンダー表示 |

### インフラ

| サービス | 用途 |
|---------|------|
| Vercel | フロントエンドホスティング |
| Railway | バックエンドホスティング |
| Railway MySQL | データベース |
| GitHub | ソースコード管理 |

---

## 機能一覧

### 認証機能
- ユーザー登録・ログイン・ログアウト
- JWT（JSON Web Token）による認証
- トークンの自動更新（401エラー時に自動ログアウト）

### タスク機能
- タスクの作成・編集・削除
- タスク名・期日・メモ・タグ・プロジェクトの設定
- 作成日順・期日順・タグ順での並び替え（バックエンドでソート）
- 今日期日・直近のタスク一覧表示

### プロジェクト機能
- プロジェクトの作成・編集・削除
- タスクとプロジェクトの紐付け・切り離し
- 完了タグのタスク数に基づく進捗度の自動計算
- 作成日順・期日順・進捗度順での並び替え

### タグ機能
- タグの作成・編集・削除
- カラーピッカーによる色のカスタマイズ
- タスク詳細画面からワンクリックでタグ変更
- 新規ユーザー登録時にデフォルトタグ（未着手・作業中・完了）を自動作成

### カレンダー機能
- タスクの期日をカレンダーで表示
- 日付クリックでその日のタスク一覧を表示
- タグカラーに連動したイベント色

### アカウント機能
- ユーザー名・メールアドレス・パスワードの更新

---

## システム構成

```
React（Vercel）
    ↓ HTTPS
Spring Boot（Railway）
    ↓ 内部ネットワーク
MySQL（Railway）
```

### アーキテクチャ

```
Controller → Service → Repository → DB
```

| 層 | 役割 |
|----|------|
| Controller | HTTPリクエストの受け取り・レスポンスの返却 |
| Service | ビジネスロジック・トランザクション管理 |
| Repository | DBとのやりとり（JPQL・JOIN FETCH） |
| DTO | リクエスト・レスポンスのデータ変換 |
| Security | JWT認証・CORS・Spring Security設定 |

---

## DB設計

```
users（ユーザー）
  ├── tags（タグ）
  ├── projects（プロジェクト）
  └── tasks（タスク）
        ├── tag_id（FK）
        └── project_id（FK）
```

---

## API一覧

| メソッド | エンドポイント | 説明 | 認証 |
|---------|--------------|------|------|
| POST | /api/auth/register | ユーザー登録 | 不要 |
| POST | /api/auth/login | ログイン | 不要 |
| GET | /api/tasks | タスク一覧（ソート対応） | 必要 |
| POST | /api/tasks | タスク作成 | 必要 |
| PUT | /api/tasks/{id} | タスク更新 | 必要 |
| DELETE | /api/tasks/{id} | タスク削除 | 必要 |
| GET | /api/tasks/today | 今日期日のタスク | 必要 |
| GET | /api/tasks/upcoming | 直近のタスク | 必要 |
| GET | /api/projects | プロジェクト一覧 | 必要 |
| POST | /api/projects | プロジェクト作成 | 必要 |
| PUT | /api/projects/{id} | プロジェクト更新 | 必要 |
| DELETE | /api/projects/{id} | プロジェクト削除 | 必要 |
| GET | /api/tags | タグ一覧 | 必要 |
| POST | /api/tags | タグ作成 | 必要 |
| PUT | /api/tags/{id} | タグ更新 | 必要 |
| DELETE | /api/tags/{id} | タグ削除 | 必要 |
| PUT | /api/account | アカウント更新 | 必要 |

---

## テスト

```
単体テスト（Mockito）
  → TaskServiceTest：タスク操作のビジネスロジック検証
  → AuthServiceTest：認証ロジック・パスワード暗号化検証

統合テスト（MockMvc）
  → TaskControllerTest：タスクAPIのエンドツーエンド検証
```

---

## リポジトリ構成

```
task-app/
  ├── backend/    # Spring Boot（Java）
  └── frontend/   # React（Vite）
```

- **GitHub**：https://github.com/KousakuOke/task-app

---

## セットアップ（ローカル）

### 必要な環境
- Java 21以上
- MySQL 8.0以上
- Node.js 18以上

### バックエンド

```bash
# リポジトリをクローン
git clone https://github.com/KousakuOke/task-app.git
cd task-app/backend

# 設定ファイルを作成
cp src/main/resources/application.properties.example \
   src/main/resources/application-local.properties

# application-local.properties を編集
# spring.datasource.url=jdbc:mysql://localhost:3306/taskapp
# spring.datasource.username=your_username
# spring.datasource.password=your_password
# jwt.secret=your_secret_key

# DBを作成
mysql -u root -p -e "CREATE DATABASE taskapp;"

# テーブルを作成
mysql -u root -p taskapp

-- 以下のSQLを実行してください
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tags (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    color VARCHAR(7) DEFAULT '#8b5cf6',
    user_id BIGINT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE projects (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    deadline DATE,
    memo TEXT,
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE tasks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    deadline DATE,
    memo TEXT,
    user_id BIGINT NOT NULL,
    tag_id BIGINT,
    project_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE SET NULL,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL
);


# 起動
./mvnw spring-boot:run
```

### フロントエンド

```bash
cd task-app/frontend
npm install
npm run dev
```

### ブラウザでアクセス

```
http://localhost:5173
```

---

## 工夫した点

### N+1問題の解消
JPAの遅延読み込みによるN+1問題を、`@Query`アノテーションと`JOIN FETCH`を用いて解消しました。タスク取得時にタグ・プロジェクト情報を1回のSQLで取得します。

### JWT認証
セッションを使用しないSTATELESS構成を採用し、JWTトークンによる認証を実装しました。フィルターチェーンにJwtFilterを組み込み、リクエストのたびにトークンを検証します。

### 例外の一元管理
`@RestControllerAdvice`を用いたGlobalExceptionHandlerにより、バリデーションエラー・認可エラー・リソース未検出エラーを適切なHTTPステータスコードとともに返却します。

### 環境変数による機密情報管理
DBパスワード・JWT秘密鍵などの機密情報は環境変数で管理し、GitHubには上げない設計にしています。
