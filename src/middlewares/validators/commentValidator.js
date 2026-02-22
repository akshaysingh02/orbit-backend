import { body,param,validationResult } from "express-validator";
import { errorResponse } from "../../utils/response.js";

export const validateCommentBody = [
    body("body")
    .trim()
    .notEmpty().withMessage("Comment can't be empty")
    .isLength({max: 1000}).withMessage("Comment can't be more than 1000 characters"),
    

    (req,res,next) => {
        const error = validationResult(req)
        if(!error.isEmpty()){
            return errorResponse(res,"Validation failed",400,error.array())
        }
        next();
    }
]

export const validateCommentTaskId = [
    param("taskId")
    .trim()
    .notEmpty().withMessage("Task Id is required")
    .isUUID().withMessage("Task Id must be a valid UUID"),
    

    (req,res,next) => {
        const error = validationResult(req)
        if(!error.isEmpty()){
            return errorResponse(res,"Validation failed",400,error.array())
        }
        next();
    }
]