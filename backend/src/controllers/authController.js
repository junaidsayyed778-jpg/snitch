import { setAuthCookie } from "../utils/cookie.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  loginUser,
  registerUser,
  googleLoginUser,
} from "../services/authService.js";

export const register = asyncHandler(async (req, res) => {
  const { email, contact, password, fullname, isSeller } = req.body;

  const { token, user } = await registerUser({
    email,
    contact,
    password,
    fullname,
    isSeller,
  });

  setAuthCookie(res, token);

  res.status(201).json({
    message: "User registered successfully",
    success: true,
    user: {
      id: user._id,
      email: user.email,
      contact: user.contact,
      fullname: user.fullname,
      role: user.role,
      profilePic: user.profilePic,
    },
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const { token, user } = await loginUser(email, password);

  setAuthCookie(res, token);

  res.status(200).json({
    message: "User logged in successfully",
    success: true,
    user: {
      id: user._id,
      email: user.email,
      contact: user.contact,
      fullname: user.fullname,
      role: user.role,
      profilePic: user.profilePic,
    },
  });
});

export const googleCallback = asyncHandler(async (req, res) => {
  const { token } = await googleLoginUser(req.user);

  setAuthCookie(res, token);

  res.redirect("http://localhost:5173/");
});

export const getMe = asyncHandler(async (req, res) => {
  const user = req.user;

  res.status(200).json({
    message: "User fetched successfully",
    success: true,
    user: {
      id: user._id,
      email: user.email,
      contact: user.contact,
      fullname: user.fullname,
      role: user.role,
      profilePic: user.profilePic,
    },
  });
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  res.status(200).json({
    message: "User logged out successfully",
    success: true,
  });
});
