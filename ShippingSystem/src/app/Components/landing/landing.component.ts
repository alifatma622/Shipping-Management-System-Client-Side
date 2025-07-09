import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from "../Navbar/Navbar.component";
import { ImageSliderComponent } from "../Slider/image-slider/image-slider.component";
import { ServiceComponent } from "../Services/service/service.component";
import { AskedQuestionsComponent } from "../Frequently/asked-questions/asked-questions.component";
import { AboutUsComponent } from "../About/about-us/about-us.component";
import { FooterComponent } from "../Footer/footer/footer.component";

@Component({
  selector: 'app-landing',
  imports: [RouterModule, NavbarComponent, ImageSliderComponent, ServiceComponent, AskedQuestionsComponent, AboutUsComponent, FooterComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {

}
