import { Module } from '@nestjs/common';
import { DomoticModule } from '../../../../remotes/domotic';
import { GetAllLightsUseCase } from './get-all-lights.use-case';

@Module({
  imports: [DomoticModule],
  providers: [GetAllLightsUseCase],
  exports: [GetAllLightsUseCase],
})
export class GetAllLightsUseCaseModule {}
