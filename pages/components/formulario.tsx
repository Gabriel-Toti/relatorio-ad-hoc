import {useState} from 'react';
import {Tabelas, ITabela, IColuna} from '../../utils/tables';

enum Operacao {
    Menor = "<",
    MenorOuIgual = "<=",
    Maior = ">",
    MaiorOuIgual = ">=",
    Diferente = "!=",
    Igual = "=="
}

interface ICampo {
    tabela: ITabela,
    campo: IColuna
}
interface IFiltro {
    tabela: ITabela,
    campo: ICampo,
    operacao: Operacao | string, 
    valor: string,
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

function SelectCampos({campos, camposSelecionados, camposAgrupados, onChangeSelect, onChangeGroup}) {
    console.log("campos", camposSelecionados);
    campos.map(campo => {
        if (!camposSelecionados.includes(campo)) {
            console.log("n tem campo", campo);
        } 
    });
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
                            <td className="table-form mx-5">{campo.campo.descricao}</td>
                            <td className="table-form mx-5">
                                <input
                                    type="checkbox"
                                    onChange={(e) => onChangeSelect(campo, e)}
                                    checked={camposSelecionados.some(
                                        (element) =>
                                            element.tabela.nome === campo.tabela.nome &&
                                            element.campo.nome === campo.campo.nome
                                    )}
                                />
                            </td>
                            <td className="table-form mx-5">
                                <input
                                    type="checkbox"
                                    onChange={(e) => onChangeGroup(campo, e)}
                                    checked={camposAgrupados.some(
                                        (element) =>
                                            element.tabela.nome === campo.tabela.nome &&
                                            element.campo.nome === campo.campo.nome
                                    )}
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
                            <td className="table-form">{campo.tabela.nome}</td>
                            <td className="table-form">{campo.campo.descricao}</td>
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
    const [tabelas, setTabelas] = useState<ITabela[]>(Tabelas);
    const [camposTabela, setCamposTabela] = useState<ICampo[]>([]);
    const [camposSelecionados, setCamposSelecionados] = useState<ICampo[]>([]);
    const [camposAgrupados, setCamposAgrupados] = useState<ICampo[]>([]);
    const [filtros, setFiltros] = useState<IFiltro[]>([]);
    const classTable = "border border-gray-300 rounded p-2"

    function handleAdicionarFiltro() {
        if (camposSelecionados.length === 0) {
            return;
        }
        setFiltros([
            ...filtros,
            {
                tabela: tabelas[0],
                campo: camposSelecionados[0],
                operacao: Operacao.Igual,
                valor: ""
            }
        ]);
    }
    function handleDeletarFiltro(id)
    {
        setFiltros(filtros.filter((filtro, index) => index !== id));
    }
    function getCamposTabela()
    {
        
    }

    return (
        <form className="flex flex-col gap-4 w-1/2 m-6">
            <>
                <label>
                    Tabelas: 
                    <SelectArray 
                        array={tabelas.map(tabela => tabela.nome)}
                        onChange={(e) => {
                            const tabelaSelecionada = tabelas.find(t => t.nome === e.target.value);
                            if (tabelaSelecionada) {
                                setCamposTabela(tabelaSelecionada.colunas.map(c => ({ tabela: tabelaSelecionada, campo: c })));
                            }
                        }}
                        defaultValue={tabelas[0].nome}
                    />
                </label>
                <label>Selecionar campos:</label>
                <SelectCampos
                    campos={camposTabela}
                    onChangeSelect={(campo, e) => {
                        if (e.target.checked) {
                            setCamposSelecionados([...camposSelecionados, campo]);
                        } else {
                            setCamposSelecionados(
                                camposSelecionados.filter(
                                    c =>
                                        c.tabela.nome !== campo.tabela.nome ||
                                        c.campo.nome !== campo.campo.nome
                                )
                            );
                        }
                    }}
                    onChangeGroup={(campo, e) => {
                        if (e.target.checked) {
                            setCamposAgrupados([...camposAgrupados, campo]);
                        } else {
                            setCamposAgrupados(
                                camposAgrupados.filter(
                                    c =>
                                        c.tabela.nome !== campo.tabela.nome ||
                                        c.campo.nome !== campo.campo.nome
                                )
                            );
                        }
                    }}
                    camposSelecionados={camposSelecionados}
                    camposAgrupados={camposAgrupados}
                />
                <label>Ordernar por campo:</label>
                <SelectOrderBy campos={camposSelecionados} />
            </>
            Filtros:
            <table>
                <thead>
                    <tr>
                        <th className="table-form">Campo</th>
                        <th className="table-form">Operação</th>
                        <th className="table-form">Valor</th>
                        <th className="table-form w-16"></th>
                    </tr>
                </thead>
                <tbody>
                    {filtros.map((filtro, index) => (
                        <tr key={index}>
                            <td className="table-form text-center">
                                <SelectArray array={camposSelecionados.map(campo => campo.tabela.nome + ": " + campo.campo.descricao)} defaultValue={filtro.campo.campo.descricao} onChange={
                                    (e) => {
                                        const novoCampo = e.target.value;
                                        const campoSelecionado = camposSelecionados.find(c =>  c.tabela.nome + ": " + c.campo.descricao === novoCampo);
                                        if (campoSelecionado) {
                                            setFiltros((prev) =>
                                                prev.map((f, i) =>
                                                    i === index ? { ...f, campo: campoSelecionado } : f
                                                )
                                            );
                                        }
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
                        <button type="button" className="table-form" onClick={handleAdicionarFiltro}>
                            Adicionar
                        </button>
                    </tr>
                </tbody>
            </table>
        </form>
    );
}