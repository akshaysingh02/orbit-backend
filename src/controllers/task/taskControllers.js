import { assignTaskService, createTask, deleteTaskService, getTasksForProjectService, getTaskWithSubTaskService, updateTaskService, updateTaskStatusService } from "../../services/taskServices.js"
import { errorResponse, successResponse } from "../../utils/response.js"

export const createNewTask = async (req,res) => {
    try {
        const {title,description,projectId,dueDate,status,assignedToId} = req.body
        const userId = req.user?.id
        const taskData = await createTask({title,description,projectId,dueDate,status,assignedToId,userId})
        return successResponse(res,taskData,"Task created",200)
    } catch (error) {
        return errorResponse(res,error.message,500,error)
    }
}

export const getTasksForProject = async (req,res) => {
    try {
        const projectId = req.params?.id;
        const userId = req.user.id;
        const taskList = await getTasksForProjectService({projectId,userId});
        return successResponse(res,taskList,"List of Tasks fetched",200)
    } catch (error) {
        return errorResponse(res,error.message,500,error)
    }
}

export const getTaskWithSubTask = async (req,res) => {
    try {
        const taskId = req.params?.id;
        const userId = req.user?.id;
        const projectId = req.body?.projectId;
        const taskData = await getTaskWithSubTaskService({taskId,userId,projectId});
        return successResponse(res,taskData,"Task successfully fetched",200)
    } catch (error) {
        return errorResponse(res,error.message,500,error)
    }
}

export const updateTask = async (req,res) => {
    try {
        const {title,description,projectId,dueDate,status,assignedToId} = req.body
        const userId = req.user?.id;
        const taskId = req.params?.id
        const updatedTask = await updateTaskService({userId,title,description,projectId,dueDate,status,assignedToId,taskId})
        return successResponse(res,updatedTask,"Task successfully updated",200)
    } catch (error) {
        return errorResponse(res,error.message,500,error)
    }
}

export const deleteTask = async (req,res) => {
    try {
        const taskId = req.params?.id;
        const userId = req.user?.id;
        const projectId = req.body?.projectId
        const deletedTask = await deleteTaskService({taskId,userId,projectId})
        return successResponse(res,deletedTask,"Task successfully deleted",200)
    } catch (error) {
        return errorResponse(res,error.message,500,error)
    }
}

export const updateTaskStatus = async (req,res) => {
    try {
        const taskId = req.params?.id
        const userId = req.user?.id
        const {status,projectId} = req.body
        const updatedTaskStatus = await updateTaskStatusService({taskId,userId,status,projectId})
        return successResponse(res,updatedTaskStatus,"Status successfully updated",200)
    } catch (error) {
        return errorResponse(res,error.message,500,error)
    }
}

export const assignTask = async (req,res) => {
    try {
        const taskId = req.params?.id
        const userId = req.user?.id
        const {projectId, assignedToId} = req.body
        const newAssigneeData = await assignTaskService({taskId,projectId,userId,assignedToId})
        return successResponse(res,newAssigneeData,"Task successfully re-assigned",200)
    } catch (error) {
        return errorResponse(res,error.message,500,error)
    }
}






// GET    /api/projects/:projectId/tasks              - Get all tasks in a project
// POST   /api/projects/:projectId/tasks              - Create new task
// GET    /api/tasks/:id                              - Get specific task with subtasks
// PUT    /api/tasks/:id                              - Update task
// DELETE /api/tasks/:id                              - Delete task
// PATCH  /api/tasks/:id/status                       - Update task status
// PATCH  /api/tasks/:id/assign                       - Assign task to user