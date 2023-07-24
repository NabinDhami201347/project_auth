import { z } from "zod";

export const signupSchema = z
  .object({
    body: z.object({
      name: z.string(),
      email: z.string().email().endsWith("@ncit.edu.np"),
      password: z.string().min(6),
      passwordConfirmation: z.string().min(6),
    }),
  })
  .refine((data) => data.body.password === data.body.passwordConfirmation, {
    message: "Passwords don't match",
    path: ["passwordConfirmation"],
  });

export type SignUpInput = z.infer<typeof signupSchema>;
