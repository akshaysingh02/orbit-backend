import {prisma} from "../config/db.js"
import { getMembership } from "../utils/membership.js"

export const createTask = async ({title,description,projectId,dueDate,status,assignedToId,userId})=>{
    //check for valid project id 
    const validProject = await prisma.project.findUnique({
        where: {id: projectId}
    })
    if(!validProject){
        throw new Error("Not a Valid project to create a task")
    }

    //check if user is allowed to create Task
    const membership = await getMembership(projectId,userId);
    if(!membership || !["ADMIN","MEMBER"].includes(membership?.role)){
        throw new Error("User not allowed to create task in this project")
    }

    //check if assignedToId is a id of valid user
    if(assignedToId){
        const validUser = await prisma.user.findUnique({
            where: {id:assignedToId}
        })
        if(!validUser){
            throw new Error("Invalid User to assign to")
        }

        //then check if user is a member of project or not
        const membership = await getMembership(projectId,assignedToId)
        if(!membership || membership?.role === "VIEWER"){
            throw new Error("Can't assign task to user, User doesn't have access")
        }
    }


    const newTaskObject = {
        title,
        description,
        projectId,
        ...(dueDate && {dueDate}),
        ...(status && {status}),
        ...(assignedToId && {assignedToId})
    }

   

    //create new task
    const newTask = await prisma.task.create({
        data: newTaskObject
    })
    return newTask;
}

//give all tasks for a particular project
export const getTasksForProjectService = async ({projectId,userId}) => {
    //check if user is member, admin or viewer of project
    const membership = await getMembership(projectId,userId)
    if(!membership || !["ADMIN","MEMBER","VIEWER"].includes(membership.role)){
        throw new Error("Can't get member ship info")
    }

    const taskList = await prisma.project.findUnique({
        where: {id: projectId},
        include: {tasks: true}
    })
    return taskList
}

//get specific task with all subtasks
export const getTaskWithSubTaskService = async({taskId,userId,projectId}) => {
    //check if user is member, admin or viewer of project
    const membership = await getMembership(projectId,userId)
    if(!membership || !["ADMIN","MEMBER","VIEWER"].includes(membership.role)){
        throw new Error("Can't get member ship info")
    }

    //get task data with subtasks
    const taskData = await prisma.task.findUnique({
        where:{id: taskId},
        include: {subTasks: true}
    })
    if(!taskData){
        throw new Error("Can't find the valid task")
    }
    return taskData
}

export const updateTaskService = async({userId,title,description,projectId,dueDate,status,assignedToId,taskId}) => {
    //check if user is allowed to update the task or not
    const membership = await getMembership(projectId,userId);
    if(!membership || !["ADMIN","MEMBER"].includes(membership?.role)){
        throw new Error("User not allowed to update task")
    }

    //check if assignedTo is provided then its a valid userId
    if(assignedToId){
        const isValidAssigni = await prisma.user.findUnique({where:{id: assignedToId}})
        if(!isValidAssigni) throw new Error("not a valid assignedToId")
    }

    //check if taskId belongs to Project that is coming
    const task = await prisma.task.findUnique({
        where: {id: taskId}
    })
    if(!task || task.projectId !== projectId){
        throw new Error("Invalid task, not authroized to delete")
    }

    //create update object
    const updatedTaskObject = {
        ...(title && {title}),
        ...(description && {description}),
        ...(dueDate && {dueDate}),
        ...(status && {status}),
        ...(assignedToId && {assignedToId})
    }

    //update the task
    const updatedTask = await prisma.task.update({
        where:{id: taskId},
        data: updatedTaskObject
    })
    if(!updatedTask){
        throw new Error("server error while updating the DB")
    }
    return updatedTask
}

export const deleteTaskService = async ({taskId,userId,projectId}) => {
    //check if user is admin or member 
    const membership = await getMembership(projectId,userId)
    if(!membership || !["ADMIN","MEMBER"].includes(membership?.role)){
        throw new Error("Not allowed to delete Task")
    }

    //check if taskId belongs to Project that is coming
    const task = await prisma.task.findUnique({
        where: {id: taskId}
    })
    if(!task || task.projectId !== projectId){
        throw new Error("Invalid task, not authroized to delete")
    }

    const deletedTask = await prisma.task.delete({
        where: {id: taskId}
    })
    return deletedTask
}

export const updateTaskStatusService = async({taskId,userId,status,projectId}) => {
    //check if user is admin or member 
    const membership = await getMembership(projectId,userId)
    if(!membership || !["ADMIN","MEMBER"].includes(membership?.role)){
        throw new Error("Not allowed to update Task status")
    }

    //check if taskId belongs to Project that is coming
    const task = await prisma.task.findUnique({
        where: {id: taskId}
    })
    if(!task || task.projectId !== projectId){
        throw new Error("Invalid task, not authroized to delete")
    }

    const updatedData = await prisma.task.update({
        where: {id: taskId},
        data: {status}
    })

    return updatedData
}

export const assignTaskService = async({taskId,projectId,userId,assignedToId}) => {
    //check if user is admin or member 
    const membership = await getMembership(projectId,userId)
    if(!membership || !["ADMIN","MEMBER"].includes(membership?.role)){
        throw new Error("Not allowed to assign task")
    }
    
    //check if assignedToId is not already a member of project
    const alreadyAssigned = await getMembership(projectId,assignedToId)
    if(!alreadyAssigned || !["ADMIN","MEMBER"].includes(alreadyAssigned.role)){
        throw new Error("Can't assign task")
    }
    
    //check is assignedToId is of a valid user
    const isValidUser = await prisma.user.findUnique({
        where: {id: assignedToId}
    })
    if(!isValidUser){
        throw new Error("Not a valid user to assign to")
    }

    //check if taskId belongs to Project that is coming
    const task = await prisma.task.findUnique({
        where: {id: taskId}
    })
    if(!task || task.projectId !== projectId){
        throw new Error("Invalid task, not authroized to delete")
    }

    const updatedAssignment = await prisma.task.update({
        where: {id: taskId},
        data: {assignedToId}
    })

    return updatedAssignment
}