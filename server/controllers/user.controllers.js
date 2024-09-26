import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import bcryptjs from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";

// 200 OK
// 400 Bad Request, 401 Uauthorized, 404 Not Found
// 500 Internal Server Error

export const followUnfollowUser = async (req, res) => {
  const { id } = req.params;
  try {
    const userToModify = await User.findById(id);
    if (
      !userToModify ||
      userToModify._id.toString() === req.user._id.toString()
    ) {
      return res
        .status(400)
        .json({ error: "You can't follow unfollow this user" });
    }
    const isFollowing = req.user.following.includes(id);
    if (isFollowing) {
      // Unfollowing
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
      res.status(200).json("User unfollowed successfully");
    } else {
      // Following
      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
      res.status(200).json("User followed successfully");
    }
  } catch (error) {
    console.log("Error in Follow unfollow user controller : ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, username, email, bio, profilePicture } = req.body;
  let { password } = req.body;
  try {
    if (id !== req.user._id.toString()) {
      return res
        .status(400)
        .json({ error: "You're not allowed to update this user" });
    }

    if (password) {
      password = bcryptjs.hashSync(password, 10);
    }
    const user = await User.findById(id);

    // Deleting image from the cloudinary
    if (profilePicture) {
      if (user.profilePicture) {
        const publidId = user.profilePicture.split("/").pop().split(".")[0];
        const response = await cloudinary.uploader.destroy(publidId);
        console.log(response);
      }
    }

    user.name = name || user.name;
    user.username = username || user.username;
    user.email = email || user.email;
    user.bio = bio || user.bio;
    user.profilePicture = profilePicture || user.profilePicture;
    user.password = password || user.password;

    await user.save();

    // Find all posts that this user replied and update username & profile pictures fields
    await Post.updateMany(
      { "replies.userId": id },
      {
        $set: {
          "replies.$[reply].username": user.username,
          "replies.$[reply].profilePicture": user.profilePicture,
        },
      },
      { arrayFilters: [{ "reply.userId": id }] }
    );

    const { password: pass, ...rest } = user._doc;

    res.status(200).json(rest);
  } catch (error) {
    console.log("Error in Update user controller : ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const userProfile = async (req, res) => {
  const { query } = req.params;
  try {
    let user;
    if (mongoose.Types.ObjectId.isValid(query)) {
      user = await User.findById(query)
        .select("-password")
        .select("-updatedAt");
    } else {
      user = await User.findOne({ username: query })
        .select("-password")
        .select("-updatedAt");
    }
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    console.log("Error in User Profile controller : ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getSuggestedUsers = async (req, res) => {
  const userId = req.user._id;
  try {
    const usersFollowedByYou = await User.findById(userId).select("following");
    const users = await User.aggregate([
      { $match: { _id: { $ne: userId } } },
      { $sample: { size: 10 } },
    ]);
    const filteredUsers = users.filter(
      (user) => !usersFollowedByYou.following.includes(user._id)
    );
    const suggestedUsers = filteredUsers.slice(0, 4);

    suggestedUsers.forEach((user) => (user.password = null));

    res.status(200).json(suggestedUsers);
  } catch (error) {
    console.log("Error in Get suggested users controller : ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const freezeAccount = async (req, res) => {
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.isFrozen = true;
    await user.save();

    res.status(200).json(user);
  } catch (error) {
    console.log("Error in Freeze account controller : ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
