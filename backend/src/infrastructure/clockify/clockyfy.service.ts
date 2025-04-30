import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import fetch from 'node-fetch';

@Injectable()
export class ClockifyService {
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor(private readonly configService: ConfigService) {
    this.baseUrl = this.configService.get<string>('CLOCKIFY_API_URL') || 'https://api.clockify.me/api/v1';
    this.apiKey = this.configService.get<string>('CLOCKIFY_API_KEY')!;
  }

  async getWorkspaces(): Promise<any> {
    const response = await fetch(`${this.baseUrl}/workspaces`, {
      headers: {
        'X-Api-Key': this.apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(`Clockify error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getUser(): Promise<any> {
    const response = await fetch(`${this.baseUrl}/user`, {
      headers: {
        'X-Api-Key': this.apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(`Clockify error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }
}
