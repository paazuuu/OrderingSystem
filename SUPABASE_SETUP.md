# Supabase設定手順

## 現在の状況

✅ 環境変数の設定完了  
✅ .envファイル作成完了  
✅ Supabaseクライアント設定完了  
⚠️ データベーステーブルの作成が必要

## 必要な手順

### 1. Supabase管理画面でテーブルを作成

Supabase管理画面（https://supabase.com/dashboard）にアクセスして、以下のSQLを実行してください：

#### ステップ1: メインテーブル作成
```sql
-- ファイル: supabase/migrations/20250720135928_falling_term.sql の内容を実行
-- または以下を手動実行：

-- テーブル管理
CREATE TABLE IF NOT EXISTS tables (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  number text NOT NULL,
  seats integer NOT NULL DEFAULT 2,
  status text NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'occupied', 'reserved', 'cleaning')),
  customer_count integer DEFAULT 0,
  order_start_time timestamptz,
  total_amount integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- メニュー項目
CREATE TABLE IF NOT EXISTS menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price integer NOT NULL,
  category text NOT NULL,
  description text DEFAULT '',
  image_url text DEFAULT '',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 注文
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  table_id uuid REFERENCES tables(id) ON DELETE CASCADE,
  menu_item_id uuid REFERENCES menu_items(id),
  quantity integer NOT NULL DEFAULT 1,
  unit_price integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- 注文履歴
CREATE TABLE IF NOT EXISTS order_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  table_number text NOT NULL,
  items jsonb NOT NULL,
  total_amount integer NOT NULL,
  completed_at timestamptz DEFAULT now()
);
```

#### ステップ2: RLS設定（開発環境用）
```sql
-- RLSを有効化
ALTER TABLE tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_history ENABLE ROW LEVEL SECURITY;

-- 匿名ユーザーを含むすべてのユーザーがアクセス可能なポリシーを作成
CREATE POLICY "Allow all access to tables"
  ON tables
  FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all access to menu items"
  ON menu_items
  FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all access to orders"
  ON orders
  FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all access to order history"
  ON order_history
  FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);
```

#### ステップ3: 初期データ投入（オプション）
```sql
-- 初期メニューデータを挿入
INSERT INTO menu_items (name, price, category, description, image_url) VALUES
  ('本日の日替わり定食', 980, '定食', '季節の食材を使った栄養バランスの良い定食', 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=300'),
  ('鶏の唐揚げ定食', 850, '定食', 'ジューシーな鶏の唐揚げ定食', 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=300'),
  ('焼き魚定食', 920, '定食', '新鮮な魚の焼き魚定食', 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=300'),
  ('緑茶', 200, 'ドリンク', '香り豊かな緑茶', 'https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg?auto=compress&cs=tinysrgb&w=300'),
  ('ほうじ茶', 200, 'ドリンク', '香ばしいほうじ茶', 'https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg?auto=compress&cs=tinysrgb&w=300'),
  ('抹茶', 350, 'ドリンク', '本格的な抹茶', 'https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg?auto=compress&cs=tinysrgb&w=300'),
  ('わらび餅', 380, 'デザート', 'もちもちのわらび餅', 'https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg?auto=compress&cs=tinysrgb&w=300'),
  ('みたらし団子', 320, 'デザート', '甘辛いみたらし団子', 'https://images.pexels.com/photos/6880219/pexels-photo-6880219.jpeg?auto=compress&cs=tinysrgb&w=300'),
  ('あんみつ', 450, 'デザート', '和風あんみつ', 'https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg?auto=compress&cs=tinysrgb&w=300')
ON CONFLICT DO NOTHING;

-- 初期テーブルデータを挿入
INSERT INTO tables (number, seats, status) VALUES
  ('T1', 2, 'available'),
  ('T2', 4, 'available'),
  ('T3', 2, 'available'),
  ('T4', 6, 'available'),
  ('T5', 4, 'available'),
  ('T6', 2, 'available'),
  ('T7', 4, 'available'),
  ('T8', 8, 'available')
ON CONFLICT DO NOTHING;
```

### 2. 接続テスト実行

```bash
node test-supabase.js
```

### 3. EXPO GO用の設定

現在の設定:
- ✅ 環境変数: `.env`ファイル
- ✅ Expo設定: `EXPO_PUBLIC_*`プレフィックス使用
- ✅ Supabaseクライント: 環境変数から設定読み込み

### 4. 確認事項

- [ ] Supabaseテーブルが作成されている
- [ ] RLSポリシーが正しく設定されている  
- [ ] `node test-supabase.js`が成功する
- [ ] Expoアプリが正常に起動する

## トラブルシューティング

### テーブルが見つからないエラー
→ Supabase管理画面でSQLを実行してテーブルを作成

### RLSエラー
→ `fix-rls-policy.sql`の内容をSupabase管理画面で実行

### 接続エラー
→ `.env`ファイルのURL・Keyが正しいか確認

## EXPO GO デプロイ手順

1. 上記の設定を完了
2. `npm run dev`でExpoサーバー起動
3. Expo GOアプリでQRコードをスキャン
4. アプリが正常に動作することを確認

## 現在のExpo開発サーバーURL

**Expo開発サーバー**: https://8081-impya18f57v4q92f8kduv-2e77fc33.sandbox.novita.ai

このURLにアクセスして、QRコードをExpo GOアプリでスキャンしてください。