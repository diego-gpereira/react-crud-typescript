export function formatarData(dataISO: string): string {
  const data = new Date(dataISO);
  return data.toLocaleDateString('pt-BR', {
    // Adicionamos timeZone: 'UTC' para evitar que a data mude
    // dependendo do fuso horário do usuário.
    timeZone: 'UTC',
  });
}

export function formatarDataParaApi(data: string): string {
  if (!data) return '';
  const [ano, mes, dia] = data.split('-');
  return `${dia}/${mes}/${ano}`;
}