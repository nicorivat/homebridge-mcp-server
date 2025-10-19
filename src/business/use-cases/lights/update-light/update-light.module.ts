import { Module } from '@nestjs/common';
import { DomoticModule } from '../../../../remotes/domotic';
import { UpdateLightUseCase } from './update-light.use-case';

@Module({
  imports: [DomoticModule],
  providers: [UpdateLightUseCase],
  exports: [UpdateLightUseCase],
})
export class UpdateLightUseCaseModule {}
