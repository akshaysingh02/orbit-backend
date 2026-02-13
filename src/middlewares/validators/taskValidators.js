import { body,validationResult } from "express-validator";

const TASK_STATUS_VALUES = ["TODO", "IN_PROGRESS", "DEV_DONE", "STAGING_TEST", "PRODUCTION_READY", "PRODUCTION_REVIEW", "DONE", "REMOVED"];
export const validateCreateTask = [
    body("title")
    .trim()
    .notEmpty().withMessage("Title is required")
    .isLength({min: 3, max: 50}).withMessage("Title should be minimum of 3 characters and maximum of 50"),

    body("description")
    .trim()
    .notEmpty().withMessage("Description can't be empty")
    .isLength({max: 10000}).withMessage("Description length can't exceed 10000 characters"),

    body("projectId")
    .trim()
    .notEmpty().withMessage("Project Id is required")
    .isUUID().withMessage("Project Id must be valid"),

    body("dueDate")
    .trim()
    .optional()
    .isDate().withMessage("Must be a valid Date"),

    body("status")
    .trim()
    .isIn(TASK_STATUS_VALUES)
    .withMessage(`Status must be one of: ${TASK_STATUS_VALUES.join(", ")}`),

    body("assignedToId")
    .trim()
    .optional()
    .isUUID().withMessage("Must be a valid Id"),

    (req,res,next) => {
        const error = validationResult(req)
        if(!error.isEmpty()){
            return errorResponse(res,"Validation failed",400,error.array())
        }
        next()
    }
]

export const validateUpdateTask = [
    body("title")
    .trim()
    .optional()
    .notEmpty().withMessage("Title is required")
    .isLength({min: 3, max: 50}).withMessage("Title should be minimum of 3 characters and maximum of 50"),

    body("description")
    .trim()
    .optional()
    .notEmpty().withMessage("Description can't be empty")
    .isLength({max: 10000}).withMessage("Description length can't exceed 10000 characters"),

    body("projectId")
    .trim()
    .optional()
    .notEmpty().withMessage("Project Id is required")
    .isUUID().withMessage("Project Id must be valid"),

    body("dueDate")
    .trim()
    .optional()
    .isDate().withMessage("Must be a valid Date"),

    body("status")
    .trim()
    .optional()
    .isIn(TASK_STATUS_VALUES)
    .withMessage(`Status must be one of: ${TASK_STATUS_VALUES.join(", ")}`),

    body("assignedToId")
    .trim()
    .optional()
    .isUUID().withMessage("Must be a valid Id"),


    (req,res,next) => {
        const error = validationResult(req)
        if(!error.isEmpty()){
            return errorResponse(res,"Validation failed",400,error.array())
        }
        next()
    }
]

export const validateTaskStatus = [
    body("status")
    .trim()
    .optional()
    .isIn(TASK_STATUS_VALUES)
    .withMessage(`Status must be one of: ${TASK_STATUS_VALUES.join(", ")}`),

    (req,res,next) => {
        const error = validationResult(req)
        if(!error.isEmpty()){
            return errorResponse(res,"Validation failed",400,error.array())
        }
        next()
    }
]