import { CommonModule } from '@angular/common';
import { Component, computed, input, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AddDeliveryManComponent } from '../delivery-men/add-delivery-man/add-delivery-man.component';

@Component({
  selector: 'app-Main',
  imports: [ CommonModule, RouterOutlet],
  templateUrl: './Main.component.html',
  styleUrls: ['./Main.component.css'],
})
<<<<<<< HEAD
export class MainComponent implements OnInit {
  isLeftSidebarCollapsed = input.required<boolean>();
  screenWidth = input.required<number>();
  constructor() {}

  ngOnInit() {}

=======
export class MainComponent {
 isLeftSidebarCollapsed = input.required<boolean>();
  screenWidth = input.required<number>();
>>>>>>> origin/sara
  sizeClass = computed(() => {
    const isLeftSidebarCollapsed = this.isLeftSidebarCollapsed();
    if (isLeftSidebarCollapsed) {
      return '';
    }
    return this.screenWidth() > 768 ? 'body-trimmed' : 'body-md-screen';
  });
}
