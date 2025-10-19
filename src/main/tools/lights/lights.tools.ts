import { Injectable } from '@nestjs/common';
import { Tool } from '@rekog/mcp-nest';
import z from 'zod';
import {
  GetAllLightsUseCase,
  UpdateLightUseCase,
} from '../../../business/use-cases';
import { lightAttributesSchema, LightDTO } from '../../dto';
import { LightStatuses } from '../../enums';
import { SchedulerService } from '../../services';

@Injectable()
export class LightsTools {
  constructor(
    private readonly getAllLightsUseCase: GetAllLightsUseCase,
    private readonly updateLightUseCase: UpdateLightUseCase,
    private readonly schedulerService: SchedulerService,
  ) {}

  @Tool({
    name: 'get_all_lights',
    description: 'Get all lights informations',
  })
  async getAllLights() {
    const lights = await this.getAllLightsUseCase.execute();
    return lights.map((light) => ({
      ...light,
      capabilities: {
        changeBrightness: light.brightness !== undefined,
        changeHue: light.hue !== undefined,
        saturation: light.saturation !== undefined,
      },
    }));
  }

  @Tool({
    name: 'update_lights',
    description: 'Update lights attributes',
    parameters: lightAttributesSchema.partial().extend({
      lightIds: z.string().array().describe('The IDs of the lights'),
    }),
  })
  async updateLights({
    lightIds,
    status,
    brightness,
    hue,
    saturation,
  }: {
    lightIds: string[];
    status?: z.infer<typeof LightStatuses>;
    brightness?: number;
    hue?: number;
    saturation?: number;
  }): Promise<LightDTO[]> {
    return (
      await Promise.all(
        lightIds.map((lightId) =>
          this.updateLightUseCase.execute(lightId, {
            status,
            brightness,
            hue,
            saturation,
          }),
        ),
      )
    ).filter((light) => !!light);
  }

  @Tool({
    name: 'schedule_update_lights',
    description: 'Schedule updates lights attributes',
    parameters: lightAttributesSchema
      .partial()
      .extend({
        lightIds: z.string().array().describe('The IDs of the lights'),
      })
      .merge(
        z.object({
          when: z
            .string()
            .describe(
              "Either an ISO 8601 date/time or a relative expression such as 'in 5 minutes', 'in 2 hours', or 'tomorrow at 9am'.",
            ),
        }),
      ),
  })
  scheduleUpdateLights({
    lightIds,
    status,
    brightness,
    hue,
    saturation,
    when,
  }: {
    lightIds: string[];
    status?: z.infer<typeof LightStatuses>;
    brightness?: number;
    hue?: number;
    saturation?: number;
    when: string;
  }): string {
    return this.schedulerService.scheduleTask(when, () =>
      this.updateLights({ lightIds, status, brightness, hue, saturation }),
    );
  }
}
