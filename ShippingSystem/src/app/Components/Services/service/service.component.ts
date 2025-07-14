import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

export interface Service {
  id: number;
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-service',
  imports: [CommonModule],
  templateUrl: './service.component.html',
  styleUrl: './service.component.css',
})
export class ServiceComponent {
  services: Service[] = [
    {
      id: 1,
      icon: 'fas fa-shipping-fast',
      title: 'Free Shipping',
      description:
        'Free delivery on orders over $50. Fast and reliable shipping worldwide.',
    },
    {
      id: 2,
      icon: 'fas fa-city',
      title: 'Multi-City Delivery',
      description: 'We cover a wide range of cities and governorates.',
    },
    {
      id: 3,
      icon: 'fas fa-user-check',
      title: 'Delivery Agent Assignment',
      description:
        'Orders are automatically assigned to the nearest available agent.',
    },
    {
      id: 4,
      icon: 'fas fa-headset',
      title: '24/7 Support',
      description:
        'Round-the-clock customer support to help you with any questions.',
    },
    {
      id: 5,
      icon: 'fas fa-bolt',
      title: 'Fast Processing',
      description:
        'Orders processed within 24 hours. Quick turnaround for faster delivery.',
    },
    {
      id: 6,
      icon: 'fas fa-building',
      title: 'Branch Management',
      description: 'Manage all your shipping branches in one place.',
    },
  ];

  trackByServiceId(index: number, service: Service): number {
    return service.id;
  }
}
