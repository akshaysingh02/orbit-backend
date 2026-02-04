import express from "express"
import { userInfo, userList } from "../controllers/user/userControllers.js"
import { authMiddleware } from "../middlewares/authMiddleware.js"

const router = express.Router()

router.get("/",authMiddleware,userList)
router.get('/:id',authMiddleware,userInfo)

export default router