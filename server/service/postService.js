// services/postService.js

import PostMessage from "../models/postMessage.js";

/**
 * Retrieves a post by its ID.
 * 
 * @param {string} id - The ID of the post to retrieve
 * @returns {Promise<Object>} The post document
 */
export const getPostById = async (id) => {
  return await PostMessage.findById(id);
};

/**
 * Retrieves a paginated list of posts.
 * 
 * @param {number} page - The page number to retrieve
 * @returns {Promise<Object>} Object containing posts data, current page, and total number of pages
 */
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

/**
 * Searches for posts based on a search query and tags.
 * 
 * @param {string} searchQuery - The search query for post titles
 * @param {string} tags - Comma-separated list of tags
 * @returns {Promise<Array>} Array of matching post documents
 */
export const getPostsBySearch = async (searchQuery, tags) => {
  const title = new RegExp(searchQuery, "i");
  return await PostMessage.find({
    $or: [{ title }, { tags: { $in: tags.split(",") } }],
  });
};

export const createPost = async (postData) => {
  const newPost = new PostMessage(postData);
  return await newPost.save();
};

export const deletePost = async (id) => {
  return await PostMessage.findByIdAndDelete(id);
};

export const commentOnPost = async (id, value) => {
  const post = await PostMessage.findById(id);
  post.comments.push(value);

  return await PostMessage.findByIdAndUpdate(id, post, { new: true });
};

export const likePost = async (id, userId) => {
  const post = await PostMessage.findById(id);
  const index = post.likes.findIndex((id) => id === String(userId));

  if (index === -1) {
    // Like the post
    post.likes.push(userId);
  } else {
    // Unlike the post
    post.likes = post.likes.filter((id) => id !== String(userId));
  }

  return await PostMessage.findByIdAndUpdate(id, post, { new: true });
};

export const updatePost = async (id, postData) => {
  return await PostMessage.findByIdAndUpdate(
    id,
    { ...postData, _id: id },
    { new: true }
  );
};
