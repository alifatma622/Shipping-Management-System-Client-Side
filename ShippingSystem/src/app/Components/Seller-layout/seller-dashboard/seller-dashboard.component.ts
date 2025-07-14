import { Component, HostListener, OnInit, signal } from '@angular/core';
import { OrderStatusCountsDTO } from '../../../Models/DashboardDTO';
import { DashboardService } from '../../../Services/dashboard.service';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MainComponent } from "../../Main/Main.component";
import { SidebarComponent } from "../../Sidebar/Sidebar.component";

@Component({
  selector: 'app-seller-dashboard',
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './seller-dashboard.component.html',
  styleUrl: './seller-dashboard.component.css'
})
export class SellerDashboardComponent implements OnInit{
  statusCounts?: OrderStatusCountsDTO;
  isLoading = true;
  error: string | null = null;


  isLeftSidebarCollapsed = signal<boolean>(false);
  screenWidth = signal<number>(window.innerWidth);

  @HostListener('window:resize')
  onResize() {
    this.screenWidth.set(window.innerWidth);
    if (this.screenWidth() < 768) {
      this.isLeftSidebarCollapsed.set(true);
    }
  }

  ngoninit(): void {
    this.isLeftSidebarCollapsed.set(this.screenWidth() < 768);
  }

  changeIsLeftSidebarCollapsed(isLeftSidebarCollapsed: boolean): void {
    this.isLeftSidebarCollapsed.set(isLeftSidebarCollapsed);
  }

  statusList = [
    { key: 'new', label: 'New', icon: 'fiber_new', color: '#3B82F6' },
    { key: 'pending', label: 'Pending', icon: 'hourglass_empty', color: '#F59E0B' },
    { key: 'deliveredToAgent', label: 'Delivered to Agent', icon: 'local_shipping', color: '#8B5CF6' },
    { key: 'delivered', label: 'Delivered', icon: 'check_circle', color: '#10B981' },
    { key: 'cancelledByReceiver', label: 'Cancelled by Receiver', icon: 'cancel', color: '#EF4444' },
    { key: 'partiallyDelivered', label: 'Partially Delivered', icon: 'call_split', color: '#F97316' },
    { key: 'postponed', label: 'Postponed', icon: 'schedule', color: '#6B7280' },
    { key: 'notReachable', label: 'Not Reachable', icon: 'signal_wifi_off', color: '#9CA3AF' },
    { key: 'refusedWithPartialPayment', label: 'Refused w/ Partial Payment', icon: 'money_off', color: '#DC2626' },
    { key: 'refusedWithoutPayment', label: 'Refused w/o Payment', icon: 'block', color: '#7F1D1D' },
  ];

  getStatusCount(key: string): number {
    return (this.statusCounts as any)?.[key] ?? 0;
  }

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.getOrderStatusCountsForSeller().subscribe({
      next: (data) => {
        this.statusCounts = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err.message || 'Failed to load data';
        this.isLoading = false;
      }
    });
  }

}



