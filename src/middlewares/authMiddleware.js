import jwt from "jsonwebtoken"
import {prisma} from "../../src/config/db.js"
import { errorResponse } from "../utils/response.js"

export const authMiddleware = async (req,res,next) => {

    let token;

    //verify if token exists
    if(req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies?.jwt){
        token = req.cookies.jwt;
    }
    if(!token){
        errorResponse(res,"Not Authorized: Token not found",404)
    }

    //verify token and extract user id
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)

        //check if user exists with the userId from decodedToken
        const user = await prisma.user.findUnique({
            where: {id: decoded.id}
        })

        if(!user){
            errorResponse(res,"User not found", 404)
        }

        req.user = user

        next()
    } catch (error) {
        errorResponse(res,"Authorization error",401,error)
    }

}