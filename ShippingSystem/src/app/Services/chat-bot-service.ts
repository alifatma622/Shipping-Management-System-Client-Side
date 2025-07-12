// chatbot.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ChatBotService {
  private settingsUrl = `${environment.baseUrl}/api/GeneralSettings`; // Update if needed

  constructor(private http: HttpClient) {}

  getGeneralSettings(): Observable<any> {
    return this.http.get(this.settingsUrl);
  }
}
