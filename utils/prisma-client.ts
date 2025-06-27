"use server"
import { PrismaClient } from "../generated/prisma/client";
import {tableNames } from "./tables";

const prisma = new PrismaClient();


export default prisma;