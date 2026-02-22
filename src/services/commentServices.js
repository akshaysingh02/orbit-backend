import { prisma } from "../config/db.js"
import { getMembership } from "../utils/membership.js"


export const createCommentService = async({taskId,body,userId}) => {
    //check if task exists
    const task = await prisma.task.findUnique({
        where: {id: taskId},
        include: {parentProject:{select:{id: true}}}
    })
    if(!task){
        throw new Error("Invalid task to comment")
    }

    //check if user is allowed to comment
    const membership = await getMembership(task.parentProject?.id,userId)
    if(!membership || !["ADMIN","MEMBER","VIEWER"].includes(membership.role)){
        throw new Error("Not authorized to comment on this task")
    }

    const comment = await prisma.comment.create({
        data: {body, taskId, userId}
    })
    return comment;
}

export const getCommentsService = async({taskId, userId}) => {
    //check if task is valid
    const task = await prisma.task.findUnique({
        where: {id: taskId},
        include: {parentProject:{select:{id: true}}}
    })
    if(!task){
        throw new Error("Invalid task")
    }

    //check if user is allowed to view all comments of task
    const membership = await getMembership(task.parentProject?.id,userId)
    if(!membership || !["ADMIN","MEMBER","VIEWER"].includes(membership.role)){
        throw new Error("Not authorized to view comment on this task")
    }

    const comments = await prisma.comment.findMany({
        where: {taskId}
    })

    return comments
}

export const updateCommentService = async({commentId,body,userId}) => {
    //check if comment exists and userId is of comment publisher
    const comment = await prisma.comment.findUnique({
        where: {id: commentId},
        include: {parentTask: {select: {projectId: true}}}
    })
    if(!comment || comment.userId !== userId){
        throw new Error("Can't update comment, check if comment exists and you're the publisher")
    }

    //check if user still has access to parent project
    const hasAccess = await getMembership(comment.parentTask.projectId, userId)
    if(!hasAccess){
        throw new Error("Not authorized to update this comment")
    }
    const updatedComment = await prisma.comment.update({
        where: {id: commentId},
        data: {body}
    })
    return updatedComment
}

export const deleteCommentService = async({commentId,userId}) => {
    //check if comment exists and userId is of comment publisher
    const comment = await prisma.comment.findUnique({
        where: {id: commentId},
        include: {parentTask: {select: {projectId: true}}}
    })
    if(!comment || comment.userId !== userId){
        throw new Error("Can't delete comment, check if comment exists and you're the publisher")
    }

    //check if user still has access to parent project
    const hasAccess = await getMembership(comment.parentTask.projectId, userId)
    if(!hasAccess){
        throw new Error("Not authorized to delete this comment")
    }

    const deletedComment = await prisma.comment.delete({
        where: {id: commentId}
    })

    return deletedComment
}
