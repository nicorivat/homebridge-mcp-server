import { Module } from '@nestjs/common';
import {
  GetAllLightsUseCaseModule,
  UpdateLightBrightnessUseCaseModule,
  UpdateLightStatusUseCaseModule,
} from '../../../business/use-cases';
import { SchedulerModule } from '../../services';
import { LightsTools } from './lights.tools';

@Module({
  imports: [
    GetAllLightsUseCaseModule,
    UpdateLightStatusUseCaseModule,
    UpdateLightBrightnessUseCaseModule,
    SchedulerModule,
  ],
  providers: [LightsTools],
  exports: [LightsTools],
})
export class LightsToolsModule {}
