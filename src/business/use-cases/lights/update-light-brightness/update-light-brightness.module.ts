import { Module } from '@nestjs/common';
import { DomoticModule } from '../../../../remotes/domotic';
import { UpdateLightBrightnessUseCase } from './update-light-brightness.use-case';

@Module({
  imports: [DomoticModule],
  providers: [UpdateLightBrightnessUseCase],
  exports: [UpdateLightBrightnessUseCase],
})
export class UpdateLightBrightnessUseCaseModule {}
