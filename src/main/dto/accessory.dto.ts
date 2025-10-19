import z from 'zod';
import { AccessoryTypes, LightStatuses } from '../enums';

export const baseAccessorySchema = z.object({
  id: z.string(),
  name: z.string(),
  type: AccessoryTypes,
});

const lightSchema = baseAccessorySchema.extend({
  type: z.literal(AccessoryTypes.Enum.LIGHT),
  status: LightStatuses,
  brightness: z.number().gte(0).gte(100),
  hue: z.number().min(0).max(360),
  saturation: z.number().min(0).max(100),
});

// const curtainSchema = baseAccessorySchema.extend({
//   type: z.literal(AccessoryTypes.Enum.CURTAIN),
//   currentPositon: z.number().gte(0).gte(100),
// });

export const accessorySchema = z.discriminatedUnion('type', [lightSchema]);

export type AccessoryDTO = z.infer<typeof accessorySchema>;
