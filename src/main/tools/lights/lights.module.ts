import { Module } from '@nestjs/common';
import {
  GetAllLightsUseCaseModule,
  UpdateLightBrightnessUseCaseModule,
  UpdateLightColorUseCaseModule,
  UpdateLightStatusUseCaseModule,
  UpdateLightUseCaseModule,
} from '../../../business/use-cases';
import { SchedulerModule } from '../../services';
import { LightsTools } from './lights.tools';

@Module({
  imports: [
    GetAllLightsUseCaseModule,
    UpdateLightStatusUseCaseModule,
    UpdateLightBrightnessUseCaseModule,
    UpdateLightColorUseCaseModule,
    UpdateLightUseCaseModule,
    SchedulerModule,
  ],
  providers: [LightsTools],
  exports: [LightsTools],
})
export class LightsToolsModule {}
