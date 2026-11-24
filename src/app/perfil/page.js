'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  MdTrendingUp,
  MdOutlineRocketLaunch,
  MdOutlinePrecisionManufacturing,
  MdOutlineEventAvailable,
  MdPersonOutline,
  MdOutlineEdit,
  MdOutlineAccountBalance,
  MdOutlineLink,
  MdOutlineSecurity,
  MdOutlineLockReset,
  MdClose,
  MdOutlineLocationOn
} from 'react-icons/md'
import { AdminSidebar } from '@/components/AdminSidebar'
import { ModalConfirmacao } from '@/components/ModalConfirmacao'
import { Select } from '@/components/Select'
import {
  apiAuth,
  apiEscolas,
  apiProjetos,
  apiSolicitacoesVinculo,
  apiTutoriais,
  apiUsuarios,
  obterToken,
  obterUsuario
} from '@/services/api'

function normalizarVinculo(item, idx = 0) {
  const escolaObj = item?.school || item
  if (!escolaObj?.name) return null
  return {
    id: escolaObj.id ?? idx + 1,
    escola: escolaObj.name,
    endereco: escolaObj.address || 'Caraguatatuba - SP',
    status: item?.status || 'ativo',
    ativo:
      item?.status === 'em_analise'
        ? false
        : item?.active !== undefined
          ? Boolean(item.active)
          : true
  }
}

function criarPerfilInicial(usuarioSalvo) {
  return {
    id: usuarioSalvo?.id || null,
    role: usuarioSalvo?.role || 'TEACHER',
    impacto: {
      tutoriais: 0,
      equipes: 0,
      eventos: 0
    },
    pessoal: {
      nome: usuarioSalvo?.name || '',
      email: usuarioSalvo?.email || '',
      telefone: usuarioSalvo?.phone || '',
      matricula: usuarioSalvo?.id ? `#${String(usuarioSalvo.id).padStart(5, '0')}` : '',
      cpf: usuarioSalvo?.cpf || '',
      nascimento: usuarioSalvo?.birthDate || ''
    },
    vinculos: []
  }
}

export default function PerfilPage() {
  const [perfil, setPerfil] = useState(() => criarPerfilInicial(null))
  const [escolasDisponiveis, setEscolasDisponiveis] = useState([])
  const [editando, setEditando] = useState(false)

  // Modal de solicitação de novo vínculo
  const [modalVinculoAberto, setModalVinculoAberto] = useState(false)
  const [escolaSelecionadaId, setEscolaSelecionadaId] = useState('')
  const [erroSelecaoEscola, setErroSelecaoEscola] = useState('')

  // Modal de feedback geral (atualização de perfil / solicitação enviada)
  const [modal, setModal] = useState({
    aberto: false,
    tipo: 'sucesso',
    titulo: '',
    mensagem: '',
    textoBotao: 'Continuar no Perfil'
  })

  useEffect(() => {
    let ativo = true

    Promise.all([
      obterToken() ? apiAuth.me().catch(() => null) : Promise.resolve(null),
      apiTutoriais.listar().catch(() => []),
      apiProjetos.listar().catch(() => []),
      apiEscolas.listar().catch(() => []),
      apiEscolas.listarDoUsuarioLogado().catch(() => [])
    ]).then(([userApi, listaTutoriais, listaProjetos, listaEscolas, escolasDoUsuario]) => {
      if (!ativo) return

      const usuarioAtual = userApi || obterUsuario()
      const escolasDaRede = Array.isArray(listaEscolas) ? listaEscolas : []
      setEscolasDisponiveis(escolasDaRede)

      let vinculos = Array.isArray(usuarioAtual?.schools)
        ? usuarioAtual.schools.map(normalizarVinculo).filter(Boolean)
        : []

      if (vinculos.length === 0 && Array.isArray(escolasDoUsuario) && escolasDoUsuario.length > 0) {
        vinculos = escolasDoUsuario.map(normalizarVinculo).filter(Boolean)
      }

      // Contas antigas com apenas schoolId (sem registros em schools).
      if (vinculos.length === 0 && usuarioAtual?.schoolId) {
        const encontrada = escolasDaRede.find(
          (esc) => Number(esc.id) === Number(usuarioAtual.schoolId)
        )
        const v = normalizarVinculo(encontrada, 0)
        if (v) vinculos = [v]
      }

      // Anexa solicitações de vínculo pendentes ("Em Análise") deste professor
      const solicitacoesUsuario = apiSolicitacoesVinculo.listarDoUsuario(
        usuarioAtual?.id,
        usuarioAtual?.email
      )
      const idsJaAtivos = new Set(vinculos.map((v) => Number(v.id)))
      const vinculosEmAnalise = solicitacoesUsuario
        .filter((s) => s.status === 'em_analise' && !idsJaAtivos.has(Number(s.schoolId)))
        .map((s) => ({
          id: Number(s.schoolId),
          escola: s.schoolName,
          endereco: s.schoolAddress || 'Caraguatatuba - SP',
          status: 'em_analise',
          ativo: false
        }))

      const todosVinculos = [...vinculos, ...vinculosEmAnalise]

      if (!ativo) return

      setPerfil((prev) => ({
        ...prev,
        id: usuarioAtual?.id || prev.id,
        role: usuarioAtual?.role || prev.role,
        impacto: {
          tutoriais: Array.isArray(listaTutoriais) ? listaTutoriais.length : 0,
          equipes: Array.isArray(listaProjetos) ? listaProjetos.length : 0,
          eventos: vinculos.length
        },
        pessoal: {
          ...prev.pessoal,
          nome: usuarioAtual?.name || prev.pessoal.nome,
          email: usuarioAtual?.email || prev.pessoal.email,
          matricula: usuarioAtual?.matricula
            ? String(usuarioAtual.matricula).startsWith('#')
              ? String(usuarioAtual.matricula)
              : `#${usuarioAtual.matricula}`
            : usuarioAtual?.id
              ? `#${String(usuarioAtual.id).padStart(5, '0')}`
              : prev.pessoal.matricula || '-'
        },
        vinculos: todosVinculos
      }))
    })

    return () => {
      ativo = false
    }
  }, [])

  const idsVinculados = useMemo(
    () => new Set(perfil.vinculos.map((v) => Number(v.id))),
    [perfil.vinculos]
  )

  const escolaSelecionadaObj = useMemo(
    () => escolasDisponiveis.find((esc) => String(esc.id) === String(escolaSelecionadaId)) || null,
    [escolasDisponiveis, escolaSelecionadaId]
  )

  const cardsImpacto = [
    {
      label: 'Tutoriais Publicados',
      value: String(perfil.impacto.tutoriais).padStart(2, '0'),
      icon: MdOutlineRocketLaunch
    },
    {
      label: 'Projetos / Equipes',
      value: String(perfil.impacto.equipes).padStart(2, '0'),
      icon: MdOutlinePrecisionManufacturing
    },
    {
      label: 'Escolas Vinculadas',
      value: String(perfil.impacto.eventos).padStart(2, '0'),
      icon: MdOutlineEventAvailable
    }
  ]

  const camposPessoais = [
    { key: 'nome', label: 'NOME COMPLETO' },
    { key: 'email', label: 'E-MAIL' },
    { key: 'telefone', label: 'TELEFONE' },
    { key: 'matricula', label: 'MATRÍCULA' },
    { key: 'cpf', label: 'CPF' },
    { key: 'nascimento', label: 'DATA DE NASCIMENTO' }
  ]

  function handleCampoChange(key, valor) {
    setPerfil((prev) => ({
      ...prev,
      pessoal: {
        ...prev.pessoal,
        [key]: valor
      }
    }))
  }

  async function alternarEdicao() {
    if (!editando) {
      setEditando(true)
      return
    }

    if (!perfil.id || !obterToken()) {
      setModal({
        aberto: true,
        tipo: 'erro',
        titulo: 'Não foi possível atualizar o perfil!',
        mensagem: 'Faça login para atualizar suas informações no servidor.',
        textoBotao: 'Entendido'
      })
      return
    }

    try {
      const idsEscolasAtuais = perfil.vinculos
        .map((v) => Number(v.id))
        .filter((id) => Number.isInteger(id) && id > 0)
      const atualizado = await apiUsuarios.atualizar(perfil.id, {
        name: perfil.pessoal.nome,
        email: perfil.pessoal.email,
        ...(idsEscolasAtuais.length > 0 ? { schoolIds: idsEscolasAtuais } : {})
      })
      if (atualizado) {
        apiAuth.me({ forcar: true }).catch(() => {})
      }
      setEditando(false)
      setModal({
        aberto: true,
        tipo: 'sucesso',
        titulo: 'Perfil atualizado com sucesso!',
        mensagem: 'Suas informações pessoais foram salvas no servidor.',
        textoBotao: 'Continuar no Perfil'
      })
    } catch (err) {
      setModal({
        aberto: true,
        tipo: 'erro',
        titulo: 'Não foi possível atualizar o perfil!',
        mensagem: err?.message || 'Verifique os dados informados e tente novamente.',
        textoBotao: 'Entendido'
      })
    }
  }

  function abrirModalVinculo() {
    setEscolaSelecionadaId('')
    setErroSelecaoEscola('')
    setModalVinculoAberto(true)
  }

  async function handleSolicitarVinculo(e) {
    e.preventDefault()

    if (!escolaSelecionadaObj) {
      setErroSelecaoEscola('Selecione uma escola disponível para enviar a solicitação.')
      return
    }

    try {
      const usuarioLogado = obterUsuario()
      apiSolicitacoesVinculo.criar({
        userId: perfil.id || usuarioLogado?.id,
        userName: perfil.pessoal.nome || usuarioLogado?.name || 'Professor(a)',
        userEmail: perfil.pessoal.email || usuarioLogado?.email || '',
        userMatricula: perfil.pessoal.matricula || '',
        schoolId: Number(escolaSelecionadaObj.id),
        schoolName: escolaSelecionadaObj.name,
        schoolAddress: escolaSelecionadaObj.address || 'Caraguatatuba - SP'
      })

      const novoVinculoEmAnalise = {
        id: Number(escolaSelecionadaObj.id),
        escola: escolaSelecionadaObj.name,
        endereco: escolaSelecionadaObj.address || 'Caraguatatuba - SP',
        status: 'em_analise',
        ativo: false
      }

      setPerfil((prev) => {
        const jaListado = prev.vinculos.some(
          (v) => Number(v.id) === Number(escolaSelecionadaObj.id)
        )
        const atualizados = jaListado ? prev.vinculos : [...prev.vinculos, novoVinculoEmAnalise]
        return {
          ...prev,
          vinculos: atualizados
        }
      })
      setModalVinculoAberto(false)
      setModal({
        aberto: true,
        tipo: 'sucesso',
        titulo: 'Solicitação enviada para análise!',
        mensagem: `Sua solicitação de vínculo com a unidade "${escolaSelecionadaObj.name}" foi registrada. A equipe administrativa irá analisar o pedido e liberar o vínculo em breve.`,
        textoBotao: 'Entendido'
      })
    } catch (err) {
      setErroSelecaoEscola(
        err?.message || 'Não foi possível vincular a escola selecionada. Tente novamente.'
      )
    }
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full bg-background relative">
      <AdminSidebar variant="professor" />

      <div className="flex flex-1 flex-col pb-16">
        <main className="w-full max-w-[1040px] mx-auto flex flex-col gap-6 sm:gap-8 py-8 lg:py-10 px-6 sm:px-10 lg:px-14">
          {/* Cabeçalho */}
          <section className="flex flex-col gap-2">
            <h1 className="text-3xl sm:text-4xl font-bold text-verde-escuro leading-tight">
              Configurações de Perfil
            </h1>
            <p className="text-sm sm:text-base text-verde-musgo">
              Gerencie a identidade da sua conta, vínculos escolares e preferências de segurança.
            </p>
          </section>

          {/* Meu Impacto */}
          <section className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-verde-escuro">
              <MdTrendingUp size={20} className="text-verde-musgo" />
              <h2 className="text-base sm:text-lg font-bold">Meu Impacto</h2>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {cardsImpacto.map(({ label, value, icon: Icon }) => (
                <div
                  key={label}
                  className="flex items-center gap-4 rounded-2xl border border-verde-musgo/20 bg-white px-5 py-4 shadow-sm"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-input-bg text-verde-musgo">
                    <Icon size={22} />
                  </div>
                  <div>
                    <p className="text-xl sm:text-2xl font-bold leading-tight text-verde-escuro">
                      {value}
                    </p>
                    <p className="text-xs sm:text-sm text-verde-musgo">{label}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Informações Pessoais */}
          <section className="rounded-2xl border border-verde-musgo bg-white p-6 sm:p-8 shadow-sm">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5 text-verde-escuro">
                <MdPersonOutline size={22} className="text-verde-musgo shrink-0" />
                <h2 className="text-base sm:text-lg font-bold uppercase tracking-wide">
                  Informações Pessoais
                </h2>
              </div>

              <button
                type="button"
                onClick={alternarEdicao}
                className="flex items-center gap-1.5 text-sm font-bold text-verde-musgo hover:underline cursor-pointer"
              >
                <MdOutlineEdit size={16} />
                {editando ? 'Salvar' : 'Editar'}
              </button>
            </div>

            <div className="grid grid-cols-1 gap-x-12 gap-y-5 sm:grid-cols-2">
              {camposPessoais.map(({ key, label }) => (
                <div key={key}>
                  <p className="text-xs font-bold uppercase tracking-wide text-verde-musgo">
                    {label}
                  </p>
                  {editando ? (
                    <input
                      type="text"
                      value={perfil.pessoal[key]}
                      onChange={(e) => handleCampoChange(key, e.target.value)}
                      className="mt-1.5 w-full h-11 rounded-xl border border-verde-musgo bg-input-bg px-3.5 text-sm sm:text-base text-verde-escuro focus:outline-none focus:ring-1 focus:ring-verde-musgo"
                    />
                  ) : (
                    <p className="mt-1 text-sm sm:text-base text-verde-escuro">
                      {perfil.pessoal[key] || '-'}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Vínculos Institucionais (exibido para Professores) */}
          {perfil.role !== 'ADMIN' && (
            <section className="rounded-2xl border border-verde-musgo bg-white p-6 sm:p-8 shadow-sm">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 text-verde-escuro">
                  <MdOutlineAccountBalance size={22} className="text-verde-musgo shrink-0" />
                  <h2 className="text-base sm:text-lg font-bold uppercase tracking-wide">
                    Vínculos Institucionais
                  </h2>
                </div>
                <span className="text-xs font-semibold text-verde-musgo">
                  {perfil.vinculos.length}{' '}
                  {perfil.vinculos.length === 1 ? 'unidade vinculada' : 'unidades vinculadas'}
                </span>
              </div>

              <div className="flex flex-col gap-3.5">
                {perfil.vinculos.length > 0 ? (
                  perfil.vinculos.map((vinculo) => (
                    <div
                      key={vinculo.id}
                      className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-verde-musgo/20 bg-input-bg px-5 py-4 transition hover:border-verde-musgo/40"
                    >
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm sm:text-base font-bold text-verde-escuro">
                          {vinculo.escola}
                        </h3>
                        <p className="mt-0.5 text-xs sm:text-sm text-verde-musgo">
                          {vinculo.endereco}
                        </p>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-3.5 py-1 text-xs font-bold ${
                          vinculo.status === 'em_analise'
                            ? 'bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-500/50'
                            : vinculo.ativo
                              ? 'bg-verde-limao text-verde-escuro'
                              : 'bg-verde-escuro/10 text-verde-escuro/70'
                        }`}
                      >
                        {vinculo.status === 'em_analise'
                          ? 'Em Análise'
                          : vinculo.ativo
                            ? 'Ativo'
                            : 'Inativo'}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="rounded-xl border border-verde-musgo/20 bg-input-bg/50 px-5 py-4 text-sm text-verde-musgo">
                    Nenhum vínculo escolar encontrado para esta conta.
                  </div>
                )}

                <button
                  type="button"
                  onClick={abrirModalVinculo}
                  className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-verde-musgo/50 py-3.5 text-xs sm:text-sm font-bold text-verde-musgo hover:bg-input-bg hover:border-verde-musgo transition cursor-pointer"
                >
                  <MdOutlineLink size={18} />
                  Solicitar Novo Vínculo
                </button>
              </div>
            </section>
          )}

          {/* Segurança */}
          <section className="rounded-2xl border border-verde-musgo bg-white p-6 sm:p-8 shadow-sm">
            <div className="mb-5 flex items-center gap-2.5 text-verde-escuro pb-4 border-b border-verde-escuro/10">
              <MdOutlineSecurity size={22} className="text-verde-musgo shrink-0" />
              <h2 className="text-base sm:text-lg font-bold uppercase tracking-wide">Segurança</h2>
            </div>

            <Link
              href="/forgot-password"
              className="inline-flex items-center gap-2 text-sm sm:text-base font-bold text-verde-musgo hover:text-verde-escuro hover:underline transition"
            >
              <MdOutlineLockReset size={20} className="shrink-0" />
              <span>Esqueceu sua senha? Solicitar recuperação</span>
            </Link>
          </section>
        </main>
      </div>

      {/* Modal Solicitar Novo Vínculo */}
      {modalVinculoAberto && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="titulo-modal-vinculo"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4"
        >
          <div className="relative w-full max-w-xl rounded-3xl border border-verde-musgo bg-white p-7 sm:p-10 shadow-2xl">
            <button
              type="button"
              onClick={() => setModalVinculoAberto(false)}
              aria-label="Fechar modal"
              className="absolute top-6 right-6 p-1.5 rounded-lg text-verde-musgo hover:bg-input-bg hover:text-verde-escuro transition cursor-pointer"
            >
              <MdClose size={22} />
            </button>

            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-verde-pastel text-verde-musgo">
                <MdOutlineAccountBalance size={22} />
              </div>
              <h2
                id="titulo-modal-vinculo"
                className="text-xl sm:text-2xl font-bold text-verde-escuro"
              >
                Solicitar Novo <span className="text-verde-musgo">Vínculo</span>
              </h2>
            </div>

            <p className="text-sm text-verde-musgo leading-relaxed">
              Selecione a unidade escolar desejada. Sua solicitação será encaminhada aos
              administradores da rede para análise e liberação do acesso.
            </p>

            <form onSubmit={handleSolicitarVinculo} noValidate className="mt-6 flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="select-escola-vinculo"
                  className="text-sm font-semibold text-verde-escuro"
                >
                  Escola disponível
                </label>
                <Select
                  id="select-escola-vinculo"
                  value={escolaSelecionadaId}
                  onChange={(e) => {
                    setEscolaSelecionadaId(e.target.value)
                    setErroSelecaoEscola('')
                  }}
                  placeholder="Selecione uma escola..."
                  searchPlaceholder="Pesquisar escola..."
                  className="w-full h-12 rounded-xl border border-verde-musgo bg-input-bg px-4 text-sm sm:text-base text-verde-escuro focus:outline-none focus:ring-1 focus:ring-verde-musgo"
                >
                  <option value="">Selecione uma escola...</option>
                  {escolasDisponiveis.map((esc) => {
                    const jaVinculada = idsVinculados.has(Number(esc.id))
                    return (
                      <option key={esc.id} value={String(esc.id)} disabled={jaVinculada}>
                        {esc.name}
                        {jaVinculada ? ' (Já vinculada)' : ''}
                      </option>
                    )
                  })}
                </Select>
                {erroSelecaoEscola && (
                  <span className="text-xs font-semibold text-vermelho mt-0.5">
                    {erroSelecaoEscola}
                  </span>
                )}
              </div>

              {escolaSelecionadaObj && (
                <div className="flex items-start gap-2.5 rounded-xl border border-verde-musgo/20 bg-input-bg px-4 py-3 text-xs sm:text-sm text-verde-musgo">
                  <MdOutlineLocationOn size={18} className="shrink-0 mt-0.5 text-verde-escuro" />
                  <div>
                    <p className="font-bold text-verde-escuro">{escolaSelecionadaObj.name}</p>
                    <p>{escolaSelecionadaObj.address || 'Caraguatatuba - SP'}</p>
                  </div>
                </div>
              )}

              <div className="mt-2 flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalVinculoAberto(false)}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl border-2 border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-sm sm:text-base font-bold transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl border-2 border-verde-musgo bg-verde-musgo hover:bg-white hover:text-verde-musgo text-white text-sm sm:text-base font-bold shadow-xs transition cursor-pointer"
                >
                  Solicitar Novo Vínculo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ModalConfirmacao
        aberto={modal.aberto}
        tipo={modal.tipo}
        titulo={modal.titulo}
        mensagem={modal.mensagem}
        textoBotaoSucesso={modal.textoBotao}
        onConfirmar={() => setModal((prev) => ({ ...prev, aberto: false }))}
        onCancelar={() => setModal((prev) => ({ ...prev, aberto: false }))}
        onTentarNovamente={() => setModal((prev) => ({ ...prev, aberto: false }))}
      />
    </div>
  )
}
