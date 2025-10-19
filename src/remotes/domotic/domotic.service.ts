import { HttpException, Injectable } from '@nestjs/common';
import z from 'zod';
import { DomoticFacade } from '../../business/facades';
import { AccessoryDTO, LightAttributesDTO } from '../../main/dto';
import { AccessoryTypes, LightStatuses } from '../../main/enums';
import { HomeBridgeLight, HomeBridgeLightAttributes } from './models';
import { DomoticHttpService } from './services';

@Injectable()
export class DomoticService implements DomoticFacade {
  constructor(private readonly httpService: DomoticHttpService) {}

  private parseLight(light: HomeBridgeLight): AccessoryDTO {
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

  async getAllLights(): Promise<AccessoryDTO[]> {
    try {
      const { data } =
        await this.httpService.axiosRef.get<HomeBridgeLight[]>('/accessories');
      return data
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

  private async getAccessory(id: string): Promise<HomeBridgeLight> {
    try {
      const { data } = await this.httpService.axiosRef.get<HomeBridgeLight>(
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

  async updateLight(
    id: string,
    config: Partial<LightAttributesDTO>,
  ): Promise<AccessoryDTO | undefined> {
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
      return this.parseLight(await this.getAccessory(id));
    } catch (e: any) {
      console.error(e);
      throw new HttpException(
        'Erreur lors de la mise à jour de la lumière',
        e.status || 500,
      );
    }
  }

  async updateLightStatus(
    id: string,
    status: z.infer<typeof LightStatuses>,
  ): Promise<AccessoryDTO> {
    try {
      await this.httpService.axiosRef.put(`/accessories/${id}`, {
        characteristicType: 'On',
        value: status === LightStatuses.Enum.ON ? 1 : 0,
      });

      const lights = await this.getAllLights();
      return lights.find((l) => l.id === id)!;
    } catch (e: any) {
      console.error(e);
      throw new HttpException(
        'Erreur lors de la mise à jour de la lumière',
        e.status || 500,
      );
    }
  }

  async updateLightBrightness(
    id: string,
    brightness: number,
  ): Promise<AccessoryDTO> {
    try {
      await this.httpService.axiosRef.put(`/accessories/${id}`, {
        characteristicType: 'Brightness',
        value: brightness,
      });

      const lights = await this.getAllLights();
      return lights.find((l) => l.id === id)!;
    } catch (e: any) {
      console.error(e);
      throw new HttpException(
        'Erreur lors de la mise à jour de la luminosité de la lumière',
        e.status || 500,
      );
    }
  }

  async updateLightColor(
    id: string,
    hue: number,
    saturation: number,
  ): Promise<AccessoryDTO> {
    try {
      await this.httpService.axiosRef.put(`/accessories/${id}`, {
        characteristicType: 'Hue',
        value: hue,
      });
      await this.httpService.axiosRef.put(`/accessories/${id}`, {
        characteristicType: 'Saturation',
        value: saturation,
      });

      const lights = await this.getAllLights();
      return lights.find((l) => l.id === id)!;
    } catch (e: any) {
      console.error(e);
      throw new HttpException(
        'Erreur lors de la mise à jour de la luminosité de la lumière',
        e.status || 500,
      );
    }
  }
}
