import { prisma } from "../../config/db.js";
import bcrypt from "bcryptjs";


const register = async (req,res) =>{
    try {
        const {username, name, email, password} = req.body;
        if(!name || name.trim() === ""){
            return res
            .status(400)
            .json({error: "Name can't be empty"})
        }
        else if (!email || email.trim() === ""){
            return res
            .status(400)
            .json({error: "Email can't be empty"})
        }
        else if (!password || password.trim() === ""){
            return res
            .status(400)
            .json({error: "Password can't be empty"})
        } else if(!username || username.trim() === ""){
            return res
            .status(400)
            .json({error: "username can't be empty"})
        }

        // Check if user already exists
        const userExists = await prisma.user.findUnique({
            where: {email: email},
        });
        if(userExists){
            return res
            .status(409)
            .json({message: "User already exists, please login"})
        }

        const userNameExists = await prisma.user.findUnique({
            where: {username: username}
        })

        if(userNameExists){
            return res
            .status(409)
            .json({message: "UserName already exists, please user different one"})
        }

        //Hashing the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await prisma.user.create({
            data:{
                username,
                name,
                email,
                password: hashedPassword
            }
        })

        res.status(201).json({
            status: "Success",
            data: {
                username,
                id: user.id,
                name: name,
                email: email
            }
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Internal server error" })
    }
}

export {
    register
}