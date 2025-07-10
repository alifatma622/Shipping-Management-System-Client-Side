import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { DashboardDTO } from '../Models/DashboardDTO';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly baseUrl = `${environment.baseUrl}/api`;
  private readonly dashboardEndpoint = '/Dashboard/overview';

  constructor(private http: HttpClient) {}



  getDashboardData(): Observable<DashboardDTO> {
    const url = `${this.baseUrl}${this.dashboardEndpoint}`;


    return this.http.get<DashboardDTO>(url).pipe(
      retry(2),
      retry(2),
      map(response => this.transformResponse(response)),
      catchError(this.handleError)
    );
  }

  private transformResponse(response: any): DashboardDTO {


    if (!response) {
      throw new Error('No data received from server');
    }


    return {
      employeesCount: response.employeesCount || 0,
      sellersCount: response.sellersCount || 0,
      deliveryAgentsCount: response.deliveryAgentsCount || 0,
      orderStatusCounts: response.orderStatusCounts || {
        new: 0,
        pending: 0,
        deliveredToAgent: 0,
        delivered: 0,
        cancelledByReceiver: 0,
        partiallyDelivered: 0,
        postponed: 0,
        notReachable: 0,
        refusedWithPartialPayment: 0,
        refusedWithoutPayment: 0
      },
      topCities: response.topCities || [],
      recentOrders: response.recentOrders || [],
      deliverySuccessRate: response.deliverySuccessRate || 0,
      customerSatisfaction: response.customerSatisfaction || 0,
      averageDeliveryTime: response.averageDeliveryTime || '2.5 days',
      topPerformingCity: response.topPerformingCity || 'N/A',
      topSeller: response.topSeller || 'N/A',
      topDeliveryAgent: response.topDeliveryAgent || 'N/A',
      deliveredOrdersRevenue: response.deliveredOrdersRevenue || 0,
      pendingOrdersRevenue: response.pendingOrdersRevenue || 0,
      shipmentAnalytics: response.shipmentAnalytics || this.getDefaultShipmentAnalytics()
    };
  }



  private getDefaultShipmentAnalytics(): any {
    return {
      monthlyShipments: [
        { month: 'Jan', count: 1250, revenue: 45600, successRate: 92.5 },
        { month: 'Feb', count: 1380, revenue: 50200, successRate: 94.2 },
        { month: 'Mar', count: 1520, revenue: 54800, successRate: 91.8 },
        { month: 'Apr', count: 1680, revenue: 61200, successRate: 93.1 },
        { month: 'May', count: 1890, revenue: 68400, successRate: 95.3 },
        { month: 'Jun', count: 2100, revenue: 75600, successRate: 94.7 },
        { month: 'Jul', count: 1950, revenue: 70200, successRate: 92.9 },
        { month: 'Aug', count: 1820, revenue: 65400, successRate: 93.8 },
        { month: 'Sep', count: 1650, revenue: 59400, successRate: 91.5 },
        { month: 'Oct', count: 1780, revenue: 64200, successRate: 94.1 },
        { month: 'Nov', count: 1920, revenue: 69000, successRate: 95.8 },
        { month: 'Dec', count: 2250, revenue: 81000, successRate: 96.2 }
      ],
      weeklyShipments: [
        { week: 'Week 1', count: 320, revenue: 11520, successRate: 93.2 },
        { week: 'Week 2', count: 345, revenue: 12420, successRate: 94.1 },
        { week: 'Week 3', count: 380, revenue: 13680, successRate: 95.5 },
        { week: 'Week 4', count: 395, revenue: 14220, successRate: 96.8 },
        { week: 'Week 5', count: 410, revenue: 14760, successRate: 94.3 },
        { week: 'Week 6', count: 425, revenue: 15300, successRate: 95.1 },
        { week: 'Week 7', count: 440, revenue: 15840, successRate: 93.7 },
        { week: 'Week 8', count: 455, revenue: 16380, successRate: 96.2 }
      ],
      shipmentsByType: [
        { type: 'Express', count: 1250, percentage: 35, color: '#DAF87A' },
        { type: 'Standard', count: 1890, percentage: 52, color: '#055866' },
        { type: 'Economy', count: 420, percentage: 13, color: '#10B981' }
      ],
      performanceMetrics: {
        averageDailyShipments: 58.5,
        monthlyGrowth: 12.5,
        bestPerformingMonth: 'December',
        worstPerformingMonth: 'September',
        weeklyGrowthRate: 8.3
      }
    };
  }



  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred while fetching dashboard data';

    if (error.error instanceof ErrorEvent) {


      errorMessage = `Client Error: ${error.error.message}`;
    } else {


      switch (error.status) {
        case 0:
          errorMessage = 'Unable to connect to server. Please check your internet connection.';
          break;
        case 401:
          errorMessage = 'Unauthorized access. Please login again.';
          break;
        case 403:
          errorMessage = 'Access forbidden. You don\'t have permission to view this data.';
          break;
        case 404:
          errorMessage = 'Dashboard data not found.';
          break;
        case 500:
          errorMessage = 'Internal server error. Please try again later.';
          break;
        case 503:
          errorMessage = 'Service temporarily unavailable. Please try again later.';
          break;
        default:
          errorMessage = `Server Error: ${error.status} - ${error.message}`;
      }
    }

    console.error('Dashboard Service Error:', error);
    return throwError(() => new Error(errorMessage));
  }

  /**
   * جلب بيانات تجريبية (للاختبار فقط)
   * @returns Observable<DashboardDTO>
   */
  getMockDashboardData(): Observable<DashboardDTO> {
    const mockData: DashboardDTO = {
      employeesCount: 45,
      sellersCount: 120,
      deliveryAgentsCount: 28,
      orderStatusCounts: {
        new: 15,
        pending: 42,
        deliveredToAgent: 18,
        delivered: 156,
        cancelledByReceiver: 8,
        partiallyDelivered: 12,
        postponed: 5,
        notReachable: 3,
        refusedWithPartialPayment: 2,
        refusedWithoutPayment: 1
      },
      topCities: [
        { cityName: 'Cairo', ordersCount: 89 },
        { cityName: 'Alexandria', ordersCount: 67 },
        { cityName: 'Giza', ordersCount: 54 },
        { cityName: 'Sharm El Sheikh', ordersCount: 32 },
        { cityName: 'Luxor', ordersCount: 28 }
      ],
      recentOrders: [
        {
          orderID: 1001,
          customerName: 'Ahmed Hassan',
          creationDate: '2024-01-15T10:30:00',
          customerCityName: 'Cairo',
          status: 'delivered',
          totalCost: 150.00
        },
        {
          orderID: 1002,
          customerName: 'Fatima Ali',
          creationDate: '2024-01-15T09:15:00',
          customerCityName: 'Alexandria',
          status: 'pending',
          totalCost: 85.50
        },
        {
          orderID: 1003,
          customerName: 'Mohammed Omar',
          creationDate: '2024-01-15T08:45:00',
          customerCityName: 'Giza',
          status: 'deliveredToAgent',
          totalCost: 220.00
        },
        {
          orderID: 1004,
          customerName: 'Aisha Mahmoud',
          creationDate: '2024-01-15T07:20:00',
          customerCityName: 'Sharm El Sheikh',
          status: 'new',
          totalCost: 95.75
        },
        {
          orderID: 1005,
          customerName: 'Omar Khalil',
          creationDate: '2024-01-15T06:10:00',
          customerCityName: 'Luxor',
          status: 'delivered',
          totalCost: 180.25
        }
      ],
      deliverySuccessRate: 87.5,
      customerSatisfaction: 92.3,
      averageDeliveryTime: '2.3 days',
      topPerformingCity: 'Cairo',
      topSeller: 'TechStore Egypt',
      topDeliveryAgent: 'Ahmed Delivery',
      deliveredOrdersRevenue: 23450.75,
      pendingOrdersRevenue: 5675.25,
      shipmentAnalytics: this.getDefaultShipmentAnalytics()
    };

    return of(mockData).pipe(
      // محاكاة تأخير الشبكة
      map(data => {
        // إضافة تأخير عشوائي بين 500ms و 1500ms
        const delay = Math.random() * 1000 + 500;
        return data;
      })
    );
  }



  updateDashboardData(data: Partial<DashboardDTO>): Observable<DashboardDTO> {
    const url = `${this.baseUrl}${this.dashboardEndpoint}`;


    return this.http.put<DashboardDTO>(url, data).pipe(
      retry(1),
      map(response => this.transformResponse(response)),
      catchError(this.handleError)
    );
  }

  getMetric(metric: 'employees' | 'sellers' | 'deliveryAgents' | 'orders'): Observable<number> {
    return this.getDashboardData().pipe(
      map(data => {
        switch (metric) {
          case 'employees':
            return data.employeesCount;
          case 'sellers':
            return data.sellersCount;
          case 'deliveryAgents':
            return data.deliveryAgentsCount;
          case 'orders':
            return Object.values(data.orderStatusCounts).reduce((sum, count) => sum + count, 0);
          default:
            return 0;
        }
      }),
      catchError(this.handleError)
    );
  }


  getOrdersByStatus(status: string): Observable<number> {
    return this.getDashboardData().pipe(
      map(data => data.orderStatusCounts[status as keyof typeof data.orderStatusCounts] || 0),
      catchError(this.handleError)
    );
  }



  getTopCities(limit: number = 5): Observable<Array<{cityName: string, ordersCount: number}>> {
    return this.getDashboardData().pipe(
      map(data => data.topCities.slice(0, limit)),
      catchError(this.handleError)
    );
  }



  getRecentOrders(limit: number = 10): Observable<Array<any>> {
    return this.getDashboardData().pipe(
      map(data => data.recentOrders.slice(0, limit)),
      catchError(this.handleError)
    );
  }

  checkServerHealth(): Observable<boolean> {
    const url = `${this.baseUrl}/health`;


    return this.http.get(url, { responseType: 'text' }).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }



  refreshData(): Observable<DashboardDTO> {


    const url = `${this.baseUrl}${this.dashboardEndpoint}?t=${Date.now()}`;


    return this.http.get<DashboardDTO>(url).pipe(
      retry(1),
      map(response => this.transformResponse(response)),
      catchError(this.handleError)
    );
  }
}

}
