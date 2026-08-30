import userModel from "../models/userModel.js";
import { generateToken } from "../utils/token.js";
import AppError from "../errors/AppError.js";

export async function loginUser(email, password) {
  const user = await userModel.findOne({ email });

  if (!user) {
    throw new AppError("Invalid email or password", 400);
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new AppError("Invalid email or password", 400);
  }

  const token = generateToken(user._id);

  return {
    token,
    user,
  };
}

export async function registerUser({
  email,
  contact,
  password,
  fullname,
  isSeller,
}) {
  const existingUser = await userModel.findOne({
    $or: [{ email }, { contact }],
  });

  if (existingUser) {
    throw new AppError("User already exists", 409);
  }

  const user = await userModel.create({
    email,
    contact,
    password,
    fullname,
    role: isSeller ? "seller" : "buyer",
  });

  const token = generateToken(user._id);

  return {
    token,
    user,
  };
}

export async function googleLoginUser(profile) {
  const email = profile.emails[0].value
  const fullname = profile.displayName

  let user = await userModel.findOne({ email })

  if (!user) {
    user = await userModel.create({
      email,
      googleId: profile.id,
      fullname,
      contact: "N/A",
      password: "google-oauth-" + profile.id,
      role: "buyer"
    })
  }

  const token = generateToken(user._id);

  return {
    token,
    user,
  };
}
