import { param,validationResult } from "express-validator"
import { errorResponse } from "../../utils/response.js"

export const validateUuidParam = [
    param("id")
    .optional({values: "falsy"})
    .isUUID().withMessage("Invalid Id format"),

    (req,res,next) => {
        const error = validationResult(req)
        if(!error.isEmpty()){
            return errorResponse(res,"Validation failed",400,error.array())
        }
        next();
    }
]