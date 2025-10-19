import { Module } from '@nestjs/common';
import { DomoticModule } from '../../../../remotes/domotic';
import { UpdateCurtainUseCase } from './update-curtain.use-case';

@Module({
  imports: [DomoticModule],
  providers: [UpdateCurtainUseCase],
  exports: [UpdateCurtainUseCase],
})
export class UpdateCurtainUseCaseModule {}
