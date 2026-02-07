import { z } from "zod";

const registerDTO = z.object({
  body: z.object({
    name: z.string().min(5, "Name must be at least 5 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
  }),
});

const loginDTO = z.object({
  body: z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
  }),
});

export { registerDTO, loginDTO };
