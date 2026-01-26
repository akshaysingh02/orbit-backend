import {PrismaClient} from "@prisma/client";

const primsa = new PrismaClient({
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

export {connectDb,disconnectDb, primsa}