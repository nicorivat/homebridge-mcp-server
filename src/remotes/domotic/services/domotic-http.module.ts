import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DomoticAuthInterceptor } from '../interceptors';
import { DomoticHttpService } from './domotic-http.service';

@Module({
  imports: [ConfigModule, HttpModule],
  providers: [DomoticAuthInterceptor, DomoticHttpService],
  exports: [DomoticHttpService],
})
export class DomoticHttpModule {}
