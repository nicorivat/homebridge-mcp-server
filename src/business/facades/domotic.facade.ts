import z from 'zod';
import { AccessoryDTO, LightAttributesDTO } from '../../main/dto';
import { LightStatuses } from './../../main/enums';

export abstract class DomoticFacade {
  abstract getAllLights(): Promise<AccessoryDTO[]>;
  abstract updateLightStatus(
    id: string,
    status: z.infer<typeof LightStatuses>,
  ): Promise<AccessoryDTO>;
  abstract updateLightBrightness(
    id: string,
    brightness: number,
  ): Promise<AccessoryDTO>;
  abstract updateLightColor(
    id: string,
    hue: number,
    saturation: number,
  ): Promise<AccessoryDTO>;
  abstract updateLight(
    id: string,
    config: Partial<LightAttributesDTO>,
  ): Promise<AccessoryDTO | undefined>;
}
