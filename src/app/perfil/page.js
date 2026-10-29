'use client'

import { useEffect, useState } from 'react'
import {
  MdTrendingUp,
  MdOutlineRocketLaunch,
  MdOutlinePrecisionManufacturing,
  MdOutlineEventAvailable,
  MdPersonOutline,
  MdOutlineEdit,
  MdOutlineAccountBalance,
  MdOutlineLink,
  MdLockOutline
} from 'react-icons/md'
import { IoCheckmarkCircle, IoRadioButtonOffOutline } from 'react-icons/io5'
import { AdminSidebar } from '@/components/AdminSidebar'
import { ModalConfirmacao } from '@/components/ModalConfirmacao'
import {
  apiAuth,
  apiEscolas,
  apiProjetos,
  apiTutoriais,
  apiUsuarios,
  obterToken,
  obterUsuario
} from '@/services/api'

const RequisitoItem = ({ atendido, texto }) => (
  <div
    className={`flex items-center gap-2 text-sm transition-colors duration-300 ${
      atendido ? 'text-verde-escuro font-semibold' : 'text-verde-musgo opacity-60'
    }`}
  >
    {atendido ? (
      <IoCheckmarkCircle
        size={18}
        className="text-verde-oliva shadow-[0px_0px_8px_0px_rgba(185,246,0,0.40)] rounded-full"
      />
    ) : (
      <IoRadioButtonOffOutline size={18} />
    )}
    <span>{texto}</span>
  </div>
)

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
      telefone: '',
      matricula: usuarioSalvo?.id ? `#${String(usuarioSalvo.id).padStart(5, '0')}` : '',
      cpf: '',
      nascimento: ''
    },
    vinculos: []
  }
}

export default function PerfilPage() {
  const [perfil, setPerfil] = useState(() => criarPerfilInicial(obterUsuario()))
  const [editando, setEditando] = useState(false)
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [senha, setSenha] = useState('')
  const [modal, setModal] = useState({ aberto: false, tipo: 'sucesso', mensagemErro: '' })

  const validacoes = {
    tamanho: senha.length >= 8,
    maiuscula: /[A-Z]/.test(senha),
    numero: /[0-9]/.test(senha),
    especial: /[^A-Za-z0-9]/.test(senha)
  }

  useEffect(() => {
    let ativo = true

    Promise.all([
      obterToken() ? apiAuth.me().catch(() => null) : Promise.resolve(null),
      apiTutoriais.listar().catch(() => []),
      apiProjetos.listar().catch(() => []),
      apiEscolas.listar().catch(() => [])
    ]).then(async ([user, listaTutoriais, listaProjetos, listaEscolas]) => {
      if (!ativo) return

      let vinculos = []
      if (user?.id) {
        const escDoUsuario = await apiUsuarios.buscarEscolaDoUsuario(user.id).catch(() => null)
        if (escDoUsuario?.name) {
          vinculos = [
            {
              id: escDoUsuario.id || 1,
              escola: escDoUsuario.name,
              endereco: escDoUsuario.address || 'Caraguatatuba - SP',
              ativo: true
            }
          ]
        }
      }

      if (vinculos.length === 0 && Array.isArray(listaEscolas) && listaEscolas.length > 0) {
        vinculos = listaEscolas.map((esc, idx) => ({
          id: esc.id,
          escola: esc.name,
          endereco: esc.address || 'Caraguatatuba - SP',
          ativo: idx === 0
        }))
      }

      if (!ativo) return

      setPerfil((prev) => ({
        ...prev,
        id: user?.id || prev.id,
        role: user?.role || prev.role,
        impacto: {
          tutoriais: Array.isArray(listaTutoriais) ? listaTutoriais.length : 0,
          equipes: Array.isArray(listaProjetos) ? listaProjetos.length : 0,
          eventos: vinculos.length
        },
        pessoal: {
          ...prev.pessoal,
          nome: user?.name || prev.pessoal.nome,
          email: user?.email || prev.pessoal.email,
          matricula: user?.id
            ? `#${String(user.id).padStart(5, '0')}`
            : prev.pessoal.matricula || '-'
        },
        vinculos
      }))
    })

    return () => {
      ativo = false
    }
  }, [])

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
        mensagemErro: 'Faça login para atualizar suas informações no servidor.'
      })
      return
    }

    try {
      await apiUsuarios.atualizar(perfil.id, {
        name: perfil.pessoal.nome,
        email: perfil.pessoal.email,
        ...(senha.length >= 6 ? { password: senha } : {})
      })
      setEditando(false)
      setModal({ aberto: true, tipo: 'sucesso', mensagemErro: '' })
    } catch (err) {
      setModal({
        aberto: true,
        tipo: 'erro',
        mensagemErro: err?.message || 'Não foi possível atualizar os dados do perfil.'
      })
    }
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <AdminSidebar variant="professor" />

      <div className="flex flex-1 flex-col px-4 sm:px-6 lg:px-10 pb-16">
        <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 pt-8 lg:pt-12">
          {/* Cabeçalho */}
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-verde-escuro">
              Configurações de Perfil
            </h1>
            <p className="mt-1 text-sm text-verde-musgo">
              Gerencie a identidade da sua conta, vínculos escolares e preferências de segurança.
            </p>
          </div>

          {/* Meu Impacto */}
          <section className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-verde-escuro">
              <MdTrendingUp size={20} className="text-verde-musgo" />
              <h2 className="text-base font-bold">Meu Impacto</h2>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {cardsImpacto.map(({ label, value, icon: Icon }) => (
                <div
                  key={label}
                  className="flex items-center gap-4 rounded-2xl bg-white px-5 py-4 shadow-sm"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-input-bg text-verde-musgo">
                    <Icon size={22} />
                  </div>
                  <div>
                    <p className="text-xl font-bold leading-tight text-verde-escuro">{value}</p>
                    <p className="text-xs text-verde-musgo">{label}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Informações Pessoais */}
          <section className="rounded-2xl bg-white p-7 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2 text-verde-escuro">
                <MdPersonOutline size={20} className="text-verde-musgo" />
                <h2 className="text-base font-bold">Informações Pessoais</h2>
              </div>

              <button
                type="button"
                onClick={alternarEdicao}
                className="flex items-center gap-1.5 text-xs font-bold text-verde-musgo hover:underline cursor-pointer"
              >
                <MdOutlineEdit size={16} />
                {editando ? 'Salvar' : 'Editar'}
              </button>
            </div>

            <div className="grid grid-cols-1 gap-x-12 gap-y-6 sm:grid-cols-2">
              {camposPessoais.map(({ key, label }) => (
                <div key={key}>
                  <p className="text-[11px] font-bold uppercase text-verde-musgo">{label}</p>
                  {editando ? (
                    <input
                      type="text"
                      value={perfil.pessoal[key]}
                      onChange={(e) => handleCampoChange(key, e.target.value)}
                      className="mt-1 w-full rounded-lg border border-verde-musgo bg-input-bg px-3 py-1.5 text-sm text-verde-escuro focus:outline-none"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-verde-escuro">{perfil.pessoal[key] || '-'}</p>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Vínculos Institucionais */}
          <section className="rounded-2xl bg-white p-7 shadow-sm">
            <div className="mb-5 flex items-center gap-2 text-verde-escuro">
              <MdOutlineAccountBalance size={20} className="text-verde-musgo" />
              <h2 className="text-base font-bold">Vínculos Institucionais</h2>
            </div>

            <div className="flex flex-col gap-3">
              {perfil.vinculos.length > 0 ? (
                perfil.vinculos.map((vinculo) => (
                  <div
                    key={vinculo.id}
                    className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-verde-musgo/20 bg-input-bg px-5 py-4"
                  >
                    <div>
                      <h3 className="text-sm font-bold text-verde-escuro">{vinculo.escola}</h3>
                      <p className="mt-0.5 text-xs text-verde-musgo">{vinculo.endereco}</p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold
                        ${
                          vinculo.ativo
                            ? 'bg-verde-oliva text-verde-escuro'
                            : 'bg-verde-escuro/10 text-verde-escuro/70'
                        }`}
                    >
                      {vinculo.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-verde-musgo py-2">
                  Nenhum vínculo escolar encontrado para esta conta.
                </p>
              )}

              <button
                type="button"
                className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-verde-musgo/40 py-3 text-xs font-medium text-verde-musgo hover:bg-input-bg cursor-pointer"
              >
                <MdOutlineLink size={18} />
                Vincular Outra Escola
              </button>
            </div>
          </section>

          {/* Credenciais */}
          <section className="p-8 bg-white rounded-3xl shadow-sm border border-verde-musgo border-opacity-10 flex flex-col gap-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-verde-pastel bg-opacity-20 rounded-lg flex justify-center items-center text-verde-musgo">
                <MdLockOutline size={24} />
              </div>
              <h3 className="text-verde-escuro text-2xl font-semibold">Credenciais</h3>
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-start w-full justify-center">
              <div className="flex flex-col gap-2 max-w-lg flex-1 w-full">
                <label className="text-verde-musgo text-sm font-bold uppercase tracking-wide px-1">
                  Nova senha
                </label>

                <div className="relative">
                  <input
                    type={mostrarSenha ? 'text' : 'password'}
                    placeholder="Digite a senha..."
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    className="w-full px-4 py-3.5 pe-12 bg-input-bg border border-verde-musgo rounded-xl text-verde-musgo focus:outline-none transition"
                  />

                  <button
                    type="button"
                    onClick={() => setMostrarSenha(!mostrarSenha)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-verde-musgo hover:text-verde-escuro transition cursor-pointer"
                    aria-label="Alternar visibilidade da senha"
                  >
                    {mostrarSenha ? (
                      <svg
                        className="shrink-0 size-5"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    ) : (
                      <svg
                        className="shrink-0 size-5"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                        <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                        <line x1="2" x2="22" y1="2" y2="22" />
                      </svg>
                    )}
                  </button>
                </div>

                <span className="text-verde-musgo opacity-75 text-xs px-1 mb-2">
                  O usuário deverá alterar a senha no primeiro acesso.
                </span>

                {/* Requisitos senha */}
                <div className="flex flex-col gap-2 p-4 bg-input-bg rounded-xl border border-verde-musgo border-opacity-20">
                  <span className="text-verde-escuro text-sm font-bold mb-1">
                    A senha deve conter:
                  </span>
                  <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                    <RequisitoItem atendido={validacoes.tamanho} texto="Mínimo 8 caracteres" />
                    <RequisitoItem atendido={validacoes.maiuscula} texto="1 letra maiúscula" />
                    <RequisitoItem atendido={validacoes.numero} texto="1 número" />
                    <RequisitoItem atendido={validacoes.especial} texto="1 caractere especial" />
                  </div>
                </div>
              </div>

              {/* Toggle permissões de admin */}
              <div className="flex-1 max-w-lg w-full p-5 bg-input-bg rounded-2xl border border-verde-musgo flex justify-between items-center md:mt-7">
                <div className="flex flex-col">
                  <span className="text-verde-escuro text-base font-bold">
                    Permissões de Administrador
                  </span>
                  <span className="text-verde-musgo text-sm">
                    Acesso completo a todos os controles.
                  </span>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={perfil.role === 'ADMIN'}
                    readOnly
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-verde-oliva"></div>
                </label>
              </div>
            </div>
          </section>
        </main>
      </div>

      <ModalConfirmacao
        aberto={modal.aberto}
        tipo={modal.tipo}
        titulo={modal.tipo === 'sucesso' ? 'Perfil atualizado com' : 'Não foi possível atualizar'}
        destaque={modal.tipo === 'sucesso' ? 'sucesso!' : 'o perfil!'}
        mensagem={
          modal.tipo === 'sucesso'
            ? 'Suas informações pessoais foram salvas no servidor.'
            : modal.mensagemErro || 'Verifique os dados informados e tente novamente.'
        }
        textoBotaoSucesso="Continuar no Perfil"
        onConfirmar={() => setModal({ aberto: false, tipo: 'sucesso', mensagemErro: '' })}
        onCancelar={() => setModal({ aberto: false, tipo: 'sucesso', mensagemErro: '' })}
        onTentarNovamente={() => setModal({ aberto: false, tipo: 'sucesso', mensagemErro: '' })}
      />
    </div>
  )
}
