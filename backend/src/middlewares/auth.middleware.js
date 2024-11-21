import jwt from 'jsonwebtoken'
import User from '../models/user.model.js';

export const protectedRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({ message: "Not authorized, please login" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({ message: "Not authorized, Invalid token" });
        }

        const user = await User.findById(decoded.userId, { password: 0 });
        if (!user) {
            return res.status(401).json({ message: "Not authorized, User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.log("Error in protected route" , error.message);
        res.status(500).json({message : "Internal Server Error"})
    }
}