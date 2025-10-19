import { Inject, Injectable } from '@nestjs/common';
import { CurtainDTO } from '../../../../main/dto';
import { DomoticFacade } from '../../../facades';

@Injectable()
export class GetAllCurtainsUseCase {
  constructor(@Inject(DomoticFacade) private readonly domotic: DomoticFacade) {}

  execute(): Promise<CurtainDTO[]> {
    return this.domotic.getAllCurtains();
  }
}
