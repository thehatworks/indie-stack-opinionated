import { z } from "zod";

import { UserModel } from "~/zod";

export const AuthInputSchema = UserModel.pick({ email: true }).merge(
  z.object({
    password: z.string().min(8, "Password should be at least 8 characters"),
    redirectTo: z.string(),
    remember: z.boolean().optional(),
  })
);
