import { Post } from "../models/index.js";

async function createBlog(req, res) {
  const loggedInUserId = req.user?.id;
  if (!loggedInUserId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const { title, content, status, tags } = req.body;
    const newPost = await Post.create({
      title,
      content,
      status,
      tags,
      author: loggedInUserId,
    });
    res
      .status(201)
      .json({ message: "Post created successfully", data: newPost });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
}

async function fetchBlogs(req, res) {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const skip = (page - 1) * limit;
  const query = { deletedAt: null };

  // query conditionals
  if (req.user && req.query.status) {
    query.status = req.query.status;
  } else {
    query.status = "published";
  }

  if (req.query.search) {
    query.$or = [
      { title: { $regex: req.query.search, $options: "i" } },
      { content: { $regex: req.query.search, $options: "i" } },
    ];
  }

  if (req.query.tag) {
    query.tags = req.query.tag;
  }

  if (req.query.author) {
    query.author = req.query.author;
  }

  try {
    const [posts, total] = await Promise.all([
      Post.find(query)
        .populate("author", "-password")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Post.countDocuments(query),
    ]);

    res.status(200).json({
      message: "Posts fetched successfully",
      data: posts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
}

async function fetchBlogBySlug(req, res) {
  const { slug } = req.params;
  try {
    const existingPost = await Post.findOne({
      slug,
      status: "published",
      deletedAt: null,
    }).populate("author", "-password");
    if (!existingPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res
      .status(200)
      .json({ message: "Post fetched successfully", data: existingPost });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
}

async function updateBlog(req, res) {
  const loggedInUserId = req.user?.id;
  if (!loggedInUserId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const { id } = req.params;
  try {
    const body = req.body;
    const existingPost = await Post.findOne({
      _id: id,
      author: loggedInUserId,
      deletedAt: null,
    });
    if (!existingPost) {
      return res
        .status(404)
        .json({ message: "Post not found or unauthorized" });
    }

    Object.assign(existingPost, body);
    await existingPost.save();
    res
      .status(200)
      .json({ message: "Post updated successfully", data: existingPost });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
}

async function deleteBlog(req, res) {
  const loggedInUserId = req.user?.id;
  if (!loggedInUserId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const { id } = req.params;
  try {
    const existingPost = await Post.findOne({
      _id: id,
      author: loggedInUserId,
      deletedAt: null,
    }).select("-password");
    if (!existingPost) {
      return res
        .status(404)
        .json({ message: "Post not found or unauthorized" });
    }

    existingPost.deletedAt = new Date();
    await existingPost.save();
    res.status(200).json({
      message: "Post moved to trash successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
}

export { createBlog, fetchBlogs, fetchBlogBySlug, updateBlog, deleteBlog };
