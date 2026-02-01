import { prisma } from "../../src/config/db.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";


export const createUser = async ({ username, name, email, password }) => {

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

export const updateUserProfile = async () => {

}