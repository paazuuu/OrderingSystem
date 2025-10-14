import { SupabaseClient } from '@supabase/supabase-js';

export interface Table {
  id: string;
  number: string;
  seats: number;
  status: 'available' | 'occupied';
  customer_count?: number;
  order_start_time?: string;
  total_amount: number;
  created_at?: string;
  updated_at?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  description?: string;
  image_url?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Order {
  id: string;
  table_id?: string;
  menu_item_id?: string;
  quantity: number;
  unit_price: number;
  created_at?: string;
}

export interface OrderHistory {
  id: string;
  table_number: string;
  items: any;
  total_amount: number;
  completed_at?: string;
}

export class DatabaseService {
  constructor(private supabase: SupabaseClient) {}

  // テーブル操作
  async getTables(): Promise<Table[]> {
    const { data, error } = await this.supabase
      .from('tables')
      .select('*')
      .order('number');
    
    if (error) throw error;
    return data || [];
  }

  async createTable(table: Omit<Table, 'id' | 'created_at' | 'updated_at'>): Promise<Table> {
    const { data, error } = await this.supabase
      .from('tables')
      .insert(table)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateTable(id: string, updates: Partial<Table>): Promise<Table> {
    const { data, error } = await this.supabase
      .from('tables')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async deleteTable(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('tables')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // メニュー操作
  async getMenuItems(): Promise<MenuItem[]> {
    const { data, error } = await this.supabase
      .from('menu_items')
      .select('*')
      .eq('is_active', true)
      .order('category', { ascending: true })
      .order('name', { ascending: true });
    
    if (error) throw error;
    return data || [];
  }

  async createMenuItem(item: Omit<MenuItem, 'id' | 'created_at' | 'updated_at'>): Promise<MenuItem> {
    const { data, error } = await this.supabase
      .from('menu_items')
      .insert(item)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateMenuItem(id: string, updates: Partial<MenuItem>): Promise<MenuItem> {
    const { data, error } = await this.supabase
      .from('menu_items')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async deleteMenuItem(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('menu_items')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('id', id);
    
    if (error) throw error;
  }

  // 注文操作
  async getOrdersByTable(tableId: string): Promise<Order[]> {
    const { data, error } = await this.supabase
      .from('orders')
      .select('*')
      .eq('table_id', tableId)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    return data || [];
  }

  async createOrder(order: Omit<Order, 'id' | 'created_at'>): Promise<Order> {
    const { data, error } = await this.supabase
      .from('orders')
      .insert(order)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateOrder(id: string, updates: Partial<Order>): Promise<Order> {
    const { data, error } = await this.supabase
      .from('orders')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async deleteOrder(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('orders')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  async deleteOrdersByTable(tableId: string): Promise<void> {
    const { error } = await this.supabase
      .from('orders')
      .delete()
      .eq('table_id', tableId);
    
    if (error) throw error;
  }

  // 注文履歴操作
  async getOrderHistory(): Promise<OrderHistory[]> {
    const { data, error } = await this.supabase
      .from('order_history')
      .select('*')
      .order('completed_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async createOrderHistory(history: Omit<OrderHistory, 'id' | 'completed_at'>): Promise<OrderHistory> {
    const { data, error } = await this.supabase
      .from('order_history')
      .insert(history)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // 初期データ投入
  async seedInitialData(): Promise<void> {
    console.log('初期データ投入を開始...');
    
    // Supabase接続テスト
    try {
      const { data: testData, error: testError } = await this.supabase
        .from('tables')
        .select('count')
        .limit(1);
      
      if (testError) {
        console.error('Supabase接続テストエラー:', testError);
        throw new Error(`Supabase接続エラー: ${testError.message}`);
      }
      console.log('Supabase接続テスト成功');
    } catch (error) {
      console.error('Supabase接続に失敗:', error);
      throw error;
    }

    // 既存データをチェック
    const { data: existingTables } = await this.supabase
      .from('tables')
      .select('id')
      .limit(1);

    if (existingTables && existingTables.length > 0) {
      console.log('既存データが見つかりました。初期データ投入をスキップします。');
      return; // 既にデータが存在する場合はスキップ
    }

    console.log('初期テーブルデータを投入中...');
    // 初期テーブルデータ
    const initialTables = [
      { number: 'T1', seats: 2, status: 'available' as const, total_amount: 0 },
      { number: 'T2', seats: 4, status: 'available' as const, total_amount: 0 },
      { number: 'T3', seats: 2, status: 'available' as const, total_amount: 0 },
      { number: 'T4', seats: 6, status: 'available' as const, total_amount: 0 },
      { number: 'T5', seats: 4, status: 'available' as const, total_amount: 0 },
      { number: 'T6', seats: 2, status: 'available' as const, total_amount: 0 },
      { number: 'T7', seats: 4, status: 'available' as const, total_amount: 0 },
      { number: 'T8', seats: 8, status: 'available' as const, total_amount: 0 },
    ];

    console.log('初期メニューデータを投入中...');
    // 初期メニューデータ
    const initialMenuItems = [
      {
        name: '本日の日替わり定食',
        price: 980,
        category: '定食',
        description: '季節の食材を使った栄養バランスの良い定食',
        image_url: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=300',
        is_active: true,
      },
      {
        name: '鶏の唐揚げ定食',
        price: 850,
        category: '定食',
        description: 'ジューシーな鶏の唐揚げ定食',
        image_url: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=300',
        is_active: true,
      },
      {
        name: '焼き魚定食',
        price: 920,
        category: '定食',
        description: '新鮮な魚の焼き魚定食',
        image_url: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=300',
        is_active: true,
      },
      {
        name: '緑茶',
        price: 200,
        category: 'ドリンク',
        description: '香り豊かな緑茶',
        image_url: 'https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg?auto=compress&cs=tinysrgb&w=300',
        is_active: true,
      },
      {
        name: 'ほうじ茶',
        price: 200,
        category: 'ドリンク',
        description: '香ばしいほうじ茶',
        image_url: 'https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg?auto=compress&cs=tinysrgb&w=300',
        is_active: true,
      },
      {
        name: '抹茶',
        price: 350,
        category: 'ドリンク',
        description: '本格的な抹茶',
        image_url: 'https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg?auto=compress&cs=tinysrgb&w=300',
        is_active: true,
      },
      {
        name: 'わらび餅',
        price: 380,
        category: 'デザート',
        description: 'もちもちのわらび餅',
        image_url: 'https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg?auto=compress&cs=tinysrgb&w=300',
        is_active: true,
      },
      {
        name: 'みたらし団子',
        price: 320,
        category: 'デザート',
        description: '甘辛いみたらし団子',
        image_url: 'https://images.pexels.com/photos/6880219/pexels-photo-6880219.jpeg?auto=compress&cs=tinysrgb&w=300',
        is_active: true,
      },
      {
        name: 'あんみつ',
        price: 450,
        category: 'デザート',
        description: '和風あんみつ',
        image_url: 'https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg?auto=compress&cs=tinysrgb&w=300',
        is_active: true,
      },
    ];

    // データを投入
    try {
      const { error: tablesError } = await this.supabase
        .from('tables')
        .insert(initialTables);
      
      if (tablesError) {
        console.error('テーブルデータ投入エラー:', tablesError);
        throw tablesError;
      }
      console.log('テーブルデータ投入完了');

      const { error: menuError } = await this.supabase
        .from('menu_items')
        .insert(initialMenuItems);
      
      if (menuError) {
        console.error('メニューデータ投入エラー:', menuError);
        throw menuError;
      }
      console.log('メニューデータ投入完了');
      console.log('初期データ投入が正常に完了しました');
    } catch (error) {
      console.error('初期データ投入中にエラーが発生:', error);
      throw error;
    }
  }

  // モックデータをSupabaseに移行
  async migrateMockDataToSupabase(mockTables: any[], mockMenuItems: any[], mockOrderHistory: any[]): Promise<void> {
    try {
      // 既存データをクリア（開発環境のみ）
      await this.supabase.from('orders').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await this.supabase.from('tables').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await this.supabase.from('menu_items').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await this.supabase.from('order_history').delete().neq('id', '00000000-0000-0000-0000-000000000000');

      // テーブルデータを移行
      if (mockTables.length > 0) {
        const tablesToInsert = mockTables.map(table => ({
          number: table.number,
          seats: table.seats,
          status: table.status,
          customer_count: table.customerCount || null,
          order_start_time: table.orderStartTime ? table.orderStartTime.toISOString() : null,
          total_amount: table.totalAmount || 0,
        }));
        
        const { data: insertedTables, error: tablesError } = await this.supabase
          .from('tables')
          .insert(tablesToInsert)
          .select();
        
        if (tablesError) throw tablesError;

        // 注文データを移行（テーブルIDをマッピング）
        for (let i = 0; i < mockTables.length; i++) {
          const mockTable = mockTables[i];
          const insertedTable = insertedTables?.[i];
          
          if (mockTable.orders && mockTable.orders.length > 0 && insertedTable) {
            const ordersToInsert = mockTable.orders.map((order: any) => ({
              table_id: insertedTable.id,
              menu_item_id: order.id, // これは後でメニューIDとマッピングが必要
              quantity: order.quantity,
              unit_price: order.price,
            }));
            
            // 注文データは一旦スキップ（メニューIDマッピングが複雑なため）
            // await this.supabase.from('orders').insert(ordersToInsert);
          }
        }
      }

      // メニューデータを移行
      if (mockMenuItems.length > 0) {
        const menuItemsToInsert = mockMenuItems.map(item => ({
          name: item.name,
          price: item.price,
          category: item.category,
          description: item.description || '',
          image_url: item.image || '',
          is_active: true,
        }));
        
        const { error: menuError } = await this.supabase
          .from('menu_items')
          .insert(menuItemsToInsert);
        
        if (menuError) throw menuError;
      }

      // 注文履歴を移行
      if (mockOrderHistory.length > 0) {
        const historyToInsert = mockOrderHistory.map(history => ({
          table_number: history.tableNumber,
          items: history.items,
          total_amount: history.total,
          completed_at: history.timestamp ? history.timestamp.toISOString() : new Date().toISOString(),
        }));
        
        const { error: historyError } = await this.supabase
          .from('order_history')
          .insert(historyToInsert);
        
        if (historyError) throw historyError;
      }

    } catch (error) {
      console.error('モックデータ移行エラー:', error);
      throw error;
    }
  }
}