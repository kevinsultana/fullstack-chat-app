import express from "express";
import {
  login,
  logout,
  me,
  register,
  updateProfile,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

router.get("/me", protectRoute, me);
router.put("/update-profile", protectRoute, updateProfile);

export default router;
