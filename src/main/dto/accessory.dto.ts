import z from 'zod';
import { lightSchema } from './light.dto';

// const curtainSchema = baseAccessorySchema.extend({
//   type: z.literal(AccessoryTypes.Enum.CURTAIN),
//   currentPositon: z.number().gte(0).gte(100),
// });

export const accessorySchema = z.discriminatedUnion('type', [lightSchema]);

export type AccessoryDTO = z.infer<typeof accessorySchema>;
