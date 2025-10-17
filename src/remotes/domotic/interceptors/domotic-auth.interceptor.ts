import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

@Injectable()
export class DomoticAuthInterceptor {
  private token: string | null = null;
  private tokenPromise: Promise<string> | null = null;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.getToken();
  }

  private async getToken(): Promise<string> {
    if (this.token) return this.token;
    if (this.tokenPromise) return this.tokenPromise;

    this.tokenPromise = (async () => {
      const username = this.configService.get('HOMEBRIDGE_USERNAME');
      const password = this.configService.get('HOMEBRIDGE_PWD');
      const baseURL = this.configService.get('HOMEBRIDGE_URL');

      const { data } = await this.httpService.axiosRef.post<{
        access_token: string;
      }>(`${baseURL}/auth/login`, {
        username,
        password,
        grant_type: 'password',
      });

      this.token = data.access_token;
      this.tokenPromise = null;
      return this.token;
    })();

    return this.tokenPromise;
  }

  private clearToken() {
    this.token = null;
  }

  async onRequest(
    config: InternalAxiosRequestConfig,
  ): Promise<InternalAxiosRequestConfig> {
    const token = await this.getToken();

    if (!config.headers) {
      config.headers = new axios.AxiosHeaders();
    }

    if (config.headers.set) {
      config.headers.set('Authorization', `Bearer ${token}`);
    } else {
      (config.headers as any)['Authorization'] = `Bearer ${token}`;
    }

    return config;
  }

  async onResponseError(error: AxiosError) {
    if (error.response?.status === 401) {
      console.warn('⚠️ Token expiré, tentative de régénération...');
      this.clearToken();

      const originalRequest = error.config;
      if (!originalRequest) throw error;

      const newToken = await this.getToken();

      if (originalRequest.headers) {
        if ((originalRequest.headers as any).set) {
          (originalRequest.headers as any).set(
            'Authorization',
            `Bearer ${newToken}`,
          );
        } else {
          (originalRequest.headers as any)['Authorization'] =
            `Bearer ${newToken}`;
        }
      }

      return axios(originalRequest);
    }

    throw error;
  }
}
