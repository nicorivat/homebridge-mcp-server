import { Module } from '@nestjs/common';
import {
  GetAllLightsUseCaseModule,
  UpdateLightBrightnessUseCaseModule,
  UpdateLightColorUseCaseModule,
  UpdateLightStatusUseCaseModule,
} from '../../../business/use-cases';
import { SchedulerModule } from '../../services';
import { LightsTools } from './lights.tools';

@Module({
  imports: [
    GetAllLightsUseCaseModule,
    UpdateLightStatusUseCaseModule,
    UpdateLightBrightnessUseCaseModule,
    UpdateLightColorUseCaseModule,
    SchedulerModule,
  ],
  providers: [LightsTools],
  exports: [LightsTools],
})
export class LightsToolsModule {}
