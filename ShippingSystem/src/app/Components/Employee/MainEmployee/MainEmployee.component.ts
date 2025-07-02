import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReadEmployeeDTO } from '../../../Models/employee';
import { EmployeeService } from '../../../Services/Employee-Services/Employee.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-MainEmployee',
  imports: [RouterModule,FormsModule], 
  templateUrl: './MainEmployee.component.html',
  styleUrls: ['./MainEmployee.component.css']
})
export class MainEmployeeComponent implements OnInit {
  public employees:ReadEmployeeDTO[] =[];
  constructor(private EmployeeService:EmployeeService) { }

  ngOnInit() {
    this.EmployeeService.getAllEmployees().subscribe({
      next: (response) => {
        this.employees = response;
      },
      error: (error) => {
        console.error('Error fetching employees:', error);
      }
    });
  }


}
