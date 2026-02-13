import { createTask } from "../../services/taskServices.js"
import { errorResponse, successResponse } from "../../utils/response.js"

export const createNewTask = async (req,res) => {
    try {
        const {title,description,projectId,dueDate,status,assignedToId} = req.body
        const taskData = await createTask({title,description,projectId,dueDate,status,assignedToId})
        return successResponse(res,taskData,"Task created",200)
    } catch (error) {
        errorResponse(res,error.message,500,error)
    }
}

export const getTasksForProject = async (req,res) => {
    try {
        
    } catch (error) {
        errorResponse(res,error.message,500,error)
    }
}

export const getTaskWithSubTask = async (req,res) => {
    try {
        
    } catch (error) {
        errorResponse(res,error.message,500,error)
    }
}

export const updateTask = async (req,res) => {
    try {
        
    } catch (error) {
        errorResponse(res,error.message,500,error)
    }
}

export const deleteTask = async (req,res) => {
    try {
        
    } catch (error) {
        errorResponse(res,error.message,500,error)
    }
}

export const updateTaskStatus = async (req,res) => {
    try {
        
    } catch (error) {
        errorResponse(res,error.message,500,error)
    }
}

export const assignTask = async (req,res) => {
    try {
        
    } catch (error) {
        errorResponse(res,error.message,500,error)
    }
}






// GET    /api/projects/:projectId/tasks              - Get all tasks in a project
// POST   /api/projects/:projectId/tasks              - Create new task
// GET    /api/tasks/:id                              - Get specific task with subtasks
// PUT    /api/tasks/:id                              - Update task
// DELETE /api/tasks/:id                              - Delete task
// PATCH  /api/tasks/:id/status                       - Update task status
// PATCH  /api/tasks/:id/assign                       - Assign task to user