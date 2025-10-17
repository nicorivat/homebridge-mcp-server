import z from 'zod';
import { AccessoryDTO } from '../../main/dto';
import { LightStatuses } from './../../main/enums';

export abstract class DomoticFacade {
  abstract getAllLights(): Promise<AccessoryDTO[]>;
  abstract updateLightStatus(
    id: string,
    status: z.infer<typeof LightStatuses>,
  ): Promise<AccessoryDTO>;
  // abstract updateLightBrightness(
  //   id: string,
  //   brightness: number,
  // ): Promise<AccessoryDTO>;
}
