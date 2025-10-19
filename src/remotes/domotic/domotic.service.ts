import { HttpException, Injectable } from '@nestjs/common';
import { DomoticFacade } from '../../business/facades';
import {
  CurtainAttributesDTO,
  CurtainDTO,
  LightAttributesDTO,
  LightDTO,
} from '../../main/dto';
import { AccessoryTypes, LightStatuses } from '../../main/enums';
import {
  HomeBridgeAccessory,
  HomeBridgeCurtain,
  HomeBridgeCurtainAttributes,
  HomeBridgeLight,
  HomeBridgeLightAttributes,
} from './models';
import { DomoticHttpService } from './services';

@Injectable()
export class DomoticService implements DomoticFacade {
  constructor(private readonly httpService: DomoticHttpService) {}

  private parseLight(light: HomeBridgeLight): LightDTO {
    return {
      id: light.uniqueId,
      name: light.serviceName,
      type: AccessoryTypes.Enum.LIGHT,
      brightness: light.values.Brightness,
      hue: light.values.Hue,
      saturation: light.values.Saturation,
      status:
        light.values.On === 1 ? LightStatuses.Enum.ON : LightStatuses.Enum.OFF,
    };
  }

  private parseCurtain(curtain: HomeBridgeCurtain): CurtainDTO {
    return {
      id: curtain.uniqueId,
      name: curtain.serviceName,
      type: AccessoryTypes.Enum.CURTAIN,
      currentPosition: curtain.values.CurrentPosition,
      targetPosition: curtain.values.TargetPosition,
    };
  }

  private async getAccessories(): Promise<HomeBridgeAccessory[]> {
    try {
      const { data } =
        await this.httpService.axiosRef.get<HomeBridgeAccessory[]>(
          '/accessories',
        );
      return data;
    } catch (e: any) {
      console.error(e);
      throw new HttpException(
        'Erreur lors de la récupération des accessoires',
        e.status || 500,
      );
    }
  }

  private async getAccessory(id: string): Promise<HomeBridgeAccessory> {
    try {
      const { data } = await this.httpService.axiosRef.get<HomeBridgeAccessory>(
        `/accessories/${id}`,
      );
      return data;
    } catch (e: any) {
      console.error(e);
      throw new HttpException(
        "Erreur lors de la récupération de l'accessoire",
        e.status || 500,
      );
    }
  }

  private lightAttributesToHomebridgeAttributes(
    light: Partial<LightAttributesDTO>,
  ): Partial<HomeBridgeLightAttributes> {
    return {
      On: light.status
        ? light.status === LightStatuses.Enum.ON
          ? 1
          : 0
        : undefined,
      Brightness: light.brightness ?? undefined,
      Hue: light.hue ?? undefined,
      Saturation: light.saturation ?? undefined,
    };
  }

  private curtainAttributesToHomebridgeAttributes(
    curtain: Partial<CurtainAttributesDTO>,
  ): Partial<HomeBridgeCurtainAttributes> {
    return {
      CurrentPosition: undefined,
      TargetPosition: curtain.targetPosition ?? undefined,
    };
  }

  async getAllLights(): Promise<LightDTO[]> {
    try {
      const accessories = await this.getAccessories();
      return accessories
        .filter((a) => a.type === 'Lightbulb')
        .map((a) => this.parseLight(a));
    } catch (e: any) {
      console.error(e);
      throw new HttpException(
        'Erreur lors de la récupération des lumières',
        e.status || 500,
      );
    }
  }

  async updateLight(
    id: string,
    config: Partial<LightAttributesDTO>,
  ): Promise<LightDTO | undefined> {
    try {
      const light = await this.getAccessory(id);
      const transformedConfig =
        this.lightAttributesToHomebridgeAttributes(config);
      const requestedAttributes = Object.keys(transformedConfig).filter(
        (key) => transformedConfig[key] !== undefined,
      );
      for (const requestedAttribute of requestedAttributes) {
        if (
          light.values[requestedAttribute] !==
          transformedConfig[requestedAttribute]
        ) {
          await this.httpService.axiosRef.put(`/accessories/${id}`, {
            characteristicType: requestedAttribute,
            value: transformedConfig[requestedAttribute],
          });
        }
      }
      return this.parseLight((await this.getAccessory(id)) as HomeBridgeLight);
    } catch (e: any) {
      console.error(e);
      throw new HttpException(
        'Erreur lors de la mise à jour de la lumière',
        e.status || 500,
      );
    }
  }

  async getAllCurtains(): Promise<CurtainDTO[]> {
    try {
      const accessories = await this.getAccessories();
      return accessories
        .filter((a) => a.type === 'WindowCovering')
        .map((a) => this.parseCurtain(a));
    } catch (e: any) {
      console.error(e);
      throw new HttpException(
        'Erreur lors de la récupération des volets',
        e.status || 500,
      );
    }
  }

  async updateCurtain(
    id: string,
    config: Partial<CurtainAttributesDTO>,
  ): Promise<CurtainDTO | undefined> {
    try {
      const light = await this.getAccessory(id);
      const transformedConfig =
        this.curtainAttributesToHomebridgeAttributes(config);
      const requestedAttributes = Object.keys(transformedConfig).filter(
        (key) => transformedConfig[key] !== undefined,
      );
      for (const requestedAttribute of requestedAttributes) {
        if (
          light.values[requestedAttribute] !==
          transformedConfig[requestedAttribute]
        ) {
          await this.httpService.axiosRef.put(`/accessories/${id}`, {
            characteristicType: requestedAttribute,
            value: transformedConfig[requestedAttribute],
          });
        }
      }
      return this.parseCurtain(
        (await this.getAccessory(id)) as HomeBridgeCurtain,
      );
    } catch (e: any) {
      console.error(e);
      throw new HttpException(
        'Erreur lors de la mise à jour de la lumière',
        e.status || 500,
      );
    }
  }
}
