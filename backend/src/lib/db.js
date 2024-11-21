import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGODB_URI);
        console.log("Mongo Connected : ", connection.connection.host);

    } catch (err) {
        console.log("Mongo Error :", err);
    }
}