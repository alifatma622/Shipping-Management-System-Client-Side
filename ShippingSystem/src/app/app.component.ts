import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LandingComponent } from './../Components/landing/landing.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [LandingComponent, RouterOutlet],
})
export class AppComponent {
  title = 'ShippingSystem';
}
