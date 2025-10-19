import { z } from 'zod';
import { AccessoryTypes, LightStatuses } from '../enums';
import { baseAccessorySchema } from './base-accessory.dto';

export const lightAttributesSchema = z.object({
  status: LightStatuses.describe(
    'The target status of the lights. Do NOT set if not requested',
  ),
  brightness: z
    .number()
    .gte(0)
    .lte(100)
    .describe(
      'The brightness of the light. Make sure the light have changeBrightness capability. Do NOT set if not requested',
    ),
  hue: z
    .number()
    .min(0)
    .max(360)
    .describe(
      'The hue (0 = red, 120 = green, 240 = blue, etc.) of the light. Make sure the light have changeHue capability. Do NOT set if not requested',
    ),
  saturation: z
    .number()
    .gte(0)
    .lte(100)
    .describe(
      'The saturation percentage (0 = gray, 100 = vivid color) of the light. Make sure the light have changeSaturation capability. Do NOT set if not requested',
    ),
});

export const lightSchema = baseAccessorySchema
  .extend({
    type: z.literal(AccessoryTypes.Enum.LIGHT),
  })
  .merge(lightAttributesSchema);

export type LightAttributesDTO = z.infer<typeof lightAttributesSchema>;
export type LightDTO = z.infer<typeof lightSchema>;
