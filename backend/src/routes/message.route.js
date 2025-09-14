import express from "express";

import { protectRoute } from "../middleware/auth.middleware.js";
import { getAllConnectedUsers } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/users", protectRoute, getAllConnectedUsers);

export default router;
