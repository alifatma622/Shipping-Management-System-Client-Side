import { NavbarComponent } from "../Navbar/Navbar.component";
import { ImageSliderComponent } from "../Slider/image-slider/image-slider.component";
import { ServiceComponent } from "../Services/service/service.component";
import { AskedQuestionsComponent } from "../Frequently/asked-questions/asked-questions.component";
import { AboutUsComponent } from "../About/about-us/about-us.component";
import { FooterComponent } from "../Footer/footer/footer.component";
import { ChatbotComponent } from '../chat-bot/chat-bot.component';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule, ViewportScroller } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';


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
    MatDialogModule,
    CommonModule
  ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css',
})

export class LandingComponent implements OnInit, OnDestroy {
  showBackToTop: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private viewportScroller: ViewportScroller,
    private dialog: MatDialog
  ) {}
  showChatbot = false;
  ngOnInit(): void {
    window.addEventListener('scroll', this.checkScroll);
    this.route.fragment.subscribe((fragment) => {
      if (fragment) {
        setTimeout(() => {
          const el = document.getElementById(fragment);

          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } else {
            console.warn('Element not found:', fragment);
          }
        }, 500);
      }
    });
  }

  checkScroll = () => {
    this.showBackToTop = window.scrollY > 400;
  };

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.checkScroll);
  }

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
