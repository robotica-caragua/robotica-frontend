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
  }
}

export function limparSessao() {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(CHAVE_TOKEN)
  window.localStorage.removeItem(CHAVE_USUARIO)
  document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax'
}

async function tentarRenovarToken() {
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
  }
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

  if (resposta.status === 401 && autenticado && tentarRefresh && !caminho.startsWith('/auth/')) {
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

export function mapearTutorialDaApi(tutorial, imagemPadrao) {
  const dataIso = tutorial.updatedAt || tutorial.createdAt || new Date().toISOString()
  const dataFormatada = new Date(dataIso).toLocaleDateString('pt-BR')
  const listaMateriais = Array.isArray(tutorial.materialsNeeded) ? tutorial.materialsNeeded : []

  let imagemSalva = null
  if (typeof window !== 'undefined' && tutorial.id) {
    imagemSalva = window.localStorage.getItem(`foto_tutorial_${tutorial.id}`)
  }

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
    imagem: imagemSalva || tutorial.imageUrl || imagemPadrao,
    imagemUrl: imagemSalva || tutorial.imageUrl || '',
    visivel: true
  }
}

export function mapearProjetoDaApi(projeto, imagemPadrao) {
  const dataIso = projeto.updatedAt || projeto.createdAt || new Date().toISOString()
  const dataFormatada = new Date(dataIso).toLocaleDateString('pt-BR')

  let imagemSalva = null
  if (typeof window !== 'undefined' && projeto.id) {
    imagemSalva = window.localStorage.getItem(`foto_projeto_${projeto.id}`)
  }

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
    imagem: imagemSalva || projeto.imageUrl || imagemPadrao,
    destaque: true
  }
}

// ==========================================
// Endpoints de Autenticação (/auth/*)
// ==========================================
export const apiAuth = {
  async login({ email, password }) {
    const dados = await requisicaoApi('/auth/login', {
      method: 'POST',
      body: { email, password },
      autenticado: false
    })
    salvarSessao(dados)
    return dados
  },

  async loginGoogle(idToken) {
    const dados = await requisicaoApi('/auth/google', {
      method: 'POST',
      body: { idToken },
      autenticado: false
    })
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
      limparSessao()
    }
  },

  async me() {
    const dados = await requisicaoApi('/auth/me')
    if (dados?.user) {
      salvarSessao({ user: dados.user })
    }
    return dados.user
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
      return dados.tutorials || []
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
    tutorialUrl
  }) {
    const payload = {
      title,
      description,
      categoryId: Number(categoryId),
      difficulty,
      schoolId: Number(schoolId),
      materialsNeeded
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
    { title, description, categoryId, difficulty, schoolId, materialsNeeded, tutorialUrl }
  ) {
    const payload = {}
    if (title !== undefined) payload.title = title
    if (description !== undefined) payload.description = description
    if (categoryId !== undefined) payload.categoryId = Number(categoryId)
    if (difficulty !== undefined) payload.difficulty = difficulty
    if (schoolId !== undefined) payload.schoolId = Number(schoolId)
    if (materialsNeeded !== undefined) payload.materialsNeeded = materialsNeeded
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

// ==========================================
// Endpoints de Categorias (/categories)
// ==========================================
export const apiCategorias = {
  async listar() {
    return listarComVazioEm404(async () => {
      const dados = await requisicaoApi('/categories', { autenticado: false })
      return dados.categories || []
    })
  },

  async criar(name) {
    const dados = await requisicaoApi('/categories', {
      method: 'POST',
      body: { name }
    })
    return dados.category
  }
}

// ==========================================
// Endpoints de Escolas (/schools)
// ==========================================
export const apiEscolas = {
  async listar() {
    try {
      return await listarComVazioEm404(async () => {
        const dados = await requisicaoApi('/schools')
        return dados.schools || []
      })
    } catch (err) {
      // Se o usuário não for ADMIN (401/403), extrai dinamicamente as escolas vinculadas aos tutoriais públicos da API
      if (err?.status === 401 || err?.status === 403) {
        const tutoriais = await apiTutoriais.listar().catch(() => [])
        const mapa = new Map()
        for (const t of tutoriais) {
          if (t.school?.id && !mapa.has(t.school.id)) {
            mapa.set(t.school.id, t.school)
          }
        }
        return Array.from(mapa.values())
      }
      throw err
    }
  },

  async buscarPorId(id) {
    const dados = await requisicaoApi(`/schools/${id}`)
    return dados.school
  },

  async criar({ name, address }) {
    const dados = await requisicaoApi('/schools', {
      method: 'POST',
      body: { name, ...(address ? { address } : {}) }
    })
    return dados.school
  },

  async atualizar(id, { name, address }) {
    const dados = await requisicaoApi(`/schools/${id}`, {
      method: 'PUT',
      body: { ...(name ? { name } : {}), ...(address !== undefined ? { address } : {}) }
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
      return dados.users || []
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

  async criar({ name, email, password, role = 'TEACHER', schoolId }) {
    const payload = { name, email, password, role }
    if (schoolId) payload.schoolId = Number(schoolId)
    const dados = await requisicaoApi('/users', {
      method: 'POST',
      body: payload
    })
    return dados.user
  },

  async atualizar(id, campos) {
    const payload = { ...campos }
    if (payload.schoolId) payload.schoolId = Number(payload.schoolId)
    const dados = await requisicaoApi(`/users/${id}`, {
      method: 'PUT',
      body: payload
    })
    return dados.user
  },

  async excluir(id) {
    return requisicaoApi(`/users/${id}`, { method: 'DELETE' })
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

    try {
      return await listarComVazioEm404(async () => {
        const dados = await requisicaoApi(`/projects${queryString}`)
        return dados.projects || []
      })
    } catch (err) {
      // Se o visitante no portal público não estiver autenticado (401/403), usa os tutoriais públicos da API como vitrine de projetos
      if (err?.status === 401 || err?.status === 403) {
        const tutoriais = await apiTutoriais.listar(filtros).catch(() => [])
        return tutoriais.map((t) => ({
          id: t.id,
          name: t.title,
          description: t.description,
          schoolId: t.schoolId,
          school: t.school,
          categories: t.category?.name ? [t.category.name] : ['Robótica'],
          createdAt: t.createdAt,
          updatedAt: t.updatedAt
        }))
      }
      throw err
    }
  },

  async buscarPorId(id) {
    try {
      const dados = await requisicaoApi(`/projects/${id}`)
      return dados.project
    } catch (err) {
      if (err?.status === 401 || err?.status === 403) {
        const t = await apiTutoriais.buscarPorId(id)
        if (!t) throw err
        return {
          id: t.id,
          name: t.title,
          description: t.description,
          schoolId: t.schoolId,
          school: t.school,
          categories: t.category?.name ? [t.category.name] : ['Robótica'],
          createdAt: t.createdAt,
          updatedAt: t.updatedAt
        }
      }
      throw err
    }
  },

  async criar({ name, description, schoolId }) {
    const dados = await requisicaoApi('/projects', {
      method: 'POST',
      body: { name, description, schoolId: Number(schoolId) }
    })
    return dados.project
  },

  async atualizar(id, { name, description, schoolId }) {
    const payload = {}
    if (name !== undefined) payload.name = name
    if (description !== undefined) payload.description = description
    if (schoolId !== undefined) payload.schoolId = Number(schoolId)
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
