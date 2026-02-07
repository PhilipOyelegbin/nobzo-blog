import { signToken } from "../config/jwt.js";
import { Post, User } from "../models/index.js";
import * as argon from "argon2";

async function registerUser(req, res) {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await argon.hash(password);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    newUser.password = undefined;
    res
      .status(201)
      .json({ message: "User registered successfully", data: newUser });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
}

async function loginUser(req, res) {
  try {
    const { email, password } = await req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const isPasswordValid = await argon.verify(existingUser.password, password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = await signToken({
      id: existingUser.id,
      email: existingUser.email,
    });

    res
      .status(200)
      .json({ message: "User logged in successfully", data: { token } });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
}

async function fetchUser(req, res) {
  const loggedInUserId = req.user?.id;
  if (!loggedInUserId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const existingUsers =
      await User.findById(loggedInUserId).select("-password");
    res
      .status(200)
      .json({ message: "User fetched successfully", data: existingUsers });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
}

async function updateUser(req, res) {
  const loggedInUserId = req.user?.id;
  if (!loggedInUserId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const body = req.body;
    const existingUser =
      await User.findById(loggedInUserId).select("-password");
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    Object.assign(existingUser, body);
    await existingUser.save();
    res
      .status(200)
      .json({ message: "User updated successfully", data: existingUser });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
}

async function deleteUser(req, res) {
  const loggedInUserId = req.user?.id;
  if (!loggedInUserId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const existingUser =
      await User.findById(loggedInUserId).select("-password");
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const existingPost = await Post.find({ author: loggedInUserId });
    if (existingPost.length > 0) {
      return res.status(400).json({
        message:
          "Cannot delete user with existing posts. Please delete all user's posts first.",
      });
    }

    await existingUser.deleteOne(existingUser);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
}

export { registerUser, loginUser, fetchUser, updateUser, deleteUser };
