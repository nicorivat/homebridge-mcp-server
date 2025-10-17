import { Module } from '@nestjs/common';
import { DomoticModule } from '../../../../remotes/domotic';
import { UpdateLightStatusUseCase } from './update-light-status.use-case';

@Module({
  imports: [DomoticModule],
  providers: [UpdateLightStatusUseCase],
  exports: [UpdateLightStatusUseCase],
})
export class UpdateLightStatusUseCaseModule {}
