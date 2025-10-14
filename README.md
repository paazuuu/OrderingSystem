# Ordering_System

## Supabase設定

このプロジェクトはSupabaseを使用してデータベース機能を提供しています。

### 現在の設定

- **Project URL**: `https://txbrrqdebofybvmgrwcq.supabase.co`
- **Anon Public Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4YnJycWRlYm9meWJ2bWdyd2NxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0MzY4NjgsImV4cCI6MjA3NjAxMjg2OH0.tn8Zi6-0XlmvlIIy5yjA-RQFLGcXcKguPmjYCYX2XUw`

### Supabase設定を変更する方法

Supabaseの接続先を変更したい場合は、以下のファイルを編集してください：

**ファイル**: `lib/supabase.ts`

```typescript
// この部分の値を変更してください
const SUPABASE_URL = 'https://your-project-id.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key-here';
```

### 変更手順

1. `lib/supabase.ts` ファイルを開く
2. `SUPABASE_URL` の値を新しいProject URLに変更
3. `SUPABASE_ANON_KEY` の値を新しいAnon Public Keyに変更
4. ファイルを保存
5. アプリを再起動

### 注意事項

- 設定はアプリ内に埋め込まれているため、変更後は必ずアプリの再ビルドが必要です
- Anon Keyは公開されても安全なキーですが、Service Role Keyは絶対にクライアントサイドのコードに含めないでください
