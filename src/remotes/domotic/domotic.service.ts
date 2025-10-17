import { HttpException, Injectable } from '@nestjs/common';
import z from 'zod';
import { DomoticFacade } from '../../business/facades';
import { AccessoryDTO } from '../../main/dto';
import { AccessoryTypes, LightStatuses } from '../../main/enums';
import { HomeBridgeLight } from './models';
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
}
