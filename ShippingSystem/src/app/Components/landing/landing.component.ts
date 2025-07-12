import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from "../Navbar/Navbar.component";
import { ImageSliderComponent } from "../Slider/image-slider/image-slider.component";
import { ServiceComponent } from "../Services/service/service.component";
import { AskedQuestionsComponent } from "../Frequently/asked-questions/asked-questions.component";
import { AboutUsComponent } from "../About/about-us/about-us.component";
import { FooterComponent } from "../Footer/footer/footer.component";
import { ChatbotComponent } from '../chat-bot/chat-bot.component';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-landing',
  imports: [
    CommonModule,
    FormsModule,
    ChatbotComponent,
    RouterModule,
    NavbarComponent,
    ImageSliderComponent,
    ServiceComponent,
    AskedQuestionsComponent,
    AboutUsComponent,
    FooterComponent,
    MatDialogModule
  ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {
  constructor(private dialog: MatDialog) {}

  showChatbot = false;

  toggleChatbot(): void {
    this.showChatbot = !this.showChatbot;
  }

  openChatbot(): void {
    this.dialog.open(ChatbotComponent, {
      width: '600px',
      maxHeight: '90vh',
      autoFocus: false,
      panelClass: 'chatbot-dialog-panel'
    });
  }
}
