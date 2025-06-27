import { Tabelas, ITabela, IColuna, tableNames } from "../../utils/tables";
import React, { useReducer, useState } from "react";
import ReactModal from "react-modal";

interface IArvore {
    id: string;
    tabela: ITabela;
    colunas: Array<IColuna|IArvore>;
}

function generate_id() {
    return Math.random().toString(36).substring(2, 15);
}

function Arvore({ arvore, arvorePrincipal, dispatch } : { arvore: IArvore, arvorePrincipal : IArvore, dispatch?: (action: any) => void }) {
    const { tabela, colunas } = arvore;
    return (
        <div className="mx-4 my-2 p-4 border rounded-lg shadow-sm max-w-fit">
            <h3>Tabela: {tabela.nome}</h3>
            <p>Descrição: {tabela.descricao}</p>
            <ul className="list-disc pl-6 ml-6">
                {colunas.map((coluna, index) => (
                    <li key={index}>
                        {"colunas" in coluna && "tabela" in coluna ? (
                            <Arvore arvore={coluna as IArvore} dispatch={dispatch} arvorePrincipal={arvorePrincipal} />
                        ) : (
                            (coluna as IColuna).nome
                        )}
                    </li>
                ))}
                <button onClick={() => {
                    if (dispatch) {
                        dispatch({
                            type: 'ADD_COLUNA',
                            arvore,
                            filho: {
                                nome: 'nova_coluna',
                                tipo: 'string',
                                descricao: 'Nova coluna adicionada'
                            }
                        });
                    }
                }} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Adicionar
                </button>
                <button onClick={() => {
                    if (dispatch) {
                        dispatch({
                            type: 'ADD_COLUNA',
                            arvore,
                            filho: {
                                id: generate_id(),
                                tabela: {
                                    nome: 'Nova Tabela',
                                    descricao: 'Descrição da nova tabela',
                                    tabela: 'nova_tabela',
                                    colunas: [],
                                    juncoes: []
                                },
                                colunas: [],
                                descricao: 'Nova tabela adicionada'
                            }
                        });
                    }
                }} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Adicionar Filho
                </button>
            </ul>
        </div>
    );
}

export default function NovoForm() {
    const mockArvore: IArvore = {
        id: generate_id(),
        tabela: {
            nome: "Usuários",
            descricao: "Tabela de usuários do sistema",
            tabela: "usuarios",
            colunas: [],
            juncoes: []
        },
        colunas: [
            {
                nome: "id",
                tipo: "integer",
                descricao: "Identificador único do usuário"
            },
            {
                nome: "nome",
                tipo: "string",
                descricao: "Nome do usuário"
            },
            {
                id: generate_id(),
                tabela: {
                    nome: "Endereços",
                    descricao: "Tabela de endereços dos usuários",
                    tabela: "enderecos",
                    colunas: [
                        {
                            nome: "rua",
                            tipo: "string",
                            descricao: "Rua do endereço"
                        },
                        {
                            nome: "cidade",
                            tipo: "string",
                            descricao: "Cidade do endereço"
                        },
                        {
                            nome: "pais",
                            tipo: "string",
                            descricao: "Pais do endereço"
                        },
                        {
                            nome: "rolansega",
                            tipo: "string",
                            descricao: "rolansega do endereço"
                        },
                    ],
                    juncoes: []
                },
                colunas: [
                        {
                            nome: "rua",
                            tipo: "string",
                            descricao: "Rua do endereço"
                        },
                        {
                            nome: "cidade",
                            tipo: "string",
                            descricao: "Cidade do endereço"
                        }
                    ],
                descricao: "Endereços associados ao usuário"
            }
        ]
    };

    const [arvoreAtual, dispatch] = useReducer(arvoreReducer, mockArvore);
    return (
        <div>
            <h1>Estrutura de Dados</h1>
            <Arvore arvore={arvoreAtual} arvorePrincipal = {arvoreAtual} dispatch={dispatch} />
        </div>
    );
}

function arvoreReducer(state: IArvore, action: { type: string, arvore: IArvore, filho?: IColuna|IArvore }): IArvore {
    switch (action.type) {
        case 'ADD_COLUNA':
            const addColunaRecursivo = (arvore: IArvore, idAlvo: string, novaColuna: IColuna|IArvore): IArvore => {
                if (arvore.id === idAlvo) {
                    return {
                        ...arvore,
                        colunas: [...arvore.colunas, novaColuna]
                    };
                }
                return {
                    ...arvore,
                    colunas: arvore.colunas.map(col =>
                        "colunas" in col && "tabela" in col
                            ? addColunaRecursivo(col as IArvore, idAlvo, novaColuna)
                            : col
                    )
                };
            }
            if (action.filho && action.arvore && action.arvore.id) {
                return addColunaRecursivo(state, action.arvore.id, action.filho);
            }
            return state;
        default:
            return state;
    }
}