import express from "express";
import {
  getPost,
  getPosts,
  createPost,
  updatePost,
  deletePost,
  likePost,
  commentPost,
  getPostsBySearch,
} from "../controllers/postController.js";
import auth from "../middleware/auth.js";

const router = express.Router();
router.get("/search", getPostsBySearch);
router.get("/", getPosts);
router.get("/:id", getPost);

// Route for creating a new post (protected)
router.post("/", auth, createPost);

// Route for deleting a post (protected)
router.delete("/:id", auth, deletePost);