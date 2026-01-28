import {PrismaClient} from "@prisma/client";
import dotenv from 'dotenv';
import { PrismaNeon } from "@prisma/adapter-neon";
dotenv.config()

const adapter = new PrismaNeon({connectionString: process.env.DATABASE_URL})
const prisma = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query","error", "warn"] : 
    ["error"],
});

const connectDb = async() =>{
    try {
        await prisma.$connect();
        console.log("Database connected via prisma")
    } catch (error) {
        console.log(`Database connection error ${error.message}`);
        process.exit(1);
    }
}

const disconnectDb = async () => {
    try {
        await prisma.$disconnect();
        console.log(`Database disconnected via prisma`)
    } catch (error) {
        console.log(`Disconneting DB failed ${error.message}`)
    }
}

export {connectDb,disconnectDb, prisma}