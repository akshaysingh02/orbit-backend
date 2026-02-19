import { prisma } from "../config/db.js"
import { getMembership } from "../utils/membership.js"

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

export const getProjectData = async({projectId,userId}) => {
    //check if user is project member or not
    const membership = await getMembership(projectId,userId)
    if(!membership){
        throw new Error("not allowed to view project details")
    }

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

    const memberShipCheck = await getMembership(projectId,userId)
    if(!memberShipCheck || !["ADMIN","MEMBER"].includes(memberShipCheck.role)){
        throw new Error("Not authorized to change project data")
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


export const getMembersService = async({projectId,userId}) => {
    //validate if project is valid
    const project = await prisma.project.findUnique({where: {id: projectId}})
    if(!project) throw new Error("Project not found")

    //validate if user allowed to get member list
    const membership = await getMembership(projectId,userId)
    if(!membership || !["ADMIN","MEMBER","VIEWER"].includes(membership.role)){
        throw new Error("Not authorized to view members")
    }

    const members = await prisma.project_member.findMany({
        where: {projectId},
        include:{user:{select:{id: true, username: true, name: true, email: true}}},
        orderBy: {joinedAt: "asc"}
    })

    return members
}

export const addMemberService = async({projectId,callerUserId,targetUserId,role}) => {
    //check is projectId is of valid project
    const project = await prisma.project.findUnique({where: {id: projectId}})
    if(!project) throw new Error("Project not valid")

    //check if callerUserId is member or admin of project
    const membership = await getMembership(projectId,callerUserId);
    if(!membership || !["ADMIN","MEMBER"].includes(membership.role)){
        throw new Error("Not authorized to add member")
    }

    //check for a valid target user
    const validTargetUser = await prisma.user.findUnique({where: {id: targetUserId}})
    if(!validTargetUser) throw new Error("User not found")

    //check if user is already a member of project
    const existingMember = await prisma.project_member.findUnique({where: {projectId_userId: {projectId,userId:targetUserId}}})
    if(existingMember) throw new Error("User is already a member of this project")

    //check if to be assigned role is ADMIN then user must also be an admin
    if(role === "ADMIN" && membership.role !== "ADMIN"){
        throw new Error("Not authorized to add new Admin")
    }

    const member = await prisma.project_member.create({
        data: {projectId, userId: targetUserId, role}
    })
    return member
}

export const updateMemberService = async({projectId, callerUserId, targetUserId, role}) => {
    //check is projectId is of valid project
    const project = await prisma.project.findUnique({where: {id: projectId}})
    if(!project) throw new Error("Project not valid")

    //check if callerUserId is admin
    const membership = await getMembership(projectId,callerUserId);
    if(!membership || membership.role !== "ADMIN"){
        throw new Error("Not authorized to update member")
    }

    //check if to be updated user is member of project
    const targetMembership = await getMembership(projectId,targetUserId)
    if(!targetMembership) throw new Error("Member not found in this project")

    if(project.adminId === targetUserId){
        throw new Error("Cannot change project owner's role")
    }

    const updatedRole = await prisma.project_member.update({
        where: {projectId_userId:{projectId, userId: targetUserId}},
        data: {role}
    })
    
    return updatedRole
}

export const removeMemberService = async({projectId,targetUserId,callerUserId})=>{
    //check if project is valid
    const project = await prisma.project.findUnique({where: {id: projectId} })
    if(!project){ throw new Error("Project not found")}

    //make sure only admin can remove member
    const isAdmin = await getMembership(projectId,callerUserId)
    if(!isAdmin || isAdmin.role !== "ADMIN"){
        throw new Error("Not authorized to remove member")
    }

    //can't remove project owner with owner ship transfer
    if(project.adminId === targetUserId){
        throw new Error("Cannot remove the project owner, Transfer ownership first")
    }

    //check if targeted user is member of project
    const isMember = await prisma.project_member.findUnique({
        where: {projectId_userId: {projectId,userId:targetUserId}}
    })
    if(!isMember) throw new Error("User is not member of project")


    const removedMember = await prisma.project_member.delete({
        where:{projectId_userId: {projectId, userId: targetUserId}}
    })

    return removedMember
}