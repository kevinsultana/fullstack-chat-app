import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const findUsers = async (req, res) => {
  try {
    const { query } = req.query;
    const myId = req.user._id;

    if (!query) {
      return res.status(200).json([]);
    }

    const users = await User.find({
      $and: [
        { _id: { $ne: myId } },
        {
          $or: [
            { fullName: { $regex: query, $options: "i" } },
            { email: { $regex: query, $options: "i" } },
          ],
        },
      ],
    }).select("-password");

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const sendFriendRequest = async (req, res) => {
  try {
    const { recipientId } = req.params;
    const senderId = req.user._id;

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: "User not found" });
    }

    if (
      recipient.friends.includes(senderId) ||
      recipient.friendRequestsReceived.includes(senderId)
    ) {
      return res
        .status(400)
        .json({ message: "Friend request already sent or already friends" });
    }

    await User.findByIdAndUpdate(senderId, {
      $push: { friendRequestsSent: recipientId },
    });
    await User.findByIdAndUpdate(recipientId, {
      $push: { friendRequestsReceived: senderId },
    });

    const newNotification = new Notification({
      recipient: recipientId,
      sender: senderId,
      type: "friend_request",
      message: `${req.user.fullName} has sent you a friend request.`,
    });
    await newNotification.save();

    const receiverSocketId = getReceiverSocketId(recipientId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("new_notification", newNotification);
    }

    res.status(200).json({ message: "Friend request sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const respondToFriendRequest = async (req, res) => {
  try {
    const { senderId, status } = req.body;
    const recipientId = req.user._id;

    // Hapus request dari kedua user
    await User.findByIdAndUpdate(recipientId, {
      $pull: { friendRequestsReceived: senderId },
    });
    await User.findByIdAndUpdate(senderId, {
      $pull: { friendRequestsSent: recipientId },
    });

    if (status === "accepted") {
      await User.findByIdAndUpdate(recipientId, {
        $push: { friends: senderId },
      });
      await User.findByIdAndUpdate(senderId, {
        $push: { friends: recipientId },
      });
    }

    await Notification.findOneAndDelete({
      recipient: recipientId,
      sender: senderId,
      type: "friend_request",
    });

    res.status(200).json({ message: `Request ${status}` });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getFriends = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate(
      "friends",
      "-password"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user.friends);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getFriendRequests = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate(
      "friendRequestsReceived",
      "-password"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user.friendRequestsReceived);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
