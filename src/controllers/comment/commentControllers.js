import { createCommentService, deleteCommentService, getCommentsService, updateCommentService } from "../../services/commentServices.js";
import { errorResponse, successResponse } from "../../utils/response.js"


export const createComment = async(req,res) => {
    try {
        const taskId = req.params?.taskId;
        const body = req.body?.body;
        const userId = req.user?.id;
        const comment = await createCommentService({taskId,body,userId})
        return successResponse(res,comment,"Comment successfully created",201)
    } catch (error) {
        return errorResponse(res,error.message,500,error)
    }
}

export const getComments = async(req,res) => {
    try {
        const taskId = req.params?.taskId;
        const userId = req.user?.id;
        const comments = await getCommentsService({taskId, userId})
        return successResponse(res,comments,"Comments successfully fetched",200)
    } catch (error) {
        return errorResponse(res,error.message,500,error)
    }
}

export const updateComment = async(req,res) => {
    try {
        const commentId = req.params?.id;
        const body = req.body?.body;
        const userId = req.user?.id;
        const updatedComment = await updateCommentService({commentId,body,userId})
        return successResponse(res,updatedComment,"Comment successfully updated",200)
    } catch (error) {
        return errorResponse(res,error.message,500,error)
    }
}

export const deleteComment = async(req,res) => {
    try {
        const commentId = req.params?.id;
        const userId = req.user?.id;
        const deletedComment = await deleteCommentService({commentId,userId})
        return successResponse(res,deletedComment,"Comment Successfully deleted",200)
    } catch (error) {
        return errorResponse(res,error.message,500,error)
    }
}