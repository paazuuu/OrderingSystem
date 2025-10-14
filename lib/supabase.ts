import { createClient, SupabaseClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

let supabase: SupabaseClient | null = null;

export const initializeSupabase = async (url: string, anonKey: string) => {
  try {
    supabase = createClient(url, anonKey);
    
    // 設定を保存
    await AsyncStorage.setItem('supabase_url', url);
    await AsyncStorage.setItem('supabase_anon_key', anonKey);
    
    return supabase;
  } catch (error) {
    console.error('Supabase initialization error:', error);
    throw error;
  }
};

export const getSupabase = () => {
  return supabase;
};

export const clearSupabaseConfig = async () => {
  supabase = null;
  await AsyncStorage.removeItem('supabase_url');
  await AsyncStorage.removeItem('supabase_anon_key');
};

export const loadSupabaseConfig = async () => {
  try {
    const url = await AsyncStorage.getItem('supabase_url');
    const anonKey = await AsyncStorage.getItem('supabase_anon_key');
    
    if (url && anonKey) {
      return await initializeSupabase(url, anonKey);
    }
    return null;
  } catch (error) {
    console.error('Failed to load Supabase config:', error);
    return null;
  }
};

export const isSupabaseConfigured = async () => {
  const url = await AsyncStorage.getItem('supabase_url');
  const anonKey = await AsyncStorage.getItem('supabase_anon_key');
  return !!(url && anonKey);
};