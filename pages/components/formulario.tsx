import {useState} from 'react';
import {Tabelas, ITabela, IColuna} from '../../utils/tables';
//import axios from "axios";

enum Operacao {
    Menor = "<",
    MenorOuIgual = "<=",
    Maior = ">",
    MaiorOuIgual = ">=",
    Diferente = "!=",
    Igual = "=="
}

enum Agregacao {
    Soma = "sum",
    Contagem = "count",
    Minimo = "min",
    Maximo = "max",
    Media = "avg"
}

interface IFiltro {
    tabela: ITabela,
    campo: ICampo,
    operacao: Operacao | string,
    valor: string
}

interface IAgregacao {
    tabela: ITabela,
    campo: ICampo,
    operacao: Operacao | string,
    alias: string
}

interface ICampo {
    tabela: ITabela,
    campo: IColuna
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
        <select
                className="table-form"
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
        </select>
        <table className="table-form w-1/1">
            <thead className='bg-gray-200'>
            <tr>
                <th className="table-form">Nome</th>
                <th className="table-form">Descrição</th>
                <th className="table-form">Tabela</th>
                <th className="table-form"></th>
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
                            className="table-form mx-auto bg-red-500 font-bold text-white"
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                onRemove(tabela);
                            }}
                        >
                            x
                        </button>
                    )}
                </td>
                </tr>
            ))}
            </tbody>
        </table>
    </>);
}

function SelectCampos({campos, camposSelecionados, camposAgrupados, onChangeSelect, onChangeGroup}) {
    campos.map(campo => {
        if (!camposSelecionados.includes(campo)) {
            console.log("n tem campo", campo);
        } 
    });
    return (<table className={"table-form"}>
                <thead className='bg-gray-200'>
                    <tr>
                        <th className="table-form">Tabela</th>
                        <th className="table-form">Campo</th>
                        <th className="table-form">Selecionar</th>
                        <th className="table-form">Agregar</th>
                    </tr>
                </thead>
                <tbody>
                    {campos.map((campo, index) => (
                        <tr key={index}>
                            <td className="table-form">{campo.tabela.nome}</td>
                            <td className="table-form">{campo.campo.descricao}</td>
                            <td className="table-form">
                                <input
                                    type="checkbox"
                                    onChange={(e) => onChangeSelect(campo,e)}
                                    checked={camposSelecionados.some(
                                        (element) =>
                                            element.tabela.nome === campo.tabela.nome &&
                                            element.campo.nome === campo.campo.nome
                                    )}
                                />
                            </td>
                            <td className="table-form">
                                <input
                                    type="checkbox"
                                    onChange={(e) => onChangeGroup(campo,e)}
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
                <thead className='bg-gray-200'>
                    <tr>
                        <th className="table-form">Tabela</th>
                        <th className="table-form">Campo</th>
                        <th className="table-form mx-auto">Ascendente</th>
                        <th className="table-form mx-auto">Descendente</th>
                    </tr>
                </thead>
                <tbody>
                    {campos.map((campo, index) => (
                        <tr key={index}>
                            <td className="table-form">{campo.tabela.nome}</td>
                            <td className="table-form">{campo.campo.descricao}</td>
                            <td className="table-form">
                                <input type="radio" name={`order`} value="Ascendente" /> 
                                <label> Ascencente</label>
                            </td>
                            <td className="table-form">
                                <input type="radio" name={`order`} value="Descendente" /> 
                                <label> Descendente</label>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
    )
}

function SelectFiltro({filtros, camposSelecionados, tabelas}){
    const [buttonOn, setButtonOn] = useState<boolean[]>([]);
    const [filtrosState, setFiltrosState] = useState<IFiltro[]>(filtros || []);

    function novoFiltro() {
        const existeLinhaPendente = buttonOn.includes(false);

        if (existeLinhaPendente || camposSelecionados.length === 0) {
            return;
        }
        const campo = camposSelecionados[0];
        const tabela = campo.tabela

        setFiltrosState([
            ...filtrosState,
            {
                tabela: tabela,
                campo: campo.campo,
                operacao: Agregacao.Soma,
                valor: campo.campo
            }
        ]);

        setButtonOn([...buttonOn, false]);
    }

    function handleAdicionarFiltro(index: number) {

        //lógica de salvar os dados para usar na geração do relatório
        setButtonOn(prev => {
            const newState = [...prev];
            newState[index] = true;
            return newState;
        });
    }

    function handleDeletarFiltro(idx)
    {
        //lógica de apagar os dados salvos para usar na geração do relatório
        setFiltrosState(prev => prev.filter((_, i) => i !== idx));
        setButtonOn(prev => prev.filter((_, i) => i !== idx));
    }

    return(<table>
        <thead className='bg-gray-200'>
            <tr>
                <th className="table-form w-1/5">Tabela</th>
                <th className="table-form w-1/5">Campo</th>
                <th className="table-form w-1/5">Categoria</th>
                <th className="table-form w-1/5">Operação</th>
                <th className="table-form w-1/5">Valor</th>
                <th className="table-form w-1/5">
                <button className='table-form bg-black font-bold text-white w-full' type='button' onClick={novoFiltro}>Novo</button>
                </th>
            </tr>
        </thead>
        <tbody>
            {filtrosState.map((filtro, index) => (
                <tr key={index}>
                    <td className="table-form">
                        <select
                            className="table-form w-full"
                            defaultValue={""}
                            onChange={(e) => {
                                const nomeCampoSelecionado = e.target.value;
                                const campoSelecionado = camposSelecionados.find(c => c.tabela.nome === nomeCampoSelecionado);

                                if (!campoSelecionado) return;

                                setFiltrosState(prev => {
                                    const novosFiltros = [...prev];
                                    novosFiltros[index] = {
                                        ...novosFiltros[index],
                                        tabela: campoSelecionado.tabela,
                                        campo: undefined
                                    };
                                    return novosFiltros;
                                });
                            }}
                        >
                            <option value="" disabled>Selecione</option>
                            {camposSelecionados.map((campoObj, i) => (
                                <option key={i} value={campoObj.campo.nome}>
                                    {campoObj.tabela.nome}
                                </option>
                            ))}
                        </select>
                    </td>
                    <td className="table-form">
                        <select
                            className="table-form w-full"
                            defaultValue={""}
                            onChange={(e) => {
                                const nomeCampoSelecionado = e.target.value;
                                const campoSelecionado = camposSelecionados.find(c => c.campo.nome === nomeCampoSelecionado);

                                if (!campoSelecionado) return;

                                setFiltrosState(prev => {
                                    const novosFiltros = [...prev];
                                    novosFiltros[index] = {
                                        ...novosFiltros[index],
                                        campo: campoSelecionado.campo
                                    };
                                    return novosFiltros;
                                });
                            }}
                            disabled={!filtro.tabela}
                        >
                            <option value="" disabled>Selecione</option>
                            {camposSelecionados.map((campoObj, i) => (
                                <option key={i} value={campoObj.campo.nome}>
                                    {campoObj.campo.descricao}
                                </option>
                            ))}
                        </select>
                    </td>
                    <td className="table-form">
                        <select
                            className="table-form w-full"
                            defaultValue={""}
                            onChange={(e) => {
                                const nomeCampoSelecionado = e.target.value;
                                const campoSelecionado = camposSelecionados.find(c => c.campo.nome === nomeCampoSelecionado);

                                if (!campoSelecionado) return;

                                setFiltrosState(prev => {
                                    const novosFiltros = [...prev];
                                    novosFiltros[index] = {
                                        ...novosFiltros[index],
                                        campo: campoSelecionado.campo
                                    };
                                    return novosFiltros;
                                });
                            }}
                            disabled={!filtro.tabela}
                        >
                            <option value="" disabled>Selecione</option>
                            {camposSelecionados.map((campoObj, i) => (
                                <option key={i} value={campoObj.campo.nome}>
                                    {campoObj.campo.descricao}
                                </option>
                            ))}
                        </select>
                    </td>
                    <td className="table-form text-center">
                        <SelectArray array={["<", "<=", ">", ">=", "!=", "=="]} 
                            defaultValue={filtro.operacao} 
                            onChange={
                                (e) => {
                                    const novaOP = e.target.value;
                                }
                            }
                        />
                        </td>
                    <td className="table-form w-max">
                        <input className="table-form w-full"/>
                    </td>
                    <td className="table-form">
                        {buttonOn[index] ? (
                            <button
                                type="button"
                                className="table-form bg-red-500 font-bold text-white w-1/1"
                                onClick={() => handleDeletarFiltro(index)}
                            >
                                Deletar
                            </button>
                            ) : (
                            <button 
                                type="button" 
                                className="table-form bg-black font-bold text-white w-1/1" 
                                onClick={() => handleAdicionarFiltro(index)}
                                >
                                Adicionar
                            </button>
                        )}
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
)
}

function SelectAgregation({filtros, camposSelecionados, tabelas}){
    const [buttonOn, setButtonOn] = useState<boolean[]>([]);
    const [agregacoes, setAgregacoes] = useState<IAgregacao[]>(filtros || []);

    function novaAgregacao() {
        const existeLinhaPendente = buttonOn.includes(false);

        if (existeLinhaPendente || camposSelecionados.length === 0) {
            return;
        }
        const campo = camposSelecionados[0];
        const tabela = campo.tabela

        setAgregacoes([
            ...agregacoes,
            {
                tabela: tabela,
                campo: campo.campo,
                operacao: Operacao.Igual,
                alias: ""
            }
        ]);

        setButtonOn([...buttonOn, false]);
    }

    function handleAdicionarAgregacao(index: number) {

        //lógica de salvar os dados para usar na geração do relatório
        setButtonOn(prev => {
            const newState = [...prev];
            newState[index] = true;
            return newState;
        });
    }

    function handleDeletarAgregacao(idx)
    {
        //lógica de apagar os dados salvos para usar na geração do relatório
        setAgregacoes(prev => prev.filter((_, i) => i !== idx));
        setButtonOn(prev => prev.filter((_, i) => i !== idx));
    }

    return(<table>
        <thead className='bg-gray-200'>
            <tr>
                <th className="table-form">Tabela</th>
                <th className="table-form">Campo</th>
                <th className="table-form">Operação</th>
                <th className="table-form">
                    <button 
                        className='table-form bg-black font-bold text-white w-full' 
                        onClick={() => novaAgregacao()}
                        type='button'
                    >
                        Novo
                    </button>
                </th>
            </tr>
        </thead>
        <tbody>
            {agregacoes.map((filtro, index) => (
                <tr key={index}>
                    <td className="table-form">
                        <select
                            className="table-form w-full"
                            defaultValue={""}
                            onChange={(e) => {
                                const nomeCampoSelecionado = e.target.value;
                                const campoSelecionado = camposSelecionados.find(c => c.tabela.nome === nomeCampoSelecionado);

                                if (!campoSelecionado) return;

                                setAgregacoes(prev => {
                                    const novosFiltros = [...prev];
                                    novosFiltros[index] = {
                                        ...novosFiltros[index],
                                        tabela: campoSelecionado.tabela,
                                        campo: undefined
                                    };
                                    return novosFiltros;
                                });
                            }}
                        >
                            <option value="" disabled>Selecione</option>
                            {camposSelecionados.map((campoObj, i) => (
                                <option key={i} value={campoObj.campo.nome}>
                                    {campoObj.tabela.nome}
                                </option>
                            ))}
                        </select>
                    </td>
                    <td className="table-form">
                        <select
                            className="table-form w-full"
                            defaultValue={""}
                            onChange={(e) => {
                                const nomeCampoSelecionado = e.target.value;
                                const campoSelecionado = camposSelecionados.find(c => c.campo.nome === nomeCampoSelecionado);

                                if (!campoSelecionado) return;

                                setAgregacoes(prev => {
                                    const novosFiltros = [...prev];
                                    novosFiltros[index] = {
                                        ...novosFiltros[index],
                                        campo: campoSelecionado.campo
                                    };
                                    return novosFiltros;
                                });
                            }}
                            disabled={!filtro.tabela}
                        >
                            <option value="" disabled>Selecione</option>
                            {camposSelecionados.map((campoObj, i) => (
                                <option key={i} value={campoObj.campo.nome}>
                                    {campoObj.campo.descricao}
                                </option>
                            ))}
                        </select>
                    </td>
                    <td className="table-form text-center">
                        <SelectArray array={["sum", "count", "min", "max"]} 
                            defaultValue={filtro.operacao} 
                            onChange={
                                (e) => {
                                    const novaOP = e.target.value;

                                    setAgregacoes(prev => {
                                        const novosFiltros = [...prev];
                                        novosFiltros[index] = {
                                            ...novosFiltros[index],
                                            operacao: novaOP
                                        };
                                        return novosFiltros;
                                    });
                                }
                            }
                        />
                    </td>
                    <td className="table-form">
                        {buttonOn[index] ? (
                            <button
                                type="button"
                                className="table-form bg-red-500 font-bold text-white w-1/1"
                                onClick={() => handleDeletarAgregacao(index)}
                            >
                                Deletar
                            </button>
                            ) : (
                            <button 
                                type="button" 
                                className="table-form bg-black font-bold text-white w-1/1" 
                                onClick={() => handleAdicionarAgregacao(index)}
                                >
                                Adicionar
                            </button>
                        )}
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

    function handleReport() {
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

    function getCamposTabela(){}
    function handleReportGraphic(){}
    function handleReset(){}

    return (
        <div className='general'>
        <form className="flex flex-col gap-4 mx-full">

            <label>Tabelas:</label>
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
                                tabelasSelecionadasCopy.some(ts => ts.tabela === j.tabelaDe || ts.tabela === j.tabelaPara)
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

            <label>Selecionar campos:</label>
            <SelectCampos
                campos={camposTabela}
                onChangeSelect={(campo, e) => {
                    if (e.target.checked) {
                        setCamposSelecionados([...camposSelecionados, campo]);
                    } else {
                        setCamposSelecionados(camposSelecionados.filter(
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

            <label>Filtros:</label>
            <SelectFiltro filtros={filtros} camposSelecionados={camposSelecionados} tabelas={tabelas}/>

            <label>Agregações:</label>
            <SelectAgregation filtros={filtros} camposSelecionados={camposSelecionados} tabelas={tabelas}/>

            <table className='gap-4 mx-auto flex'>
                    <td className=''>
                        <button
                            className="table-form bg-black font-bold text-white w-1/1"
                            onClick={() => handleReport()}
                            type='button'
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
                    <td>
                        <button
                            type="button"
                            className="table-form bg-black font-bold text-white w-1/1"
                            onClick={() => handleReset()}
                        >
                            Limpar Formulário
                        </button>
                    </td>
                </table>
        </form>
        </div>
    );
}