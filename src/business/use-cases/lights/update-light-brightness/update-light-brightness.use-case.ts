import { Inject, Injectable } from '@nestjs/common';
import { AccessoryDTO } from '../../../../main/dto';
import { DomoticFacade } from '../../../facades';

@Injectable()
export class UpdateLightBrightnessUseCase {
  constructor(
    @Inject(DomoticFacade) private readonly domoticService: DomoticFacade,
  ) {}

  execute(id: string, brightness: number): Promise<AccessoryDTO> {
    return this.domoticService.updateLightBrightness(id, brightness);
  }
}
