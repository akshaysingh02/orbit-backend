import express from "express"
import { deleteProject, getAllProjects, getProject, newProject, updateProject } from "../controllers/project/projectControllers.js"
import { authMiddleware } from "../middlewares/authMiddleware.js"
import { validateCreateProject, validateUpdateProject } from "../middlewares/validators/projectValidator.js"
import { validateUuidParam } from "../middlewares/validators/generalValidators.js"

const router = express.Router()
router.use(authMiddleware)

router.post("/",validateCreateProject,newProject)
router.get("/",getAllProjects)
router.get("/:id",validateUuidParam,getProject)
router.put("/:id",validateUuidParam,validateUpdateProject,updateProject)
router.delete("/:id",validateUuidParam,deleteProject)

export default router

// GET    /api/projects               - Get all projects for logged-in user
// POST   /api/projects               - Create new project
// GET    /api/projects/:id           - Get specific project with its tasks
// PUT    /api/projects/:id           - Update project
// DELETE /api/projects/:id           - Delete project