import { Component, OnInit, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterModule } from '@angular/router';
@Component({
  selector: 'app-Sidebar',
  imports: [CommonModule, RouterModule],
  templateUrl: './Sidebar.component.html',
  styleUrls: ['./Sidebar.component.css'],
})
export class SidebarComponent {
  constructor(private router: Router) {}

  isLeftSidebarCollapsed = input.required<boolean>();
  changeIsLeftSidebarCollapsed = output<boolean>();
  items = [
    {
      routeLink: 'dashboard',
      icon: 'fal fa-home',
      label: 'Dashboard',
    },
    {
      icon: 'fal fa-user-tie',
      label: 'Employees',
      isOpen: false,
      subItems: [
        { label: 'Employees list', routeLink: 'employee' },
        { label: 'New employee', routeLink: 'employee/add' },
      ],
    },
    {
      icon: 'fal fa-store',
      label: 'Sellers',
      isOpen: false,
      subItems: [
        { label: 'Sellers list', routeLink: 'seller' },
        { label: 'New seller', routeLink: 'seller/add' },
      ],
    },
    {
      icon: 'fal fa-truck',
      label: 'Delivery Agents',
      isOpen: false,
      subItems: [
        { label: 'Deliver agents list', routeLink: 'delivery-men' },
        { label: 'New delivery agent ', routeLink: 'delivery-men/add' },
      ],
    },
    {
      icon: 'fal fa-box-open',
      label: 'Orders',
      isOpen: false,
      subItems: [
        { label: 'Orders list', routeLink: 'order' },
        { label: 'Add order', routeLink: 'order/add' },
      ],
    },
    {
      icon: 'fal fa-globe',
      label: 'Governorates',
      isOpen: false,
      subItems: [
        { label: 'Governorates list', routeLink: 'governrates' },
        { label: 'Add Governorate', routeLink: 'add-governrate' },
      ],
    },
    {
      icon: 'fal fa-city',
      label: 'Cities',
      isOpen: false,
      subItems: [
        { label: 'Cities dashboard', routeLink: 'Allcity' },
        { label: 'New City', routeLink: 'Addcity' },
      ],
    },
    {
      icon: 'fal fa-building',
      label: 'Branches',
      isOpen: false,
      subItems: [
        { label: 'Branches dashboard', routeLink: 'AllBranch' },
        { label: 'New Branch', routeLink: 'AddBranch' },
      ],
    },
    //   label: 'Products',
    // },
    // {
    //   routeLink: 'pages',
    //   icon: 'fal fa-file',
    //   label: 'Pages',
    // },
    {
      routeLink: 'general-settings',
      icon: 'fal fa-cog',
      label: 'Settings',
    },
  ];

  toggleCollapse(): void {
    this.changeIsLeftSidebarCollapsed.emit(!this.isLeftSidebarCollapsed());
  }

  closeSidenav(): void {
    this.changeIsLeftSidebarCollapsed.emit(true);
  }

  toggleSubItems(selectedItem: any) {
    this.items.forEach((item) => {
      if (item !== selectedItem) {
        item.isOpen = false;
      }
    });
    selectedItem.isOpen = !selectedItem.isOpen;
  }
}
