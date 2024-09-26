import Conversation from "../models/conv.model.js";
import Message from "../models/msg.model.js";
import { getRecipientSocketId, io } from "../socket/socket.js";
import { v2 as cloudinary } from "cloudinary";

export const sendMessage = async (req, res) => {
  const { recipientId, message } = req.body;
  const userId = req.user._id;
  let { img } = req.body;

  try {
    let conversation = await Conversation.findOne({
      participants: { $all: [userId, recipientId] },
    });

    if (!conversation) {
      conversation = new Conversation({
        participants: [userId, recipientId],
        lastMessage: {
          sender: userId,
          text: message,
        },
      });

      await conversation.save();
    }

    if (img) {
      const uploadedResponse = await cloudinary.uploader.upload(img);
      img = uploadedResponse.secure_url;
    }
    const newMessage = new Message({
      convId: conversation._id,
      sender: userId,
      text: message,
      img: img || "",
    });

    await Promise.all([
      newMessage.save(),
      conversation.updateOne({
        lastMessage: {
          sender: userId,
          text: message,
        },
      }),
    ]);

    const recipientSocketId = getRecipientSocketId(recipientId);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("newMessage", newMessage);
    }
    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in Send message controller", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getMessages = async (req, res) => {
  const userId = req.user._id;
  const { participantId } = req.params;

  try {
    const conversation = await Conversation.findOne({
      participants: { $all: [userId, participantId] },
    });
    if (!conversation) {
      res.status(404).json({ error: "Conversation not found" });
    }
    const messages = await Message.find({
      convId: conversation?._id,
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in Get messages controller", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getCoversations = async (req, res) => {
  const userId = req.user._id;
  try {
    const conversations = await Conversation.find({
      participants: userId,
    }).populate({
      path: "participants",
      select: "username name profilePicture",
    });
    // Remove the current user from participants array
    conversations.forEach((conversation) => {
      conversation.participants = conversation.participants.filter(
        (p) => p._id.toString() !== userId.toString()
      );
    });
    res.status(200).json(conversations);
  } catch (error) {
    console.log("Error in Get conversations controller", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
