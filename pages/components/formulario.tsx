import {useState} from 'react';

enum Operacao {
    Menor = "<",
    MenorOuIgual = "<=",
    Maior = ">",
    MaiorOuIgual = ">=",
    Diferente = "!=",
    Igual = "=="
}

interface IFiltro {
    tabela: string,
    campo: string,
    operacao: Operacao | string, 
    valor: string,
}

interface ICampo {
    tabela: string,
    campo: string
}

const SelectArray = ({
    array,
    onChange,
    defaultValue
}: {
    array: string[];
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    defaultValue?: string;
}) => (
    <select
        className="border border-gray-300 rounded p-2 mx-5 min-w-1/4"
        defaultValue={defaultValue || array[0]}
        onChange={onChange}
    >
        {array.map((tabela, index) => (
            <option key={index} value={tabela}>
                {tabela}
            </option>
        ))}
    </select>
);

function SelectCampos({campos, onChangeSelect, onChangeGroup}) {
    return (<table className={"table-form mx-5"}>
                <thead>
                    <tr>
                        <th className="table-form mx-5">Campo</th>
                        <th className="table-form mx-5">Selecionar</th>
                        <th className="table-form mx-5">Agrupar</th>
                    </tr>
                </thead>
                <tbody>
                    {campos.map((campo, index) => (
                        <tr key={index}>
                            <td className="table-form mx-5">{campo}</td>
                            <td className="table-form mx-5">
                                <input
                                    type="checkbox"
                                    onChange={(e) => onChangeSelect(campo,e)}
                                />
                            </td>
                            <td className="table-form mx-5">
                                <input
                                    type="checkbox"
                                    onChange={(e) => onChangeGroup(campo,e)}
                                />
                            </td>
                        </tr>
                    ))
                }
                </tbody>
            </table>
    );
}

function SelectOrderBy({campos}) {
    return (<table>
                <thead>
                    <tr>
                        <th className="table-form">Tabela</th>
                        <th className="table-form">Campo</th>
                        <th className="table-form">ASC</th>
                        <th className="table-form">DESC</th>
                    </tr>
                </thead>
                <tbody>
                    {campos.map((campo, index) => (
                        <tr key={index}>
                            <td className="table-form">a</td>
                            <td className="table-form">{campo}</td>
                            <td className="table-form">
                                <input type="radio" name={`order`} value="asc" /> 
                                <label> ASC</label>
                            </td>
                            <td className="table-form">
                                <input type="radio" name={`order`} value="asc" /> 
                                <label> DESC</label>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
    )
}

export default function Formulario() {
    const [tabelas, setTabelas] = useState<string[]>(["a", "b", "c"]);
    const [camposTabela, setCamposTabela] = useState<string[]>(["campo1", "campo2", "campo3"]);
    const [camposSelecionados, setCamposSelecionados] = useState<string[]>([]);
    const [filtros, setFiltros] = useState<IFiltro[]>([
        {
            tabela: "a",
            campo: "campo1",
            operacao: Operacao.Igual,
            valor: "123"
        },
        {
            tabela: "b",
            campo: "campo2",
            operacao: Operacao.Maior,
            valor: "50"
        }
    ]);
    const classTable = "border border-gray-300 rounded p-2"

    function handleDeletarFiltro(id)
    {

    }
    function getCamposTabela()
    {
        
    }

    return (
        <form className="flex flex-col gap-4 w-1/2 m-6">
            <>
                <label>
                    Tabelas: 
                    <SelectArray array={tabelas}/>
                </label>
                <label>Selecionar campos:</label>
                <SelectCampos
                    campos={camposTabela}
                    onChangeSelect={(campo, e) => {
                        if (e.target.checked) {
                            setCamposSelecionados([...camposSelecionados, campo]);
                        } else {
                            setCamposSelecionados(camposSelecionados.filter(c => c !== campo));
                        }
                    }}
                    onChangeGroup={(campo, e) => {
                        // lógica para agrupar campos
                    }}
                />
                <label>Ordernar por campo:</label>
                <SelectOrderBy campos={camposSelecionados} />
            </>
            Filtros:
            <table>
                <thead>
                    <tr>
                        <th className="table-form">Tabela</th>
                        <th className="table-form">Campo</th>
                        <th className="table-form">Operação</th>
                        <th className="table-form">Valor</th>
                        <th className="table-form w-16"></th>
                    </tr>
                </thead>
                <tbody>
                    {filtros.map((filtro, index) => (
                        <tr key={index}>
                            <td className="table-form">
                                <SelectArray array={tabelas} defaultValue={filtro.tabela} onChange={
                                    (e) => {
                                        const novaTabela = e.target.value;
                                        setFiltros((prev) =>
                                            prev.map((f, i) =>
                                                i === index ? { ...f, tabela: novaTabela } : f
                                            )
                                        );
                                    }
                                }/>
                            </td>
                            <td className="table-form text-center">
                                <SelectArray array={camposSelecionados} defaultValue={filtro.campo} onChange={
                                    (e) => {
                                        const novoCampo = e.target.value;
                                        setFiltros((prev) =>
                                            prev.map((f, i) =>
                                                i === index ? { ...f, campo: novoCampo } : f
                                            )
                                        );
                                    }
                                }/>
                            </td>
                            <td className="table-form text-center">
                                <SelectArray array={["<", "<=", ">", ">=", "!=", "=="]} defaultValue={filtro.operacao} onChange={
                                    (e) => {
                                        const novaOP = e.target.value;
                                        setFiltros((prev) =>
                                            prev.map((f, i) =>
                                                i === index ? { ...f, operacao: novaOP } : f
                                            )
                                        );
                                    }
                                }/>
                                </td>
                            <td className="table-form">
                                <input className="table-form w-1/1"/>
                            </td>
                            <td className="table-form">
                                <button
                                    type="button"
                                    className="table-form text-red"
                                    onClick={() => handleDeletarFiltro(index)}
                                >
                                    Deletar
                                </button>
                            </td>
                        </tr>
                    ))}
                    <tr className="table-form">
                        Adicionar
                    </tr>
                </tbody>
            </table>
        </form>
    );
}