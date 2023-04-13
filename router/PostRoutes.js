import {Router} from "express";
import { getSinglePost,getAllPosts,likePost,unlikePost,commentPost,deletePost,createPost } from "../controllers/PostController.js";

const router = Router();


// Get all posts
router.get("/all_posts", getAllPosts);

// Get single post
router.get("/posts/:postId", getSinglePost);

// Create post
router.post("/posts", createPost);

// Like post
router.put("/like/:id", likePost);

// Unlike post
router.put("/unlike/:id", unlikePost);

// Comment on post
router.put("/comment/:id", commentPost);

// Delete post
router.delete("/posts/:id", deletePost);

export default router;

