import { setAuthCookie } from "../utils/cookie.js";
import {
  loginUser,
  registerUser,
  googleLoginUser,
} from "../services/authService.js";

export const register = async (req, res) => {
  const { email, contact, password, fullname, isSeller } = req.body;

  try {
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
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
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
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    });
  }
};
export const googleCallback = async (req, res) => {
  try {
    const { token } = await googleLoginUser(req.user);

    setAuthCookie(res, token);

    res.redirect("http://localhost:5173/");
  } catch (err) {
    console.error("Google callback error:", err);
    res.redirect("http://localhost:5173/login");
  }
};

export const getMe = async (req, res) => {
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
};

export const logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false, // Set to true in production
    sameSite: "lax",
  });
  res
    .status(200)
    .json({ message: "User logged out successfully", success: true });
};
