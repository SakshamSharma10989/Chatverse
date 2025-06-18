import bcryptjs from "bcryptjs"
import User from "../models/user.model.js"
import generateTokenandsetCookie from "../utils/generateToken.js"

export const signup = async (req, res) => {
  try {
    const { fullname, username, password, confirmPassword, gender } = req.body;

    if (!fullname || !username || !password || !confirmPassword || !gender) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Password does not match" });
    }

    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

    const newUser = new User({
      fullname,
      username,
      password: hashedPassword,
      gender,
      profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
    });

    await newUser.save();  // ✅ Save first
    generateTokenandsetCookie(newUser._id, res);  // ✅ Then generate token

    res.status(201).json({
      _id: newUser._id,
      fullname: newUser.fullname,
      username: newUser.username,
      profilePic: newUser.profilePic,
    });
  } catch (error) {
    console.error("Signup error:", error.message);  // ✅ Log the real error
    res.status(500).json({ error: "Internal Server Error" });
  }
};



export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log("Login attempt:", { username });
    if (!username || !password) {
      console.log("Missing credentials");
      return res.status(400).json({ error: "Please fill all fields" });
    }
    const user = await User.findOne({ username });
    console.log("Found user:", user ? user._id : "Not found");
    if (!user) {
      console.log("User not found");
      return res.status(400).json({ error: "Invalid credentials" });
    }
    const isPasswordCorrect = await bcryptjs.compare(password, user.password || "");
    console.log("Password match:", isPasswordCorrect);
    if (!isPasswordCorrect) {
      console.log("Password mismatch");
      return res.status(400).json({ error: "Invalid credentials" });
    }
    generateTokenandsetCookie(user._id, res);
    console.log("Token generated for:", user._id);
    res.status(201).json({
      _id: user._id,
      fullname: user.fullname,
      username: user.username,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.error("Login error:", error.message, error.stack);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export const logout=(req,res)=>{
    try {
        res.cookie("jwt","",{maxAge:0});
        return res.status(200).json({message:"logout successful"})
    } catch (error) {
        res.status(500).json({error:"Internal Server Error"})
    }
}

