import express from "express"
import { singupController } from "../controllers/auth/signup.js"
const router = express.Router()

router.get("/signup",singupController)

export default router