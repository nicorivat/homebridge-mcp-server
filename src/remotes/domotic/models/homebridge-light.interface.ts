import z from 'zod';

const homebridgeLightValuesSchema = z.object({
  Brightness: z.number(),
  ColorTemperature: z.number(),
  Hue: z.number(),
  Saturation: z.number(),
  On: z.union([z.literal(0), z.literal(1)]),
});

export const homebridgeLightSchema = z.object({
  uniqueId: z.string(),
  serviceName: z.string(),
  type: z.literal('Lightbulb'),
  values: homebridgeLightValuesSchema,
});

export type HomeBridgeLight = z.infer<typeof homebridgeLightSchema>;
