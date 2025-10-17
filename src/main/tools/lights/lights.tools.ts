import { Injectable } from '@nestjs/common';
import { Tool } from '@rekog/mcp-nest';
import z from 'zod';
import {
  GetAllLightsUseCase,
  UpdateLightStatusUseCase,
} from '../../../business/use-cases';
import { AccessoryDTO } from '../../dto';
import { LightStatuses } from '../../enums';

@Injectable()
export class LightsTools {
  constructor(
    private readonly getAllLightsUseCase: GetAllLightsUseCase,
    private readonly updateLightStatusUseCase: UpdateLightStatusUseCase,
  ) {}

  @Tool({
    name: 'get_all_lights',
    description: 'Get all lights informations',
  })
  async getAllLights(): Promise<AccessoryDTO[]> {
    const response = await this.getAllLightsUseCase.execute();
    console.log('getAllLights', response);
    return response;
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
    const response = await this.updateLightStatusUseCase.execute(
      lightId,
      status,
    );
    console.log('updateLightStatus', response);
    return response;
  }
}
