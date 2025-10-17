import { Module } from '@nestjs/common';
import {
  GetAllLightsUseCaseModule,
  UpdateLightStatusUseCaseModule,
} from '../../../business/use-cases';
import { LightsTools } from './lights.tools';

@Module({
  imports: [GetAllLightsUseCaseModule, UpdateLightStatusUseCaseModule],
  providers: [LightsTools],
  exports: [LightsTools],
})
export class LightsToolsModule {}
