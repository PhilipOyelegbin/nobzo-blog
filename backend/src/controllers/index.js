import {
  registerUser,
  loginUser,
  fetchUser,
  deleteUser,
  updateUser,
} from "./user.controller.js";
import {
  createBlog,
  fetchBlogs,
  fetchBlogBySlug,
  updateBlog,
  deleteBlog,
} from "./post.controller.js";

export const register = registerUser;
export const login = loginUser;
export const profiles = fetchUser;
export const updateProfile = updateUser;
export const deleteProfile = deleteUser;
export const createPost = createBlog;
export const getPosts = fetchBlogs;
export const getPostBySlug = fetchBlogBySlug;
export const updatePost = updateBlog;
export const deletePost = deleteBlog;
