import z from 'zod';

export const baseHomebridgeAccessorySchema = z.object({
  uniqueId: z.string(),
  serviceName: z.string(),
  type: z.string(),
});
