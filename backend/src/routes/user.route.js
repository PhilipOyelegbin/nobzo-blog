import { Router } from "express";
import {
  register,
  login,
  profiles,
  deleteProfile,
  updateProfile,
} from "../controllers/index.js";
import { authenticate, validate } from "../middlewares/index.js";
import { loginDTO, registerDTO } from "../dtos/index.js";

const userRouter = Router();

userRouter.post("/auth/register", validate(registerDTO), register);
userRouter.post("/auth/login", validate(loginDTO), login);
userRouter.get("/users", authenticate, profiles);
userRouter.put("/users", authenticate, updateProfile);
userRouter.delete("/users", authenticate, deleteProfile);

export { userRouter };
