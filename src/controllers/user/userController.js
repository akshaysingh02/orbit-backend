import { getUser, getUserList } from "../../services/userService.js"
import { errorResponse, successResponse } from "../../utils/response.js";

export const userList = async(req, res) => {
    try {
        const userListData = await getUserList();
        return successResponse(res,userListData,"User list successfully fetched",200)
    } catch (error) {
        return errorResponse(res,"Internal server error",500,error)
    }
}

export const userInfo = async(req, res) => {
    try {
        const userId = req.params?.id
        if(!userId){
            return errorResponse(res,"User Id not found",400)
        }
        const userData = await getUser(userId);
        return successResponse(res,userData,"User info successfully fetched",200)
    } catch (error) {
        if(error.message === "Can not find user with given Id"){
            return errorResponse(res,error.message,404)
        }
        return errorResponse(res,"Internal server error",500,error)
    }
}

// Redundant controller for now, no feature need them
// export const updateUser = async(req,res) => {
//     try {
        // const {name,email,username} = req.body
        // const updatedUserData = await 
        // return successResponse(res,userData,"User info successfully fetched",200)
//     } catch (error) {
//         return errorResponse(res,"Internal server error",500,error)
//     }
// }

// export const deleteUser = async(req,res)=>{
//     try {
//         const userId = req.params
//         const userData = await deleteUser(userId)
//         return successResponse(res,userData,"User info successfully fetched",200)
//     } catch (error) {
//         return errorResponse(res,"Internal server error",500,error)
//     }
// }

// GET    /api/users                  - Get all users (for assignment dropdowns)
// GET    /api/users/:id              - Get specific user
// PUT    /api/users/:id              - Update user
// DELETE /api/users/:id              - Delete user