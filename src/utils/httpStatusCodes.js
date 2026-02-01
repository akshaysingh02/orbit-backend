export const getsuccessMessage = (code) => {
    switch (code) {
        case 200:
            return "Success"
        case 201:
            return "Created"
        default:
            return "Success"
    }
}
export const getErrorMessage = (code) => {
    switch(code){
        case 400:
            return "Bad Request"
        case 404:
            return "Not Found"
        case 409:
            return "Conflict"
        case 500:
            return "Internal Server Error"
        default:
            return "Error"
    }
}