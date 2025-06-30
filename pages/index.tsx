import { alias } from "drizzle-orm/gel-core";
import type { Hello, QueryReturn } from "../interfaces";
import { Tabelas } from "../utils/tables";
import Formulario  from "./components/formulario";
import useSwr from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Index() {
  const { data, error, mutate } = useSwr<QueryReturn>("/api/backend", fetcher);

  const sendQuery = async (queryArguments) => {
    const response = await fetch("/api/backend", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(queryArguments),
    });
    const result = await response.json();
    console.log(result);
    mutate(result, false);
  };


  return (
    <div>
      <button
        onClick={() => {
          const queryArguments = {
            tabelas: ["desmatamento_estado", "estado"],
            colunas: [
              { nome: "nomeEstado", tabela: "estado" },
            ],
            filtros: [
              {
                coluna: { nome: "ano", tabela: "desmatamento_estado" },
                operador: ">",
                valor: "2010",
              }
            ],
            groupBy: [
              //{ nome: "ano", tabela: "desmatamento_estado" },
              { nome: "nomeEstado", tabela: "estado" }
            ],
            agregacoes: [
              {
                tipo: "SUM",
                alias: "totalDesmatado",
                coluna: { nome: "areaDesmatada", tabela: "desmatamento_estado" }, 
              }
            ],
          }
          sendQuery(queryArguments);
        }}
      >
        Teste Query
      </button>
    </div>
  );
}
