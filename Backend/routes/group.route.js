// ../backend/routes/group.route.js
import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import Group from "../models/group.model.js";

const router = express.Router();

// Get groups the authenticated user is a member of
router.get("/", protectRoute, async (req, res) => {
  try {
    const groups = await Group.find({ members: req.user._id }).select("name members _id");
    res.json(groups);
  } catch (error) {
    console.error("Error fetching groups:", error);
    res.status(500).json({ error: error.message });
  }
});

// Create a new group
router.post("/", protectRoute, async (req, res) => {
  try {
    const { name, members } = req.body;
    if (!name) throw new Error("Group name is required");
    const newGroup = new Group({
      name,
      members: members || [req.user._id],
    });
    const savedGroup = await newGroup.save();
    console.log("Group created:", savedGroup);
    res.status(201).json(savedGroup);
  } catch (error) {
    console.error("Error creating group:", error);
    res.status(500).json({ error: error.message });
  }
});

// Add members to an existing group
router.put("/:groupId", protectRoute, async (req, res) => {
  try {
    const { groupId } = req.params;
    const { members } = req.body; // Array of user _ids to add
    if (!members || !Array.isArray(members)) throw new Error("Members array is required");

    const group = await Group.findById(groupId);
    if (!group) throw new Error("Group not found");
    if (!group.members.includes(req.user._id)) throw new Error("You are not a member of this group");

    // Add new members, avoiding duplicates
    const updatedMembers = [...new Set([...group.members, ...members])];
    group.members = updatedMembers;
    const updatedGroup = await group.save();
    console.log("Group updated with new members:", updatedGroup);
    res.json(updatedGroup);
  } catch (error) {
    console.error("Error updating group members:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;