import { CommonModule } from '@angular/common';
import { Component, computed, input, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainEmployeeComponent } from "../Employee/MainEmployee/MainEmployee.component";

@Component({
  selector: 'app-Main',
  imports: [ CommonModule, MainEmployeeComponent],
  templateUrl: './Main.component.html',
  styleUrls: ['./Main.component.css']
})
export class MainComponent implements OnInit {
 isLeftSidebarCollapsed = input.required<boolean>();
  screenWidth = input.required<number>();
  constructor() { }

  ngOnInit() {
  }

  sizeClass = computed(() => {
    const isLeftSidebarCollapsed = this.isLeftSidebarCollapsed();
    if (isLeftSidebarCollapsed) {
      return 'sidebar-collapsed';
    }
    return this.screenWidth() > 768 ? 'body-trimmed' : 'body-md-screen';
  });
}
