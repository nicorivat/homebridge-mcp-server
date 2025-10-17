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
import { SchedulerService } from '../../services';

@Injectable()
export class LightsTools {
  constructor(
    private readonly getAllLightsUseCase: GetAllLightsUseCase,
    private readonly updateLightStatusUseCase: UpdateLightStatusUseCase,
    private readonly updateLightBrightnessUseCase: UpdateLightBrightnessUseCase,
    private readonly schedulerService: SchedulerService,
  ) {}

  @Tool({
    name: 'get_all_lights',
    description: 'Get all lights informations',
  })
  async getAllLights(): Promise<AccessoryDTO[]> {
    return await this.getAllLightsUseCase.execute();
  }

  @Tool({
    name: 'update_lights_status',
    description: 'Change lights status',
    parameters: z.object({
      lightIds: z.string().array().describe('The IDs of the lights'),
      status: LightStatuses.describe('The target status of the lights'),
    }),
  })
  async updateLightStatus({
    lightIds,
    status,
  }: {
    lightIds: string[];
    status: z.infer<typeof LightStatuses>;
  }): Promise<AccessoryDTO[]> {
    return await Promise.all(
      lightIds.map((lightId) =>
        this.updateLightStatusUseCase.execute(lightId, status),
      ),
    );
  }

  @Tool({
    name: 'schedule_lights_status',
    description: 'schedule lights status',
    parameters: z.object({
      lightIds: z.string().array().describe('The IDs of the lights'),
      status: LightStatuses.describe('The target status of the lights'),
      when: z
        .string()
        .describe(
          "Either an ISO 8601 date/time or a relative expression such as 'in 5 minutes', 'in 2 hours', or 'tomorrow at 9am'.",
        ),
    }),
  })
  sheduleLightStatus({
    lightIds,
    status,
    when,
  }: {
    lightIds: string[];
    status: z.infer<typeof LightStatuses>;
    when: string;
  }): string {
    const result = this.schedulerService.scheduleTask(
      when,
       () => this.updateLightStatus({ lightIds, status }),
    );
    return result
      ? 'Task successfully scheduled'
      : 'An error occured during the task scheduling';
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
