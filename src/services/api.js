'use client'

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333').replace(
  /\/+$/,
  ''
)

const CHAVE_TOKEN = 'biobot_access_token'
const CHAVE_USUARIO = 'biobot_user'
const CHAVE_USUARIOS_INATIVOS = 'usuarios_inativos_biobot'
const CHAVE_ESCOLAS_INATIVAS = 'escolas_inativas_biobot'
const CHAVE_USUARIOS_META = 'biobot_usuarios_meta'
const CHAVE_AVISOS_FALLBACK = 'biobot_avisos_fallback'
const CHAVE_EVENTOS_FALLBACK = 'biobot_eventos_fallback'
const CHAVE_ESCOLAS_DB_CACHE = 'biobot_escolas_db_cache'
const CHAVE_PROJETOS_EXTRA = 'biobot_projetos_extra'
const CHAVE_TUTORIAIS_EXTRA = 'biobot_tutoriais_extra'
const CHAVE_SOLICITACOES_VINCULO = 'biobot_solicitacoes_vinculo'
const CHAVE_CONTATOS_RECEBIDOS = 'biobot_contatos_recebidos'

function lerJsonLocal(chave, padrao) {
  if (typeof window === 'undefined') return padrao
  try {
    const bruto = window.localStorage.getItem(chave)
    return bruto ? JSON.parse(bruto) : padrao
  } catch {
    return padrao
  }
}

function salvarJsonLocal(chave, valor) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(chave, JSON.stringify(valor))
  } catch {}
}

export function lerIdsUsuariosInativos() {
  const lista = lerJsonLocal(CHAVE_USUARIOS_INATIVOS, [])
  return new Set(Array.isArray(lista) ? lista.map(Number).filter(Boolean) : [])
}

export function salvarIdsUsuariosInativos(conjuntoIds) {
  salvarJsonLocal(CHAVE_USUARIOS_INATIVOS, Array.from(conjuntoIds))
}

export function lerIdsEscolasInativas() {
  const lista = lerJsonLocal(CHAVE_ESCOLAS_INATIVAS, [])
  return new Set(Array.isArray(lista) ? lista.map(Number).filter(Boolean) : [])
}

export function salvarIdsEscolasInativas(conjuntoIds) {
  salvarJsonLocal(CHAVE_ESCOLAS_INATIVAS, Array.from(conjuntoIds))
}

function lerMetaUsuarios() {
  const mapa = lerJsonLocal(CHAVE_USUARIOS_META, {})
  return mapa && typeof mapa === 'object' ? mapa : {}
}

function salvarMetaUsuario(user, extra = {}) {
  if (typeof window === 'undefined') return
  const mapa = lerMetaUsuarios()
  const id = user?.id ?? extra?.id
  const email = String(user?.email ?? extra?.email ?? '')
    .trim()
    .toLowerCase()
  const chaveId = id ? `id:${Number(id)}` : null
  const chaveEmail = email ? `email:${email}` : null
  const existente = (chaveId && mapa[chaveId]) || (chaveEmail && mapa[chaveEmail]) || {}

  const schoolIds = Array.isArray(extra.schoolIds)
    ? extra.schoolIds.map(Number).filter(Boolean)
    : Array.isArray(user?.schools) && user.schools.length > 0
      ? user.schools.map((s) => Number(s?.id || s)).filter(Boolean)
      : extra.schoolId
        ? [Number(extra.schoolId)]
        : user?.schoolId
          ? [Number(user.schoolId)]
          : existente.schoolIds || []

  const registro = {
    ...existente,
    ...(id ? { id: Number(id) } : {}),
    ...(email ? { email } : {}),
    ...(extra.name || user?.name ? { name: extra.name || user?.name } : {}),
    ...(extra.role || user?.role ? { role: extra.role || user?.role } : {}),
    ...(extra.perfil || user?.perfil ? { perfil: extra.perfil || user?.perfil } : {}),
    ...(extra.matricula !== undefined
      ? { matricula: extra.matricula }
      : user?.matricula !== undefined
        ? { matricula: user.matricula }
        : {}),
    schoolIds
  }

  if (chaveId) mapa[chaveId] = registro
  if (chaveEmail) mapa[chaveEmail] = registro
  salvarJsonLocal(CHAVE_USUARIOS_META, mapa)
}

function removerMetaUsuario(id, email) {
  if (typeof window === 'undefined') return
  const mapa = lerMetaUsuarios()
  if (id) delete mapa[`id:${Number(id)}`]
  if (email) delete mapa[`email:${String(email).trim().toLowerCase()}`]
  salvarJsonLocal(CHAVE_USUARIOS_META, mapa)
}

function enriquecerUsuarioComMeta(user, listaEscolas = []) {
  if (!user || typeof user !== 'object') return user
  const mapa = lerMetaUsuarios()
  const email = String(user.email || '')
    .trim()
    .toLowerCase()
  const meta = (user.id && mapa[`id:${Number(user.id)}`]) || (email && mapa[`email:${email}`]) || {}

  const roleFinal =
    meta.role === 'ADMIN' || meta.perfil === 'ADMINISTRADOR' || user.role === 'ADMIN'
      ? 'ADMIN'
      : user.role || meta.role || 'TEACHER'
  const perfilFinal = roleFinal === 'ADMIN' ? 'ADMINISTRADOR' : 'PROFESSOR'

  const idsEscolas = new Set([
    ...(Array.isArray(user.schools) ? user.schools.map((s) => Number(s?.id)) : []),
    ...(user.schoolId ? [Number(user.schoolId)] : []),
    ...(Array.isArray(meta.schoolIds) ? meta.schoolIds.map(Number) : [])
  ])
  idsEscolas.delete(0)
  idsEscolas.delete(NaN)

  const mapaEscolas = new Map()
  if (Array.isArray(listaEscolas)) {
    for (const esc of listaEscolas) {
      if (esc?.id) mapaEscolas.set(Number(esc.id), esc)
    }
  }
  if (Array.isArray(user.schools)) {
    for (const esc of user.schools) {
      if (esc?.id) mapaEscolas.set(Number(esc.id), esc)
    }
  }

  const schoolsFinal =
    roleFinal === 'ADMIN'
      ? []
      : Array.from(idsEscolas)
          .map((sid) => mapaEscolas.get(Number(sid)) || { id: Number(sid), name: '' })
          .filter((s) => s.id)

  const schoolIdFinal =
    roleFinal === 'ADMIN' ? null : (user.schoolId ?? schoolsFinal[0]?.id ?? null)

  const listaIdsEscolas = roleFinal === 'ADMIN' ? [] : Array.from(idsEscolas)

  return {
    ...user,
    name: meta.name || user.name,
    role: roleFinal,
    perfil: perfilFinal,
    permissaoAdministrador: roleFinal === 'ADMIN',
    matricula:
      roleFinal === 'ADMIN' ? null : (user.matricula ?? meta.matricula ?? user.matricula ?? null),
    schoolId: schoolIdFinal,
    schoolIds: listaIdsEscolas,
    schools: schoolsFinal
  }
}

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

function enriquecerTutorialComExtra(tutorial) {
  if (!tutorial || typeof tutorial !== 'object') return tutorial
  const mapa = lerJsonLocal(CHAVE_TUTORIAIS_EXTRA, {})
  const extra = tutorial.id ? mapa[String(tutorial.id)] : null
  if (!extra) return tutorial
  return {
    ...tutorial,
    description: extra.description || tutorial.description,
    images: Array.isArray(extra.images) && extra.images.length > 0 ? extra.images : tutorial.images,
    imageUrl: extra.imageUrl || extra.images?.[0] || tutorial.imageUrl,
    tutorialUrl: extra.tutorialUrl || tutorial.tutorialUrl
  }
}

function salvarExtraTutorial(id, campos = {}) {
  if (!id) return
  const mapa = lerJsonLocal(CHAVE_TUTORIAIS_EXTRA, {})
  mapa[String(id)] = {
    ...(mapa[String(id)] || {}),
    ...campos
  }
  salvarJsonLocal(CHAVE_TUTORIAIS_EXTRA, mapa)
}

function enriquecerProjetoComExtra(projeto) {
  if (!projeto || typeof projeto !== 'object') return projeto
  const mapa = lerJsonLocal(CHAVE_PROJETOS_EXTRA, {})
  const extra = projeto.id ? mapa[String(projeto.id)] : null
  if (!extra) return projeto
  return {
    ...projeto,
    description: extra.description || projeto.description,
    images: Array.isArray(extra.images) && extra.images.length > 0 ? extra.images : projeto.images,
    imageUrl: extra.imageUrl || extra.images?.[0] || projeto.imageUrl,
    categories: extra.categories || projeto.categories
  }
}

function salvarExtraProjeto(id, campos = {}) {
  if (!id) return
  const mapa = lerJsonLocal(CHAVE_PROJETOS_EXTRA, {})
  mapa[String(id)] = {
    ...(mapa[String(id)] || {}),
    ...campos
  }
  salvarJsonLocal(CHAVE_PROJETOS_EXTRA, mapa)
}

export function mapearTutorialDaApi(tutorialBruto, imagemPadrao) {
  const tutorial = enriquecerTutorialComExtra(tutorialBruto)
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

export function mapearProjetoDaApi(projetoBruto, imagemPadrao) {
  const projeto = enriquecerProjetoComExtra(projetoBruto)
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
    const escolas = await apiEscolas.listar().catch(() => [])
    const userEnriquecido = enriquecerUsuarioComMeta(dados?.user, escolas)
    if (userEnriquecido?.id && lerIdsUsuariosInativos().has(Number(userEnriquecido.id))) {
      limparSessao()
      throw new Error('Esta conta está inativa. Entre em contato com a administração do portal.')
    }
    const dadosFinais = { ...dados, user: userEnriquecido }
    cacheMeRecente = { user: userEnriquecido || null, timestamp: Date.now() }
    salvarSessao(dadosFinais)
    return dadosFinais
  },

  async loginGoogle(idToken) {
    const dados = await requisicaoApi('/auth/google', {
      method: 'POST',
      body: { idToken },
      autenticado: false
    })
    const escolas = await apiEscolas.listar().catch(() => [])
    const userEnriquecido = enriquecerUsuarioComMeta(dados?.user, escolas)
    if (userEnriquecido?.id && lerIdsUsuariosInativos().has(Number(userEnriquecido.id))) {
      limparSessao()
      throw new Error('Esta conta está inativa. Entre em contato com a administração do portal.')
    }
    const dadosFinais = { ...dados, user: userEnriquecido }
    cacheMeRecente = { user: userEnriquecido || null, timestamp: Date.now() }
    salvarSessao(dadosFinais)
    return dadosFinais
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
    const usuarioSalvo = obterUsuario()
    if (usuarioSalvo?.id && lerIdsUsuariosInativos().has(Number(usuarioSalvo.id))) {
      cacheMeRecente = { user: null, timestamp: 0 }
      limparSessao()
      const erroInativo = new Error('Conta inativa.')
      erroInativo.status = 401
      throw erroInativo
    }
    if (!forcar && cacheMeRecente.user && Date.now() - cacheMeRecente.timestamp < 2000) {
      return cacheMeRecente.user
    }
    if (!forcar && promessaMeEmAndamento) {
      return promessaMeEmAndamento
    }
    promessaMeEmAndamento = (async () => {
      try {
        const [dados, escolas] = await Promise.all([
          requisicaoApi('/auth/me'),
          apiEscolas.listar().catch(() => [])
        ])
        if (!dados?.user) {
          cacheMeRecente = { user: null, timestamp: 0 }
          limparSessao()
          const erroAusente = new Error('Usuário não encontrado.')
          erroAusente.status = 404
          throw erroAusente
        }
        const userEnriquecido = enriquecerUsuarioComMeta(dados.user, escolas)
        if (userEnriquecido?.id && lerIdsUsuariosInativos().has(Number(userEnriquecido.id))) {
          cacheMeRecente = { user: null, timestamp: 0 }
          limparSessao()
          const erroInativo = new Error('Conta inativa.')
          erroInativo.status = 401
          throw erroInativo
        }
        cacheMeRecente = { user: userEnriquecido, timestamp: Date.now() }
        salvarSessao({ user: userEnriquecido })
        return userEnriquecido
      } catch (err) {
        if (err?.status === 401 || err?.status === 403 || err?.status === 404) {
          cacheMeRecente = { user: null, timestamp: 0 }
          limparSessao()
        }
        throw err
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
      return extrairLista(dados, ['tutorials']).map(enriquecerTutorialComExtra)
    })
  },

  async buscarPorId(id) {
    const dados = await requisicaoApi(`/tutorials/${id}`, { autenticado: false })
    return enriquecerTutorialComExtra(dados.tutorial)
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

    const enviarComFallback = async () => {
      try {
        const dados = await requisicaoApi('/tutorials', {
          method: 'POST',
          body: payload
        })
        return dados.tutorial
      } catch (err) {
        if (err?.status === 403 && schoolId) {
          await apiAuth.concluirOnboarding({ schoolId: Number(schoolId) }).catch(() => null)
          const dados = await requisicaoApi('/tutorials', {
            method: 'POST',
            body: payload
          })
          return dados.tutorial
        }
        throw err
      }
    }

    try {
      const criado = await enviarComFallback()
      if (criado?.id) {
        salvarExtraTutorial(criado.id, { description, images, imageUrl, tutorialUrl })
      }
      return enriquecerTutorialComExtra(criado)
    } catch (err) {
      if (err?.status >= 500 || err?.status === 400 || err?.status === 413) {
        // Fallback para banco com coluna description VARCHAR(191) ou sem Cloudinary configurado em produção
        if (schoolId) {
          await apiAuth.concluirOnboarding({ schoolId: Number(schoolId) }).catch(() => null)
        }
        const payloadReduzido = {
          title: String(title || '').slice(0, 185),
          description: String(description || '').slice(0, 185),
          categoryId: Number(categoryId),
          difficulty,
          schoolId: Number(schoolId),
          materialsNeeded: Array.isArray(materialsNeeded) ? materialsNeeded : []
        }
        if (tutorialUrl && /^https?:\/\//i.test(tutorialUrl)) {
          payloadReduzido.tutorialUrl = tutorialUrl
        }
        const dados = await requisicaoApi('/tutorials', {
          method: 'POST',
          body: payloadReduzido
        })
        if (dados?.tutorial?.id) {
          salvarExtraTutorial(dados.tutorial.id, { description, images, imageUrl, tutorialUrl })
        }
        return enriquecerTutorialComExtra(dados.tutorial)
      }
      throw err
    }
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
    salvarExtraTutorial(id, {
      ...(description !== undefined ? { description } : {}),
      ...(images !== undefined ? { images } : {}),
      ...(imageUrl !== undefined ? { imageUrl } : {}),
      ...(tutorialUrl !== undefined ? { tutorialUrl } : {})
    })
    try {
      const dados = await requisicaoApi(`/tutorials/${id}`, {
        method: 'PUT',
        body: payload
      })
      return enriquecerTutorialComExtra(dados.tutorial)
    } catch (err) {
      if (err?.status >= 500 || err?.status === 400 || err?.status === 413) {
        const payloadReduzido = { ...payload }
        delete payloadReduzido.images
        delete payloadReduzido.imageUrl
        if (payloadReduzido.description) {
          payloadReduzido.description = String(payloadReduzido.description).slice(0, 185)
        }
        const dados = await requisicaoApi(`/tutorials/${id}`, {
          method: 'PUT',
          body: payloadReduzido
        })
        return enriquecerTutorialComExtra(dados.tutorial)
      }
      throw err
    }
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
  // Todas as escolas cadastradas no banco (ADMIN usa /schools; demais perfis usam /public/schools).
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
    const normalizadas = lista
      .filter((esc) => esc?.id !== null && esc?.id !== undefined && esc?.name)
      .map(normalizarEscola)

    if (normalizadas.length > 0) {
      salvarJsonLocal(CHAVE_ESCOLAS_DB_CACHE, normalizadas)
      return normalizadas
    }

    const cacheBanco = lerJsonLocal(CHAVE_ESCOLAS_DB_CACHE, [])
    return Array.isArray(cacheBanco) ? cacheBanco.map(normalizarEscola) : []
  },

  // Escolas às quais o usuário logado está vinculado (relação N:N retornada por /auth/me).
  // É a única fonte para os seletores de escola de Projetos e Tutoriais.
  // Administradores não possuem vínculo escolar: para eles, todas as escolas cadastradas.
  async listarDoUsuarioLogado() {
    const todas = await apiEscolas.listar().catch(() => [])
    const usuarioBruto = (await apiAuth.me().catch(() => null)) || obterUsuario()
    if (!usuarioBruto) return todas
    const usuario = enriquecerUsuarioComMeta(usuarioBruto, todas)
    if (usuario.role === 'ADMIN' || usuario.perfil === 'ADMINISTRADOR') return todas

    const mapa = new Map()
    const adicionar = (esc) => {
      const obj = esc?.school || esc
      if (!obj?.id) return
      const completa = todas.find((e) => Number(e.id) === Number(obj.id)) || obj
      if (!completa?.name) return
      mapa.set(Number(completa.id), normalizarEscola(completa))
    }

    if (Array.isArray(usuario.schools)) {
      usuario.schools.forEach(adicionar)
    }
    if (usuario.school) {
      adicionar(usuario.school)
    }
    if (usuario.schoolId && !mapa.has(Number(usuario.schoolId))) {
      const encontrada = todas.find((e) => Number(e.id) === Number(usuario.schoolId))
      if (encontrada) adicionar(encontrada)
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
    }

    if (mapa.size === 0) {
      return todas
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
    if (dados?.school) {
      const cache = lerJsonLocal(CHAVE_ESCOLAS_DB_CACHE, [])
      const normalizada = normalizarEscola(dados.school)
      const filtradas = (Array.isArray(cache) ? cache : []).filter(
        (e) => Number(e.id) !== Number(normalizada.id)
      )
      salvarJsonLocal(CHAVE_ESCOLAS_DB_CACHE, [...filtradas, normalizada])
    }
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
    if (dados?.school) {
      const cache = lerJsonLocal(CHAVE_ESCOLAS_DB_CACHE, [])
      const normalizada = normalizarEscola(dados.school)
      salvarJsonLocal(
        CHAVE_ESCOLAS_DB_CACHE,
        (Array.isArray(cache) ? cache : []).map((e) =>
          Number(e.id) === Number(id) ? normalizada : e
        )
      )
    }
    return dados.school
  },

  async excluir(id) {
    const resposta = await requisicaoApi(`/schools/${id}`, { method: 'DELETE' })
    const cache = lerJsonLocal(CHAVE_ESCOLAS_DB_CACHE, [])
    salvarJsonLocal(
      CHAVE_ESCOLAS_DB_CACHE,
      (Array.isArray(cache) ? cache : []).filter((e) => Number(e.id) !== Number(id))
    )
    return resposta
  }
}

// ==========================================
// Endpoints de Usuários (/users)
// ==========================================
export const apiUsuarios = {
  async listar() {
    return listarComVazioEm404(async () => {
      const [dados, escolas] = await Promise.all([
        requisicaoApi('/users'),
        apiEscolas.listar().catch(() => [])
      ])
      const lista = extrairLista(dados, ['users'])
      const enriquecidos = await Promise.all(
        lista.map(async (u) => {
          const base = enriquecerUsuarioComMeta(u, escolas)
          if (
            base.role !== 'ADMIN' &&
            (!Array.isArray(base.schools) || base.schools.length === 0) &&
            u.id
          ) {
            const escolasDoEndpoint = await apiUsuarios.buscarEscolasDoUsuario(u.id).catch(() => [])
            if (Array.isArray(escolasDoEndpoint) && escolasDoEndpoint.length > 0) {
              const ids = escolasDoEndpoint.map((s) => Number(s.id)).filter(Boolean)
              salvarMetaUsuario(u, { id: u.id, schoolIds: ids })
              return enriquecerUsuarioComMeta({ ...u, schools: escolasDoEndpoint }, escolas)
            }
          }
          return base
        })
      )
      return enriquecidos
    })
  },

  async buscarPorId(id) {
    const [dados, escolas, escolasDoUsuario] = await Promise.all([
      requisicaoApi(`/users/${id}`),
      apiEscolas.listar().catch(() => []),
      apiUsuarios.buscarEscolasDoUsuario(id).catch(() => [])
    ])
    const userBruto = dados?.user || {}
    if (
      (!Array.isArray(userBruto.schools) || userBruto.schools.length === 0) &&
      Array.isArray(escolasDoUsuario) &&
      escolasDoUsuario.length > 0
    ) {
      userBruto.schools = escolasDoUsuario
    }
    return enriquecerUsuarioComMeta(userBruto, escolas)
  },

  async buscarEscolaDoUsuario(id) {
    const escolas = await apiUsuarios.buscarEscolasDoUsuario(id)
    return escolas[0] || null
  },

  async buscarEscolasDoUsuario(id) {
    const todas = await apiEscolas.listar().catch(() => [])
    const mapa = lerMetaUsuarios()
    const meta = mapa[`id:${Number(id)}`]
    const listaMeta = Array.isArray(meta?.schoolIds)
      ? meta.schoolIds.map((sid) => todas.find((e) => Number(e.id) === Number(sid))).filter(Boolean)
      : []

    try {
      const dados = await requisicaoApi(`/users/${id}/school`)
      const doServidor = Array.isArray(dados?.schools)
        ? dados.schools
        : dados?.school?.school || dados?.school
          ? [dados.school?.school || dados.school]
          : []
      const combinadas = new Map()
      for (const esc of [...doServidor, ...listaMeta]) {
        if (esc?.id && esc?.name) combinadas.set(Number(esc.id), esc)
      }
      return Array.from(combinadas.values())
    } catch {
      return listaMeta
    }
  },

  async criar({ name, email, password, role = 'TEACHER', perfil, matricula, schoolId, schoolIds }) {
    const idsLimpos = Array.isArray(schoolIds)
      ? schoolIds.map(Number).filter(Boolean)
      : schoolId
        ? [Number(schoolId)]
        : []
    const roleFinal = role === 'ADMIN' || perfil === 'ADMINISTRADOR' ? 'ADMIN' : 'TEACHER'
    const payload = {
      name,
      email,
      password,
      role: roleFinal
    }
    if (perfil !== undefined) payload.perfil = perfil
    if (matricula !== undefined) payload.matricula = matricula
    if (roleFinal !== 'ADMIN') {
      payload.schoolIds = idsLimpos
      if (idsLimpos.length > 0) {
        payload.schoolId = idsLimpos[0]
      }
    }

    const dados = await requisicaoApi('/users', {
      method: 'POST',
      body: payload
    })

    salvarMetaUsuario(dados?.user, {
      id: dados?.user?.id,
      name,
      email,
      role: roleFinal,
      perfil: roleFinal === 'ADMIN' ? 'ADMINISTRADOR' : 'PROFESSOR',
      matricula: roleFinal === 'ADMIN' ? null : matricula,
      schoolIds: roleFinal === 'ADMIN' ? [] : idsLimpos
    })

    const escolas = await apiEscolas.listar().catch(() => [])
    return enriquecerUsuarioComMeta(dados?.user, escolas)
  },

  async atualizar(id, campos) {
    const payload = { ...campos }
    const idsLimpos = Array.isArray(payload.schoolIds)
      ? payload.schoolIds.map(Number).filter(Boolean)
      : payload.schoolId
        ? [Number(payload.schoolId)]
        : undefined

    if (idsLimpos !== undefined) {
      payload.schoolIds = idsLimpos
      payload.schoolId = idsLimpos[0] ?? null
    }

    let userRetornado = null
    try {
      const dados = await requisicaoApi(`/users/${id}`, {
        method: 'PUT',
        body: payload
      })
      userRetornado = dados?.user
    } catch (err) {
      // Se um professor tentar atualizar o próprio perfil/vínculo num servidor que restringe PUT /users/:id a ADMIN,
      // persiste localmente nos metadados e na sessão do usuário logado.
      const logado = obterUsuario()
      if (err?.status === 403 && logado && Number(logado.id) === Number(id)) {
        userRetornado = { ...logado, ...payload, id: Number(id) }
      } else {
        throw err
      }
    }

    const logadoAtual = obterUsuario()
    const ehProprio = Boolean(logadoAtual && Number(logadoAtual.id) === Number(id))
    const atorAdmin =
      logadoAtual?.role === 'ADMIN' ||
      logadoAtual?.perfil === 'ADMINISTRADOR' ||
      logadoAtual?.permissaoAdministrador === true
    const meta = {
      id: Number(id),
      ...payload,
      ...(idsLimpos !== undefined ? { schoolIds: idsLimpos } : {})
    }
    if (ehProprio && !atorAdmin) delete meta.schoolIds

    salvarMetaUsuario(userRetornado || { id: Number(id) }, meta)

    const escolas = await apiEscolas.listar().catch(() => [])
    const enriquecido = enriquecerUsuarioComMeta(
      userRetornado || { id: Number(id), ...payload },
      escolas
    )

    const logado = obterUsuario()
    if (logado && Number(logado.id) === Number(id)) {
      salvarSessao({ user: enriquecido })
    }
    cacheMeRecente = { user: null, timestamp: 0 }
    return enriquecido
  },

  async excluir(id) {
    const logado = obterUsuario()
    const resposta = await requisicaoApi(`/users/${id}`, { method: 'DELETE' })
    removerMetaUsuario(id, resposta?.user?.email)
    if (logado && Number(logado.id) === Number(id)) {
      cacheMeRecente = { user: null, timestamp: 0 }
      limparSessao()
    }
    return resposta
  }
}

// ==========================================
// Endpoints de Avisos da Administração (/announcements)
// ==========================================
export const apiAvisos = {
  async listar() {
    const locais = lerJsonLocal(CHAVE_AVISOS_FALLBACK, [])
    try {
      const dados = await requisicaoApi('/announcements')
      const remotos = extrairLista(dados, ['announcements'])
      const idsRemotos = new Set(remotos.map((a) => String(a.id)))
      return [...remotos, ...locais.filter((a) => !idsRemotos.has(String(a.id)))]
    } catch (err) {
      if (err?.status === 404) return locais
      return locais
    }
  },

  async criar({ title, message }) {
    try {
      const dados = await requisicaoApi('/announcements', {
        method: 'POST',
        body: { title, message }
      })
      return dados.announcement
    } catch (err) {
      if (err?.status === 404) {
        const locais = lerJsonLocal(CHAVE_AVISOS_FALLBACK, [])
        const novo = {
          id: Date.now(),
          title,
          message,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        salvarJsonLocal(CHAVE_AVISOS_FALLBACK, [novo, ...locais])
        return novo
      }
      throw err
    }
  },

  async excluir(id) {
    const locais = lerJsonLocal(CHAVE_AVISOS_FALLBACK, [])
    if (locais.some((a) => String(a.id) === String(id))) {
      salvarJsonLocal(
        CHAVE_AVISOS_FALLBACK,
        locais.filter((a) => String(a.id) !== String(id))
      )
    }
    try {
      return await requisicaoApi(`/announcements/${id}`, { method: 'DELETE' })
    } catch (err) {
      if (err?.status === 404) return { message: 'Aviso removido.' }
      throw err
    }
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
      return extrairLista(dados, ['projects']).map(enriquecerProjetoComExtra)
    })
  },

  async buscarPorId(id) {
    const dados = await requisicaoApi(`/projects/${id}`).catch(async (err) => {
      if (err?.status === 401 || err?.status === 403) {
        return await requisicaoApi(`/public/projects/${id}`, { autenticado: false })
      }
      throw err
    })
    return enriquecerProjetoComExtra(dados.project)
  },

  async criar({ name, description, schoolId, images, imageUrl, categories }) {
    const payload = {
      name,
      description,
      schoolId: Number(schoolId),
      ...(images !== undefined ? { images } : {}),
      ...(imageUrl !== undefined ? { imageUrl } : {})
    }

    const enviarComOnboarding = async () => {
      try {
        const dados = await requisicaoApi('/projects', {
          method: 'POST',
          body: payload
        })
        return dados.project
      } catch (err) {
        if (err?.status === 403 && schoolId) {
          await apiAuth.concluirOnboarding({ schoolId: Number(schoolId) }).catch(() => null)
          const dados = await requisicaoApi('/projects', {
            method: 'POST',
            body: payload
          })
          return dados.project
        }
        throw err
      }
    }

    try {
      const criado = await enviarComOnboarding()
      if (criado?.id) {
        salvarExtraProjeto(criado.id, { description, images, imageUrl, categories })
      }
      return enriquecerProjetoComExtra(criado)
    } catch (err) {
      if (err?.status >= 500 || err?.status === 400 || err?.status === 413) {
        if (schoolId) {
          await apiAuth.concluirOnboarding({ schoolId: Number(schoolId) }).catch(() => null)
        }
        const payloadReduzido = {
          name: String(name || '').slice(0, 185),
          description: String(description || '').slice(0, 185),
          schoolId: Number(schoolId)
        }
        const dados = await requisicaoApi('/projects', {
          method: 'POST',
          body: payloadReduzido
        })
        if (dados?.project?.id) {
          salvarExtraProjeto(dados.project.id, { description, images, imageUrl, categories })
        }
        return enriquecerProjetoComExtra(dados.project)
      }
      throw err
    }
  },

  async atualizar(id, { name, description, schoolId, images, imageUrl, categories }) {
    const payload = {}
    if (name !== undefined) payload.name = name
    if (description !== undefined) payload.description = description
    if (schoolId !== undefined) payload.schoolId = Number(schoolId)
    if (images !== undefined) payload.images = images
    if (imageUrl !== undefined) payload.imageUrl = imageUrl

    salvarExtraProjeto(id, {
      ...(description !== undefined ? { description } : {}),
      ...(images !== undefined ? { images } : {}),
      ...(imageUrl !== undefined ? { imageUrl } : {}),
      ...(categories !== undefined ? { categories } : {})
    })

    try {
      const dados = await requisicaoApi(`/projects/${id}`, {
        method: 'PUT',
        body: payload
      })
      return enriquecerProjetoComExtra(dados.project)
    } catch (err) {
      if (err?.status >= 500 || err?.status === 400 || err?.status === 413) {
        const payloadReduzido = { ...payload }
        delete payloadReduzido.images
        delete payloadReduzido.imageUrl
        if (payloadReduzido.description) {
          payloadReduzido.description = String(payloadReduzido.description).slice(0, 185)
        }
        const dados = await requisicaoApi(`/projects/${id}`, {
          method: 'PUT',
          body: payloadReduzido
        })
        return enriquecerProjetoComExtra(dados.project)
      }
      throw err
    }
  },

  async excluir(id) {
    return requisicaoApi(`/projects/${id}`, { method: 'DELETE' })
  }
}

// ==========================================
// Gestão de Equipes / Grupos de Robótica
// ==========================================
const CHAVE_GRUPOS_STORAGE = 'biobot_equipes_storage'

export const apiGrupos = {
  listar() {
    const lista = lerJsonLocal(CHAVE_GRUPOS_STORAGE, [])
    return Array.isArray(lista) ? lista : []
  },

  buscarPorId(id) {
    const lista = apiGrupos.listar()
    return lista.find((g) => String(g.id) === String(id)) || null
  },

  criar({ name, students, grade, schoolId, schoolName }) {
    const lista = apiGrupos.listar()
    const novo = {
      id: Date.now(),
      name: String(name || '').trim(),
      students: String(students || '').trim(),
      grade: String(grade || '8º Ano').trim(),
      schoolId: schoolId ? Number(schoolId) : null,
      school: schoolName || '',
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    const atualizada = [novo, ...lista]
    salvarJsonLocal(CHAVE_GRUPOS_STORAGE, atualizada)
    return novo
  },

  atualizar(id, dados) {
    const { schoolName, ...resto } = dados
    const lista = apiGrupos.listar()
    let atualizado = null
    const atualizada = lista.map((g) => {
      if (String(g.id) === String(id)) {
        atualizado = {
          ...g,
          ...resto,
          ...(schoolName !== undefined ? { school: schoolName } : {}),
          updatedAt: new Date().toISOString()
        }
        return atualizado
      }
      return g
    })
    salvarJsonLocal(CHAVE_GRUPOS_STORAGE, atualizada)
    return atualizado
  },

  excluir(id) {
    const lista = apiGrupos.listar()
    const filtrada = lista.filter((g) => String(g.id) !== String(id))
    salvarJsonLocal(CHAVE_GRUPOS_STORAGE, filtrada)
    return true
  }
}

// ==========================================
// Solicitações de Vínculo Escolar (Professor -> Admin)
// ==========================================
export const apiSolicitacoesVinculo = {
  listar() {
    const lista = lerJsonLocal(CHAVE_SOLICITACOES_VINCULO, [])
    return Array.isArray(lista) ? lista : []
  },

  listarDoUsuario(userId, userEmail) {
    const todas = apiSolicitacoesVinculo.listar()
    const emailLimpo = String(userEmail || '')
      .trim()
      .toLowerCase()
    return todas.filter(
      (s) =>
        (userId && Number(s.userId) === Number(userId)) ||
        (emailLimpo && String(s.userEmail || '').toLowerCase() === emailLimpo)
    )
  },

  criar({ userId, userName, userEmail, userMatricula, schoolId, schoolName, schoolAddress }) {
    const todas = apiSolicitacoesVinculo.listar()
    const jaExiste = todas.find(
      (s) =>
        Number(s.userId) === Number(userId) &&
        Number(s.schoolId) === Number(schoolId) &&
        s.status === 'em_analise'
    )
    if (jaExiste) return jaExiste

    const nova = {
      id: Date.now(),
      userId: Number(userId),
      userName: userName || 'Professor(a)',
      userEmail: userEmail || '',
      userMatricula: userMatricula || '',
      schoolId: Number(schoolId),
      schoolName: schoolName || '',
      schoolAddress: schoolAddress || 'Caraguatatuba - SP',
      status: 'em_analise',
      createdAt: new Date().toISOString()
    }
    salvarJsonLocal(CHAVE_SOLICITACOES_VINCULO, [nova, ...todas])
    return nova
  },

  async aprovar(idSolicitacao) {
    const todas = apiSolicitacoesVinculo.listar()
    const alvo = todas.find((s) => String(s.id) === String(idSolicitacao))
    if (!alvo) return null

    const userAtual = await apiUsuarios.buscarPorId(alvo.userId).catch(() => null)
    const idsAtuais = new Set([
      ...(Array.isArray(userAtual?.schoolIds) ? userAtual.schoolIds.map(Number) : []),
      ...(Array.isArray(userAtual?.schools) ? userAtual.schools.map((s) => Number(s.id)) : []),
      ...(userAtual?.schoolId ? [Number(userAtual.schoolId)] : []),
      Number(alvo.schoolId)
    ])
    idsAtuais.delete(0)
    idsAtuais.delete(NaN)

    const listaIds = Array.from(idsAtuais)
    await apiUsuarios
      .atualizar(alvo.userId, {
        schoolIds: listaIds,
        schoolId: listaIds[0]
      })
      .catch(() => {
        salvarMetaUsuario(
          { id: alvo.userId, email: alvo.userEmail, name: alvo.userName },
          { id: alvo.userId, email: alvo.userEmail, schoolIds: listaIds }
        )
      })

    const atualizadas = todas.map((s) =>
      String(s.id) === String(idSolicitacao)
        ? { ...s, status: 'aprovado', updatedAt: new Date().toISOString() }
        : s
    )
    salvarJsonLocal(CHAVE_SOLICITACOES_VINCULO, atualizadas)
    return atualizadas.find((s) => String(s.id) === String(idSolicitacao))
  },

  recusar(idSolicitacao) {
    const todas = apiSolicitacoesVinculo.listar()
    const atualizadas = todas.filter((s) => String(s.id) !== String(idSolicitacao))
    salvarJsonLocal(CHAVE_SOLICITACOES_VINCULO, atualizadas)
    return true
  }
}

// ==========================================
// Dúvidas / Mensagens do Formulário de Contato
// ==========================================
export const apiContatos = {
  listar() {
    const lista = lerJsonLocal(CHAVE_CONTATOS_RECEBIDOS, [])
    return Array.isArray(lista) ? lista : []
  },

  criar({ nome, sobrenome, email, assunto, mensagem }) {
    const todas = apiContatos.listar()
    const nomeCompleto = [String(nome || '').trim(), String(sobrenome || '').trim()]
      .filter(Boolean)
      .join(' ')
    const nova = {
      id: Date.now(),
      nome: String(nome || '').trim(),
      sobrenome: String(sobrenome || '').trim(),
      nomeCompleto: nomeCompleto || 'Visitante',
      email: String(email || '').trim(),
      assunto: String(assunto || '').trim(),
      mensagem: String(mensagem || '').trim(),
      lida: false,
      respondida: false,
      createdAt: new Date().toISOString()
    }
    salvarJsonLocal(CHAVE_CONTATOS_RECEBIDOS, [nova, ...todas])
    return nova
  },

  marcarComoLida(id, lida = true) {
    const todas = apiContatos.listar()
    const atualizadas = todas.map((item) =>
      String(item.id) === String(id) ? { ...item, lida: Boolean(lida) } : item
    )
    salvarJsonLocal(CHAVE_CONTATOS_RECEBIDOS, atualizadas)
    return atualizadas
  },

  marcarComoRespondida(id) {
    const todas = apiContatos.listar()
    const atualizadas = todas.map((item) =>
      String(item.id) === String(id) ? { ...item, lida: true, respondida: true } : item
    )
    salvarJsonLocal(CHAVE_CONTATOS_RECEBIDOS, atualizadas)
    return atualizadas
  },

  excluir(id) {
    const todas = apiContatos.listar()
    const atualizadas = todas.filter((item) => String(item.id) !== String(id))
    salvarJsonLocal(CHAVE_CONTATOS_RECEBIDOS, atualizadas)
    return atualizadas
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
    const locais = lerJsonLocal(CHAVE_EVENTOS_FALLBACK, [])
    try {
      const dados = await requisicaoApi('/events', { autenticado: false })
      const remotos = dados.events || []
      const idsRemotos = new Set(remotos.map((ev) => String(ev.id)))
      return [...remotos, ...locais.filter((ev) => !idsRemotos.has(String(ev.id)))]
    } catch (err) {
      if (err?.status === 404) return locais
      return locais
    }
  },

  async buscarPorId(id) {
    const locais = lerJsonLocal(CHAVE_EVENTOS_FALLBACK, [])
    const localEncontrado = locais.find((ev) => String(ev.id) === String(id))
    try {
      const dados = await requisicaoApi(`/events/${id}`, { autenticado: false })
      return dados.event || localEncontrado || null
    } catch (err) {
      if (localEncontrado || err?.status === 404) return localEncontrado || null
      throw err
    }
  },

  async criar(payload) {
    try {
      const dados = await requisicaoApi('/events', {
        method: 'POST',
        body: payload
      })
      return dados.event
    } catch (err) {
      if (err?.status === 404) {
        const locais = lerJsonLocal(CHAVE_EVENTOS_FALLBACK, [])
        const novo = {
          id: Date.now(),
          ...payload,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        salvarJsonLocal(CHAVE_EVENTOS_FALLBACK, [novo, ...locais])
        return novo
      }
      throw err
    }
  },

  async atualizar(id, payload) {
    const locais = lerJsonLocal(CHAVE_EVENTOS_FALLBACK, [])
    const idxLocal = locais.findIndex((ev) => String(ev.id) === String(id))
    if (idxLocal >= 0) {
      const atualizado = {
        ...locais[idxLocal],
        ...payload,
        updatedAt: new Date().toISOString()
      }
      locais[idxLocal] = atualizado
      salvarJsonLocal(CHAVE_EVENTOS_FALLBACK, locais)
      return atualizado
    }
    try {
      const dados = await requisicaoApi(`/events/${id}`, {
        method: 'PUT',
        body: payload
      })
      return dados.event
    } catch (err) {
      if (err?.status === 404) {
        const novo = {
          id: Number(id) || Date.now(),
          ...payload,
          updatedAt: new Date().toISOString()
        }
        salvarJsonLocal(CHAVE_EVENTOS_FALLBACK, [novo, ...locais])
        return novo
      }
      throw err
    }
  },

  async excluir(id) {
    const locais = lerJsonLocal(CHAVE_EVENTOS_FALLBACK, [])
    if (locais.some((ev) => String(ev.id) === String(id))) {
      salvarJsonLocal(
        CHAVE_EVENTOS_FALLBACK,
        locais.filter((ev) => String(ev.id) !== String(id))
      )
    }
    try {
      return await requisicaoApi(`/events/${id}`, { method: 'DELETE' })
    } catch (err) {
      if (err?.status === 404) return { message: 'Evento removido.' }
      throw err
    }
  }
}
