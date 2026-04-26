import express from "express"
import cookieParser from "cookie-parser"
import morgan from "morgan"
import cors from "cors"
import authRoutes from "./routes/authRoutes.js"
import productRoute from "./routes/productRoute.js"
import cartRoute from "./routes/cartRoute.js"
import {Strategy as GoogleStrategy} from "passport-google-oauth20"
import passport from "passport"
import { config } from "../src/config/config.js"

const app = express()

app.use(morgan("dev"))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true
}))

app.use(passport.initialize());
passport.use(new GoogleStrategy ({
    clientID: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/api/auth/google/callback"
}, (accessToken, refreshToken, profile, done) =>{
    return done(null, profile)
}))

app.get("/", (req, res) => {
    res.status(200).json({
        message: "server is running"
    })
})

// Auth routes
app.use("/api/auth", authRoutes)
app.use("/api/products", productRoute)
app.use("/api/cart", cartRoute)


export default app



