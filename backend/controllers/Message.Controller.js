const Message = require("../models/Message.Schema");
const User = require("../models/User.Schema");

// Get all users except the looged in user
const getAllUsers = async (req, res) => {
  try {
    const { _id } = req.user;
    const filterUsers = await User.find({ _id: { $ne: _id } }).select(
      "-password"
    );
    const unSeenMessages = {};
    const promises = filterUsers.map(async (user) => {
      const unSeen = await Message.find({
        senderId: user._id,
        receiverId: _id,
        seen: false,
      });
      if (unSeen.length > 0) {
        unSeenMessages[user._id] = unSeen.length;
      }
    });
    await Promise.all(promises);
    return res.status(200).json({
      success: true,
      message: "Message retrieved successfully",
      user: filterUsers,
      messages: unSeenMessages,
    });
  } catch (error) {
    console.error(error);
  }
};


module.exports = { getAllUsers};
