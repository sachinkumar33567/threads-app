import express from "express";
import {
  followUnfollowUser,
  freezeAccount,
  getSuggestedUsers,
  updateUser,
  userProfile,
} from "../controllers/user.controllers.js";
import verifyToken from "../middlewares/verify.token.js";

const router = express.Router();

router.get("/profile/:query", userProfile);
router.post("/follow/:id", verifyToken, followUnfollowUser);
router.put("/update/:id", verifyToken, updateUser);
router.get("/suggestedUsers", verifyToken, getSuggestedUsers);
router.put("/freeze", verifyToken, freezeAccount);
export default router;
