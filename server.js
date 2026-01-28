import express from "express"
import dotenv from "dotenv"
import authRoutes from "./src/routes/auth.js";
import { connectDb, disconnectDb } from "./src/config/db.js";


const app = express();

dotenv.config();
connectDb();

// Body parsing middlewares
app.use(express.json())
app.use(express.urlencoded({extended: true}))



// Api routes
app.use("/auth",authRoutes)






app.listen(process.env.PORT_DEV,()=>{
    console.log(`Server is running at port ${process.env.PORT_DEV}`)
})

//handle unhandled promise rejections (eg. database connection errors)
process.on("unhandledRejection", async(err)=>{
    console.log("unhandled rejection",err);
    server.close(async ()=>{
        await disconnectDb();
        process.exit(1);
    })
});

//handle uncaught exception
process.on("uncaughtException", async(err)=>{
    console.log("uncaught exception",err);
    server.close(async ()=>{
        await disconnectDb();
        process.exit(1);
    })
});

//Gracefull shutdown
process.on("SIGTERM", async ()=>{
    console.log("SIGTERM received, shutting down gracefully");
    server.close(async ()=>{
        await disconnectDb();
        process.exit(0);
    })
});