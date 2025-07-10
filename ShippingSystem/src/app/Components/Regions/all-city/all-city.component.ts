import { Component, OnInit } from '@angular/core';
import { CityServiceService } from '../../../Services/City_Services/city-service.service';
import { CityModel } from '../../../Models/CityModels/city-model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-all-city',
  imports: [CommonModule, FormsModule],
  templateUrl: './all-city.component.html',
  styleUrl: './all-city.component.css',
})
export class AllCityComponent implements OnInit {
  searchTerm: string = '';
  cities: CityModel[] = [];
  totalCount: number = 0;
  currentPage: number = 1;
  itemsPerPage: number = 5;
  itemsPerPageOptions: number[] = [5, 10, 15];

  constructor(
    private _cityService: CityServiceService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.getCities();
  }

  getCities(): void {
    this._cityService.getAllCities(this.currentPage, this.itemsPerPage).subscribe({
      next: (data) => {
        this.cities = data.items;
        this.totalCount = data.totalCount;
      },
      error: (err) => {
        this.cities = [];
        this.totalCount = 0;
        // ممكن تعرض رسالة خطأ هنا
      }
    });
  }

  get totalPages(): number {
    return Math.ceil(this.totalCount / this.itemsPerPage);
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.getCities();
    }
  }

  onItemsPerPageChange(): void {
    this.currentPage = 1;
    this.getCities();
  }

  onSearch(event?: Event) {
    if (event) event.preventDefault();
    this.currentPage = 1;
    // لو عايز تبحث من السيرفر، ابعت searchTerm في params هنا
    // حالياً البحث محلي فقط
  }

  onEdit(city: CityModel) {
    this._router.navigate(['dashboard/Updatecity', city.id]);
  }

  onDelete(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This city will be deleted permanently!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#055866',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this._cityService.deleteCity(id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'City has been deleted.',
              confirmButtonColor: '#055866',
            });
            this.getCities();
          },
          error: (err) => {
            console.error(err);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: err.error?.message || 'Failed to delete city.',
            });
          },
        });
      }
    });
  }

  filteredCities(): CityModel[] {
    if (this.searchTerm == '') {
      return this.cities;
    } else {
      return this.cities.filter((city) => {
        return city.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      });
    }
  }

  onAddCity() {
    this._router.navigate(['dashboard/Addcity']);
  }
}
