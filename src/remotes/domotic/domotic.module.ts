import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DomoticFacade } from '../../business/facades';
import { DomoticService } from './domotic.service';
import { DomoticHttpModule } from './services';


@Module({
  imports: [ConfigModule, DomoticHttpModule],
  providers: [
    {
      provide: DomoticFacade,
      useClass: DomoticService,
    },
  ],
  exports: [DomoticFacade],
})
export class DomoticModule {}
