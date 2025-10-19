import { z } from 'zod';
import { AccessoryTypes } from '../enums';

export const baseAccessorySchema = z.object({
  id: z.string(),
  name: z.string(),
  type: AccessoryTypes,
});
