export function arrayToCSV(columns: string[], data: any[][], delimiter = ',') {
  // cabeçalho
  const header = columns.join(delimiter);

  // linhas
  const lines = data.map(row =>
    row
      .map(value => {
        if (value == null) return '';          // null/undefined → vazio
        const str = String(value).replace(/"/g, '""'); // escapa aspas
        // se contiver delimitador, aspas ou quebras de linha → envolve em aspas
        return /[",\n]/.test(str) ? `"${str}"` : str;
      })
      .join(delimiter)
  );

  return [header, ...lines].join('\n');
}