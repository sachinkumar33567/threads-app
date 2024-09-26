import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generate.token.js";

// 200 OK
// 400 Bad Request, 401 Uauthorized, 404 Not Found
// 500 Internal Server Error

export const signup = async (req, res) => {
  const { name, username, email, password } = req.body;
  try {
    const user = await User.findOne({ $or: [{ username }, { email }] });
    if (user) {
      return res.status(400).json({ error: "User already exists" });
    }
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({
      name,
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    const { password: pass, ...rest } = newUser._doc;
    generateTokenAndSetCookie(rest._id, res);
    res.status(200).json(rest);
  } catch (error) {
    console.log("Error in Signup controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const signin = async (req, res) => {
  const { username, password } = req.body;
  const email = username;
  try {
    const user = await User.findOne({ $or: [{ username }, { email }] });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const validPassword = bcryptjs.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: "Invalid password" });
    }

    if (user.isFrozen) {
      user.isFrozen = false;
      await user.save();
    }

    const { password: pass, ...rest } = user._doc;

    generateTokenAndSetCookie(rest._id, res);
    res.status(202).json(rest);
  } catch (error) {
    console.log("Error in Signin controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const google = async (req, res) => {
  const { name, email, profilePicture } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user) {
      const { password: pass, ...rest } = user._doc;
      generateTokenAndSetCookie(rest._id, res);
      res.status(202).json(rest);
    } else {
      const username =
        name.split(" ")[0].toLowerCase() + Math.random().toString(9).slice(-3); // Number only
      const password = Math.random().toString(36).slice(-10); // Numbers and letters both
      const hashedPassword = bcryptjs.hashSync(password, 10);
      const newUser = new User({
        name,
        username,
        email,
        profilePicture,
        password: hashedPassword,
      });

      await newUser.save();
      const { password: pass, ...rest } = newUser._doc;
      generateTokenAndSetCookie(rest._id, res);
      res.status(200).json(rest);
    }
  } catch (error) {
    console.log("Error in Google controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const signout = (req, res) => {
  try {
    res
      .clearCookie("access_token")
      .status(200)
      .json({ message: "You've been logged out" });
  } catch (error) {
    console.log("Error in Signout controller: ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const cookie = (req, res) => {
  const token = req.cookies.access_token;
  res.status(200).json({ token });
};
