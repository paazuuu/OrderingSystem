import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Supabase設定（埋め込み）
const SUPABASE_URL = 'https://txbrrqdebofybvmgrwcq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4YnJycWRlYm9meWJ2bWdyd2NxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0MzY4NjgsImV4cCI6MjA3NjAxMjg2OH0.tn8Zi6-0XlmvlIIy5yjA-RQFLGcXcKguPmjYCYX2XUw';

// Supabaseクライアントを初期化
const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const getSupabase = () => {
  return supabase;
};

// 後方互換性のための関数（既存のコードがある場合に備えて）
export const initializeSupabase = async (url?: string, anonKey?: string) => {
  console.warn('initializeSupabase is deprecated. Supabase is now configured with embedded settings.');
  return supabase;
};

export const loadSupabaseConfig = async () => {
  return supabase;
};

export const isSupabaseConfigured = async () => {
  return true;
};

export const clearSupabaseConfig = async () => {
  console.warn('clearSupabaseConfig is no longer needed. Supabase is configured with embedded settings.');
};