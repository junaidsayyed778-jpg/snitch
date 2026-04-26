import jwt from "jsonwebtoken"
import userModel from "../models/userModel.js";
import { config } from "../config/config.js";
import { json } from "express";

export const authenticateUser = async (req, res, next) => {
    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({
            message: "Unathorized"
        })
    }

    try {
        const decoded = jwt.verify(token, config.JWT_SECRET)

        const user = await userModel.findById(decoded.id)

        if (!user) {
            return res.status(401).json({
                message: "Unathorized"
            })
        }

        req.user = user
        next()
    } catch (err) {
        return res.status(401).json({ message: "Unauthorized: Invalid token" });

    }
}

const authenticateSeller = async (req, res, next) => {
    try {
        const token = req.cookies?.token;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: "Unauthorized: User not found" });
        }
        if (user.role !== "seller") {
            return res.status(403).json({ message: "Forbidden: Not a seller" });
        }
        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
};

export default authenticateSeller