// controllers/message-controller.js
const Message = require("../models/message-model");
const Client = require("../models/client-model");
const mongoose = require('mongoose');
const saveMessageToDatabase = async (messageData) => {
  const message = new Message(messageData);
  return await message.save();
};

const getMessagesBetweenUsers = async (req, res, next) => {
  try {
    const { userId1, userId2 } = req.params;

    const messages = await Message.find({
      $or: [
        { sender: userId1, receiver: userId2 },
        { sender: userId2, receiver: userId1 }
      ]
    }).sort({ timestamp: 1 });

    // Mark messages as read
    await Message.updateMany(
      { receiver: req.user.userId, sender: userId1, read: false },
      { $set: { read: true } }
    );

    res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
};

const getConversations = async (req, res, next) => {
    try {
      const userId = new mongoose.Types.ObjectId(req.user.userId);
  
      const conversations = await Message.aggregate([
        {
          $match: {
            $or: [
              { sender: userId },
              { receiver: userId }
            ]
          }
        },
        {
          $project: {
            otherUser: {
              $cond: [
                { $eq: ["$sender", userId] },
                "$receiver",
                "$sender"
              ]
            },
            lastMessage: "$$ROOT"
          }
        },
        {
          $group: {
            _id: "$otherUser",
            lastMessage: { $last: "$lastMessage" },
            unreadCount: {
              $sum: {
                $cond: [
                  { 
                    $and: [
                      { $eq: ["$lastMessage.receiver", userId] },
                      { $eq: ["$lastMessage.read", false] }
                    ]
                  },
                  1,
                  0
                ]
              }
            }
          }
        },
        {
          $lookup: {
            from: "clients",
            localField: "_id",
            foreignField: "_id",
            as: "user"
          }
        },
        {
          $unwind: "$user"
        },
        {
          $project: {
            "user.password": 0,
            "user.verificationIdDoc": 0,
            "user.verificationIdNo": 0
          }
        },
        {
          $sort: { "lastMessage.timestamp": -1 }
        }
      ]);
  
      res.status(200).json(conversations);
    } catch (error) {
      next(error);
    }
  };
  
module.exports = {
  saveMessageToDatabase,
  getMessagesBetweenUsers,
  getConversations
};