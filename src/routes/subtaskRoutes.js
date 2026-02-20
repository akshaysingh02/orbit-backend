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
















// GET    /api/tasks/:taskId/subtasks                 - Get all subtasks for a task
// POST   /api/tasks/:taskId/subtasks                 - Create new subtask
// GET    /api/subtasks/:id                           - Get specific subtask (not need as of now)
// PUT    /api/subtasks/:id                           - Update subtask
// DELETE /api/subtasks/:id                           - Delete subtask
// PATCH  /api/subtasks/:id/status                    - Toggle subtask done status