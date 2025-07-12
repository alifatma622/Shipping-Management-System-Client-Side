import { AuthServiceService } from './../../Services/Auth_Services/auth-service.service';
import { Component, OnInit, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterModule } from '@angular/router';

interface MenuItem {
  routeLink?: string;
  icon: string;
  label: string;
  isOpen?: boolean;
  visibleFor?: string[];
  subItems?: SubMenuItem[];
}

interface SubMenuItem {
  label: string;
  routeLink: string;
  visibleFor?: string[];
}

@Component({
  selector: 'app-Sidebar',
  imports: [CommonModule, RouterModule],
  templateUrl: './Sidebar.component.html',
  styleUrls: ['./Sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  userRole: string[] | null = [];
  orderListRouteLink: string = '';
  newOrderRouteLink: string = '';
  items: MenuItem[] = [];

  isLeftSidebarCollapsed = input.required<boolean>();
  changeIsLeftSidebarCollapsed = output<boolean>();

  logout = {
    routeLink: 'logout',
    icon: 'fal fa-sign-out',
    isOpen: false,
    label: 'Log out'
  };

  constructor(private router: Router, public authService: AuthServiceService) {}

  ngOnInit(): void {
    this.initializeUserRoles();
    this.items = this.getMenuItems();
  }

  private initializeUserRoles(): void {
    this.userRole = this.authService.getRole();
    console.log("✅ User roles:", this.userRole);

    if (this.authService.hasRole('Admin')) {
      this.orderListRouteLink = 'order';
      this.newOrderRouteLink = 'order/add';
    } else if (this.authService.hasRole('DeliveryAgent')) {
      this.orderListRouteLink = 'order-delivery';
    } else if (this.authService.hasRole('Seller')) {
      this.orderListRouteLink = 'orders-seller';
      this.newOrderRouteLink = 'add-order-seller';
    }
  }

  private getMenuItems(): MenuItem[] {
    return [
      {
        routeLink: 'deliveryman',
        icon: 'fal fa-home',
        label: 'Dashboard',
        visibleFor: ['DeliveryAgent'],
      },
      {
        routeLink: 'overview',
        icon: 'fal fa-home',
        label: 'Dashboard',
        visibleFor: ['Employee', 'Admin'],
      },
      {
        routeLink: 'seller-dashboard',
        icon: 'fal fa-home',
        label: 'Dashboard',
        visibleFor: ['Seller'],
      },
      {
        icon: 'fal fa-user-tie',
        label: 'Employees',
        isOpen: false,
        visibleFor: ['Employee', 'Admin'],
        subItems: [
          { label: 'Employees list', routeLink: 'employee' },
          { label: 'New employee', routeLink: 'employee/add' },
        ],
      },
      {
        icon: 'fal fa-store',
        label: 'Sellers',
        isOpen: false,
        visibleFor: ['Employee', 'Admin'],
        subItems: [
          { label: 'Sellers list', routeLink: 'seller' },
          { label: 'New seller', routeLink: 'seller/add' },
        ],
      },
      {
        icon: 'fal fa-truck',
        label: 'Delivery Agents',
        isOpen: false,
        visibleFor: ['Employee', 'Admin'],
        subItems: [
          { label: 'Delivery Agents', routeLink: 'delivery-men' },
          { label: 'New delivery agent', routeLink: 'delivery-men/add' },
        ],
      },
      {
        icon: 'fal fa-box-open',
        label: 'Orders',
        isOpen: false,
        visibleFor: ['Employee', 'Admin', 'Seller', 'DeliveryAgent'],
        subItems: [
          { label: 'Orders list', routeLink: this.orderListRouteLink },
          ...(this.newOrderRouteLink ? [{
            label: 'New order',
            routeLink: this.newOrderRouteLink,
            visibleFor: ['Employee', 'Admin', 'Seller']
          }] : [])
        ],
      },
      {
        icon: 'fal fa-globe',
        label: 'Governorates',
        isOpen: false,
        visibleFor: ['Employee', 'Admin'],
        subItems: [
          { label: 'Governorates', routeLink: 'governrates' },
        ],
      },
      {
        icon: 'fal fa-city',
        label: 'Cities',
        isOpen: false,
        visibleFor: ['Employee', 'Admin'],
        subItems: [
          { label: 'Cities list', routeLink: 'Allcity' },
          { label: 'New City', routeLink: 'Addcity' },
        ],
      },
      {
        icon: 'fal fa-building',
        label: 'Branches',
        isOpen: false,
        visibleFor: ['Employee', 'Admin'],
        subItems: [
          { label: 'Branches list', routeLink: 'AllBranch' },
          { label: 'New Branch', routeLink: 'AddBranch' },
        ],
      },
      {
        routeLink: 'general-settings',
        icon: 'fal fa-cog',
        label: 'Settings',
        visibleFor: ['Employee', 'Admin'],
      },
    ];
  }

  toggleCollapse(): void {
    this.changeIsLeftSidebarCollapsed.emit(!this.isLeftSidebarCollapsed());
  }

  closeSidenav(): void {
    this.changeIsLeftSidebarCollapsed.emit(true);
  }

  toggleSubItems(selectedItem: MenuItem): void {
    this.items.forEach((item) => {
      if (item !== selectedItem) {
        item.isOpen = false;
      }
    });
    selectedItem.isOpen = !selectedItem.isOpen;
  }

  Logout(): void {
    this.authService.logout();
    this.router.navigate(['/landing']);
  }
}
