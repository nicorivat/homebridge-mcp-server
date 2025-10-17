import { Inject, Injectable } from '@nestjs/common';
import { AccessoryDTO } from '../../../../main/dto';
import { DomoticFacade } from '../../../facades';

@Injectable()
export class GetAllLightsUseCase {
  constructor(@Inject(DomoticFacade) private readonly domotic: DomoticFacade) {}

  async execute(): Promise<AccessoryDTO[]> {
    const test = await this.domotic.getAllLights();
    console.log(test);
    return test;
  }
}
