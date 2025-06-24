import { PrismaClient } from "@prisma/client";

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

export const tables = [
  {
    nome: "Desmatamento por Bioma",
    tabela: "desmatamento_bioma",
    obj: prisma.desmatamento_bioma,
    descricao: "Desmatamento por bioma no Brasil, incluindo dados de área desmatada e ano.",
    colunas: [
      { nome: "bioma", tipo: "string", descricao: "Nome do bioma" },
      { nome: "ano", tipo: "number", descricao: "Ano do desmatamento" },
      { nome: "area_desmatada", tipo: "number", descricao: "Área desmatada em hectares" }
    ]
  },
  {
    nome: "Desmatamento por Estado",
    tabela: "desmatamento_estado",
    obj: prisma.desmatamento_estado,
    descricao: "Desmatamento por estado no Brasil, incluindo dados de área desmatada e ano.",
    colunas: [
      { nome: "estado", tipo: "string", descricao: "Nome do estado" },
      { nome: "ano", tipo: "number", descricao: "Ano do desmatamento" },
      { nome: "area_desmatada", tipo: "number", descricao: "Área desmatada em hectares" }
    ]
  }
]

export default prisma;