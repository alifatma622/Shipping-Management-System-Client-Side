export interface DashboardDTO {
  employeesCount: number;
  sellersCount: number;
  deliveryAgentsCount: number;
  orderStatusCounts: OrderStatusCounts;
  topCities: CityOrderCount[];
  recentOrders: RecentOrder[];
  deliverySuccessRate: number;
  customerSatisfaction: number;
  averageDeliveryTime: string;
  topPerformingCity: string;
  topSeller: string;
  topDeliveryAgent: string;
  deliveredOrdersRevenue: number;
  pendingOrdersRevenue: number;
  shipmentAnalytics: ShipmentAnalytics;
}

export interface OrderStatusCounts {
  new: number;
  pending: number;
  deliveredToAgent: number;
  delivered: number;
  cancelledByReceiver: number;
  partiallyDelivered: number;
  postponed: number;
  notReachable: number;
  refusedWithPartialPayment: number;
  refusedWithoutPayment: number;
}

export interface CityOrderCount {
  cityName: string;
  ordersCount: number;
  shippingType?: string;
}

export interface RecentOrder {
  orderID: number;
  customerName: string;
  creationDate: string;
  customerCityName: string;
  status: OrderStatus;
  totalCost: number;
}

export type OrderStatus = 
  | 'new'
  | 'pending'
  | 'deliveredToAgent'
  | 'delivered'
  | 'cancelledByReceiver'
  | 'partiallyDelivered'
  | 'postponed'
  | 'notReachable'
  | 'refusedWithPartialPayment'
  | 'refusedWithoutPayment';

export interface OrderStatistics {
  totalOrders: number;
  completedOrders: number;
  pendingOrders: number;
  cancelledOrders: number;
  completionRate: number;
  averageDeliveryTime: number;
}

export interface PerformanceMetrics {
  deliverySuccessRate: number;
  customerSatisfaction: number;
  averageResponseTime: number;
  ordersPerHour: number;
  ordersPerDay: number;
}

export interface RevenueStatistics {
  totalRevenue: number;
  deliveredOrdersRevenue: number;
  pendingOrdersRevenue: number;
  cancelledOrdersRevenue: number;
  averageOrderValue: number;
  revenueGrowth: number;
  monthlyRevenue: number;
  weeklyRevenue: number;
  dailyRevenue: number;
  revenueByCity: Array<{
    cityName: string;
    revenue: number;
    orderCount: number;
  }>;
  revenueByStatus: Array<{
    status: OrderStatus;
    revenue: number;
    orderCount: number;
  }>;
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartDataset {
  data: number[];
  label: string;
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
  type?: 'bar' | 'line' | 'pie' | 'doughnut';
}

export interface ChartOptions {
  responsive?: boolean;
  maintainAspectRatio?: boolean;
  plugins?: {
    legend?: {
      display?: boolean;
    };
    tooltip?: {
      enabled?: boolean;
      backgroundColor?: string;
      titleColor?: string;
      bodyColor?: string;
    };
  };
  scales?: {
    x?: {
      display?: boolean;
      grid?: {
        display?: boolean;
      };
    };
    y?: {
      display?: boolean;
      grid?: {
        display?: boolean;
      };
    };
  };
}

export interface SearchFilter {
  searchTerm?: string;
  status?: OrderStatus;
  city?: string;
  dateFrom?: string;
  dateTo?: string;
  minCost?: number;
  maxCost?: number;
}

export interface SortOptions {
  field: keyof RecentOrder;
  direction: 'asc' | 'desc';
}

export interface PagedResponse<T> {
  data: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface DataUpdateEvent {
  type: 'refresh' | 'filter' | 'sort' | 'search';
  data?: any;
  timestamp: Date;
}

export interface DashboardSettings {
  autoRefresh: boolean;
  refreshInterval: number;
  showNotifications: boolean;
  darkMode: boolean;
  pageSize: number;
  showCharts: boolean;
  showTables: boolean;
}

export interface DashboardNotification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  action?: {
    text: string;
    url: string;
  };
}

export interface ShipmentAnalytics {
  monthlyShipments: MonthlyShipment[];
  weeklyShipments: WeeklyShipment[];
  shipmentsByType: ShipmentByType[];
  performanceMetrics: TimePerformanceMetrics;
}

export interface MonthlyShipment {
  month: string;
  count: number;
  revenue: number;
  successRate: number;
}

export interface WeeklyShipment {
  week: string;
  count: number;
  revenue: number;
  successRate: number;
}

export interface ShipmentByType {
  type: string;
  count: number;
  percentage: number;
  color: string;
}

export interface TimePerformanceMetrics {
  averageDailyShipments: number;
  monthlyGrowth: number;
  bestPerformingMonth: string;
  worstPerformingMonth: string;
  weeklyGrowthRate: number;
} 