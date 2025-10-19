import { Inject, Injectable } from '@nestjs/common';
import { LightAttributesDTO, LightDTO } from '../../../../main/dto';
import { DomoticFacade } from '../../../facades';

@Injectable()
export class UpdateLightUseCase {
  constructor(
    @Inject(DomoticFacade) private readonly domoticService: DomoticFacade,
  ) {}

  execute(
    id: string,
    config: Partial<LightAttributesDTO>,
  ): Promise<LightDTO | undefined> {
    return this.domoticService.updateLight(id, config);
  }
}
