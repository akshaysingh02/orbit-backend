import { body,param,validationResult } from "express-validator";
import { errorResponse } from "../../utils/response.js";

const ROLES = ["MEMBER","ADMIN","VIEWER"]

export const validateAddMember = [
    // {projectId,callerUserId,targetUserId,role}
    body("userId")
    .trim()
    .notEmpty().withMessage("User Id is required")
    .isUUID().withMessage("User Id must be a valid UUID"),

    body("role")
    .trim()
    .notEmpty().withMessage("Role is required")
    .isIn(ROLES).withMessage(`Role must be one of: ${ROLES.join(", ")}`),

    (req,res,next)=>{
        const error = validationResult(req)
        if (!error.isEmpty()) return errorResponse(res, "Validation failed", 400, error.array())
        
        next()
    }
]

export const validateUpdateMemberRole = [
    body("role")
    .trim()
    .notEmpty().withMessage("Role is required")
    .isIn(ROLES).withMessage(`Role must be one of: ${ROLES.join(", ")}`),

    (req,res,next)=>{
        const error = validationResult(req)
        if (!error.isEmpty()) return errorResponse(res, "Validation failed", 400, error.array())
        
        next()
    }
]

export const validateMemberUserId = [
    param("userId")
    .trim()
    .notEmpty().withMessage("Member user Id is required")
    .isUUID().withMessage("Member user Id must be a valid UUID"),

    (req,res,next)=>{
        const error = validationResult(req)
        if (!error.isEmpty()) return errorResponse(res, "Validation failed", 400, error.array())
        
        next()
    }
]