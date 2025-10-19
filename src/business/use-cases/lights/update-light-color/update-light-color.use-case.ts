import { Inject, Injectable } from '@nestjs/common';
import { AccessoryDTO } from '../../../../main/dto';
import { DomoticFacade } from '../../../facades';

@Injectable()
export class UpdateLightColorUseCase {
  constructor(
    @Inject(DomoticFacade) private readonly domoticService: DomoticFacade,
  ) {}

  execute(id: string, hue: number, saturation: number): Promise<AccessoryDTO> {
    return this.domoticService.updateLightColor(id, hue, saturation);
  }
}
