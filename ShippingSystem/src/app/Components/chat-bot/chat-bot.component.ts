import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CityService, ICity } from '../../Services/city.service';
import { GeneralSettingsServiceTsService, GeneralSetting } from './../../Services/GeneralSettings/general-settings.service';
import { AiService } from '../../Services/ai-service';
import { HttpClientModule } from '@angular/common/http';
import { Subject, takeUntil } from 'rxjs';

interface ChatMessage {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface QuickSuggestion {
  text: string;
  icon: string;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  templateUrl: './chat-bot.component.html',
  styleUrls: ['./chat-bot.component.css'],
  imports: [FormsModule, CommonModule, HttpClientModule]
})
export class ChatbotComponent implements OnInit, OnDestroy {
  @ViewChild('chatMessages', { static: false }) chatMessagesElement!: ElementRef;
  @ViewChild('questionInput', { static: false }) questionInput!: ElementRef;

  private destroy$ = new Subject<void>();

  // Chat state
  question = '';
  response = '';
  isLoading = false;
  showHistory = false;
  chatHistory: ChatMessage[] = [];

  // Data
  settings!: GeneralSetting;
  cities: ICity[] = [];

  // Quick suggestions
  quickSuggestions: QuickSuggestion[] = [
    { text: 'What cities do you ship to?', icon: '🏙️' },
    { text: 'How much does shipping cost?', icon: '💰' },
    { text: 'Do you have fast delivery?', icon: '⚡' },
    { text: 'Can you deliver to villages?', icon: '🏘️' },
    { text: 'What is the extra weight charge?', icon: '📦' }
  ];

  // Enhanced city aliases
  private readonly cityAliases: Record<string, string> = {
    alex: 'alexandria', اسكندرية: 'alexandria', إسكندرية: 'alexandria',
    banha: 'banha', بنها: 'banha',
    cairo: 'cairo', القاهره: 'cairo', القاهرة: 'cairo',
    qalyub: 'qalyub', قليوب: 'qalyub'
  };

  // Enhanced keywords
  private readonly keywords = {
    shipping: ['ship', 'deliver', 'شحن', 'تشحن', 'توصيل', 'city', 'مدينة', 'مدن'],
    pricing: ['price', 'cost', 'سعر', 'تكلفة', 'كام', 'بكام', 'فلوس'],
    extraKg: ['extra', 'kg', 'kilo', 'الكيلو', 'الإضافي', 'زيادة'],
    village: ['village', 'قرية', 'القرى', 'ريف'],
    fast: ['fast', 'quick', 'السريع', 'عاجل'],
    express: ['express', 'إكسبريس', 'فوري'],
    help: ['help', 'مساعدة', 'ساعدني'],
    greeting: ['hello', 'hi', 'مرحبا', 'أهلا', 'السلام']
  };

  constructor(
    private settingsService: GeneralSettingsServiceTsService,
    private cityService: CityService,
    private aiService: AiService
  ) {}

  ngOnInit(): void {
    this.loadSettings();
    this.loadCities();
    this.response = '👋 Hello! I\'m here to help you with shipping information. What would you like to know?';
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadSettings(): void {
    this.settingsService.getSettings()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: res => this.settings = res,
        error: err => console.error('Settings error:', err)
      });
  }

  private loadCities(): void {
    this.cityService.getAllCities()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: res => this.cities = res,
        error: err => console.error('Cities error:', err)
      });
  }

  private addToHistory(question: string, response: string): void {
    this.chatHistory.push({
      text: question,
      isUser: true,
      timestamp: new Date()
    });
    this.chatHistory.push({
      text: response,
      isUser: false,
      timestamp: new Date()
    });

    // Keep only last 20 messages
    if (this.chatHistory.length > 20) {
      this.chatHistory = this.chatHistory.slice(-20);
    }
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      if (this.chatMessagesElement) {
        this.chatMessagesElement.nativeElement.scrollTop =
          this.chatMessagesElement.nativeElement.scrollHeight;
      }
    }, 100);
  }

  useSuggestion(suggestion: QuickSuggestion): void {
    this.question = suggestion.text;
    this.focusInput();
  }

  private focusInput(): void {
    setTimeout(() => {
      if (this.questionInput) {
        this.questionInput.nativeElement.focus();
      }
    }, 100);
  }

  async ask(): Promise<void> {
    const q = this.question.trim();
    if (!q || this.isLoading) return;

    this.isLoading = true;
    const userQuestion = this.question;
    this.question = '';

    try {
      const response = await this.processQuestion(q);
      this.response = response;
      this.addToHistory(userQuestion, response);

      if (this.showHistory) {
        this.scrollToBottom();
      }
    } catch (error) {
      console.error('Error:', error);
      this.response = '❌ Sorry, I encountered an error. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }

private async processQuestion(question: string): Promise<string> {
  if (!this.settings || !this.cities.length) {
    return '⏳ Still loading data. Please wait a moment and try again.';
  }

  const cleanQuestion = question.trim().toLowerCase()
    .replace(/[^\w\s\u0600-\u06FF]/g, '');

  const foundCity = this.findCityInQuestion(cleanQuestion);

  // ✅ First: check fast delivery
  if (this.containsKeywords(cleanQuestion, this.keywords.fast)) {
    return `⚡ Fast delivery service:\n• Additional cost: ${this.settings.fast * 100}% of base price\n• Reduced delivery time\n• Priority processing`;
  }

  // ✅ Express delivery
  if (this.containsKeywords(cleanQuestion, this.keywords.express)) {
    return `🚀 Express delivery service:\n• Premium option: ${this.settings.express * 100}% of base price\n• Same-day or next-day delivery\n• Highest priority processing`;
  }

  // ✅ Extra KG
  if (this.containsKeywords(cleanQuestion, this.keywords.extraKg)) {
    return `📦 Extra kilogram charge: ${this.settings.extraPriceKg} EGP per kg`;
  }
  if (this.containsKeywords(cleanQuestion, this.keywords.pricing)) {
  return foundCity
    ? this.getPricingResponse(foundCity)
    : this.getPricingBreakdownResponse();
}


  // ✅ Village shipping
  if (
    this.containsKeywords(cleanQuestion, this.keywords.village) &&
    this.containsKeywords(cleanQuestion, this.keywords.shipping)
  ) {
    return `🏘️ Yes, we deliver to villages!\n• Extra charge: ${this.settings.extraPriceVillage} EGP\n• May require extra delivery time`;
  }

  // ✅ General village info
  if (this.containsKeywords(cleanQuestion, this.keywords.village)) {
    return `🏘️ Village delivery service:\n• Extra charge: ${this.settings.extraPriceVillage} EGP\n• May require extra delivery time`;
  }
  if (foundCity && this.containsKeywords(cleanQuestion, this.keywords.pricing)) {
  return this.getPricingResponse(foundCity);
}
  // ✅ Shipping first
  if (this.containsKeywords(cleanQuestion, this.keywords.shipping)) {
    return this.getShippingResponse(foundCity);
  }

  // ✅ Pricing
  if (this.containsKeywords(cleanQuestion, this.keywords.pricing)) {
    return this.getPricingResponse(foundCity);
  }

  // ✅ Greetings AFTER main logic
  if (this.containsKeywords(cleanQuestion, this.keywords.greeting)) {
    return this.getGreetingResponse();
  }

  // ✅ Help AFTER main logic
  if (this.containsKeywords(cleanQuestion, this.keywords.help)) {
    return this.getHelpResponse();
  }

  // Fallback to AI
  return this.getAiResponse(question);
}
private getPricingBreakdownResponse(): string {
  return `💰 Shipping cost depends on several factors:

• 🏙️ Seller & customer cities (distance-based)
• 📦 Extra weight: +${this.settings.extraPriceKg} EGP per extra kg
• 🏘️ Village delivery: +${this.settings.extraPriceVillage} EGP
• 🕒 Delivery speed:
   - Normal: standard rate
   - Fast: +${this.settings.fast * 100}% fee
   - Express: +${this.settings.express * 100}% fee
• 🛍️ Pickup orders may have reduced or no delivery fee

To get exact pricing, please mention the seller & customer cities.`;
}


  private containsKeywords(text: string, keywords: string[]): boolean {
    return keywords.some(keyword => text.includes(keyword));
  }

  private findCityInQuestion(question: string): ICity | undefined {
    for (const city of this.cities) {
      const cityName = city.name.toLowerCase();
      const aliases = Object.entries(this.cityAliases)
        .filter(([k, v]) => v === cityName)
        .map(([k]) => k);

      const matches = [cityName, ...aliases];

      if (matches.some(match => question.includes(match))) {
        return city;
      }
    }
    return undefined;
  }

  private getGreetingResponse(): string {
    const greetings = [
      '👋 Hello! How can I help you with shipping today?',
      '🌟 Hi there! I\'m here to assist you with delivery information.',
      '😊 Welcome! What would you like to know about our shipping services?'
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  private getHelpResponse(): string {
    return `🤝 I can help you with:\n\n• 🏙️ Shipping availability to different cities\n• 💰 Delivery pricing information\n• ⚡ Fast and express delivery options\n• 🏘️ Village delivery information\n• 📦 Extra weight charges\n\nJust ask me anything about shipping!`;
  }

  private getShippingResponse(foundCity?: ICity): string {
    if (foundCity) {
      return `✅ Yes, we ship to ${foundCity.name} (${foundCity.governorateName})!\n\nWould you like to know the shipping prices for this city?`;
    }

    if (this.cities.length > 0) {
      const topCities = this.cities.slice(0, 6);
      return `🏙️ We ship to many cities including:\n\n${topCities.map(city => `• ${city.name} (${city.governorateName})`).join('\n')}\n\nAnd many more! Just mention your city name to check availability.`;
    }

    return 'We ship to many cities across Egypt. Please mention your specific city name to check availability.';
  }

  private getPricingResponse(foundCity?: ICity): string {
    if (foundCity) {
      return `💰 Shipping to ${foundCity.name} (${foundCity.governorateName}):\n\n• 🚚 Normal Delivery: ${foundCity.normalPrice} EGP\n• 📦 Pickup Delivery: ${foundCity.pickupPrice} EGP\n\nNeed information about fast delivery or extra charges?`;
    }

    return `💰 To get exact pricing, please mention your city name.\n\nOur pricing varies by location and includes:\n• Normal delivery service\n• Pickup delivery option\n• Additional charges for extra weight and village delivery`;
  }

  private async getAiResponse(question: string): Promise<string> {
    const context = this.buildContext();

    try {
      const aiReply = await this.aiService.ask(question, context);
      this.aiService.pushLocalResponse(question, aiReply);
      return aiReply;
    } catch (error) {
      console.error('AI service error:', error);
      return `❌ I couldn't process your question right now. Please try asking about:\n• Shipping cities and availability\n• Delivery pricing\n• Fast/Express delivery options\n• Village delivery information`;
    }
  }

  private buildContext(): string[] {
    const context: string[] = [
      `Shipping service information:`,
      `Extra kilo price: ${this.settings.extraPriceKg} EGP`,
      `Village delivery extra: ${this.settings.extraPriceVillage} EGP`,
      `Fast delivery extra: ${this.settings.fast * 100}% more`,
      `Express delivery extra: ${this.settings.express * 100}% more`,
      `Available cities:`,
      ...this.cities.map(city =>
        `${city.name} (${city.governorateName}): Normal ${city.normalPrice} EGP, Pickup ${city.pickupPrice} EGP`
      )
    ];

    return context;
  }

  toggleHistory(): void {
    this.showHistory = !this.showHistory;
    if (this.showHistory) {
      this.scrollToBottom();
    }
  }

  clearHistory(): void {
    this.chatHistory = [];
    this.response = '👋 Chat cleared! How can I help you with shipping information?';
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.ask();
    }
  }

  formatTime(date: Date): string {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}
