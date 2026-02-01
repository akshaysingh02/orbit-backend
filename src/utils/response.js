import { getErrorMessage, getsuccessMessage } from "./httpStatusCodes.js"

export const successResponse = (res,data,message,statusCode) => {
    res.status(statusCode).json({
        status: getsuccessMessage(statusCode),
        data: {
            ...data
        },
        message: message
    })
}

export const errorResponse = (res,message,statusCode, error = null) => {
    const response = {
        status: getErrorMessage(statusCode),
        message: message
    };
    if(error){
        response.errors = error
    }
    res.status(statusCode).json(response)
}