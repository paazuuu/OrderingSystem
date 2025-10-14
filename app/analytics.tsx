import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Calendar, TrendingUp, DollarSign, ShoppingBag, ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

interface SalesData {
  date: string;
  sales: number;
  orders: number;
}

const mockSalesData: SalesData[] = [
  { date: '2024-01-01', sales: 45000, orders: 78 },
  { date: '2024-01-02', sales: 52000, orders: 89 },
  { date: '2024-01-03', sales: 38000, orders: 65 },
  { date: '2024-01-04', sales: 61000, orders: 102 },
  { date: '2024-01-05', sales: 47000, orders: 81 },
  { date: '2024-01-06', sales: 58000, orders: 95 },
  { date: '2024-01-07', sales: 72000, orders: 120 },
];

const monthlyData = [
  { month: '1月', sales: 1250000, orders: 2100 },
  { month: '2月', sales: 1180000, orders: 1950 },
  { month: '3月', sales: 1320000, orders: 2250 },
  { month: '4月', sales: 1280000, orders: 2150 },
  { month: '5月', sales: 1450000, orders: 2400 },
  { month: '6月', sales: 1380000, orders: 2300 },
];

export default function AnalyticsScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'monthly' | 'yearly'>('daily');
  const router = useRouter();

  const getCurrentData = () => {
    switch (selectedPeriod) {
      case 'daily':
        return mockSalesData;
      case 'monthly':
        return monthlyData;
      case 'yearly':
        return [{ date: '2024年', sales: 15500000, orders: 26000 }];
      default:
        return mockSalesData;
    }
  };

  const getTotalSales = () => {
    return getCurrentData().reduce((total, item) => total + item.sales, 0);
  };

  const getTotalOrders = () => {
    return getCurrentData().reduce((total, item) => total + item.orders, 0);
  };

  const getAverageOrderValue = () => {
    const totalSales = getTotalSales();
    const totalOrders = getTotalOrders();
    return totalOrders > 0 ? Math.round(totalSales / totalOrders) : 0;
  };

  const maxSales = Math.max(...getCurrentData().map(item => item.sales));

  const renderChart = () => {
    const data = getCurrentData();
    
    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>売上推移</Text>
        <View style={styles.chart}>
          {data.map((item, index) => {
            const height = (item.sales / maxSales) * 150;
            const label = selectedPeriod === 'monthly' ? 
              (item as any).month : 
              selectedPeriod === 'yearly' ? 
                '2024年' : 
                `${index + 1}日`;
            
            return (
              <View key={index} style={styles.barContainer}>
                <View style={styles.barWrapper}>
                  <View
                    style={[
                      styles.bar,
                      { height: height, backgroundColor: '#8B4513' }
                    ]}
                  />
                </View>
                <Text style={styles.barLabel}>{label}</Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>売上分析</Text>
        <Calendar size={24} color="#FFFFFF" />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.periodSelector}>
          <TouchableOpacity
            style={[
              styles.periodButton,
              selectedPeriod === 'daily' && styles.periodButtonActive
            ]}
            onPress={() => setSelectedPeriod('daily')}
          >
            <Text style={[
              styles.periodButtonText,
              selectedPeriod === 'daily' && styles.periodButtonTextActive
            ]}>
              日次
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.periodButton,
              selectedPeriod === 'monthly' && styles.periodButtonActive
            ]}
            onPress={() => setSelectedPeriod('monthly')}
          >
            <Text style={[
              styles.periodButtonText,
              selectedPeriod === 'monthly' && styles.periodButtonTextActive
            ]}>
              月次
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.periodButton,
              selectedPeriod === 'yearly' && styles.periodButtonActive
            ]}
            onPress={() => setSelectedPeriod('yearly')}
          >
            <Text style={[
              styles.periodButtonText,
              selectedPeriod === 'yearly' && styles.periodButtonTextActive
            ]}>
              年次
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.summaryCards}>
          <View style={styles.summaryCard}>
            <View style={styles.cardHeader}>
              <DollarSign size={24} color="#8B4513" />
              <Text style={styles.cardTitle}>総売上</Text>
            </View>
            <Text style={styles.cardValue}>¥{getTotalSales().toLocaleString()}</Text>
          </View>

          <View style={styles.summaryCard}>
            <View style={styles.cardHeader}>
              <ShoppingBag size={24} color="#8B4513" />
              <Text style={styles.cardTitle}>注文数</Text>
            </View>
            <Text style={styles.cardValue}>{getTotalOrders().toLocaleString()}</Text>
          </View>

          <View style={styles.summaryCard}>
            <View style={styles.cardHeader}>
              <TrendingUp size={24} color="#8B4513" />
              <Text style={styles.cardTitle}>平均単価</Text>
            </View>
            <Text style={styles.cardValue}>¥{getAverageOrderValue().toLocaleString()}</Text>
          </View>
        </View>

        {renderChart()}

        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>詳細データ</Text>
          {getCurrentData().map((item, index) => {
            const label = selectedPeriod === 'monthly' ? 
              (item as any).month : 
              selectedPeriod === 'yearly' ? 
                '2024年' : 
                `${index + 1}日目`;
            
            return (
              <View key={index} style={styles.detailItem}>
                <Text style={styles.detailDate}>{label}</Text>
                <View style={styles.detailStats}>
                  <Text style={styles.detailSales}>¥{item.sales.toLocaleString()}</Text>
                  <Text style={styles.detailOrders}>{item.orders}件</Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5E6D3',
  },
  header: {
    backgroundColor: '#8B4513',
    paddingTop: 40,
    paddingBottom: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    padding: 4,
    marginBottom: 20,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 20,
  },
  periodButtonActive: {
    backgroundColor: '#8B4513',
  },
  periodButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B4513',
  },
  periodButtonTextActive: {
    color: '#FFFFFF',
  },
  summaryCards: {
    marginBottom: 25,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
    marginLeft: 10,
  },
  cardValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#8B4513',
  },
  chartContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 20,
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 180,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
  },
  barWrapper: {
    height: 150,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bar: {
    width: 20,
    backgroundColor: '#8B4513',
    borderRadius: 2,
  },
  barLabel: {
    fontSize: 12,
    color: '#666666',
    marginTop: 8,
    textAlign: 'center',
  },
  detailsSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 15,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  detailDate: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
  },
  detailStats: {
    alignItems: 'flex-end',
  },
  detailSales: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8B4513',
  },
  detailOrders: {
    fontSize: 14,
    color: '#666666',
    marginTop: 2,
  },
});