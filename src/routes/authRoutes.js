import express from "express"
import { validateLogin, validateRegister, validateUpdateProfile } from "../middlewares/validators/authValidator.js"
import { getProfile, login,logout,register, updateProfile } from "../controllers/auth/authControllers.js"
import { authMiddleware } from "../middlewares/authMiddleware.js"

const router = express.Router()

router.post("/register",validateRegister,register)
router.post("/login",validateLogin,login)
router.post("/logout", logout)
router.get("/profile",authMiddleware,getProfile)
router.put("/profile",authMiddleware,validateUpdateProfile,updateProfile)

export default router