import { Injectable } from '@nestjs/common';
import { Tool } from '@rekog/mcp-nest';
import z from 'zod';
import {
  GetAllLightsUseCase,
  UpdateLightBrightnessUseCase,
  UpdateLightColorUseCase,
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
    private readonly updateLightColorUseCase: UpdateLightColorUseCase,
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
    return this.schedulerService.scheduleTask(when, () =>
      this.updateLightStatus({ lightIds, status }),
    );
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

  @Tool({
    name: 'schedule_lights_brightness',
    description: 'Schedule light brightness',
    parameters: z.object({
      lightId: z.string().describe('The ID of the light'),
      brightness: z
        .number()
        .gte(0)
        .lte(100)
        .describe('The target brightness of the light'),
      when: z
        .string()
        .describe(
          "Either an ISO 8601 date/time or a relative expression such as 'in 5 minutes', 'in 2 hours', or 'tomorrow at 9am'.",
        ),
    }),
  })
  sheduleLightBrightness({
    lightId,
    brightness,
    when,
  }: {
    lightId: string;
    brightness: number;
    when: string;
  }): string {
    return this.schedulerService.scheduleTask(when, () =>
      this.updateLightBrightnessUseCase.execute(lightId, brightness),
    );
  }

  @Tool({
    name: 'update_light_color',
    description:
      'Update the color of a light: hue, saturation and/or color temperature. Can ONLY work if these attributes exist on the light. You can send one or more color attributes.',
    parameters: z.object({
      lightId: z.string().describe('The ID of the light'),
      hue: z
        .number()
        .gte(0)
        .lte(360)
        .optional()
        .describe('Target hue (0 = red, 120 = green, 240 = blue, etc.)'),
      saturation: z
        .number()
        .gte(0)
        .lte(100)
        .optional()
        .describe('Target saturation percentage (0 = gray, 100 = vivid color)'),
    }),
  })
  async updateLightColor({
    lightId,
    hue,
    saturation,
  }: {
    lightId: string;
    hue: number;
    saturation: number;
  }): Promise<AccessoryDTO> {
    return await this.updateLightColorUseCase.execute(lightId, hue, saturation);
  }

  @Tool({
    name: 'shedule_light_color',
    description:
      'Shedule the color of a light: hue, saturation and/or color temperature. Can ONLY work if these attributes exist on the light. You can send one or more color attributes.',
    parameters: z.object({
      lightId: z.string().describe('The ID of the light'),
      hue: z
        .number()
        .gte(0)
        .lte(360)
        .optional()
        .describe('Target hue (0 = red, 120 = green, 240 = blue, etc.)'),
      saturation: z
        .number()
        .gte(0)
        .lte(100)
        .optional()
        .describe('Target saturation percentage (0 = gray, 100 = vivid color)'),
      when: z
        .string()
        .describe(
          "Either an ISO 8601 date/time or a relative expression such as 'in 5 minutes', 'in 2 hours', or 'tomorrow at 9am'.",
        ),
    }),
  })
  scheduleLightColor({
    lightId,
    hue,
    saturation,
    when,
  }: {
    lightId: string;
    hue: number;
    saturation: number;
    when: string;
  }): string {
    return this.schedulerService.scheduleTask(when, () =>
      this.updateLightColorUseCase.execute(lightId, hue, saturation),
    );
  }
}
