import { Module } from '@nestjs/common';
import {
  GetAllCurtainsUseCaseModule,
  UpdateCurtainUseCaseModule,
} from '../../../business/use-cases';
import { SchedulerModule } from '../../services';
import { CurtainsTools } from './curtains.tools';

@Module({
  imports: [
    GetAllCurtainsUseCaseModule,
    UpdateCurtainUseCaseModule,
    SchedulerModule,
  ],
  providers: [CurtainsTools],
  exports: [CurtainsTools],
})
export class CurtainsToolsModule {}
