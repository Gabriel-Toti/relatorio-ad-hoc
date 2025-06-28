import {useState} from 'react';
import {Tabelas, ITabela, IColuna} from '../../utils/tables';
import axios from "axios";

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

function SelectTabela({tabelas, tabelasSelecionadas, onChange, onRemove}) {
    return (<>
        <table className="table-form mx-5">
            <thead>
            <tr>
                <th className="table-form">Nome</th>
                <th className="table-form">Descrição</th>
                <th className="table-form">Tabela</th>
            </tr>
            </thead>
            <tbody>
            {tabelasSelecionadas && tabelasSelecionadas.length > 0 && tabelasSelecionadas.map((tabela, idx) => (
                <tr key={idx}>
                <td className="table-form">{tabela.nome}</td>
                <td className="table-form">{tabela.descricao}</td>
                <td className="table-form">{tabela.tabela}</td>
                <td className="table-form">
                    {tabelasSelecionadas.length === idx + 1 && (
                        <button
                            className="table-form mr-5"
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                onRemove(tabela);
                            }}
                        >
                            X
                        </button>
                    )}
                </td>
                </tr>
            ))}
            </tbody>
        </table>
        <select
            className="table-form mx-5"
            onChange={onChange}
            defaultValue=""
        >
            <option value="" disabled>
            Selecione uma Tabela
            </option>
            {tabelas.map((tabela, index) => (
            <option key={index} value={tabela.nome}>
                {tabela.nome}
            </option>
            ))}
        </select></>
    );
}

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
                        <th className="table-form mx-5">Tabela</th>
                        <th className="table-form mx-5">Campo</th>
                        <th className="table-form mx-5">Selecionar</th>
                        <th className="table-form mx-5">Agrupar</th>
                    </tr>
                </thead>
                <tbody>
                    {campos.map((campo, index) => (
                        <tr key={index}>
                            <td className="table-form mx-5">{campo.tabela.nome}</td>
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
    const [tabelasSelecionadas, setTabelasSelecionadas] = useState<ITabela[]>([]);
    const [camposTabela, setCamposTabela] = useState<ICampo[]>([]);
    const [camposSelecionados, setCamposSelecionados] = useState<ICampo[]>([]);
    const [camposAgrupados, setCamposAgrupados] = useState<ICampo[]>([]);
    const [filtros, setFiltros] = useState<IFiltro[]>([]);
    const classTable = "border border-gray-300 rounded p-2"

    function handleRemoveTabela(tabela: ITabela) {
        const tabelasSelecionadasCopy = tabelasSelecionadas.filter(t => t.nome !== tabela.nome);
        setTabelasSelecionadas(tabelasSelecionadasCopy);

        const tabelasComJuncao = Tabelas.filter(t =>
            t.juncoes && t.juncoes.some(j =>
                tabelasSelecionadasCopy.some(ts => ts.tabela === j.tabelaDe || ts.tabela === j.tabelaPara)
                &&
                !tabelasSelecionadasCopy.some(ts => ts.nome === t.nome)
            )
        );
        if(tabelasSelecionadasCopy.length === 0) {
            setTabelas(Tabelas);
        } else {
            setTabelas(tabelasComJuncao);
        }
        if (tabelasSelecionadasCopy) {
            setCamposTabela(tabelasSelecionadasCopy.flatMap(t => t.colunas.map(c => ({ tabela: t, campo: c }))));
        }
        let camposSelecionadosCopy = camposSelecionados.filter(c => c.tabela.nome !== tabela.nome);
        setCamposSelecionados(camposSelecionadosCopy);
        setCamposAgrupados(camposAgrupados.filter(c => c.tabela.nome !== tabela.nome));
        setFiltros(filtros.filter(f => f.tabela.nome !== tabela.nome));
    }
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

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = {
            tabela: tabelas[0].tabela,
            tabelas: tabelas,
            camposSelecionados: camposSelecionados,
            filtros: filtros,
            orderBy: camposAgrupados,
            groupBy: camposAgrupados
        };
        console.log("Form Data:", formData);
        
    }
    return (
        <form className="flex flex-col gap-4 w-1/2 m-6">
            <>
                <label>
                    Tabelas:
                    <SelectTabela
                        tabelas={tabelas}
                        tabelasSelecionadas={tabelasSelecionadas}
                        onChange={(e) => {
                            const tabelaSelecionada = tabelas.find(t => t.nome === e.target.value);
                            const tabelasSelecionadasCopy = [...tabelasSelecionadas, tabelaSelecionada];
                            if (tabelaSelecionada && !tabelasSelecionadas.some(t => t.nome === tabelaSelecionada.nome)) {
                                setTabelasSelecionadas(tabelasSelecionadasCopy);
                            }
                            const tabelasComJuncao = Tabelas.filter(t =>
                                t.juncoes && t.juncoes.some(j =>
                                    tabelasSelecionadasCopy.some(ts => ts.tabela === j)
                                    &&
                                    !tabelasSelecionadasCopy.some(ts => ts.nome === t.nome)
                                )
                            );
                            setTabelas(tabelasComJuncao);
                            e.target.value = ""; // Reset select after selection
                            if (tabelasSelecionadasCopy) {
                                setCamposTabela(tabelasSelecionadasCopy.flatMap(t => t.colunas.map(c => ({ tabela: t, campo: c }))));
                            }
                        }}
                        onRemove={handleRemoveTabela}
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