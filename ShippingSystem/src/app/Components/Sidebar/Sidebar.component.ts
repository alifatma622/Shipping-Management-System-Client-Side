import { Component, OnInit,input,output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
@Component({
  selector: 'app-Sidebar',
  imports: [CommonModule, RouterModule],
  templateUrl: './Sidebar.component.html',
  styleUrls: ['./Sidebar.component.css']
})
export class SidebarComponent {

  isLeftSidebarCollapsed = input.required<boolean>();
  changeIsLeftSidebarCollapsed = output<boolean>();
  items = [
    {
      routeLink: 'dashboard',
      icon: 'fal fa-home',
      label: 'Dashboard'
    },
    {
      routeLink: 'employees',
      icon: 'fal fa-user-tie',
      label: 'Employees',
      isOpen: false,
      subItems : [{label:'Employees dashboard' , routeLink:''},{label:'New employee', routeLink:''}]
    },
    {
      routeLink: 'sellers',
      icon: 'fal fa-store',
      label: 'Sellers',
      isOpen: false,
      subItems : [{label:'Sellers dashboard', routeLink:''} ,{label:'New seller', routeLink:''}]
    },
    {
      routeLink: 'deliveragent',
      icon: 'fal fa-truck',
      label: 'Delivery Agents',
       isOpen: false,
      subItems : [{label:'Deliver agents dashboard', routeLink:''} ,{label:'New delivery agent ', routeLink:''}]
    },
    {
      routeLink: 'governorates',
      icon: 'fal fa-globe',
      label: 'Governorates',
       isOpen: false,
      subItems : [{label:'Governorates dashboard', routeLink:''} ,{label:'New Governorate', routeLink:''}]
    },
    {
      routeLink: 'cities',
      icon: 'fal fa-city',
      label: 'Cities',
      isOpen: false,
      subItems : [{label:'Cities dashboard', routeLink:''} ,{label:'New City', routeLink:''}]
    },
    {
      routeLink: 'branches',
      icon: 'fal fa-building',
      label: 'Branches',
       isOpen: false,
      subItems : [{label:'Branches dashboard', routeLink:'' },{label:'New Branch' , routeLink:''}]
    },
    // {
    //   routeLink: 'products',
    //   icon: 'fal fa-box-open',
    //   label: 'Products',
    // },
    // {
    //   routeLink: 'pages',
    //   icon: 'fal fa-file',
    //   label: 'Pages',
    // },
    {
      routeLink: 'settings',
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
  this.items.forEach(item => {
    if (item !== selectedItem) {
      item.isOpen = false;
    }
  });
  selectedItem.isOpen = !selectedItem.isOpen;
}
} 
