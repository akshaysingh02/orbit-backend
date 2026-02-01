import jwt from "jsonwebtoken"

export const generateToken = (userId) => {
    const payload = {id: userId}
    const token = jwt.sign(payload,process.env.JWT_SECRET_KEY, {
        expiresIn: (process.env.JWT_TOKEN_EXPIRE_IN || "7d").trim()
    });
    
    return token;
}