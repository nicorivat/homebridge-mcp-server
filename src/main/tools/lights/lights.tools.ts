import { Injectable } from '@nestjs/common';
import { Tool } from '@rekog/mcp-nest';
import z from 'zod';
import {
  GetAllLightsUseCase,
  UpdateLightBrightnessUseCase,
  UpdateLightStatusUseCase,
} from '../../../business/use-cases';
import { AccessoryDTO } from '../../dto';
import { LightStatuses } from '../../enums';

@Injectable()
export class LightsTools {
  constructor(
    private readonly getAllLightsUseCase: GetAllLightsUseCase,
    private readonly updateLightStatusUseCase: UpdateLightStatusUseCase,
    private readonly updateLightBrightnessUseCase: UpdateLightBrightnessUseCase,
  ) {}

  @Tool({
    name: 'get_all_lights',
    description: 'Get all lights informations',
  })
  async getAllLights(): Promise<AccessoryDTO[]> {
    return await this.getAllLightsUseCase.execute();
  }

  @Tool({
    name: 'update_light_status',
    description: 'Change light status',
    parameters: z.object({
      lightId: z.string().describe('The ID of the light'),
      status: LightStatuses.describe('The target status of the light'),
    }),
  })
  async updateLightStatus({
    lightId,
    status,
  }: {
    lightId: string;
    status: z.infer<typeof LightStatuses>;
  }): Promise<AccessoryDTO> {
    return await this.updateLightStatusUseCase.execute(lightId, status);
  }

  @Tool({
    name: 'update_light_brightness',
    description:
      'Change light brightness. Can ONLY work if light has a brightness not undefined',
    parameters: z.object({
      lightId: z.string().describe('The ID of the light'),
      brightness: z
        .number()
        .gte(0)
        .lte(100)
        .describe('The target brightness of the light'),
    }),
  })
  async updateLightBrightness({
    lightId,
    brightness,
  }: {
    lightId: string;
    brightness: number;
  }): Promise<AccessoryDTO> {
    return await this.updateLightBrightnessUseCase.execute(lightId, brightness);
  }
}
