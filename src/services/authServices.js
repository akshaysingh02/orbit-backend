import { prisma } from "../config/db.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";
import { successResponse } from "../utils/response.js";


export const createUser = async ({ username, name, email, password,bio }) => {

    //check if user already exists
    const existingUser = await prisma.user.findFirst({
        where: { OR: [{ email }, { username }] },
    })
    if (existingUser) {
        throw new Error("user already exists, change email or username")
    }

    //Hashing the password
    const hashedPassword = await bcrypt.hash(password, 10);


    // Create user
    const user = await prisma.user.create({
        data: {
            username,
            name,
            email,
            password: hashedPassword,
            bio
        }
    })

    //Generate jwt token after successfull signup
    const token = generateToken(user.id);

    return { id: user.id, username: user.username, email: user.email, token }
}

export const loginUser = async ({ email, password }) => {

    //check if user exists
    const user = await prisma.user.findUnique({
        where: { email: email }
    })
    if (!user) {
        throw new Error("User not found, Invalid email")
    }

    //match the password
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
        throw new Error("Password is incorrect")
    }

    //Generate jwt token
    const token = generateToken(user.id)

    return { id: user.id, username: user.username, email: user.email, token }
}


export const getUserProfile = async (userId) => {

    const user = await prisma.user.findUnique({
        where: { id: userId }
    })
    if (!user) {
        throw new Error("User not found")
    }

    return { id: user.id, email: user.email, name: user.name, bio: user.bio, username: user.username }
}

export const updateUserProfile = async ({name,username,email,password,bio,userId}) => {
    //check if email is already in use
    if(email){
        const isExistingUser = await prisma.user.findUnique({
            where: {email: email, NOT: {id: userId}}
        })
        if(isExistingUser){
            throw new Error("Email is already in use")
        }
    }

    //check if username is alrady in use
    if(username){
        const isExistingUsername = await prisma.user.findUnique({
            where:{username:username, NOT: {id: userId}}
        })
        if(isExistingUsername){
            throw new Error("This username is already taken")
        }
    }

    //create the update object
    const updateData = {}
    if(name) updateData.name = name
    if(email) updateData.email = email
    if(username) updateData.username = username
    if(bio) updateData.bio = bio

    //hash the password if given
    if(password){
        const hashedPassword = await bcrypt.hash(password,10)
        updateData.password = hashedPassword
    }

    const updatedProfile = await prisma.user.update({
        where: {id: userId},
        data: updateData,
        omit: { password: true}
    })

    return updatedProfile
}