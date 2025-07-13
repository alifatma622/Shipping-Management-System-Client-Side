import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-image-slider',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterLink],
  templateUrl: './image-slider.component.html',
  styleUrl: './image-slider.component.css',
})
export class ImageSliderComponent implements OnInit, OnDestroy {
  constructor() {}

  private autoSlideInterval: any;
  public isPlaying = true;

  images = [
    'https://picsum.photos/id/1015/1200/600',
    'https://picsum.photos/id/1011/1200/600',
    'https://picsum.photos/id/1005/1200/600',
    'https://picsum.photos/id/1040/1200/600',
    'https://picsum.photos/id/1018/1200/600'
  ];

  sliderTexts = [
    {
      title: 'Fast Shipping Service',
      subtitle: 'We guarantee your order arrives in the shortest time possible',
      buttonText: 'Order Now'
    },
    {
      title: 'Safe and Efficient Delivery',
      subtitle: 'We care about the safety of your goods from start to finish',
      buttonText: 'Learn More'
    },
    {
      title: 'All Types of Carvex',
      subtitle: 'We handle all types of Carvex with high professionalism',
      buttonText: 'Our Services'
    },
    {
      title: 'Trackable Service',
      subtitle: 'Reliable tracking delivered on time',
      buttonText: 'Track Shipment'
    },
    {
      title: 'Your Service is Our Priority',
      subtitle: 'Your logistics, our priority',
      buttonText: 'Contact Us'
    }
  ];

  currentIndex = 0;
  progressWidth = 0;

  ngOnInit(): void {
    this.startAutoSlide();
  }

  ngOnDestroy(): void {
    this.clearAutoSlide();
  }

  nextImage(): void {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    this.resetProgress();
  }

  prevImage(): void {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    this.resetProgress();
  }

  goToImage(index: number): void {
    this.currentIndex = index;
    this.resetProgress();
  }

  private startAutoSlide(): void {
    this.autoSlideInterval = setInterval(() => {
      if (this.isPlaying) {
        this.nextImage();
      }
    }, 4000);
  }

  private clearAutoSlide(): void {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
  }

  private resetProgress(): void {
    this.progressWidth = 0;
    this.clearAutoSlide();

    this.autoSlideInterval = setInterval(() => {
      if (this.isPlaying) {
        this.nextImage();
      }
    }, 4000);

    setTimeout(() => {
      this.progressWidth = 100;
    }, 50);
  }

  onSliderEnter(): void {
    this.isPlaying = false;
  }

  onSliderLeave(): void {
    this.isPlaying = true;
  }

  onButtonClick(buttonText: string): void {
    console.log(`Button clicked: ${buttonText}`);
  }
}
