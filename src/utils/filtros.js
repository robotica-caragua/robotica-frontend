// Utilitários compartilhados de busca, ordenação e paginação das listagens.

// Remove acentos e deixa em minúsculas para buscas mais tolerantes ("robotica" encontra "Robótica").
export const normalizar = (texto = '') =>
  texto
    .toString()
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
  { valor: 'alfabetica', texto: 'Ordem Alfabética' }
]

// Espera itens com `data` (ISO), `createdAt`/`updatedAt`, `id` e `titulo`.
export const ordenar = (itens, criterio) => {
  const copia = [...itens]
  switch (criterio) {
    case 'alfabetica':
      return copia.sort((a, b) => a.titulo.localeCompare(b.titulo, 'pt-BR'))
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

export const paginar = (itens, pagina, porPagina) =>
  itens.slice((pagina - 1) * porPagina, pagina * porPagina)

// Valores únicos (ordenados) de um campo, para popular os selects de filtro.
export const opcoesUnicas = (itens, campo) =>
  [...new Set(itens.flatMap((item) => item[campo]))].sort((a, b) => a.localeCompare(b, 'pt-BR'))
