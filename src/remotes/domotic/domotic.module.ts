import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DomoticFacade } from '../../business/facades';
import { DomoticHttpModule } from './domotic-http.module';
import { DomoticService } from './domotic.service';


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
