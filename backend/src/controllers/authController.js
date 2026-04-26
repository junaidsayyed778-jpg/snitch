import { config } from "../config/config.js"
import userModel from "../models/userModel.js"
import jwt from "jsonwebtoken"

async function sendTokenResponse(user, res, message) {
    const token = jwt.sign({
        id: user._id,
    }, config.JWT_SECRET, {
        expiresIn: "7d"
    })

    res.cookie("token", token, {
        httpOnly: true,
        secure: false, // Set to true in production
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    res.status(200).json({
        message: message || "success",
        success: true,
        user: {
            id: user._id,
            email: user.email,
            contact: user.contact,
            fullname: user.fullname,
            role: user.role,
            profilePic: user.profilePic
        }
    })
}
export const register = async (req, res) => {
    const { email, contact, password, fullname, isSeller } = req.body

    try {
        const existingUser = await userModel.findOne({
            $or: [
                { email },
                { contact }
            ]
        })

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            })
        }

        const user = await userModel.create({
            email,
            contact,
            password,
            fullname,
            role: isSeller ? "seller" : "buyer"
        })
        await sendTokenResponse(user, res, "user registered successfully")
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message: "Server error"
        })
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body

    const user = await userModel.findOne({ email })

    if (!user) {
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    const isMatch = await user.comparePassword(password)

    if (!isMatch) {
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }
    await sendTokenResponse(user, res, "User logged in successfully")
}

export const googleCallback = async (req, res) => {
    console.log(req.user)
    try {
        const profile = req.user
        const email = profile.emails[0].value
        const fullname = profile.displayName

        // Find existing user or create a new one
        let user = await userModel.findOne({ email })

        if (!user) {
            user = await userModel.create({
                email,
                googleId: profile.id,
                fullname,
                contact: "N/A",
                password: "google-oauth-" + profile.id,
                role: "buyer",
            })
        }

        // Generate JWT and set cookie
        const token = jwt.sign(
            { id: user._id },
            config.JWT_SECRET,
            { expiresIn: "7d" }
        )

        res.cookie("token", token, {
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })

        res.redirect("http://localhost:5173/")
    } catch (err) {
        console.error("Google callback error:", err)
        res.redirect("http://localhost:5173/login")
    }
}

export const getMe = async (req, res) => {
    const user = req.user

    res.status(200).json({
        message: "User fetched successfully",
        success: true,
        user: {
            id: user._id,
            email: user.email,
            contact: user.contact,
            fullname: user.fullname,
            role: user.role,
            profilePic: user.profilePic
        }
    })
}

export const logout = async (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: false, // Set to true in production
        sameSite: "lax",
    })
    res.status(200).json({ message: "User logged out successfully", success: true })
}