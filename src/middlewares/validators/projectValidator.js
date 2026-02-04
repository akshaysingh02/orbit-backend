import { body,validationResult } from "express-validator"
import { errorResponse } from "../../utils/response.js"

export const validateCreateProject = [
    body("title")
    .trim()
    .notEmpty().withMessage("Title can't be empty")
    .isLength({min: 3, max: 50}).withMessage("Title should be minimum of 3 characters and maximum of 50"),

    body("description")
    .trim()
    .notEmpty().withMessage("Description can't be empty")
    .isLength({max: 2000}).withMessage("Description length can't exceed 2000 characters"),

    body("startDate")
    .isDate()
    .optional(),

    body("endDate")
    .isDate()
    .optional(),

    (req,res,next)=>{
        const error = validationResult(req)
        if(!error.isEmpty()){
            return errorResponse(res,"Validation failed",400,error.array())
        }
        next()
    }
];

export const validateUpdateProject = [
    body("title")
    .optional()
    .trim()
    .notEmpty().withMessage("Title can't be empty")
    .isLength({min: 3, max: 50}).withMessage("Title should be minimum of 3 characters and maximum of 50"),

    body("description")
    .optional()
    .trim()
    .notEmpty().withMessage("Description can't be empty")
    .isLength({max: 2000}).withMessage("Description length can't exceed 2000 characters"),

    body("startDate")
    .optional()
    .isDate()
    .optional(),

    body("endDate")
    .optional()
    .isDate()
    .optional(),

    body("adminId")
    .optional()
    .isUUID().withMessage("Admin Id not valid"),


    (req,res,next)=>{
        const error = validationResult(req)
        if(!error.isEmpty()){
            return errorResponse(res,"Validation failed",400,error.array())
        }
        next()
    }
]