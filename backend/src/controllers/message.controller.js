import { getReceiverSocketId, io } from "../lib/socket.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import { v2 as cloudinary } from 'cloudinary';
export const getUsersForSideBar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUser = await User.find({ _id: { $ne: loggedInUserId } }, { password: 0 });

        res.status(200).json(filteredUser);
    } catch (err) {
        console.log("Error in getUsersForSideBar", err.message);
        res.status(500).json({ "message": "Internal Server Error" });  // Internal Server Error status code 500. 500 indicates a server error, which could be due to a database error, a network issue, or any other server-side problem.
    }
}


export const getMessages = async (req, res) => {
    try {
        const otherUser = req.params.id;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [{ senderId: myId, receiverId: otherUser }, { senderId: otherUser, receiverId: myId }]
        })

        res.status(200).json(messages);
    } catch (err) {
        console.log("Error in getMessages", err.message);
        res.status(500).json({ "message": "Internal Server Error" });
    }
}

export const sendMessages = async (req, res) => {
    try {
        const { text, image } = req.body;
        const receiverId = req.params.id;
        const senderId = req.user._id;

        let imgUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imgUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imgUrl,
        });

        await newMessage.save();

        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }



        res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error in sendMessages", error.message);
        res.status(500).json({ "message": "Internal Server Error" });  // Internal Server Error status code 500. 500 indicates a server error, which could be due to a database error, a network issue, or any other server-side problem.
    }
}