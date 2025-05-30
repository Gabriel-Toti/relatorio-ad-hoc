// import { PrismaClient } from "@prisma/client";
import { hello } from "../repositories/hello.repository";

export async function helloService(/*prisma: PrismaClient*/) {
    try {
        return await hello(/*prisma*/);
    } catch (error) {
        throw error;
    }
}