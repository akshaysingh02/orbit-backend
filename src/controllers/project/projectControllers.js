import { addMemberService, createProject, deleteProjectData, getMembersService, getProjectData, getProjectList, removeMemberService, updateMemberService, updateProjectData } from "../../services/projectServices.js"
import { errorResponse, successResponse } from "../../utils/response.js"

export const newProject = async (req, res) => {
    try {
        const { title, description, startDate, endDate } = req.body // start date and end date format not decided
        const adminId = req.user?.id
        const projectData = await createProject({ title, description, startDate, endDate, adminId });
        return successResponse(res, projectData, "Project successfully created", 200)
    } catch (error) {
        return errorResponse(res, error.message, 500, error)
    }
}

export const getAllProjects = async (req, res) => {
    try {
        const userId = req.user?.id
        const projectList = await getProjectList({ userId })
        return successResponse(res, projectList, "Projects fetched successfully", 200)
    } catch (error) {
        const status = error.message?.includes("user's id") ? 401 : 500
        return errorResponse(res, error.message, status, error)
    }
}

export const getProject = async (req, res) => {
    try {
        const projectId = req.params?.id
        const userId = req.user?.id
        const projectData = await getProjectData({projectId,userId});
        return successResponse(res, projectData, "Project data fetched", 200)
    } catch (error) {
        return errorResponse(res, error.message, 500, error)
    }
}

export const updateProject = async (req, res) => {
    try {
        const { title, description, startDate, endDate, adminId } = req.body
        const projectId = req.params?.id
        const userId = req.user?.id
        const { updatedProject, adminIdSkipped } = await updateProjectData({ projectId, title, description, startDate, endDate, adminId, userId });
        return successResponse(res, updatedProject, (adminIdSkipped ? "Project updated, Only the project admin can change its admin" : "Project Details updated successfully"), 200)
    } catch (error) {
        if(error.message === "Project not found"){
            return errorResponse(res,error.message,404,error)
        }
        return errorResponse(res, error.message, 500, error)
    }
}

export const deleteProject = async (req, res) => {
    try {
        const projectId = req.params?.id
        const userId = req.user?.id
        const deletedData = await deleteProjectData(projectId,userId)
        return successResponse(res, deletedData, "Project successfully deleted", 200)
    } catch (error) {
        return errorResponse(res, error.message, 500, error)
    }
}


//Member management controllers

export const addMember = async(req,res) => {
    try {
        const projectId = req.params?.id
        const callerUserId = req.user?.id
        const {userId: targetUserId,role} = req.body
        const member = await addMemberService({projectId,callerUserId,targetUserId,role})
        return successResponse(res,member,"User successfully added to project",200)
    } catch (error) {
        return errorResponse(res,error.message,500,error)
    }
}

export const getMembers = async(req,res)=>{
    try {
        const projectId = req.params?.id;
        const userId = req.user?.id
        const memberList = await getMembersService({projectId,userId})
        return successResponse(res,memberList,"Members Fetched for the project")
    } catch (error) {
        return errorResponse(res,error.message,500,error)
    }
}

export const updateMemberRole = async(req,res)=>{
    try {
        const projectId = req.params?.id
        const targetUserId = req.params?.userId
        const callerUserId = req.user?.id
        const role = req.body?.role
        const updatedMember = await updateMemberService({projectId,targetUserId,callerUserId,role})
        return successResponse(res,updatedMember,"Member Role successfully updated",200)
    } catch (error) {
        return errorResponse(res,error.message,500,error)
    }
}

export const deleteMember = async(req,res) => {
    try {
        const projectId = req.params?.id
        const targetUserId = req.params?.userId;
        const callerUserId = req.user?.id
        const deletedMember = await removeMemberService({projectId,targetUserId,callerUserId})
        return successResponse(res,deletedMember,"User successfully removed from the project",200)
    } catch (error) {
        return errorResponse(res,error.message,500,error)
    }
}
// GET    /api/projects               - Get all projects for logged-in user
// POST   /api/projects               - Create new project
// GET    /api/projects/:id           - Get specific project with its tasks
// PUT    /api/projects/:id           - Update project
// DELETE /api/projects/:id           - Delete project