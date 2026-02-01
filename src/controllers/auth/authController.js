import { createUser, getUserProfile, loginUser,updateUserProfile } from "../../services/authService.js";
import { errorResponse, successResponse } from "../../utils/response.js";

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export const register = async (req,res) =>{
    try {
        const {username, name, email, password} = req.body;
        
        const userData = await createUser({username,name,email,password})

        res.cookie("jwt", userData.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * DAY
        })

        return successResponse(res,userData,"User successfully created",201)
    } catch (error) {
        if (error.message === 'user already exists, change email or username') {
            return errorResponse(res, error.message, 409);
          }
          return errorResponse(res, error.message, 500);
    }
}

export const login = async(req,res) => {
    try {
        const {email, password} = req.body;

        const userData = await loginUser({email, password})
        res.cookie("jwt", userData.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * DAY
        })

        return successResponse(res,userData,"User successfully logged In",200);
    } catch (error) {
        if(error.message === "User not found, Invalid email"){
            return errorResponse(res,error.message,404)
        } else if (error.message === "Password is incorrect"){
            return errorResponse(res,error.message,403)
        }
        return errorResponse(res,error.message,400)
    }
}

export const logout = async(req,res) => {
    try {
        res.cookie("jwt","",{
            httpOnly: true,
            expires: new Date(0)
        })

        return successResponse(res,{},"User successfully logged out",200);
    } catch (error) {
        
        return errorResponse(res,error.message,500)
    }
}

export const getProfile = async(req,res)=>{
    try {
        const userId = req.user?.id
        const userData = await getUserProfile(userId)

        return successResponse(res,userData,"User profile fetched",200)
    } catch (error) {      
        return errorResponse(res,error.message, 500,error)
    }
}

export const updateProfile = async(req,res) => {
    try {
        const {name, username,email,password} = req.body;
        const userData = await updateUserProfile({name,username,email,password});

        successResponse(res,userData,"User profile updated",200)
    } catch (error) {
        return errorResponse(res,error.message, 500,error)
    }
}