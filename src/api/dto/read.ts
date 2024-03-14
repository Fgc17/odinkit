import { z } from "../../utils/zod";
import { ZodTypeAny } from "zod";

const paginationDto = z.object({
  take: z.number().optional(),
  skip: z.number().optional(),
  cursor: z.any(),
  count: z.number().optional(),
});

export type PaginationDto = z.infer<typeof paginationDto>;

export const readDto = <W extends ZodTypeAny>(where: W) =>
  z.object({
    pagination: paginationDto.optional(),
    where: where.optional(),
  });
