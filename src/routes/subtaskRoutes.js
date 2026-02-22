import express from "express"
import { authMiddleware } from "../middlewares/authMiddleware.js"
import { createSubtask, deleteSubtask, getSubtasks, subtaskStatus, updateSubtask } from "../controllers/subtask/subtaskController.js"
import { validateCreateSubtask, validateGetSubtask, validateSubtaskStatus, validateUpdateSubtask } from "../middlewares/validators/subtaskValidator.js"
import { validateUuidParam } from "../middlewares/validators/generalValidators.js"

const router = express.Router()
router.use(authMiddleware)

router.get("/:taskId/subtasks",validateGetSubtask,getSubtasks)
router.post("/:taskId/subtasks",validateCreateSubtask,createSubtask)
router.put("/:id",validateUuidParam,validateUpdateSubtask,updateSubtask)
router.delete("/:id",validateUuidParam,deleteSubtask)
router.patch("/:id/status",validateUuidParam,validateSubtaskStatus,subtaskStatus)


export default router