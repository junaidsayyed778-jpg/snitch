import userModel from "../models/userModel.js";
import { generateToken } from "../utils/token.js";

export async function loginUser(email, password) {
  const user = await userModel.findOne({ email });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new Error("Invalid email or password");
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
    throw new Error("User already exists");
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
