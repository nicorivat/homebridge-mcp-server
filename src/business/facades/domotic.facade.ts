import {
  CurtainAttributesDTO,
  CurtainDTO,
  LightAttributesDTO,
  LightDTO,
} from '../../main/dto';

export abstract class DomoticFacade {
  abstract getAllLights(): Promise<LightDTO[]>;
  abstract updateLight(
    id: string,
    config: Partial<LightAttributesDTO>,
  ): Promise<LightDTO | undefined>;
  abstract getAllCurtains(): Promise<CurtainDTO[]>;
  abstract updateCurtain(
    id: string,
    config: Partial<CurtainAttributesDTO>,
  ): Promise<CurtainDTO | undefined>;
}
