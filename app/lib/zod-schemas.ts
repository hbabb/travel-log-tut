import { z } from "zod";

export const NameSchema = z.string().min(1).max(100);
export const DescriptionSchema = z.string().max(1000).or(z.null()).optional();
export const LatSchema = z.coerce.number().min(-90).max(90);
export const LongSchema = z.coerce.number().min(-180).max(180);
