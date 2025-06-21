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
    operacao: Operacao,
    valor: string,
}

interface ICampo {
    tabela: string,
    campo: string
}

function SelectArray({array, onChange, defaultValue}){
    return (<select
                className="border border-gray-300 rounded p-2 mx-5 min-w-1/4"
                defaultValue={defaultValue || array[0]}
                onChange={onChange} //colocar lógica para atualizar camposTabela com base na tabela selecionada
            >
                {array.map((tabela, index) => (
                    <option key={index} value={tabela}>
                        {tabela}
                    </option>
                ))}
            </select>)
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
                <table className={classTable}>
                    <thead>
                        <tr>
                            <th className={classTable}>Campo</th>
                            <th className={classTable}>Selecionar</th>
                            <th className={classTable}>Agrupar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {camposTabela.map((campo, index) => (
                            <tr key={index}>
                                <td className={classTable}>{campo}</td>
                                <td className={classTable}>
                                    <input
                                        type="checkbox"
                                        onChange={() => {
                                            setCamposSelecionados((prev) => {
                                                if (prev.includes(campo)) {
                                                    return prev.filter((c) => c !== campo);
                                                } else {
                                                    return [...prev, campo];
                                                }
                                            });
                                        }}
                                    />
                                </td>
                                <td className={classTable}>
                                    <input
                                        type="checkbox"
                                        onChange={() => {
                                            // Handle checkbox change if needed
                                        }}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <label>Ordernar por campo:</label>
                <table>
                    <thead>
                        <tr>
                            <th className={classTable}>Tabela</th>
                            <th className={classTable}>Campo</th>
                            <th className={classTable}>ASC</th>
                            <th className={classTable}>DESC</th>
                        </tr>
                    </thead>
                    <tbody>
                        {camposSelecionados.map((campo, index) => (
                            <tr key={index}>
                                <td className={classTable}>a</td>
                                <td className={classTable}>{campo}</td>
                                <td className={classTable}>
                                    <input type="radio" name={`order`} value="asc" /> 
                                    <label> ASC</label>
                                </td>
                                <td className={classTable}>
                                    <input type="radio" name={`order`} value="asc" /> 
                                    <label> DESC</label>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </>
            Filtros:
            <table>
                <thead>
                    <tr>
                        <th className={classTable}>Tabela</th>
                        <th className={classTable}>Campo</th>
                        <th className={classTable}>Operação</th>
                        <th className={classTable}>Valor</th>
                        <th className={classTable + " w-16"}></th>
                    </tr>
                </thead>
                <tbody>
                    {filtros.map((filtro, index) => (
                        <tr key={index}>
                            <td className={classTable}>
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
                            <td className={classTable + " text-center"}>
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
                            <td className={classTable + " text-center"}>
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
                            <td className={classTable}>
                                <input className={classTable + " w-1/1"}  />
                            </td>
                            <td className={classTable}>
                                <button
                                    type="button"
                                     className={classTable + " text-red"}
                                    onClick={() => handleDeletarFiltro(index)}
                                >
                                    Deletar
                                </button>
                            </td>
                        </tr>
                    ))}
                    <tr  className={classTable}>
                        Adicionar
                    </tr>
                </tbody>
            </table>
        </form>
    );
}