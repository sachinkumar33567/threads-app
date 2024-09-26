import Post from "../models/post.model.js";
import { v2 as cloudinary } from "cloudinary";

export const createPost = async (req, res) => {
  let { postText, imgURL } = req.body;
  if (postText.length > 500)
    return res.status(400).json({ error: "Text length should be below 500" });

  if (!postText && !imgURL)
    return res.status(400).json({error: "You can't create empty post"})
  try {
    if (imgURL) {
      const uploadedResponse = await cloudinary.uploader.upload(imgURL);
      imgURL = uploadedResponse.secure_url;
    }
    const newPost = new Post({
      userId: req.user._id,
      text: postText,
      img: imgURL,
    });

    await newPost.save();
    res.status(200).json(newPost);
  } catch (error) {
    console.log("Error in Create post controller : ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({error: "Post not found"});

    res.status(200).json(post);
  } catch (error) {
    console.log("Error in Get post controller : ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deletePost = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findById(id);
    if (!post) return res.status(404).json("Post not found");

    if (req.user.id.toString() !== post.userId.toString()) {
      return res.status(400).json("You're not allowed to delete this post");
    }
    if (post.img) {
      const publidId = post.img.split("/").pop().split(".")[0];
      const response = await cloudinary.uploader.destroy(publidId);
      console.log(response);
    }
    await Post.findByIdAndDelete(id);
    res.status(200).json("Post successfully deleted");
  } catch (error) {
    console.log("Error in Delete post controller : ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const likeUnlikePost = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  try {
    const post = await Post.findById(id);
    if (!post) return res.status(404).json("Post not found");

    const userIndex = post.likes.indexOf(userId);
    if (userIndex === -1) {
      post.likes.push(userId);
    } else {
      post.likes.splice(userIndex, 1);
    }

    await post.save();
    res.status(200).json(post);
  } catch (error) {
    console.log("Error in Like unlike post controller : ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const replyToPost = async (req, res) => {
  const { id: userId, username, profilePicture } = req.user;

  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json("Post not found");

    const reply = {
      userId,
      text: req.body.text,
      username,
      profilePicture,
    };
    post.replies.push(reply);

    await post.save();
    res.status(200).json(reply);
  } catch (error) {
    console.log("Error in Reply to post controller : ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getFeedPosts = async (req, res) => {
  try {
    const following = req.user.following;
    const feedPosts = await Post.find({ userId: { $in: following } }).sort({
      createdAt: -1,
    });
    res.status(200).json(feedPosts);
  } catch (error) {
    console.log("Error in Get feed posts controller : ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const userPosts = await Post.find({ userId: req.params.id }).sort({
      createdAt: -1,
    });
    res.status(200).json(userPosts);
  } catch (error) {
    console.log("Error in Get feed posts controller : ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
