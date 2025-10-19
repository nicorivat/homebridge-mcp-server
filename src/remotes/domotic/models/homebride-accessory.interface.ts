import z from 'zod';
import { homebridgeCurtainSchema } from './homebridge-curtain.interface';
import { homebridgeLightSchema } from './homebridge-light.interface';

export const homeBridgeAccessorySchema = z.discriminatedUnion('type', [
  homebridgeLightSchema,
  homebridgeCurtainSchema,
]);

export type HomeBridgeAccessory = z.infer<typeof homeBridgeAccessorySchema>;
