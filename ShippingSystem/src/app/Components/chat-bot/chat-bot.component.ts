import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CityService, ICity } from '../../Services/city.service';
import { GeneralSettingsServiceTsService, GeneralSetting } from './../../Services/GeneralSettings/general-settings.service';
import { AiService } from '../../Services/ai-service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  templateUrl: './chat-bot.component.html',
  styleUrls: ['./chat-bot.component.css'],
  imports: [FormsModule, CommonModule, HttpClientModule]
})
export class ChatbotComponent implements OnInit {
  question = '';
  response = '';
  isLoading = false;

  settings!: GeneralSetting;
  cities: ICity[] = [];

  constructor(
    private settingsService: GeneralSettingsServiceTsService,
    private cityService: CityService,
    private aiService: AiService
  ) {}

  ngOnInit(): void {
    this.settingsService.getSettings().subscribe({
      next: res => this.settings = res
    });

    this.cityService.getAllCities().subscribe({
      next: res => this.cities = res
    });
  }

  ask(): void {
    const q = this.question.trim().toLowerCase();
    if (!q) return;

    this.isLoading = true;
    this.response = '';

    const cleanQuestion = q.replace(/[^\w\s\u0600-\u06FF]/g, '');

    const cityAliases: Record<string, string> = {
      alex: 'alexandria',
      اسكندرية: 'alexandria',
      banha: 'banha',
      بنها: 'banha',
      cairo: 'cairo',
      القاهره: 'cairo',
      qalyub: 'qalyub',
      قليوب: 'qalyub'
    };

    let foundCity: ICity | undefined;
    for (const city of this.cities) {
      const cityName = city.name.toLowerCase();
      const aliases = Object.entries(cityAliases).filter(([k, v]) => v === cityName).map(([k]) => k);
      const matches = [cityName, ...aliases];

      if (matches.some(m => cleanQuestion.includes(m))) {
        foundCity = city;
        break;
      }
    }

    // 1. الشحن
    if (cleanQuestion.includes('city') || cleanQuestion.includes('شحن') || cleanQuestion.includes('تشحن')) {
      if (foundCity) {
        this.response = `✅ Yes, we ship to ${foundCity.name} (${foundCity.governorateName}).`;
      } else {
        this.response = '❌ Sorry, we currently do not ship to this city or the city name is not recognized.';
      }
      this.aiService.pushLocalResponse(this.question, this.response);
      this.isLoading = false;
      return;
    }

    // 2. السعر
    if (foundCity && (cleanQuestion.includes('price') || cleanQuestion.includes('سعر') || cleanQuestion.includes('تكلفة') || cleanQuestion.includes('كام'))) {
      let priceText = `🏙 Shipping to ${foundCity.name} (${foundCity.governorateName}) costs:\n`;
      priceText += `• Normal Delivery: ${foundCity.normalPrice} EGP\n`;
      priceText += `• Pickup Delivery: ${foundCity.pickupPrice} EGP`;
      this.response = priceText;
      this.aiService.pushLocalResponse(this.question, this.response);
      this.isLoading = false;
      return;
    }

    // 3. الكيلو الإضافي
    if (cleanQuestion.includes('extra') && cleanQuestion.includes('kg') || cleanQuestion.includes('الكيلو') && cleanQuestion.includes('الإضافي')) {
      this.response = `📦 Extra kilogram price is ${this.settings.extraPriceKg} EGP.`;
      this.aiService.pushLocalResponse(this.question, this.response);
    }
    // 4. القرى
    else if (cleanQuestion.includes('village') || cleanQuestion.includes('قرية') || cleanQuestion.includes('القرى')) {
      this.response = `🚚 Extra price for village delivery is ${this.settings.extraPriceVillage} EGP.`;
      this.aiService.pushLocalResponse(this.question, this.response);
    }
    // 5. الشحن السريع
    else if (cleanQuestion.includes('fast') || cleanQuestion.includes('السريع')) {
      this.response = `⚡ Fast delivery costs ${this.settings.fast * 100}% more.`;
      this.aiService.pushLocalResponse(this.question, this.response);
    }
    // 6. الشحن السريع جداً
    else if (cleanQuestion.includes('express') || cleanQuestion.includes('إكسبريس')) {
      this.response = `🚀 Express delivery costs ${this.settings.express * 100}% more.`;
      this.aiService.pushLocalResponse(this.question, this.response);
    }
    // 7. استخدم الذكاء الاصطناعي
    else {
      this.response = '🤔 Let me think...';

      const context: string[] = [
        `Extra kilo price: ${this.settings.extraPriceKg}`,
        `Village delivery extra price: ${this.settings.extraPriceVillage}`,
        `Fast delivery extra: ${this.settings.fast * 100}%`,
        `Express delivery extra: ${this.settings.express * 100}%`,
        ...this.cities.map(c => `City: ${c.name}, Governorate: ${c.governorateName}, Normal: ${c.normalPrice}, Pickup: ${c.pickupPrice}`)
      ];

      this.aiService.ask(this.question, context).then(aiReply => {
        this.response = aiReply;
        this.isLoading = false;
      }).catch(error => {
        this.response = '❌ Failed to get AI response.';
        this.isLoading = false;
      });

      return;
    }

    this.isLoading = false;
  }
}
