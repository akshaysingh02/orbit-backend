import { body,validationResult,param } from "express-validator";
import { errorResponse } from "../../utils/response.js";

export const validateGetSubtask = [
    param("taskId")
    .trim()
    .notEmpty().withMessage("Task Id is required")
    .isUUID().withMessage("Task id must be valid UUID"),


    (req,res,next) => {
        const error = validationResult(req);
        if(!error.isEmpty()){
            return errorResponse(res,"Validation Failed",400,error.array())
        }

        next();
    }
]

export const validateCreateSubtask = [

    param("taskId")
    .trim()
    .notEmpty().withMessage("Task Id is required")
    .isUUID().withMessage("Task id must be valid UUID"),

    body("title")
    .trim()
    .optional()
    .isLength({max: 50}).withMessage("title must be under 50 characters"),

    body("description")
    .trim()
    .notEmpty().withMessage("Subtask description is required")
    .isLength({max: 500}).withMessage("Subtask description must be under 500 characters"),

    body("isCompleted")
    .default(false)
    .toBoolean()
    .isBoolean().withMessage("Status must be boolean"),


    (req,res,next) => {
        const error = validationResult(req);
        if(!error.isEmpty()){
            return errorResponse(res,"Validation Failed",400,error.array())
        }

        next();
    }
]

export const validateUpdateSubtask = [
    body("title")
    .trim()
    .optional()
    .isLength({max: 50}).withMessage("title must be under 50 characters"),

    body("description")
    .trim()
    .optional()
    .isLength({max: 500}).withMessage("Subtask description must be under 500 characters"),


    (req,res,next) => {
        const error = validationResult(req);
        if(!error.isEmpty()){
            return errorResponse(res,"Validation Failed",400,error.array())
        }

        const title = req.body?.title?.trim()
        const description = req.body?.description?.trim()
        if(!title && !description){
            return errorResponse(res,"Validation failed",400,[
                { msg: "At least one of title or description is required to perform an update" }
            ]);
        }

        next();
    }
]

export const validateSubtaskStatus = [
    body("isCompleted")
    .isBoolean().withMessage("Status must be boolean")
    .notEmpty().withMessage("Status value is empty"),


    (req,res,next) => {
        const error = validationResult(req);
        if(!error.isEmpty()){
            return errorResponse(res,"Validation Failed",400,error.array())
        }

        next();
    }
]



// router.get("/:taskId/subtasks",getSubtasks)
// router.post("/:taskId/subtasks",createSubtask)
// router.put("/:id",updateSubtask)
// router.delete("/:id",deleteSubtask)
// router.patch("/:id/status",subtaskStatus)

