// services/postService.js

import PostMessage from "../models/postMessage.js";

export const getPostById = async (id) => {
  return await PostMessage.findById(id);
};

export const getPosts = async (page) => {
  const LIMIT = 6;
  const startIndex = (Number(page) - 1) * LIMIT;
  const total = await PostMessage.countDocuments({});
  const posts = await PostMessage.find()
    .sort({ _id: -1 })
    .limit(LIMIT)
    .skip(startIndex);

  return {
    data: posts,
    currentPage: Number(page),
    numberOfPages: Math.ceil(total / LIMIT),
  };
};

export const getPostsBySearch = async (searchQuery, tags) => {
  const title = new RegExp(searchQuery, "i");
  return await PostMessage.find({
    $or: [{ title }, { tags: { $in: tags.split(",") } }],
  });
};