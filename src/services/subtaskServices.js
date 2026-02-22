import {prisma} from "../config/db.js"
import { getMembership } from "../utils/membership.js"

export const createSubtaskService = async({title, description, isCompleted, taskId, userId})=>{
    //check if task exists
    const task = await prisma.task.findUnique({
        where: {id: taskId}
    })
    if(!task){
        throw new Error("Invalid task")
    }

    //check if user has authority to create subtask(any member or admin of project can create subtask)
    const membership = await getMembership(task?.projectId, userId)
    if(!membership || !["ADMIN","MEMBER"].includes(membership.role)){
        throw new Error("Not authorized to create subtask")
    }

    //create subtask object
    const subtaskObj = {
        ...(title && {title}),
        description,
        isCompleted,
        taskId
    }

    const subTask = await prisma.subTask.create({
        data: subtaskObj
    })

    return subTask
}

export const getSubtasksService = async({taskId,userId}) =>{
    //check if task exists
    const task = await prisma.task.findUnique({
        where: {id: taskId}
    })
    if(!task){
        throw new Error("Task not found")
    }
    
    //check if user has authority to view all subtasks
    const membership = await getMembership(task?.projectId, userId)
    if(!membership){
        throw new Error("Not authorized to view task and subtask data")
    }

    const subtasks = await prisma.subTask.findMany({
        where: {taskId}
    })

    return subtasks
}

export const updateSubtaskService = async({subtaskId,userId,title,description}) => {
    //check if subtask exists
    const validSubtask = await prisma.subTask.findUnique({
        where: {id: subtaskId},
        include:{parentTask: {select: {projectId: true}}}
    })
    if(!validSubtask){
        throw new Error("Subtask not valid")
    }

    //check if user is allowed to update the subtask
    const membership = await getMembership(validSubtask.parentTask.projectId,userId)
    if(!membership || !["ADMIN","MEMBER"].includes(membership.role)){
        throw new Error("Not authorized to update subtask")
    }

    const subtaskObj = {
        ...(title && {title}),
        ...(description && {description})
    }

    const updatedSubtask = await prisma.subTask.update({
        where: {id: subtaskId},
        data: subtaskObj
    })

    return updatedSubtask
}

export const deleteSubtaskService = async({subtaskId,userId}) => {
    //check if subtask is valid 
    const validSubtask = await prisma.subTask.findUnique({
        where: {id: subtaskId},
        include:{parentTask:{select:{projectId: true}}}
    })
    if(!validSubtask){
        throw new Error("Subtask not valid")
    }

    //check if user is authorized to delete subtask
    const membership = await getMembership(validSubtask?.parentTask?.projectId,userId)
    if(!membership || !["ADMIN","MEMBER"].includes(membership.role)){
        throw new Error("Not authorized to delete subtask")
    }

    const deletedSubtask = await prisma.subTask.delete({
        where: {id: subtaskId}
    })
    return deletedSubtask
}

export const subtaskToggleService = async({subtaskId,userId,isCompleted}) => {
    const validSubtask = await prisma.subTask.findUnique({
        where: {id: subtaskId},
        include: {parentTask: {select: {projectId: true}}}
    })
    if(!validSubtask){
        throw new Error("Subtask not valid")
    }

    //check if user is authorized to change subtask isCompleted status
    const membership = await getMembership(validSubtask?.parentTask?.projectId,userId)
    if(!membership || !["ADMIN","MEMBER"].includes(membership.role)){
        throw new Error("Not authorized to toggle subtask status")
    }

    const updatedSubtask = await prisma.subTask.update({
        where: {id: subtaskId},
        data:{isCompleted}
    })

    return updatedSubtask
}