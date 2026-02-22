import express from "express"
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { validateUuidParam } from "../middlewares/validators/generalValidators.js";
import { validateCommentBody, validateCommentTaskId } from "../middlewares/validators/commentValidator.js";
import { createComment, deleteComment, getComments, updateComment } from "../controllers/comment/commentControllers.js";

const router = express.Router()
router.use(authMiddleware)

router.get("/tasks/:taskId",validateCommentTaskId,getComments)
router.post("/tasks/:taskId",validateCommentTaskId,validateCommentBody,createComment)
router.put("/:id",validateUuidParam,validateCommentBody,updateComment)
router.delete("/:id",validateUuidParam,deleteComment)

export default router;