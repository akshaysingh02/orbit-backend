import express from "express"
import { validateCreateTask, validateTaskStatus, validateUpdateTask } from "../middlewares/validators/taskValidators.js"
import { assignTask, createNewTask, deleteTask, getTasksForProject, getTaskWithSubTask, updateTask, updateTaskStatus } from "../controllers/task/taskControllers.js"
import { validateUuidParam } from "../middlewares/validators/generalValidators.js"
import { authMiddleware } from "../middlewares/authMiddleware.js"

const router = express.Router()

router.use(authMiddleware)

router.get("/projects/:id",validateUuidParam,getTasksForProject)
router.post("/projects/:id",validateUuidParam,validateCreateTask,createNewTask)
router.get("/:id",validateUuidParam,getTaskWithSubTask)
router.put("/:id",validateUuidParam,validateUpdateTask,updateTask)
router.delete("/:id",validateUuidParam,deleteTask)
router.patch("/:id/status",validateUuidParam,validateTaskStatus,updateTaskStatus)
router.patch("/:id/assign",validateUuidParam,assignTask)

export default router
// GET    /api/projects/:projectId/tasks              - Get all tasks in a project
// POST   /api/projects/:projectId/tasks              - Create new task
// GET    /api/tasks/:id                              - Get specific task with subtasks
// PUT    /api/tasks/:id                              - Update task
// DELETE /api/tasks/:id                              - Delete task
// PATCH  /api/tasks/:id/status                       - Update task status
// PATCH  /api/tasks/:id/assign                       - Assign task to user