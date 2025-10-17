import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DomoticHttpService } from './domotic-http.service';
import { DomoticAuthInterceptor } from './interceptors';

@Module({
  imports: [ConfigModule, HttpModule],
  providers: [DomoticAuthInterceptor, DomoticHttpService],
  exports: [DomoticHttpService],
})
export class DomoticHttpModule {}
