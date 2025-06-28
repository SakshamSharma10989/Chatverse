import User from "../models/user.model.js";

export const getuserForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUser = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
    return res.status(200).json(filteredUser);
  } catch (error) {
    console.log("Error in getuserforsidebar controller:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { readReceiptsEnabled } = req.body;
    const userId = req.user._id;

    if (typeof readReceiptsEnabled !== "boolean") {
      return res.status(400).json({ error: "Invalid readReceiptsEnabled value" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { readReceiptsEnabled },
      { new: true, select: "-password" }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ success: true, readReceiptsEnabled: user.readReceiptsEnabled });
  } catch (error) {
    console.log("Error in updateUser controller:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};