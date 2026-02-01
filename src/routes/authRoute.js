import express from "express"
import { validateLogin, validateRegister } from "../middlewares/validators/authValidator.js"
import { getProfile, login,logout,register, updateProfile } from "../controllers/auth/authController.js"
import { authMiddleware } from "../middlewares/authMiddleware.js"

const router = express.Router()



router.post("/register",validateRegister,register)
router.post("/login",validateLogin,login)
router.post("/logout", logout)
router.get("/profile",authMiddleware,getProfile)
router.put("/profile",updateProfile)

export default router