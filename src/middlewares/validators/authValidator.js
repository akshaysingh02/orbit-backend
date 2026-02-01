import { body, validationResult } from "express-validator";
import { errorResponse } from "../../utils/response.js";

export const validateRegister = [
    body('username')
    .trim()
    .notEmpty().withMessage("User Name is required")
    .isLength({min: 3}).withMessage("User name must be atleast 3 characters"),

    body('name')
    .trim()
    .notEmpty().withMessage("Name is required"),

    body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Must be a valid email"),

    body("password")
    .trim()
    .notEmpty().withMessage("Password is required")
    .isLength({min: 6}).withMessage("Password must be atleast 6 characters"),



    (req,res,next) => {
        const error = validationResult(req);
        if(!error.isEmpty()){
            return errorResponse(res,"Validation Failed",400,error.array())
        }

        next();
    }
];


export const validateLogin = [
    body("email")
    .trim()
    .notEmpty().withMessage("Invalid email")
    .isEmail().withMessage("Not a valid Email"),

    body("password")
    .trim()
    .notEmpty().withMessage("Invalid password")
    .isLength({min: 6}).withMessage("Password must be atleast 6 characters"),


    
    (req,res,next) => {
        const error = validationResult(req);
        if(!error.isEmpty()){
            return errorResponse(res,"Validation Failed",400,error.array())
        }

        next();
    }
]

