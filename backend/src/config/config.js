import dotenv from "dotenv"
dotenv.config()

/**
 * Normalizes and trims environment variables.
 * Ensures URL endpoints have trailing slashes.
 */
const getEnv = (key, required = true) => {
    const value = process.env[key]?.trim();
    if (required && !value) {
        throw new Error(`${key} is not defined in environment variables`);
    }
    return value;
};

const MONGO_URI = getEnv("MONGO_URI");
const JWT_SECRET = getEnv("JWT_SECRET");
const GOOGLE_CLIENT_ID = getEnv("GOOGLE_CLIENT_ID");
const GOOGLE_CLIENT_SECRET = getEnv("GOOGLE_CLIENT_SECRET");
const IMAGEKIT_PRIVATE_KEY = getEnv("IMAGEKIT_PRIVATE_KEY");
const IMAGEKIT_PUBLIC_KEY = getEnv("IMAGEKIT_PUBLIC_KEY");

let IMAGEKIT_URL_ENDPOINT = getEnv("IMAGEKIT_URL_ENDPOINT");
if (IMAGEKIT_URL_ENDPOINT && !IMAGEKIT_URL_ENDPOINT.endsWith("/")) {
    IMAGEKIT_URL_ENDPOINT += "/";
}

export const config = {
    MONGO_URI,
    JWT_SECRET,
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    NODE_ENV: process.env.NODE_ENV || "development",
    IMAGEKIT_PRIVATE_KEY,
    IMAGEKIT_PUBLIC_KEY,
    IMAGEKIT_URL_ENDPOINT
}