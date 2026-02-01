import {PrismaClient} from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import dotenv from 'dotenv';
dotenv.config()

const adapter = new PrismaNeon({connectionString: process.env.DATABASE_URL})
const prisma = new PrismaClient({adapter});

const userId = process.env.MOCK_USER_ID;

const projects = [{ title: "Website Revamp", description: "Redesign corporate website with modern UI/UX", adminId: userId, startDate: "2026-01-01T10:00:00.000Z" },
{ title: "Mobile App Development", description: "Build cross-platform mobile app using React Native", adminId: userId, startDate: "2026-01-05T09:00:00.000Z" },
{ title: "SEO Optimization", description: "Improve website SEO and performance metrics", adminId: userId, startDate: "2026-01-10T08:30:00.000Z" },
{ title: "E-commerce Platform", description: "Develop scalable e-commerce backend and frontend", adminId: userId, startDate: "2026-01-12T11:00:00.000Z" },
{ title: "Admin Dashboard", description: "Create internal dashboard for analytics and reporting", adminId: userId, startDate: "2026-01-15T10:15:00.000Z" },
{ title: "Authentication System", description: "Implement JWT and OAuth based authentication", adminId: userId, startDate: "2026-01-18T09:30:00.000Z" },
{ title: "Payment Gateway Integration", description: "Integrate Stripe and Razorpay for payments", adminId: userId, startDate: "2026-01-20T12:00:00.000Z" },
{ title: "Landing Page Redesign", description: "Create high-converting marketing landing pages", adminId: userId, startDate: "2026-01-22T10:00:00.000Z" },
{ title: "Notification Service", description: "Build email and push notification microservice", adminId: userId, startDate: "2026-01-25T09:00:00.000Z" },
{ title: "Analytics Integration", description: "Integrate Google Analytics and custom tracking", adminId: userId, startDate: "2026-01-28T11:00:00.000Z" },
{ title: "Role Based Access Control", description: "Implement RBAC for admin and user permissions", adminId: userId, startDate: "2026-02-01T09:30:00.000Z" },
{ title: "File Upload Module", description: "Develop media upload and storage system", adminId: userId, startDate: "2026-02-03T10:00:00.000Z" },
{ title: "Chat Support Feature", description: "Real-time chat support using WebSockets", adminId: userId, startDate: "2026-02-05T09:45:00.000Z" },
{ title: "Performance Optimization", description: "Optimize API response time and frontend rendering", adminId: userId, startDate: "2026-02-08T10:30:00.000Z" },
{ title: "Bug Fix Sprint", description: "Resolve critical bugs and improve stability", adminId: userId, startDate: "2026-02-10T09:00:00.000Z" }
];


const main = async () => {
    console.log("Seeding projects")

    for(const project of projects){
        await prisma.project.create({
            data: project
        })
        console.log(`created project: ${project.title}`)
    }

    console.log("Seeding completed")
}


main().catch((err)=>{
    console.log(err);
    process.exit(1)
}).finally(async ()=>{
    await prisma.$disconnect();
})