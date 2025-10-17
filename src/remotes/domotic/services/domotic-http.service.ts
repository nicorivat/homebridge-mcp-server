import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { DomoticAuthInterceptor } from '../interceptors';

@Injectable()
export class DomoticHttpService {
  readonly axiosRef: AxiosInstance;

  constructor(
    private readonly configService: ConfigService,
    private readonly interceptor: DomoticAuthInterceptor,
  ) {
    const baseURL = this.configService.get<string>('HOMEBRIDGE_URL');
    if (!baseURL) throw new Error('❌ HOMEBRIDGE_URL manquant');

    this.axiosRef = axios.create({
      baseURL,
      timeout: 5000,
    });

    this.axiosRef.interceptors.request.use(
      (config) => this.interceptor.onRequest(config),
      (error) => Promise.reject(error),
    );
    this.axiosRef.interceptors.response.use(
      (response) => response,
      (error) => this.interceptor.onResponseError(error),
    );
  }
}
