import { prisma } from "../config/db.js"

export const createProject = async({title,description,startDate,endDate,adminId}) =>{
    if(!adminId){
        throw new Error("Can't find the user's id")
    }
    const projectObject = {
        title,
        description,
        adminId,
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
    }

    const project = await prisma.project.create({
        data: projectObject,
    })

    return project
    //had to dos
    //make sure if endate < startend throw error
}

export const getProjectList = async ({ adminId }) => {
    if (!adminId) {
        throw new Error("Can't find the user's id")
    }
    const projects = await prisma.project.findMany({
        where: { adminId },
        orderBy: { createdAt: "desc" },
    })
    return projects
    //had to dos
    //add pagination and cursor, or add select if limited data is needed
}

export const getProjectData = async(projectId) => {
    const projectData = await prisma.project.findUnique({
        where:{id: projectId}
    })
    if(!projectData){
        throw new Error("Can't find the project with the given Id")
    }
    return projectData;
}

export const updateProjectData = async({title,description,startDate,endDate,adminId,userId,projectId}) => {

    const existingProject = await prisma.project.findUnique({
        where: {id: projectId}
    })
    if(!existingProject){
        throw new Error("Project not found")
    }
    const currentProjectAdminId = existingProject.adminId;

    const updateObject = {
        ...(title && {title}),
        ...(description && {description}),
        ...(startDate && {startDate}),
        ...(endDate && {endDate})
    }

    //check if user is updating adminId he is admin or not
    let adminIdSkipped = false;
    if(adminId){
        if(currentProjectAdminId !== userId){
            adminIdSkipped = true
        } else {
            //check if new adminId is of a valid user
            const validNewAdmin = await prisma.user.findUnique({
                where: {id: adminId}
            })
            if(validNewAdmin){
                updateObject.adminId = adminId
            } else {
                throw new Error("Invalid admin Id")
            }
        }
    }

    const updatedProject = await prisma.project.update({
        where: {id: projectId},
        data: updateObject
    })
    return {updatedProject,adminIdSkipped}
    // validate endDate >= startDate.
}

export const deleteProjectData = async(projectId,userId) => {
    //check if project exists
    const project = await prisma.project.findUnique({
        where: {id: projectId}
    })
    if(!project){
        throw new Error("Project not found")
    }

    //only admin can delete the project, so check if user is project admin
    if(project.adminId !== userId){
        throw new Error("Not authorized to delete project")
    }

    const deletedProject = await prisma.project.delete({
        where:{id: projectId}
    })
    return deletedProject
}