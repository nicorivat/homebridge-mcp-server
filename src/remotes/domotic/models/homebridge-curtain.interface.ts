import z from 'zod';
import { baseHomebridgeAccessorySchema } from './base-homebridge-accessory.interface';

const homebridgeCurtainValuesSchema = z.object({
  CurrentPosition: z.number().gte(0).lte(100),
  TargetPosition: z.number().gte(0).lte(100),
});

export const homebridgeCurtainSchema = baseHomebridgeAccessorySchema.extend({
  type: z.literal('WindowCovering'),
  values: homebridgeCurtainValuesSchema,
});

export type HomeBridgeCurtainAttributes = z.infer<
  typeof homebridgeCurtainValuesSchema
>;
export type HomeBridgeCurtain = z.infer<typeof homebridgeCurtainSchema>;
