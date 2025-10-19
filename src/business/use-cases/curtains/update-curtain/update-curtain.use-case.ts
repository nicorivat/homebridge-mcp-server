import { Inject, Injectable } from '@nestjs/common';
import { CurtainAttributesDTO, CurtainDTO } from '../../../../main/dto';
import { DomoticFacade } from '../../../facades';

@Injectable()
export class UpdateCurtainUseCase {
  constructor(@Inject(DomoticFacade) private readonly domotic: DomoticFacade) {}

  execute(
    id: string,
    config: Partial<CurtainAttributesDTO>,
  ): Promise<CurtainDTO | undefined> {
    return this.domotic.updateCurtain(id, config);
  }
}
