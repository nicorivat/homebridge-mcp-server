import z from 'zod';
import { AccessoryTypes } from '../enums';
import { baseAccessorySchema } from './base-accessory.dto';

export const curtainAttributesSchema = z.object({
  currentPosition: z
    .number()
    .gte(0)
    .lte(0)
    .describe(
      'The current position of the curtain in percentage (0 = fully closed, 100 = fully opened)',
    ),
  targetPosition: z
    .number()
    .gte(0)
    .lte(100)
    .describe(
      'The target position of the curtain in percentage (0 = fully closed, 100 = fully opened)',
    ),
});

export const curtainSchema = baseAccessorySchema
  .extend({
    type: z.literal(AccessoryTypes.Enum.CURTAIN),
  })
  .merge(curtainAttributesSchema);

export type CurtainAttributesDTO = z.infer<typeof curtainAttributesSchema>;
export type CurtainDTO = z.infer<typeof curtainSchema>;
