import { z } from "zod";

const createPostDTO = z.object({
  body: z.object({
    title: z.string().min(5, "Title must be at least 5 characters"),
    content: z.string().min(20, "Content is too short"),
    status: z.enum(["draft", "published"]).optional(),
    tags: z.array(z.string()).optional(),
  }),
});

export { createPostDTO };
