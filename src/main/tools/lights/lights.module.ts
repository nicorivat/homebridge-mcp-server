import { Module } from '@nestjs/common';
import {
  GetAllLightsUseCaseModule,
  UpdateLightBrightnessUseCaseModule,
  UpdateLightStatusUseCaseModule,
} from '../../../business/use-cases';
import { LightsTools } from './lights.tools';

@Module({
  imports: [
    GetAllLightsUseCaseModule,
    UpdateLightStatusUseCaseModule,
    UpdateLightBrightnessUseCaseModule,
  ],
  providers: [LightsTools],
  exports: [LightsTools],
})
export class LightsToolsModule {}
