import { createSubtaskService, deleteSubtaskService, getSubtasksService, subtaskToggleService, updateSubtaskService } from "../../services/subtaskServices.js"
import { errorResponse, successResponse } from "../../utils/response.js"


export const createSubtask = async(req,res) => {
    try {
        const taskId = req.params?.taskId
        const userId = req.user?.id
        const {title, description, isCompleted} = req.body
        const subtask = await createSubtaskService({title, description, isCompleted,taskId, userId})
        return successResponse(res,subtask,"Subtask Created",201)
    } catch (error) {
        return errorResponse(res,error.message,500,error)
    }
}

export const getSubtasks = async(req,res) => {
    try {
        const taskId = req.params?.taskId
        const userId = req.user?.id
        const subtasksList = await getSubtasksService({taskId,userId})
        return successResponse(res,subtasksList,"All subtasks fetched",200)
    } catch (error) {
        return errorResponse(res,error.message,500,error)
    }
}

export const updateSubtask = async(req,res) => {
    try {
        const subtaskId = req.params?.id
        const userId = req.user?.id
        const {title,description} = req.body
        const updatedSubtask = await updateSubtaskService({subtaskId,userId,title,description})
        return successResponse(res,updatedSubtask,"Subtask updated",200)
    } catch (error) {
        return errorResponse(res,error.message,500,error)
    }
}

export const deleteSubtask = async(req,res) => {
    try {
        const subtaskId = req.params?.id
        const userId = req.user?.id
        const deletedsubtask = await deleteSubtaskService({subtaskId,userId})
        return successResponse(res,deletedsubtask,"Subtask deleted",200)
    } catch (error) {
        return errorResponse(res,error.message,500,error)
    }
}

export const subtaskStatus = async(req,res) => {
    try {
        const subtaskId = req.params?.id
        const userId = req.user?.id
        const isCompleted = req.body?.isCompleted
        const toggeledSubtask = await subtaskToggleService({subtaskId,userId,isCompleted})
        return successResponse(res,toggeledSubtask,"Subtask status changed",200)
    } catch (error) {
        return errorResponse(res,error.message,500,error)
    }
}

// router.get("/:taskId/subtasks")
// router.post("/:taskId/subtasks")
// router.put("/:id")
// router.delete("/:id")
// router.patch("/:id/status")