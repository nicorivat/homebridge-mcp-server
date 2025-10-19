import { Module } from '@nestjs/common';
import { DomoticModule } from '../../../../remotes/domotic';
import { UpdateLightColorUseCase } from './update-light-color.use-case';

@Module({
  imports: [DomoticModule],
  providers: [UpdateLightColorUseCase],
  exports: [UpdateLightColorUseCase],
})
export class UpdateLightColorUseCaseModule {}
