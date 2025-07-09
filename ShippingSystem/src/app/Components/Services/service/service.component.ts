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
      icon: 'fas fa-shield-alt',
      title: 'Secure Payment',
      description:
        'Your payment information is protected with advanced encryption technology.',
    },
    {
      id: 3,
      icon: 'fas fa-undo-alt',
      title: 'Easy Returns',
      description:
        '30-day return policy. No questions asked, hassle-free returns and exchanges.',
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
      icon: 'fas fa-gift',
      title: 'Gift Wrapping',
      description:
        'Beautiful gift wrapping service available for special occasions.',
    },
  ];

  trackByServiceId(index: number, service: Service): number {
    return service.id;
  }
}
