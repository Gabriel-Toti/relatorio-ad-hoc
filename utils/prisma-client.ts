"use server"
import { PrismaClient } from "../generated/prisma/client";
import { } from "./tables";

const prisma = new PrismaClient();

export const tableNames = [
  'bioma',
  'bioma_estado',
  'bioma_municipio',
  'caracteristica',
  'caracteristica_bioma',
  'caracteristica_estado',
  'caracteristica_municipio',
  'desmatamento_bioma',
  'desmatamento_estado',
  'desmatamento_municipio',
  'estado',
  'municipio'
];


export default prisma;