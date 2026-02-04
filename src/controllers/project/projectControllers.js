import { createProject, getProjectData, getProjectList, updateProjectData } from "../../services/projectServices.js"
import { errorResponse, successResponse } from "../../utils/response.js"

export const newProject = async(req,res)=>{
    try {
        const {title,description,startDate,endDate} = req.body // start date and end date format not decided
        const projectData = await createProject({title,description,startDate,endDate});
        return successResponse(res,projectData,"Project successfully created",200)
    } catch (error) {
        return errorResponse(res,error.message,500,error)
    }
}

export const getAllProjects = async(req,res)=>{
    try {
        const projectList = await getProjectList()
        return successResponse(res,projectList,"All project fetched",200)
    } catch (error) {
        return errorResponse(res,error.message,500,error)
    }
}

export const getProject = async(req,res)=>{
    try {
        const projectId = req.params?.id
        if(!projectId){
            return errorResponse(res,"Can't find the project without project id",400)
        }
        const projectData = await getProjectData(projectId);
        return successResponse(res,projectData,"Project data fetched",200)
    } catch (error) {
        return errorResponse(res,error.message,500,error)
    }
}

export const updateProject = async(req,res)=>{
    try {
        const {title,description,startDate,endDate,adminId} = req.body
        const projectId = req.params?.id
        const updatedData = await updateProjectData({projectId,title,description,startDate,endDate,adminId});
        return successResponse(res,updatedData,"Project Details updated successfully",200)
    } catch (error) {
        return errorResponse(res,error.message,500,error)
    }
}

export const deleteProject = async(req,res)=>{
    try {
        const projectId = req.params?.id
        const deletedData = await deleteProject(projectId)
        return successResponse(res,deletedData,"Project successfully deleted",200)
    } catch (error) {
        return errorResponse(res,error.message,500,error)
    }
}


// GET    /api/projects               - Get all projects for logged-in user
// POST   /api/projects               - Create new project
// GET    /api/projects/:id           - Get specific project with its tasks
// PUT    /api/projects/:id           - Update project
// DELETE /api/projects/:id           - Delete project