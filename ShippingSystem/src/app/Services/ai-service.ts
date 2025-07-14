import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

@Injectable({
  providedIn: 'root'
})
export class AiService {


  private readonly HF_TOKEN = '';
  private readonly PROVIDER = '';
  private readonly MODEL_ID = '';
  private readonly API_URL = ``;
  private readonly MAX_HISTORY = 10;

  private messages: ChatMessage[] = [
    {
      role: 'system',
      content: 'You are a helpful assistant. Only tell a story if the user asks for one.'
    }
  ];

  constructor(private http: HttpClient) {}

  async ask(question: string, context?: string[]): Promise<string> {
    // تحديث رسالة النظام إذا تم تمرير سياق
    this.messages[0].content = context
      ? `You are a helpful assistant. Use the following data if helpful:\n${context.join('\n')}`
      : 'You are a helpful assistant. Only tell a story if the user asks for one.';

    this.messages.push({ role: 'user', content: question });

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.HF_TOKEN}`,
      'Content-Type': 'application/json'
    });

    const body = {
      model: this.MODEL_ID,
      messages: this.messages,
      temperature: 0.7,
      max_tokens: 256
    };

    try {
      const response: any = await firstValueFrom(
        this.http.post(this.API_URL, body, { headers })
      );

      const aiReply = response?.choices?.[0]?.message?.content || 'No reply.';
      this.messages.push({ role: 'assistant', content: aiReply });

      // التحكم في عدد الرسائل
      if (this.messages.length > this.MAX_HISTORY * 2 + 1) {
        this.messages.splice(1, 2); // حذف الرسائل القديمة
      }

      return aiReply;
    } catch (error) {
      console.error('AI error:', error);
      return '❌ Sorry, I encountered an error. Please try again.';
    }
  }

  pushLocalResponse(question: string, answer: string): void {
    this.messages.push({ role: 'user', content: question });
    this.messages.push({ role: 'assistant', content: answer });

    if (this.messages.length > this.MAX_HISTORY * 2 + 1) {
      this.messages.splice(1, 2);
    }
  }
}
