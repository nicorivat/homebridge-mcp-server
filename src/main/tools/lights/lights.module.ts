import { Module } from '@nestjs/common';
import {
  GetAllLightsUseCaseModule,
  UpdateLightUseCaseModule
} from '../../../business/use-cases';
import { SchedulerModule } from '../../services';
import { LightsTools } from './lights.tools';

@Module({
  imports: [
    GetAllLightsUseCaseModule,
    UpdateLightUseCaseModule,
    SchedulerModule,
  ],
  providers: [LightsTools],
  exports: [LightsTools],
})
export class LightsToolsModule {}
