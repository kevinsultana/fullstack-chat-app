import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  findUsers,
  getFriends,
  getFriendRequests,
  sendFriendRequest,
  respondToFriendRequest,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/find", protectRoute, findUsers);
router.get("/friends", protectRoute, getFriends);
router.get("/requests", protectRoute, getFriendRequests);
router.post("/send-request/:recipientId", protectRoute, sendFriendRequest);
router.post("/respond-request", protectRoute, respondToFriendRequest);

export default router;
