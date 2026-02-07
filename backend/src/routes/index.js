import { Router } from "express";
export * from "./user.route.js";
export * from "./post.route.js";

const apiRouter = Router();

export { apiRouter };
