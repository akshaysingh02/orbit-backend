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

    if( startDate && endDate && new Date(endDate) < new Date(startDate)){
        throw new Error("End date must be on or after start date of project")
    }

    const [project, memberInfo] = await prisma.$transaction( async(tx) => {
        const project = await tx.project.create({data: projectObject})

        const member = await tx.project_member.create({
            data: {projectId: project.id, userId: adminId, role: "ADMIN"}
        })

        return [project,member]
    })

    return {project,memberInfo}
}

export const getProjectList = async ({ userId }) => {
    if (!userId) {
        throw new Error("Can't find the user's id")
    }

    const memberShips = await prisma.project_member.findMany({
        where: {userId},
        include:{project: true}
    })

    if(memberShips.length === 0) {
        return {}
    }

    const projectList = memberShips.map((item)=>({
        ...item.project,
        role: item.role
    })).sort((a,b)=>(new Date(b.createdAt) - new Date(a.createdAt)))

    return projectList
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

    const currentProject = await prisma.project.findUnique({
        where: {id: projectId}
    })
    if(!currentProject){
        throw new Error("Project not found")
    }

    const newStart = startDate ? new Date(startDate) : currentProject.startDate
    const newEnd = endDate ? new Date(endDate) : currentProject.endDate
    if (newEnd < newStart) {
        throw new Error("End date must be on or after start date")
    }

    const updateObject = {
        ...(title && {title}),
        ...(description && {description}),
        ...(startDate && {startDate}),
        ...(endDate && {endDate})
    }

    //check if logged in user is admin of project
    const membership = await prisma.project_member.findUnique({
        where: {projectId_userId: {projectId,userId}},
        select: {role:true}
    })

    const canChangeAdmin = currentProject.adminId === userId && membership?.role === "ADMIN";

    //check if user is updating adminId he is admin or not
    let adminIdSkipped = false;
    if(adminId){
        if(!canChangeAdmin){
            adminIdSkipped = true
        } else {
            //check if new adminId is a valid user
            const validNewAdmin = await prisma.user.findUnique({
                where: {id: adminId}
            })
            if(validNewAdmin){
                // remove this user’s existing membership (if any) for this project and create as ADMIN
                await prisma.$transaction([
                    prisma.project_member.deleteMany({
                        where: {userId: adminId,projectId}
                    }),
                    prisma.project_member.create({
                        data: {userId: adminId, projectId,role: "ADMIN"}
                    })
                ])
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
    const membership = await prisma.project_member.findUnique({
        where: {projectId_userId:{projectId,userId}}
    })

    const canDeleteProject = membership?.role === "ADMIN" && project.adminId === userId

    if(!canDeleteProject){
        throw new Error("Not authorized to delete project")
    }

    const deletedProject = await prisma.project.delete({
        where:{id: projectId}
    })
    return deletedProject
}