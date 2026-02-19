import { prisma } from "../config/db.js"

export const getMembership = async (projectId, userId) => {
    try {
        if(!projectId || !userId){
            throw new Error("Project id or user id is missing")
        }
        const membership = await prisma.project_member.findUnique({
            where: {projectId_userId:{projectId,userId}}
        })
        if(!membership){
            return null;
        }
        return membership
    } catch (error) {
        throw new Error("Failed to fetch membership",{cause: error})
    }
}