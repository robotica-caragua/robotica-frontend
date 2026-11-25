// Utilitários compartilhados de busca, ordenação e paginação das listagens.

// Remove acentos e deixa em minúsculas para buscas mais tolerantes ("robotica" encontra "Robótica").
export const normalizar = (texto) =>
  String(texto ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()

// Verifica se algum dos campos contém o termo buscado.
export const correspondeBusca = (termo, ...campos) => {
  const termoNormalizado = normalizar(termo)
  if (!termoNormalizado) return true
  return campos.some((campo) => normalizar(campo).includes(termoNormalizado))
}

export const ordenacoes = [
  { valor: 'recentes', texto: 'Recentes' },
  { valor: 'curtidos', texto: 'Mais Curtidos' },
  { valor: 'alfabetica', texto: 'Ordem Alfabética' }
]

// Espera itens com `data` (ISO), `createdAt`/`updatedAt`, `id`, `curtidas` e `titulo`.
export const ordenar = (itens, criterio) => {
  const copia = [...itens]
  switch (criterio) {
    case 'curtidos':
      return copia.sort((a, b) => (b.curtidas || 0) - (a.curtidas || 0))
    case 'alfabetica':
      return copia.sort((a, b) =>
        String(a.titulo || '').localeCompare(String(b.titulo || ''), 'pt-BR')
      )
    case 'recentes':
    default:
      return copia.sort((a, b) => {
        const tB = new Date(b.updatedAt || b.createdAt || b.data || 0).getTime()
        const tA = new Date(a.updatedAt || a.createdAt || a.data || 0).getTime()
        if (tB !== tA) return tB - tA
        return Number(b.id || 0) - Number(a.id || 0)
      })
  }
}

export const paginar = (itens, pagina, porPagina) => {
  const indice = Math.max(1, Number(pagina) || 1)
  const tamanho = Math.max(1, Number(porPagina) || 1)
  return itens.slice((indice - 1) * tamanho, indice * tamanho)
}

// Valores únicos (ordenados) de um campo, para popular os selects de filtro.
export const opcoesUnicas = (itens, campo) =>
  [...new Set(itens.flatMap((item) => item[campo] ?? []))]
    .filter((valor) => valor !== undefined && valor !== null && String(valor).trim() !== '')
    .sort((a, b) => String(a).localeCompare(String(b), 'pt-BR'))
