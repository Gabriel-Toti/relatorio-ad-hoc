
export function AdicionarCampo() {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl font-bold mb-4">Adicionar Campo</h1>
            <ul className="list-disc">
                <li>Selecione a tabela onde deseja adicionar o campo.</li>
                <li>Escolha o tipo de campo (string, number, etc.).</li>
                <li>Forneça uma descrição para o campo.</li>
                <li>Clique em "Adicionar Campo" para salvar.</li>
            </ul>
            <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
                Adicionar Campo
            </button>
        </div>
    );
}