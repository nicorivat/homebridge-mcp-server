import { Inject, Injectable } from '@nestjs/common';
import z from 'zod';
import { AccessoryDTO } from '../../../../main/dto';
import { LightStatuses } from '../../../../main/enums';
import { DomoticFacade } from '../../../facades';

@Injectable()
export class UpdateLightStatusUseCase {
  constructor(
    @Inject(DomoticFacade) private readonly domoticService: DomoticFacade,
  ) {}

  execute(
    id: string,
    status: z.infer<typeof LightStatuses>,
  ): Promise<AccessoryDTO> {
    return this.domoticService.updateLightStatus(id, status);
  }
}
