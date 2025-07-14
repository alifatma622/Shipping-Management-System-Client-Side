import { AuthServiceService , PermissionModel } from './../../Services/Auth_Services/auth-service.service';
import { Component, OnInit, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Department } from '../../Enum/Department';
import { forkJoin } from 'rxjs';

interface MenuItem {
  routeLink?: string;
  icon: string;
  label: string;
  isOpen?: boolean;
  visibleFor?: string[];
  visible?: boolean; // Fixed typo: visable -> visible
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
  permissions: { [departmentId: number]: PermissionModel } = {};

  isLeftSidebarCollapsed = input.required<boolean>();
  changeIsLeftSidebarCollapsed = output<boolean>();

  logout = {
    routeLink: 'logout',
    icon: 'fal fa-sign-out',
    isOpen: false,
    label: 'Log out',
  };

  constructor(private router: Router, public authService: AuthServiceService) {}

  ngOnInit(): void {
    this.initializeUserRoles();
  }

  private initializeUserRoles(): void {
    this.userRole = this.authService.getRole();
    const isAdmin = this.authService.hasRole('Admin');
    const role = this.userRole?.find(r => r !== 'Employee') ?? '';

    if (isAdmin) {
      this.orderListRouteLink = 'order';
      this.newOrderRouteLink = 'order/add';
      this.items = this.getMenuItems(); // Admin can view everything
      return;
    }

    if (this.authService.hasRole('DeliveryAgent')) {
      this.orderListRouteLink = 'order-delivery';
      this.items = this.getMenuItems();
      return;
    }

    if (this.authService.hasRole('Seller')) {
      this.orderListRouteLink = 'orders-seller';
      this.newOrderRouteLink = 'add-order-seller';
      this.items = this.getMenuItems();
      return;
    }

    // For other roles (like HR), fetch permissions first
    if (role && role !== 'Employee') {
  const departmentIds = Object.values(Department).filter(v => typeof v === 'number') as number[];
  const permissionCalls = departmentIds.map(depId =>
    this.authService.getPermissionFromApi(role, depId)
  );

  forkJoin(permissionCalls).subscribe(results => {
    console.log('✅ Permissions from API:', results);

    results.forEach(p => {
      this.permissions[p.department] = p;
    });

    // ✅ أضف هنا الروابط الخاصة بالطلبات:
    this.orderListRouteLink = 'order';
    this.newOrderRouteLink = 'order/add';

    this.items = this.getMenuItems();
    console.log('✅ Generated menu items:', this.items);
  });
}
 else {
      // For Employee role without specific permissions
      this.items = this.getMenuItems();
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
        visibleFor: ['Employee', 'Admin'], // Allow Employee role to see this
        visible: this.canView(Department.Employees),
        subItems: [
          { label: 'Employees list', routeLink: 'employee' },
          { label: 'New employee', routeLink: 'employee/add' },
        ],
      },
      {
        icon: 'fal fa-store',
        label: 'Sellers',
        isOpen: false,
        visibleFor: ['Employee', 'Admin'], // Allow Employee role to see this
        visible: this.canView(Department.Sellers),
        subItems: [
          { label: 'Sellers list', routeLink: 'seller' },
          { label: 'New seller', routeLink: 'seller/add' },
        ],
      },
      {
        icon: 'fal fa-truck',
        label: 'Delivery Agents',
        isOpen: false,
        visibleFor: ['Employee', 'Admin'], // Allow Employee role to see this
        visible: this.canView(Department.DeliveryMen),
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
        visible: this.canView(Department.Orders),
        subItems: [
          { label: 'Orders list', routeLink: this.orderListRouteLink },
          ...(this.newOrderRouteLink ? [{
            label: 'New order',
            routeLink: this.newOrderRouteLink,
            visibleFor: ['Admin', 'Seller']
          }] : [])
        ],
      },
      {
        icon: 'fal fa-globe',
        label: 'Governorates',
        isOpen: false,
        visible: this.canView(Department.Governorates),
        visibleFor: ['Employee', 'Admin'], // Allow Employee role to see this
        subItems: [
          { label: 'Governorates', routeLink: 'governrates' },
        ],
      },
      {
        icon: 'fal fa-city',
        label: 'Cities',
        isOpen: false,
        visibleFor: ['Employee', 'Admin'],
        visible: this.canView(Department.Cities),
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
        visible: this.canView(Department.Branches),
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
        visible: this.canView(Department.GeneralSetting)
      },
      {
        routeLink: 'roles',
        icon: 'fal fa-shield-halved',
        label: 'Authorization',
        visibleFor: ['Admin'],
      }
    ];
  }

  toggleCollapse(): void {
    this.changeIsLeftSidebarCollapsed.emit(!this.isLeftSidebarCollapsed());
  }

  canView(departmentId: number): boolean {
    if (this.authService.hasRole('Admin')) return true;
    if (departmentId === Department.Orders &&
      (this.authService.hasRole('Seller') || this.authService.hasRole('DeliveryAgent'))) {
    return true;
  }
    return this.permissions[departmentId]?.view ?? false;
  }

  shouldShowMenuItem(item: MenuItem): boolean {
    // Check role-based visibility first
    if (item.visibleFor && !this.authService.hasAnyRole(item.visibleFor)) {
      return false;
    }

    // If item has a visible property, check it
    if (item.visible !== undefined) {
      return item.visible;
    }

    // If no visible property, default to true (show the item)
    return true;
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
