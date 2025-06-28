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
    return (<table className={"table-form"}>
                <thead className='bg-gray-200'>
                    <tr>
                        <th className="table-form">Campo</th>
                        <th className="table-form">Selecionar</th>
                        <th className="table-form">Agregar</th>
                    </tr>
                </thead>
                <tbody>
                    {campos.map((campo, index) => (
                        <tr key={index}>
                            <td className="table-form">{campo}</td>
                            <td className="table-form">
                                <input
                                    type="checkbox"
                                    onChange={(e) => onChangeSelect(campo,e)}
                                />
                            </td>
                            <td className="table-form">
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
                <thead className='bg-gray-200'>
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
    //const classTable = "border border-gray-300 rounded p-2"

    function handleDeletarFiltro(id)
    {

    }
    function getCamposTabela()
    {
        
    }
    function handleAdd(){}
    function handleReportGraphic(){}
    function handleReport(){}

    return (
        <div className='general'>
        <form className="flex flex-col gap-4 mx-full">

            <label>Tabelas:
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

            <label>Filtros:</label>
            <table>
                <thead className='bg-gray-200'>
                    <tr>
                        <th className="table-form w-1/5">Tabela</th>
                        <th className="table-form w-1/5">Campo</th>
                        <th className="table-form w-1/5">Categoria</th>
                        <th className="table-form w-1/5">Operação</th>
                        <th className="table-form w-1/5">Valor</th>
                        <th className="table-form w-1/5">
                            <button className='table-form bg-black font-bold text-white w-1/1' onClick={handleAdd}>Adicionar</button>
                        </th>
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
                                }
                                />
                                </td>
                            <td className="table-form w-max">
                                <input className="table-form w-1/1"/>
                            </td>
                            <td className="table-form">
                                <button
                                    type="button"
                                    className="table-form bg-red-500 font-bold text-white w-1/1"
                                    onClick={() => handleDeletarFiltro(index)}
                                >
                                    Deletar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <label>Agregações:</label>
            <table>
                <thead className='bg-gray-200'>
                    <tr>
                        <th className="table-form w-1/6">Tabela</th>
                        <th className="table-form w-1/6">Campo</th>
                        <th className="table-form w-1/6">Operação</th>
                        <th className="table-form w-1/6">
                            <button className='table-form bg-black font-bold text-white w-1/1' onClick={handleAdd}>Adicionar</button>
                        </th>
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
                                <SelectArray array={["sum", "min", "max", "count"]} defaultValue={filtro.operacao} onChange={
                                    (e) => {
                                        const novaOP = e.target.value;
                                        setFiltros((prev) =>
                                            prev.map((f, i) =>
                                                i === index ? { ...f, operacao: novaOP } : f
                                            )
                                        );
                                    }
                                }
                                />
                                </td>
                            <td className="table-form">
                                <button
                                    type="button"
                                    className="table-form bg-red-500 font-bold text-white w-1/1"
                                    onClick={() => handleDeletarFiltro(index)}
                                >
                                    Deletar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <table className='gap-4 mx-auto flex'>
                    <td className=''>
                        <button
                            type="button"
                            className="table-form bg-black font-bold text-white w-1/1"
                            onClick={() => handleReport()}
                        >
                            Gerar Relatório
                        </button>
                    </td>
                    <td>
                        <button
                            type="button"
                            className="table-form bg-black font-bold text-white w-1/1"
                            onClick={() => handleReportGraphic()}
                        >
                            Gerar Gráfico
                        </button>
                    </td>
                </table>
        </form>
        </div>
    );
}