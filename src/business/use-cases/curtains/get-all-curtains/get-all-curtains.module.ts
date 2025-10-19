import { Module } from '@nestjs/common';
import { DomoticModule } from '../../../../remotes/domotic';
import { GetAllCurtainsUseCase } from './get-all-curtains.use-case';

@Module({
  imports: [DomoticModule],
  providers: [GetAllCurtainsUseCase],
  exports: [GetAllCurtainsUseCase],
})
export class GetAllCurtainsUseCaseModule {}
