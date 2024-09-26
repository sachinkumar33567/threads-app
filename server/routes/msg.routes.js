import express from "express";
import {
  getCoversations,
  getMessages,
  sendMessage,
} from "../controllers/msg.controllers.js";
import verifyToken from "../middlewares/verify.token.js";

const router = express.Router();

router.post("/", verifyToken, sendMessage);
router.get("/:participantId", verifyToken, getMessages);
router.get("/", verifyToken, getCoversations);
export default router;
