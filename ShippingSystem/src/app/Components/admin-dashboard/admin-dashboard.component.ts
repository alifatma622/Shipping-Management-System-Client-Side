import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { DashboardService } from '../../Services/dashboard.service';
import { DashboardDTO } from '../../Models/DashboardDTO';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule, 
    MatTableModule, 
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    FormsModule,
    BaseChartDirective
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  dashboardData?: DashboardDTO;
  isLoading = true;
  error: string | null = null;
  searchTerm = '';
  selectedTimeFilter = 'thisMonth';

  // Order status list for cards
  orderStatusList = [
    { key: 'new', label: 'New Orders', icon: 'add_shopping_cart', color: '#3B82F6' },
    { key: 'pending', label: 'Pending', icon: 'schedule', color: '#F59E0B' },
    { key: 'deliveredToAgent', label: 'With Agent', icon: 'local_shipping', color: '#8B5CF6' },
    { key: 'delivered', label: 'Delivered', icon: 'check_circle', color: '#10B981' },
    { key: 'cancelledByReceiver', label: 'Cancelled', icon: 'cancel', color: '#EF4444' },
    { key: 'partiallyDelivered', label: 'Partial', icon: 'incomplete_circle', color: '#F97316' },
    { key: 'postponed', label: 'Postponed', icon: 'pause_circle', color: '#6B7280' },
    { key: 'notReachable', label: 'Unreachable', icon: 'phone_disabled', color: '#9CA3AF' },
    { key: 'refusedWithPartialPayment', label: 'Refused (Partial)', icon: 'money_off', color: '#DC2626' },
    { key: 'refusedWithoutPayment', label: 'Refused (Full)', icon: 'block', color: '#7F1D1D' }
  ];

  // Chart configuration
  public cityChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [{
      data: [],
      label: 'Orders Count',
      backgroundColor: ['#DAF87A', '#055866', '#DAF87A', '#055866', '#DAF87A'],
      borderRadius: 8,
      barThickness: 40
    }]
  };

  // Shipment Analytics Chart
  public shipmentChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [{
      data: [],
      label: 'Monthly Shipments',
      borderColor: '#DAF87A',
      backgroundColor: 'rgba(218, 248, 122, 0.1)',
      borderWidth: 3,
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#055866',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 6,
      pointHoverRadius: 8
    }]
  };

  public cityChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(5, 88, 102, 0.9)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: '#055866',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: (context) => context[0].label,
          label: (context) => `Orders: ${context.parsed.y}`
        }
      }
    },
    scales: {
      x: {
        display: true,
        grid: { display: false },
        ticks: {
          color: '#6B7280',
          font: { size: 12 },
          maxRotation: 45
        }
      },
      y: {
        display: true,
        grid: { color: '#E5E7EB' },
        ticks: {
          color: '#6B7280',
          font: { size: 12 },
          stepSize: 10
        }
      }
    },
    elements: {
      bar: {
        borderRadius: 8,
        borderSkipped: false
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  };

  public shipmentChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        display: true,
        position: 'top',
        labels: {
          color: '#6B7280',
          font: { size: 12, weight: 'bold' },
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(5, 88, 102, 0.95)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: '#055866',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: (context) => `Month: ${context[0].label}`,
          label: (context) => [
            `Shipments: ${context.parsed.y}`,
            `Revenue: $${this.formatCurrency(this.getMonthlyRevenue(context.label))}`,
            `Success Rate: ${this.getMonthlySuccessRate(context.label)}%`
          ]
        }
      }
    },
    scales: {
      x: {
        display: true,
        grid: { display: false },
        ticks: {
          color: '#6B7280',
          font: { size: 12 },
          maxRotation: 0
        }
      },
      y: {
        display: true,
        grid: { color: '#E5E7EB' },
        ticks: {
          color: '#6B7280',
          font: { size: 12 },
          stepSize: 500
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  };

  // Table configuration
  displayedColumns: string[] = [
    'customerName',
    'orderID', 
    'creationDate',
    'customerCityName',
    'status',
    'totalCost',
    'actions'
  ];

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.isLoading = true;
    this.error = null;
    
    this.dashboardService.getMockDashboardData().subscribe({
      next: (data) => {
        this.dashboardData = data;
        this.setupChartData();
        this.isLoading = false;
      },
      error: (error) => {
        this.error = error.message || 'Failed to load dashboard data';
        this.isLoading = false;
        console.error('Dashboard loading error:', error);
      }
    });
  }

  private setupChartData(): void {
    if (!this.dashboardData) return;

    this.cityChartData.labels = this.dashboardData.topCities.map(city => city.cityName);
    this.cityChartData.datasets[0].data = this.dashboardData.topCities.map(city => city.ordersCount);

    if (this.dashboardData.shipmentAnalytics?.monthlyShipments) {
      this.shipmentChartData.labels = this.dashboardData.shipmentAnalytics.monthlyShipments.map(item => item.month);
      this.shipmentChartData.datasets[0].data = this.dashboardData.shipmentAnalytics.monthlyShipments.map(item => item.count);
    }
  }

  // Shipment Analytics Helper Methods
  getMonthlyRevenue(month: string): number {
    if (!this.dashboardData?.shipmentAnalytics?.monthlyShipments) return 0;
    const monthData = this.dashboardData.shipmentAnalytics.monthlyShipments.find(item => item.month === month);
    return monthData?.revenue || 0;
  }

  getMonthlySuccessRate(month: string): number {
    if (!this.dashboardData?.shipmentAnalytics?.monthlyShipments) return 0;
    const monthData = this.dashboardData.shipmentAnalytics.monthlyShipments.find(item => item.month === month);
    return monthData?.successRate || 0;
  }

  getAverageDailyShipments(): number {
    return this.dashboardData?.shipmentAnalytics?.performanceMetrics?.averageDailyShipments || 0;
  }

  getMonthlyGrowth(): number {
    return this.dashboardData?.shipmentAnalytics?.performanceMetrics?.monthlyGrowth || 0;
  }

  getBestPerformingMonth(): string {
    return this.dashboardData?.shipmentAnalytics?.performanceMetrics?.bestPerformingMonth || 'N/A';
  }

  getShipmentsByType(): any[] {
    return this.dashboardData?.shipmentAnalytics?.shipmentsByType || [];
  }

  // Utility methods
  getOrderStatusCount(key: string): number {
    return this.dashboardData?.orderStatusCounts?.[key as keyof typeof this.dashboardData.orderStatusCounts] || 0;
  }

  getOrderStatusPercentage(statusKey: string): number {
    const totalOrders = this.getTotalOrders();
    if (totalOrders === 0) return 0;
    const statusCount = this.getOrderStatusCount(statusKey);
    return Math.round((statusCount / totalOrders) * 100);
  }

  getTotalOrders(): number {
    if (!this.dashboardData?.orderStatusCounts) return 0;
    return Object.values(this.dashboardData.orderStatusCounts).reduce((sum, count) => sum + count, 0);
  }

  getCompletedPercentage(): number {
    const totalOrders = this.getTotalOrders();
    if (totalOrders === 0) return 0;
    const completedOrders = this.getOrderStatusCount('delivered');
    return Math.round((completedOrders / totalOrders) * 100);
  }

  getPendingPercentage(): number {
    const totalOrders = this.getTotalOrders();
    if (totalOrders === 0) return 0;
    const pendingOrders = this.getOrderStatusCount('pending') + this.getOrderStatusCount('deliveredToAgent');
    return Math.round((pendingOrders / totalOrders) * 100);
  }

  getDeliverySuccessRate(): number {
    return this.dashboardData?.deliverySuccessRate || 0;
  }

  getCustomerSatisfaction(): number {
    return this.dashboardData?.customerSatisfaction || 0;
  }

  getAverageDeliveryTime(): string {
    return this.dashboardData?.averageDeliveryTime || 'N/A';
  }

  getTopPerformingCity(): string {
    return this.dashboardData?.topPerformingCity || 'N/A';
  }

  getTopSeller(): string {
    return this.dashboardData?.topSeller || 'N/A';
  }

  getTopDeliveryAgent(): string {
    return this.dashboardData?.topDeliveryAgent || 'N/A';
  }

  getTotalOrdersInTopCities(): number {
    return this.dashboardData?.topCities?.reduce((sum, city) => sum + city.ordersCount, 0) || 0;
  }

  getDeliveredOrdersRevenue(): number {
    return this.dashboardData?.deliveredOrdersRevenue || 0;
  }

  getPendingOrdersRevenue(): number {
    return this.dashboardData?.pendingOrdersRevenue || 0;
  }

  // Formatting methods
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }

  // Status methods
  getStatusClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      'delivered': 'complete',
      'pending': 'delivery',
      'deliveredToAgent': 'delivery',
      'new': 'delivery',
      'cancelledByReceiver': 'cancelled',
      'partiallyDelivered': 'partial',
      'postponed': 'postponed',
      'notReachable': 'unreachable',
      'refusedWithPartialPayment': 'refused',
      'refusedWithoutPayment': 'refused'
    };
    return statusClasses[status] || 'default';
  }

  getStatusLabel(status: string): string {
    const statusLabels: { [key: string]: string } = {
      'delivered': 'Delivered',
      'pending': 'Pending',
      'deliveredToAgent': 'With Agent',
      'new': 'New',
      'cancelledByReceiver': 'Cancelled',
      'partiallyDelivered': 'Partial',
      'postponed': 'Postponed',
      'notReachable': 'Unreachable',
      'refusedWithPartialPayment': 'Refused (Partial)',
      'refusedWithoutPayment': 'Refused (Full)'
    };
    return statusLabels[status] || status;
  }

  // Event handlers
  onSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target.value;
  }

  onSort(): void {
    console.log('Sort functionality to be implemented');
  }

  onFilter(): void {
    console.log('Filter functionality to be implemented');
  }

  onViewDetail(): void {
    console.log('View detail functionality to be implemented');
  }

  onRowAction(order: any): void {
    console.log('Row action for order:', order);
  }

  onRetry(): void {
    this.loadDashboardData();
  }

  // Heatmap methods
  generateHeatmapData(): Array<{value: number, intensity: string}> {
    const data = [];
    for (let i = 0; i < 63; i++) {
      const value = Math.floor(Math.random() * 100);
      data.push({
        value,
        intensity: this.getHeatmapIntensity(value)
      });
    }
    return data;
  }

  private getHeatmapIntensity(value: number): string {
    if (value < 25) return 'low';
    if (value < 50) return 'medium';
    if (value < 75) return 'high';
    return 'very-high';
  }

  getHeatmapCellClass(value: number): string {
    return this.getHeatmapIntensity(value);
  }

  // Filter methods
  getFilteredOrders(): any[] {
    if (!this.dashboardData?.recentOrders) return [];
    
    if (!this.searchTerm.trim()) {
      return this.dashboardData.recentOrders;
    }

    const searchLower = this.searchTerm.toLowerCase();
    return this.dashboardData.recentOrders.filter(order => 
      order.customerName.toLowerCase().includes(searchLower) ||
      order.orderID.toString().includes(searchLower) ||
      order.customerCityName.toLowerCase().includes(searchLower) ||
      this.getStatusLabel(order.status).toLowerCase().includes(searchLower)
    );
  }

  // دالة لإرجاع أنواع الشحن الفريدة الموجودة في الداتا
  getUniqueShippingTypes(): string[] {
    if (!this.dashboardData?.topCities) return [];
    const types = this.dashboardData.topCities
      .map(city => city.shippingType)
      .filter((type, index, arr) => type && arr.indexOf(type) === index);
    return types as string[];
  }
} 