import { Router } from "express";

const router = Router();

import { getUser,followUser,unFollowUser } from "../controllers/UserController.js";


// Get user profile
router.get("/user", getUser);

// Follow a user
router.put("/follow/:id", followUser);

// Unfollow a user
router.put("/unfollow/:id", unFollowUser);
  
export default router;
