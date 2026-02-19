import express from "express"
import { addMember, deleteMember, deleteProject, getAllProjects, getMembers, getProject, newProject, updateMemberRole, updateProject } from "../controllers/project/projectControllers.js"
import { authMiddleware } from "../middlewares/authMiddleware.js"
import { validateCreateProject, validateUpdateProject } from "../middlewares/validators/projectValidator.js"
import { validateUuidParam } from "../middlewares/validators/generalValidators.js"
import { validateAddMember, validateMemberUserId, validateUpdateMemberRole } from "../middlewares/validators/memberValidator.js"

const router = express.Router()
router.use(authMiddleware)

//project routes
router.post("/",validateCreateProject,newProject)
router.get("/",getAllProjects)
router.get("/:id",validateUuidParam,getProject)
router.put("/:id",validateUuidParam,validateUpdateProject,updateProject)
router.delete("/:id",validateUuidParam,deleteProject)

//member management routes
router.get("/:id/members", validateUuidParam,getMembers)
router.post("/:id/members",validateUuidParam,validateAddMember,addMember)
router.put("/:id/members/:userId",validateUuidParam,validateMemberUserId,validateUpdateMemberRole,updateMemberRole)
router.delete("/:id/members/:userId",validateUuidParam,validateMemberUserId,deleteMember)

export default router

// GET    /api/projects               - Get all projects for logged-in user
// POST   /api/projects               - Create new project
// GET    /api/projects/:id           - Get specific project with its tasks
// PUT    /api/projects/:id           - Update project
// DELETE /api/projects/:id           - Delete project