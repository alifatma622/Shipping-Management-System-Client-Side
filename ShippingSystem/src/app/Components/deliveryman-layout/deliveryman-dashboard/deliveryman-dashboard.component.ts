import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../../Services/dashboard.service';
import { OrderStatusCounts, OrderStatusCountsDTO } from '../../../Models/DashboardDTO';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-deliveryman-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './deliveryman-dashboard.component.html',
  styleUrl: './deliveryman-dashboard.component.css'
})
export class DeliverymanDashboardComponent implements OnInit {
  statusCounts?: OrderStatusCountsDTO;  
  isLoading = true;
  error: string | null = null;
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

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.getOrderStatusCountsForDeliveryAgent().subscribe({
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

  getStatusCount(key: string): number {
    return this.statusCounts?.[key as keyof typeof this.statusCounts] || 0;
  }
}
