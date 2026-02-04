import { prisma } from "../config/db.js"

export const getUserList = async() => {
    const userList = await prisma.user.findMany({
        omit: {password: true}
    })
    return userList
}

export const getUser = async(userId) => {
    const userData = await prisma.user.findUnique({
        where: {id: userId},
        omit: {password: true}
    })
    if(!userData){
        throw new Error(`Can not find user with given Id`)
    }
    return userData
}

// export const updateUser = async() => {

// }

// export const deleteUser = async() => {

// }