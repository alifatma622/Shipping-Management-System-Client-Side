import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-asked-questions',
  imports: [CommonModule],
  templateUrl: './asked-questions.component.html',
  styleUrl: './asked-questions.component.css',
})
export class AskedQuestionsComponent {
  activeIndex: number | null = 0;
  faqs = [
    {
      question: 'What types of cargo does Carves handle?',
      answer:
        'Carves handles a wide range of cargo types including industrial, commercial, and personal goods.',
    },
    {
      question: 'How can I track my shipment with Carves?',
      answer:
        'You can track your shipment through our tracking system using your shipment ID.',
    },
    {
      question: 'Does Carves offer international shipping services?',
      answer:
        'Yes, Carves provides international logistics and shipping services worldwide.',
    },
    {
      question: 'How secure are Carves warehouse facilities?',
      answer:
        'Our warehouses are equipped with 24/7 surveillance and advanced security systems.',
    },
  ];

  toggleQuestion(index: number): void {
    this.activeIndex = this.activeIndex === index ? null : index;
  }
}
