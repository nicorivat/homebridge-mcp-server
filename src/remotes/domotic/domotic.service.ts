import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { tap } from 'rxjs';
import z from 'zod';
import { DomoticFacade } from '../../business/facades';
import { AccessoryDTO } from '../../main/dto';
import { AccessoryTypes, LightStatuses } from '../../main/enums';
import { HomeBridgeLight } from './models';

@Injectable()
export class DomoticService implements DomoticFacade {
  private readonly homebridgeUrl: string;
  private token: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.homebridgeUrl = this.configService.get('HOMEBRIDGE_URL') ?? '';
    this.getToken();
  }

  private getToken(): void {
    this.httpService
      .post<{ access_token: string }>(`${this.homebridgeUrl}/auth/login`, {
        username: this.configService.get('HOMEBRIDGE_USERNAME'),
        password: this.configService.get('HOMEBRIDGE_PWD'),
        grant_type: 'password',
      })
      .pipe(
        tap((response) => {
          this.token = response.data.access_token;
          console.log('TOKEN', this.token);
        }),
      )
      .subscribe();
  }

  private getHeaders(): { Authorization: string } {
    return { Authorization: `Bearer ${this.token}` };
  }

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

  private updateLightValue(
    id: string,
    key: string,
    value: unknown,
  ): Promise<AccessoryDTO> {
    return this.httpService.axiosRef.put(
      `${this.homebridgeUrl}/accessories/${id}`,
      { characteristicType: key, value },
      { headers: this.getHeaders() },
    );
  }

  async getAllLights(): Promise<AccessoryDTO[]> {
    try {
      const accessories = await this.httpService.axiosRef.get<
        HomeBridgeLight[]
      >(`${this.homebridgeUrl}/accessories`, { headers: this.getHeaders() });
      return accessories.data
        .filter((accessory) => accessory.type === 'Lightbulb')
        .map((accessory) => this.parseLight(accessory));
    } catch (e) {
      console.log(e.status);
      throw new HttpException('Erreur', e.status);
    }
  }

  async updateLightStatus(
    id: string,
    status: z.infer<typeof LightStatuses>,
  ): Promise<AccessoryDTO> {
    try {
      return await this.updateLightValue(
        id,
        'On',
        status === LightStatuses.Enum.ON ? 1 : 0,
      );
    } catch (e) {
      console.log(e.status);
      throw new HttpException('Erreur', e.status);
    }
  }
}
