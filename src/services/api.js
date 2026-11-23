'use client'

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333').replace(
  /\/+$/,
  ''
)

const CHAVE_TOKEN = 'biobot_access_token'
const CHAVE_USUARIO = 'biobot_user'

export function obterToken() {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(CHAVE_TOKEN)
}

export function obterUsuario() {
  if (typeof window === 'undefined') return null
  try {
    const bruto = window.localStorage.getItem(CHAVE_USUARIO)
    return bruto ? JSON.parse(bruto) : null
  } catch {
    return null
  }
}

export function salvarSessao({ accessToken, user }) {
  if (typeof window === 'undefined') return
  if (accessToken) {
    window.localStorage.setItem(CHAVE_TOKEN, accessToken)
    document.cookie = `token=${encodeURIComponent(accessToken)}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`
  }
  if (user) {
    window.localStorage.setItem(CHAVE_USUARIO, JSON.stringify(user))
    if (user.role) {
      document.cookie = `role=${encodeURIComponent(user.role)}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`
    }
  }
}

export function limparSessao() {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(CHAVE_TOKEN)
  window.localStorage.removeItem(CHAVE_USUARIO)
  document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax'
  document.cookie = 'role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax'
}

const ROTAS_AUTH_SEM_REFRESH = new Set([
  '/auth/login',
  '/auth/register',
  '/auth/google',
  '/auth/refresh',
  '/auth/logout',
  '/auth/forgot-password',
  '/auth/reset-password'
])

function caminoPermiteRefresh(caminho) {
  const limpo = String(caminho || '').split('?')[0]
  return !ROTAS_AUTH_SEM_REFRESH.has(limpo)
}

let promessaRefreshEmAndamento = null

async function tentarRenovarToken() {
  if (promessaRefreshEmAndamento) return promessaRefreshEmAndamento
  promessaRefreshEmAndamento = (async () => {
    try {
      const resposta = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include'
      })
      if (!resposta.ok) return null
      const dados = await resposta.json()
      if (dados?.accessToken) {
        salvarSessao({ accessToken: dados.accessToken, user: dados.user })
        return dados.accessToken
      }
      return null
    } catch {
      return null
    } finally {
      promessaRefreshEmAndamento = null
    }
  })()
  return promessaRefreshEmAndamento
}

export async function requisicaoApi(
  caminho,
  { method = 'GET', body, headers = {}, autenticado = true, tentarRefresh = true } = {}
) {
  const url = `${API_BASE_URL}${caminho.startsWith('/') ? caminho : `/${caminho}`}`
  const cabecalhos = { ...headers }

  if (body !== undefined && !cabecalhos['Content-Type']) {
    cabecalhos['Content-Type'] = 'application/json'
  }

  const token = autenticado ? obterToken() : null
  if (token) {
    cabecalhos.Authorization = `Bearer ${token}`
  }

  let resposta = await fetch(url, {
    method,
    headers: cabecalhos,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    credentials: 'include',
    cache: 'no-store'
  })

  if (resposta.status === 401 && autenticado && tentarRefresh && caminoPermiteRefresh(caminho)) {
    const novoToken = await tentarRenovarToken()
    if (novoToken) {
      cabecalhos.Authorization = `Bearer ${novoToken}`
      resposta = await fetch(url, {
        method,
        headers: cabecalhos,
        body: body !== undefined ? JSON.stringify(body) : undefined,
        credentials: 'include',
        cache: 'no-store'
      })
    }
  }

  const dados = await resposta.json().catch(() => ({}))

  if (!resposta.ok) {
    const erro = new Error(dados?.message || `Erro HTTP ${resposta.status}`)
    erro.status = resposta.status
    erro.dados = dados
    throw erro
  }

  return dados
}

async function listarComVazioEm404(fn) {
  try {
    return await fn()
  } catch (err) {
    if (err?.status === 404) return []
    throw err
  }
}

const mapaDificuldadeParaNivel = {
  EASY: 'Iniciante',
  MEDIUM: 'Intermediário',
  HARD: 'Avançado'
}

const mapaNivelParaDificuldade = {
  Iniciante: 'EASY',
  Intermediário: 'MEDIUM',
  Avançado: 'HARD'
}

export function converterDificuldadeParaNivel(difficulty) {
  return mapaDificuldadeParaNivel[difficulty] || difficulty || 'Iniciante'
}

export function converterNivelParaDificuldade(nivel) {
  return mapaNivelParaDificuldade[nivel] || 'MEDIUM'
}

export function arquivoParaDataUrl(arquivo) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error('Falha ao ler o arquivo de imagem.'))
    reader.readAsDataURL(arquivo)
  })
}

export function mapearTutorialDaApi(tutorial, imagemPadrao) {
  const dataIso = tutorial.updatedAt || tutorial.createdAt || new Date().toISOString()
  const dataFormatada = new Date(dataIso).toLocaleDateString('pt-BR')
  const listaMateriais = Array.isArray(tutorial.materialsNeeded) ? tutorial.materialsNeeded : []

  const listaImagens =
    Array.isArray(tutorial.images) && tutorial.images.length > 0
      ? tutorial.images
      : tutorial.imageUrl
        ? [tutorial.imageUrl]
        : []
  const capa = tutorial.imageUrl || listaImagens[0] || null

  return {
    id: tutorial.id,
    titulo: tutorial.title || 'Tutorial sem título',
    autor: tutorial.author || tutorial.school?.name || 'Professor(a) da Rede',
    descricao: tutorial.description || '',
    categoria: tutorial.category?.name || tutorial.categoria || 'Robótica Educacional',
    categoryId: tutorial.categoryId || tutorial.category?.id || null,
    nivel: converterDificuldadeParaNivel(tutorial.difficulty),
    difficulty: tutorial.difficulty || 'EASY',
    escola: tutorial.school?.name || tutorial.escola || 'Rede Municipal de Caraguatatuba',
    enderecoEscola: tutorial.school?.address || 'Caraguatatuba - SP',
    schoolId: tutorial.schoolId || tutorial.school?.id || null,
    materiais: listaMateriais.map((item, idx) =>
      typeof item === 'string' ? { id: idx + 1, nome: item, selecionado: false } : item
    ),
    materiaisTexto: listaMateriais.map((item) => (typeof item === 'string' ? item : item.nome)),
    tutorialUrl: tutorial.tutorialUrl || '',
    nomeVideo: tutorial.tutorialUrl || '',
    curtidas: tutorial.likes ?? 0,
    data: dataIso.slice(0, 10),
    createdAt: tutorial.createdAt || dataIso,
    updatedAt: tutorial.updatedAt || dataIso,
    infoData: `Atualizado em ${dataFormatada}`,
    status: tutorial.status || 'publicado',
    duracao: tutorial.duracao || '10:00',
    visualizacoes: tutorial.visualizacoes ?? 0,
    imagem: capa || imagemPadrao,
    imagemUrl: capa || '',
    imagens: listaImagens,
    visivel: true
  }
}

export function mapearProjetoDaApi(projeto, imagemPadrao) {
  const dataIso = projeto.updatedAt || projeto.createdAt || new Date().toISOString()
  const dataFormatada = new Date(dataIso).toLocaleDateString('pt-BR')

  const listaImagens =
    Array.isArray(projeto.images) && projeto.images.length > 0
      ? projeto.images
      : projeto.imageUrl
        ? [projeto.imageUrl]
        : []
  const capa = projeto.imageUrl || listaImagens[0] || null

  return {
    id: projeto.id,
    titulo: projeto.name || 'Projeto sem título',
    categorias: Array.isArray(projeto.categories)
      ? projeto.categories
      : [projeto.category?.name || projeto.school?.name || 'Robótica'],
    escola: projeto.school?.name || 'Rede Municipal de Caraguatatuba',
    enderecoEscola: projeto.school?.address || 'Caraguatatuba - SP',
    schoolId: projeto.schoolId || projeto.school?.id || null,
    equipe: projeto.team || projeto.school?.name || 'Equipe de Robótica',
    descricao: projeto.description || '',
    curtidas: projeto.likes ?? 0,
    data: dataIso.slice(0, 10),
    createdAt: projeto.createdAt || dataIso,
    updatedAt: projeto.updatedAt || dataIso,
    infoData: `Atualizado em ${dataFormatada}`,
    imagem: capa || imagemPadrao,
    imagemUrl: capa || '',
    imagens: listaImagens,
    destaque: true
  }
}

// ==========================================
// Endpoints de Autenticação (/auth/*)
// ==========================================
let promessaMeEmAndamento = null
let cacheMeRecente = { user: null, timestamp: 0 }

export const apiAuth = {
  async login({ email, password }) {
    const dados = await requisicaoApi('/auth/login', {
      method: 'POST',
      body: { email, password },
      autenticado: false
    })
    cacheMeRecente = { user: dados?.user || null, timestamp: Date.now() }
    salvarSessao(dados)
    return dados
  },

  async loginGoogle(idToken) {
    const dados = await requisicaoApi('/auth/google', {
      method: 'POST',
      body: { idToken },
      autenticado: false
    })
    cacheMeRecente = { user: dados?.user || null, timestamp: Date.now() }
    salvarSessao(dados)
    return dados
  },

  async registrar({ name, email, password, role, schoolId }) {
    const payload = { name, email, password }
    if (role) payload.role = role
    if (schoolId) payload.schoolId = Number(schoolId)
    return requisicaoApi('/auth/register', {
      method: 'POST',
      body: payload,
      autenticado: false
    })
  },

  async logout() {
    try {
      await requisicaoApi('/auth/logout', { method: 'POST', tentarRefresh: false })
    } finally {
      cacheMeRecente = { user: null, timestamp: 0 }
      limparSessao()
    }
  },

  async me({ forcar = false } = {}) {
    if (!forcar && cacheMeRecente.user && Date.now() - cacheMeRecente.timestamp < 2000) {
      return cacheMeRecente.user
    }
    if (!forcar && promessaMeEmAndamento) {
      return promessaMeEmAndamento
    }
    promessaMeEmAndamento = (async () => {
      try {
        const dados = await requisicaoApi('/auth/me')
        if (dados?.user) {
          cacheMeRecente = { user: dados.user, timestamp: Date.now() }
          salvarSessao({ user: dados.user })
        }
        return dados.user
      } finally {
        promessaMeEmAndamento = null
      }
    })()
    return promessaMeEmAndamento
  },

  async concluirOnboarding({ schoolId, roboticsGroupId }) {
    const payload = {}
    if (schoolId) payload.schoolId = Number(schoolId)
    if (roboticsGroupId) payload.roboticsGroupId = Number(roboticsGroupId)
    const dados = await requisicaoApi('/auth/onboarding', {
      method: 'POST',
      body: payload
    })
    salvarSessao(dados)
    return dados
  },

  async esqueciSenha(email) {
    return requisicaoApi('/auth/forgot-password', {
      method: 'POST',
      body: { email },
      autenticado: false
    })
  },

  async redefinirSenha({ token, password }) {
    return requisicaoApi('/auth/reset-password', {
      method: 'POST',
      body: { token, password },
      autenticado: false
    })
  }
}

// ==========================================
// Endpoints de Tutoriais (/tutorials)
// ==========================================
export const apiTutoriais = {
  async listar(filtros = {}) {
    return listarComVazioEm404(async () => {
      const params = new URLSearchParams()
      if (filtros.busca) params.append('search', filtros.busca)
      if (filtros.categoria) params.append('category', filtros.categoria)
      if (filtros.nivel) params.append('difficulty', converterNivelParaDificuldade(filtros.nivel))
      if (filtros.escola) params.append('school', filtros.escola)
      const queryString = params.toString() ? `?${params.toString()}` : ''

      const dados = await requisicaoApi(`/tutorials${queryString}`, { autenticado: false })
      return extrairLista(dados, ['tutorials'])
    })
  },

  async buscarPorId(id) {
    const dados = await requisicaoApi(`/tutorials/${id}`, { autenticado: false })
    return dados.tutorial
  },

  async criar({
    title,
    description,
    categoryId,
    difficulty,
    schoolId,
    materialsNeeded,
    tutorialUrl,
    imageUrl,
    images
  }) {
    const payload = {
      title,
      description,
      categoryId: Number(categoryId),
      difficulty,
      schoolId: Number(schoolId),
      materialsNeeded,
      ...(images !== undefined ? { images } : {}),
      ...(imageUrl !== undefined ? { imageUrl } : {})
    }
    if (tutorialUrl && /^https?:\/\//i.test(tutorialUrl)) {
      payload.tutorialUrl = tutorialUrl
    }
    const dados = await requisicaoApi('/tutorials', {
      method: 'POST',
      body: payload
    })
    return dados.tutorial
  },

  async atualizar(
    id,
    {
      title,
      description,
      categoryId,
      difficulty,
      schoolId,
      materialsNeeded,
      tutorialUrl,
      imageUrl,
      images
    }
  ) {
    const payload = {}
    if (title !== undefined) payload.title = title
    if (description !== undefined) payload.description = description
    if (categoryId !== undefined) payload.categoryId = Number(categoryId)
    if (difficulty !== undefined) payload.difficulty = difficulty
    if (schoolId !== undefined) payload.schoolId = Number(schoolId)
    if (materialsNeeded !== undefined) payload.materialsNeeded = materialsNeeded
    if (images !== undefined) payload.images = images
    if (imageUrl !== undefined) payload.imageUrl = imageUrl
    if (tutorialUrl && /^https?:\/\//i.test(tutorialUrl)) {
      payload.tutorialUrl = tutorialUrl
    }
    const dados = await requisicaoApi(`/tutorials/${id}`, {
      method: 'PUT',
      body: payload
    })
    return dados.tutorial
  },

  async excluir(id) {
    return requisicaoApi(`/tutorials/${id}`, { method: 'DELETE' })
  }
}

function extrairLista(dados, chaves = []) {
  if (Array.isArray(dados)) return dados
  if (!dados || typeof dados !== 'object') return []
  for (const chave of [...chaves, 'data', 'items', 'results']) {
    if (Array.isArray(dados[chave])) return dados[chave]
  }
  return []
}

// ==========================================
// Endpoints de Categorias (/categories)
// ==========================================
export const apiCategorias = {
  async listar() {
    let lista = []
    try {
      const dados = await requisicaoApi('/categories').catch(async (err) => {
        if (err?.status === 401 || err?.status === 403) {
          return await requisicaoApi('/categories', { autenticado: false })
        }
        throw err
      })
      lista = extrairLista(dados, ['categories'])
    } catch (err) {
      if (err?.status !== 404 && err?.status !== 401 && err?.status !== 403) {
        lista = []
      }
    }

    const mapa = new Map()
    for (const item of lista) {
      const nome = item?.name || item?.nome || item?.title
      if (!nome) continue
      const chave = item.id ?? nome.toLowerCase()
      if (!mapa.has(chave)) {
        mapa.set(chave, { ...item, id: item.id, name: nome })
      }
    }

    // Se /categories veio vazio, extrai categorias reais vinculadas aos tutoriais do banco
    if (mapa.size === 0) {
      const tutoriais = await apiTutoriais.listar().catch(() => [])
      for (const t of tutoriais) {
        const cat = t?.category
        const nome = cat?.name || t?.categoria
        if (!nome) continue
        const id = cat?.id ?? t?.categoryId
        const chave = id ?? nome.toLowerCase()
        if (!mapa.has(chave)) {
          mapa.set(chave, { id, name: nome })
        }
      }
    }

    return Array.from(mapa.values())
  },

  async criar(name) {
    const dados = await requisicaoApi('/categories', {
      method: 'POST',
      body: { name }
    })
    return dados.category || dados
  }
}

// ==========================================
// Endpoints de Escolas (/schools)
// ==========================================
function normalizarEscola(esc) {
  return {
    ...esc,
    id: esc.id,
    name: esc.name,
    address: esc.address || esc.endereco || '',
    description: esc.description || ''
  }
}

export const apiEscolas = {
  // Todas as escolas cadastradas (ADMIN usa /schools; demais perfis usam /public/schools).
  // Sem dados mockados: se a API não retornar nada, a lista é vazia.
  async listar() {
    let lista = []
    try {
      const dados = await requisicaoApi('/schools')
      lista = extrairLista(dados, ['schools'])
    } catch (err) {
      if (err?.status === 401 || err?.status === 403 || err?.status === 404) {
        const dadosPublicos = await requisicaoApi('/public/schools', {
          autenticado: false
        }).catch(() => null)
        lista = extrairLista(dadosPublicos, ['schools'])
      }
    }
    return lista
      .filter((esc) => esc?.id !== null && esc?.id !== undefined && esc?.name)
      .map(normalizarEscola)
  },

  // Escolas às quais o usuário logado está vinculado (relação N:N retornada por /auth/me).
  // É a única fonte para os seletores de escola de Projetos e Tutoriais.
  // Administradores não possuem vínculo escolar: para eles, todas as escolas cadastradas.
  async listarDoUsuarioLogado() {
    const usuario = (await apiAuth.me().catch(() => null)) || obterUsuario()
    if (!usuario) return []
    if (usuario.role === 'ADMIN') return apiEscolas.listar()

    const mapa = new Map()
    const adicionar = (esc) => {
      const obj = esc?.school || esc
      if (!obj?.id || !obj?.name) return
      mapa.set(Number(obj.id), normalizarEscola(obj))
    }

    if (Array.isArray(usuario.schools)) {
      usuario.schools.forEach(adicionar)
    }
    if (usuario.school) {
      adicionar(usuario.school)
    }

    // Se a relação N:N veio vazia ou há apenas schoolId legado, consulta /users/:id/school
    if (
      (mapa.size === 0 || (usuario.schoolId && !mapa.has(Number(usuario.schoolId)))) &&
      usuario.id
    ) {
      const escolasEndpoint = await apiUsuarios.buscarEscolasDoUsuario(usuario.id).catch(() => [])
      for (const esc of Array.isArray(escolasEndpoint) ? escolasEndpoint : []) {
        adicionar(esc)
      }
      if (usuario.schoolId && !mapa.has(Number(usuario.schoolId))) {
        const todas = await apiEscolas.listar().catch(() => [])
        const encontrada = todas.find((e) => Number(e.id) === Number(usuario.schoolId))
        if (encontrada) adicionar(encontrada)
      }
    }

    return Array.from(mapa.values())
  },

  async buscarPorId(id) {
    const dados = await requisicaoApi(`/schools/${id}`)
    return dados.school
  },

  async criar({ name, address, description }) {
    const dados = await requisicaoApi('/schools', {
      method: 'POST',
      body: {
        name,
        ...(address ? { address } : {}),
        ...(description ? { description } : {})
      }
    })
    return dados.school
  },

  async atualizar(id, { name, address, description }) {
    const dados = await requisicaoApi(`/schools/${id}`, {
      method: 'PUT',
      body: {
        ...(name ? { name } : {}),
        ...(address !== undefined ? { address } : {}),
        ...(description !== undefined ? { description } : {})
      }
    })
    return dados.school
  },

  async excluir(id) {
    return requisicaoApi(`/schools/${id}`, { method: 'DELETE' })
  }
}

// ==========================================
// Endpoints de Usuários (/users)
// ==========================================
export const apiUsuarios = {
  async listar() {
    return listarComVazioEm404(async () => {
      const dados = await requisicaoApi('/users')
      return extrairLista(dados, ['users'])
    })
  },

  async buscarPorId(id) {
    const dados = await requisicaoApi(`/users/${id}`)
    return dados.user
  },

  async buscarEscolaDoUsuario(id) {
    const dados = await requisicaoApi(`/users/${id}/school`)
    return dados.school?.school || dados.school
  },

  async buscarEscolasDoUsuario(id) {
    const dados = await requisicaoApi(`/users/${id}/school`)
    if (Array.isArray(dados?.schools)) return dados.schools
    const unica = dados?.school?.school || dados?.school
    return unica ? [unica] : []
  },

  async criar({ name, email, password, role = 'TEACHER', perfil, matricula, schoolId, schoolIds }) {
    const payload = { name, email, password, role }
    if (perfil !== undefined) payload.perfil = perfil
    if (matricula !== undefined) payload.matricula = matricula
    if (Array.isArray(schoolIds)) payload.schoolIds = schoolIds.map(Number)
    else if (schoolId) payload.schoolId = Number(schoolId)
    const dados = await requisicaoApi('/users', {
      method: 'POST',
      body: payload
    })
    return dados.user
  },

  async atualizar(id, campos) {
    const payload = { ...campos }
    if (Array.isArray(payload.schoolIds)) payload.schoolIds = payload.schoolIds.map(Number)
    if (payload.schoolId) payload.schoolId = Number(payload.schoolId)
    const dados = await requisicaoApi(`/users/${id}`, {
      method: 'PUT',
      body: payload
    })
    cacheMeRecente = { user: null, timestamp: 0 }
    return dados.user
  },

  async excluir(id) {
    return requisicaoApi(`/users/${id}`, { method: 'DELETE' })
  }
}

// ==========================================
// Endpoints de Avisos da Administração (/announcements)
// ==========================================
export const apiAvisos = {
  async listar() {
    return listarComVazioEm404(async () => {
      const dados = await requisicaoApi('/announcements')
      return extrairLista(dados, ['announcements'])
    })
  },

  async criar({ title, message }) {
    const dados = await requisicaoApi('/announcements', {
      method: 'POST',
      body: { title, message }
    })
    return dados.announcement
  },

  async excluir(id) {
    return requisicaoApi(`/announcements/${id}`, { method: 'DELETE' })
  }
}

// ==========================================
// Endpoints de Projetos (/projects)
// ==========================================
export const apiProjetos = {
  async listar(filtros = {}) {
    const params = new URLSearchParams()
    if (filtros.busca) params.append('search', filtros.busca)
    if (filtros.categoria) params.append('category', filtros.categoria)
    if (filtros.escola) params.append('school', filtros.escola)
    const queryString = params.toString() ? `?${params.toString()}` : ''

    return listarComVazioEm404(async () => {
      const dados = await requisicaoApi(`/projects${queryString}`).catch(async (err) => {
        if (err?.status === 401 || err?.status === 403) {
          return await requisicaoApi(`/public/projects${queryString}`, { autenticado: false })
        }
        throw err
      })
      return extrairLista(dados, ['projects'])
    })
  },

  async buscarPorId(id) {
    const dados = await requisicaoApi(`/projects/${id}`).catch(async (err) => {
      if (err?.status === 401 || err?.status === 403) {
        return await requisicaoApi(`/public/projects/${id}`, { autenticado: false })
      }
      throw err
    })
    return dados.project
  },

  async criar({ name, description, schoolId, images, imageUrl }) {
    const dados = await requisicaoApi('/projects', {
      method: 'POST',
      body: {
        name,
        description,
        schoolId: Number(schoolId),
        ...(images !== undefined ? { images } : {}),
        ...(imageUrl !== undefined ? { imageUrl } : {})
      }
    })
    return dados.project
  },

  async atualizar(id, { name, description, schoolId, images, imageUrl }) {
    const payload = {}
    if (name !== undefined) payload.name = name
    if (description !== undefined) payload.description = description
    if (schoolId !== undefined) payload.schoolId = Number(schoolId)
    if (images !== undefined) payload.images = images
    if (imageUrl !== undefined) payload.imageUrl = imageUrl
    const dados = await requisicaoApi(`/projects/${id}`, {
      method: 'PUT',
      body: payload
    })
    return dados.project
  },

  async excluir(id) {
    return requisicaoApi(`/projects/${id}`, { method: 'DELETE' })
  }
}

// ==========================================
// Endpoints de Eventos (/events)
// ==========================================
const mesesCurtos = [
  'JAN',
  'FEV',
  'MAR',
  'ABR',
  'MAI',
  'JUN',
  'JUL',
  'AGO',
  'SET',
  'OUT',
  'NOV',
  'DEZ'
]

const mesesLongos = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro'
]

export function mapearEventoDaApi(evento) {
  if (!evento) return null
  const dataRaw = String(evento.date || '').trim()
  let dataCurta = dataRaw
  let dataLonga = dataRaw

  const matchIso = dataRaw.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (matchIso) {
    const [, ano, mesStr, dia] = matchIso
    const mesIdx = Math.max(0, Math.min(11, Number(mesStr) - 1))
    dataCurta = `${dia} ${mesesCurtos[mesIdx]}`
    dataLonga = `${dia} de ${mesesLongos[mesIdx]} de ${ano}`
  }

  const prefixoSelo =
    evento.registration === 'fechadas'
      ? 'INSCRIÇÕES ENCERRADAS'
      : evento.type
        ? String(evento.type).toUpperCase()
        : 'PRÓXIMO EVENTO'

  const agenda = Array.isArray(evento.agenda)
    ? evento.agenda.filter((a) => a && (a.horario?.trim() || a.titulo?.trim()))
    : []

  const documentos = Array.isArray(evento.documents)
    ? evento.documents.filter((d) => d && d.nome?.trim())
    : []

  return {
    id: evento.id,
    titulo: evento.title || 'Evento da Rede',
    tipo: evento.type || 'torneio',
    descricao: evento.description || '',
    dataIso: matchIso ? `${matchIso[1]}-${matchIso[2]}-${matchIso[3]}` : dataRaw,
    data: dataLonga || 'Data a definir',
    etiquetaData: dataCurta ? `${prefixoSelo} • ${dataCurta}` : prefixoSelo,
    horario: evento.time || '',
    local: evento.location || evento.school?.name || 'Rede Municipal de Caraguatatuba',
    inscricoes: evento.registration || 'abertas',
    status: evento.status || 'agendado',
    agenda,
    documentos,
    schoolId: evento.schoolId || null,
    linkUrl: `/detalhesEvento?id=${evento.id}`
  }
}

export const apiEventos = {
  async listar() {
    return listarComVazioEm404(async () => {
      const dados = await requisicaoApi('/events', { autenticado: false })
      return dados.events || []
    })
  },

  async buscarPorId(id) {
    const dados = await requisicaoApi(`/events/${id}`, { autenticado: false })
    return dados.event
  },

  async criar(payload) {
    const dados = await requisicaoApi('/events', {
      method: 'POST',
      body: payload
    })
    return dados.event
  },

  async atualizar(id, payload) {
    const dados = await requisicaoApi(`/events/${id}`, {
      method: 'PUT',
      body: payload
    })
    return dados.event
  },

  async excluir(id) {
    return requisicaoApi(`/events/${id}`, { method: 'DELETE' })
  }
}
