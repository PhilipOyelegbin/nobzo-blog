import { Router } from "express";
import {
  createPost,
  getPosts,
  getPostBySlug,
  updatePost,
  deletePost,
} from "../controllers/index.js";
import { authenticate, validate } from "../middlewares/index.js";
import { createPostDTO } from "../dtos/index.js";

const postRouter = Router();

postRouter.post("", authenticate, validate(createPostDTO), createPost);
postRouter.get("", authenticate, getPosts);
postRouter.get("/:slug", getPostBySlug);
postRouter.put("/:id", authenticate, updatePost);
postRouter.delete("/:id", authenticate, deletePost);

export { postRouter };
