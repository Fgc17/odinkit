import { z } from "zod";

export type ZodDtoEnv = "client" | "server";

export type ZodDto<F extends (arg: any) => any> = z.infer<ReturnType<F>>;
