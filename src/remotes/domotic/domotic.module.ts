import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DomoticFacade } from '../../business/facades';
import { DomoticService } from './domotic.service';


@Module({
  imports: [HttpModule, ConfigModule],
  providers: [
    {
      provide: DomoticFacade,
      useClass: DomoticService,
    },
  ],
  exports: [DomoticFacade],
})
export class DomoticModule {}
