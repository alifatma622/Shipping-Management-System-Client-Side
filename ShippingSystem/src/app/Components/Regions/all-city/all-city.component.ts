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
  constructor(
    private _cityService: CityServiceService,
    private _router: Router
  ) {}

  // for test pagination

  currentPage: number = 1;
  itemsPerPage: number = 5;
  itemsPerPageOptions: number[] = [5, 10, 15];

  get pagedCities(): any[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredCities().slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredCities().length / this.itemsPerPage);
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  onItemsPerPageChange(): void {
    this.currentPage = 1;
  }

  onSearch(event?: Event) {
    if (event) event.preventDefault();
    this.currentPage = 1;
  }

  /* All Of This Will Be Remove When APi Working */

  ngOnInit(): void {
    // this Is Code To Catch API When Worked
    // this._cityService.getAllCities().subscribe((data) => {
    //   this.cities = data;
    // });

    this.cities = [
      {
        name: 'Cairo',
        normalPrice: 50,
        pickupPrice: 30,
        governorateName: 'Cairo Gov',
        id: 1,
      },
      {
        name: 'Cairo',
        normalPrice: 50,
        pickupPrice: 30,
        governorateName: 'Cairo Gov',
        id: 1,
      },
      {
        name: 'Cairo',
        normalPrice: 50,
        pickupPrice: 30,
        governorateName: 'Cairo Gov',
        id: 1,
      },
      {
        name: 'Cairo',
        normalPrice: 50,
        pickupPrice: 30,
        governorateName: 'Cairo Gov',
        id: 1,
      },
      {
        name: 'Cairo',
        normalPrice: 50,
        pickupPrice: 30,
        governorateName: 'Cairo Gov',
        id: 1,
      },
      {
        name: 'Cairo',
        normalPrice: 50,
        pickupPrice: 30,
        governorateName: 'Cairo Gov',
        id: 1,
      },
      {
        name: 'Cairo',
        normalPrice: 50,
        pickupPrice: 30,
        governorateName: 'Cairo Gov',
        id: 1,
      },
      {
        name: 'Alexandria',
        normalPrice: 60,
        pickupPrice: 40,
        governorateName: 'Alex Gov',
        id: 2,
      },
    ];
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
        // This Making For Testing Only
        this.cities = this.cities.filter((c) => c.id !== id);
        this._cityService.deleteCity(id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'City has been deleted.',
              confirmButtonColor: '#055866',
            });
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
    console.log('Add City clicked');

    this._router.navigate(['dashboard/Addcity']);
  }
}
