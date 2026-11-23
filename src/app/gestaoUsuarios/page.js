'use client'

import { Select } from '@/components/Select'
import { useEffect, useState, useMemo } from 'react'
import { SideBarAdmin } from '@/components/SideBarAdmin'
import Link from 'next/link'
import { correspondeBusca } from '@/utils/filtros'
import { apiEscolas, apiUsuarios } from '@/services/api'
import { ModalConfirmacao } from '@/components/ModalConfirmacao'

import {
  IoSearchOutline,
  IoChevronBack,
  IoChevronForward,
  IoInformationCircleOutline,
  IoDownloadOutline,
  IoAddOutline
} from 'react-icons/io5'
import { MdOutlineEdit, MdOutlineBlock, MdOutlineCheckCircle } from 'react-icons/md'

const CHAVE_USUARIOS_INATIVOS = 'usuarios_inativos_biobot'

function lerIdsInativos() {
  if (typeof window === 'undefined') return new Set()
  try {
    const salvo = JSON.parse(window.localStorage.getItem(CHAVE_USUARIOS_INATIVOS) || '[]')
    return new Set(Array.isArray(salvo) ? salvo.map(Number) : [])
  } catch {
    return new Set()
  }
}

function salvarIdsInativos(conjuntoIds) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(CHAVE_USUARIOS_INATIVOS, JSON.stringify(Array.from(conjuntoIds)))
  } catch {}
}

export default function GestaoUsuarios() {
  const [usuarios, setUsuarios] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [busca, setBusca] = useState('')
  const [filtroStatus, setFiltroStatus] = useState('Todos')
  const [paginaAtual, setPaginaAtual] = useState(1)
  const itensPorPagina = 10
  const [modal, setModal] = useState({
    aberto: false,
    tipo: 'confirmacao',
    titulo: '',
    mensagem: '',
    textoConfirmar: 'Inativar',
    usuarioAlvo: null
  })

  useEffect(() => {
    let ativo = true
    Promise.all([apiUsuarios.listar().catch(() => []), apiEscolas.listar().catch(() => [])])
      .then(([usuariosApi, escolasApi]) => {
        if (!ativo) return
        const listaEscolas = Array.isArray(escolasApi) ? escolasApi : []
        const mapaEscolas = new Map(listaEscolas.map((e) => [Number(e.id), e.name]))
        const idsInativos = lerIdsInativos()
        setUsuarios(
          (Array.isArray(usuariosApi) ? usuariosApi : []).map((u) => {
            const estaInativo = idsInativos.has(Number(u.id)) || u.active === false
            const ehAdmin = u.role === 'ADMIN' || u.perfil === 'ADMINISTRADOR'
            const nomesVinculados = Array.isArray(u.schools)
              ? u.schools.map((s) => s?.name || mapaEscolas.get(Number(s?.id))).filter(Boolean)
              : []
            const rotuloEscolas =
              nomesVinculados.length > 0
                ? nomesVinculados.join(', ')
                : mapaEscolas.get(Number(u.schoolId)) ||
                  (u.schoolId ? `Unidade #${u.schoolId}` : ehAdmin ? 'Administração Geral' : '—')
            const matriculaReal =
              u.matricula && String(u.matricula).trim()
                ? String(u.matricula).trim().startsWith('#')
                  ? String(u.matricula).trim()
                  : `#${String(u.matricula).trim()}`
                : ehAdmin
                  ? '—'
                  : u.id
                    ? `#${String(u.id).padStart(5, '0')}`
                    : '—'
            return {
              id: u.id,
              nome: u.name,
              email: u.email,
              role: u.role,
              matricula: matriculaReal,
              escola: rotuloEscolas,
              status: estaInativo
                ? 'Inativo'
                : u.onboardingStatus === 'PENDING'
                  ? 'Pendente'
                  : 'Ativo'
            }
          })
        )
      })
      .finally(() => {
        if (ativo) setCarregando(false)
      })
    return () => {
      ativo = false
    }
  }, [])

  const totalUsuarios = usuarios.length
  const totalAtivos = usuarios.filter((u) => u.status === 'Ativo').length
  const totalPendentes = usuarios.filter((u) => u.status === 'Pendente').length

  const usuariosFiltrados = useMemo(() => {
    return usuarios.filter((usuario) => {
      const matchBusca = correspondeBusca(busca, usuario.nome, usuario.matricula, usuario.escola)
      const matchStatus = filtroStatus === 'Todos' || usuario.status === filtroStatus

      return matchBusca && matchStatus
    })
  }, [usuarios, busca, filtroStatus])

  const totalPaginas = Math.ceil(usuariosFiltrados.length / itensPorPagina)
  const startIndex = (paginaAtual - 1) * itensPorPagina
  const usuariosPaginados = usuariosFiltrados.slice(startIndex, startIndex + itensPorPagina)

  const exportarParaCSV = () => {
    const separador = ';'
    const cabecalho = ['Nome', 'Matricula', 'Escola', 'Status']
    const linhas = usuariosFiltrados.map((u) =>
      [u.nome, u.matricula, u.escola, u.status].map((campo) => `"${campo}"`).join(separador)
    )
    const csvContent = '\ufeff' + [cabecalho.join(separador), ...linhas].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'relatorio_usuarios.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleAlternarStatusUsuario = (usuario) => {
    const vaiReativar = usuario.status === 'Inativo'
    setModal({
      aberto: true,
      tipo: 'confirmacao',
      titulo: vaiReativar ? 'Reativar Usuário?' : 'Inativar Usuário?',
      mensagem: vaiReativar
        ? `Deseja reativar o acesso do usuário "${usuario.nome}" no portal?`
        : `Deseja realmente inativar o usuário "${usuario.nome}"? Ele ficará com o status Inativo no portal.`,
      textoConfirmar: vaiReativar ? 'Reativar' : 'Inativar',
      usuarioAlvo: usuario
    })
  }

  const handleConfirmarAlteracaoStatus = () => {
    if (!modal.usuarioAlvo) return
    const u = modal.usuarioAlvo
    const vaiReativar = u.status === 'Inativo'
    const novoStatus = vaiReativar ? 'Ativo' : 'Inativo'

    const idsInativos = lerIdsInativos()
    if (vaiReativar) {
      idsInativos.delete(Number(u.id))
    } else {
      idsInativos.add(Number(u.id))
    }
    salvarIdsInativos(idsInativos)

    setUsuarios((prev) =>
      prev.map((item) => (item.id === u.id ? { ...item, status: novoStatus } : item))
    )

    setModal({
      aberto: true,
      tipo: 'sucesso',
      titulo: vaiReativar ? 'Usuário reativado com sucesso!' : 'Usuário inativado com sucesso!',
      mensagem: vaiReativar
        ? `O usuário "${u.nome}" agora está com o status Ativo.`
        : `O usuário "${u.nome}" agora está com o status Inativo.`,
      textoConfirmar: 'OK',
      usuarioAlvo: null
    })
  }

  const handleFiltroChange = (e) => {
    setFiltroStatus(e.target.value)
    setPaginaAtual(1)
  }

  const handleBuscaChange = (e) => {
    setBusca(e.target.value)
    setPaginaAtual(1)
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full bg-background relative">
      <SideBarAdmin />

      <main className="flex-1 flex flex-col pb-16">
        <div className="w-full max-w-[1040px] mx-auto py-8 lg:py-10 px-6 sm:px-10 lg:px-14 flex flex-col gap-6 sm:gap-8">
          <div className="flex flex-wrap justify-between items-end gap-4">
            <section className="flex flex-col gap-2 max-w-[600px]">
              <h1 className="text-verde-escuro text-3xl sm:text-4xl font-bold leading-tight">
                Gestão de Usuários
              </h1>
              <p className="text-verde-musgo text-sm sm:text-base font-normal">
                Adicione novos professores, redefina senhas ou suspenda acessos.
              </p>
            </section>

            <Link
              href="/cadastrarUsuario"
              className="px-6 py-3 bg-verde-musgo hover:bg-white hover:text-verde-musgo border border-verde-musgo text-white text-sm sm:text-base font-bold rounded-lg shadow-sm flex items-center gap-2 transition"
            >
              <IoAddOutline size={20} /> Novo Usuário
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white rounded-2xl border border-verde-musgo shadow-sm flex flex-col gap-1">
              <span className="text-verde-musgo text-xs sm:text-sm font-semibold">
                Total de Usuários
              </span>
              <span className="text-verde-escuro text-2xl sm:text-3xl font-bold">
                {totalUsuarios}
              </span>
            </div>
            <div className="p-6 bg-white rounded-2xl border border-verde-musgo shadow-sm flex flex-col gap-1">
              <span className="text-verde-musgo text-xs sm:text-sm font-semibold">
                Professores Ativos
              </span>
              <span className="text-verde-escuro text-2xl sm:text-3xl font-bold">
                {totalAtivos}
              </span>
            </div>
            <div className="p-6 bg-white rounded-2xl border border-verde-musgo shadow-sm flex flex-col gap-1">
              <span className="text-verde-musgo text-xs sm:text-sm font-semibold">
                Pendentes de Acesso
              </span>
              <span className="text-verde-escuro text-2xl sm:text-3xl font-bold">
                {totalPendentes}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 px-3 py-1.5 bg-white/60 backdrop-blur-sm border border-verde-musgo rounded-xl">
            <div className="flex-1 flex items-center gap-3 px-2 py-1.5 min-w-[200px]">
              <IoSearchOutline size={20} className="text-verde-musgo shrink-0" />
              <input
                type="text"
                value={busca}
                onChange={handleBuscaChange}
                placeholder="Buscar por nome, matrícula ou CPF..."
                className="w-full bg-transparent text-sm sm:text-base focus:outline-none text-verde-escuro placeholder:text-verde-musgo/75"
              />
            </div>
            <div className="hidden sm:block w-px h-6 bg-verde-musgo/30"></div>

            <div className="relative flex items-center px-3 sm:px-4 py-1 min-w-[180px]">
              <Select
                value={filtroStatus}
                onChange={handleFiltroChange}
                className="appearance-none bg-transparent text-verde-escuro text-sm sm:text-base font-bold tracking-wide pr-8 focus:outline-none cursor-pointer z-10"
              >
                <option value="Todos">Status: Todos</option>
                <option value="Ativo">Status: Ativos</option>
                <option value="Inativo">Status: Inativos</option>
                <option value="Pendente">Status: Pendentes</option>
              </Select>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md flex flex-col overflow-x-auto">
            <div className="min-w-[680px]">
              <div className="grid grid-cols-12 px-6 py-4 bg-[#F2F3EE] border-b border-stone-200/80 items-center">
                <span className="col-span-4 text-verde-musgo text-[11px] font-bold uppercase tracking-wider text-center">
                  Nome
                </span>
                <span className="col-span-2 text-verde-musgo text-[11px] font-bold uppercase tracking-wider text-center">
                  Matrícula
                </span>
                <span className="col-span-3 text-verde-musgo text-[11px] font-bold uppercase tracking-wider text-center">
                  Escola
                </span>
                <span className="col-span-2 text-verde-musgo text-[11px] font-bold uppercase tracking-wider text-center">
                  Status
                </span>
                <span className="col-span-1 text-verde-musgo text-[11px] font-bold uppercase tracking-wider text-center">
                  Ações
                </span>
              </div>

              <div className="flex flex-col divide-y divide-stone-100">
                {carregando ? (
                  <div className="flex justify-center items-center py-8 text-sm text-verde-musgo">
                    Carregando usuários...
                  </div>
                ) : usuariosPaginados.length > 0 ? (
                  usuariosPaginados.map((usuario) => (
                    <div
                      key={usuario.id}
                      className="grid grid-cols-12 px-6 py-4 items-center hover:bg-stone-50/80 transition"
                    >
                      <div className="col-span-4 flex items-center gap-3">
                        <div className="size-9 bg-verde-pastel rounded-full flex justify-center items-center shrink-0">
                          <span className="text-verde-musgo text-xs font-bold uppercase">
                            {usuario.nome
                              .split(' ')
                              .filter(Boolean)
                              .map((n) => n[0])
                              .join('')
                              .substring(0, 2)}
                          </span>
                        </div>
                        <span className="text-verde-escuro text-sm font-bold truncate">
                          {usuario.nome}
                        </span>
                      </div>

                      <span className="col-span-2 text-center text-verde-escuro text-sm font-normal">
                        {usuario.matricula}
                      </span>

                      <span className="col-span-3 text-center text-verde-escuro text-xs sm:text-sm leading-snug px-2">
                        {usuario.escola}
                      </span>

                      <div className="col-span-2 flex items-center justify-center gap-2">
                        <div
                          className={`size-2 rounded-full ${
                            usuario.status === 'Ativo'
                              ? 'bg-verde-oliva shadow-[0px_0px_8px_0px_rgba(185,246,0,0.60)]'
                              : usuario.status === 'Pendente'
                                ? 'bg-yellow-500 shadow-[0px_0px_8px_0px_rgba(234,179,8,0.60)]'
                                : 'bg-vermelho shadow-[0px_0px_8px_0px_rgba(186,26,26,0.60)]'
                          }`}
                        ></div>
                        <span className="text-verde-escuro text-xs sm:text-sm font-bold">
                          {usuario.status}
                        </span>
                      </div>

                      <div className="col-span-1 flex justify-center items-center gap-2.5">
                        <Link
                          href={`/cadastrarUsuario?id=${usuario.id}`}
                          className="p-1 text-verde-musgo hover:text-verde-escuro transition"
                          title="Editar"
                        >
                          <MdOutlineEdit size={18} />
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleAlternarStatusUsuario(usuario)}
                          className={`p-1 transition cursor-pointer ${
                            usuario.status === 'Inativo'
                              ? 'text-verde-musgo hover:text-verde-escuro'
                              : 'text-vermelho hover:opacity-70'
                          }`}
                          title={
                            usuario.status === 'Inativo' ? 'Reativar Usuário' : 'Inativar Usuário'
                          }
                        >
                          {usuario.status === 'Inativo' ? (
                            <MdOutlineCheckCircle size={18} />
                          ) : (
                            <MdOutlineBlock size={18} />
                          )}
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex justify-center items-center py-8 text-sm text-verde-musgo">
                    Nenhum usuário encontrado no momento.
                  </div>
                )}
              </div>

              <div className="px-6 py-4 bg-[#F2F3EE] border-t border-stone-200/80 flex justify-between items-center">
                <span className="text-verde-musgo text-xs font-medium">
                  Mostrando {usuariosFiltrados.length === 0 ? 0 : startIndex + 1}-
                  {Math.min(startIndex + itensPorPagina, usuariosFiltrados.length)} de{' '}
                  {usuariosFiltrados.length} usuários
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setPaginaAtual((prev) => Math.max(prev - 1, 1))}
                    disabled={paginaAtual === 1}
                    className={`p-1.5 rounded-md transition ${paginaAtual === 1 ? 'text-verde-musgo opacity-40 cursor-not-allowed' : 'text-verde-escuro hover:bg-verde-pastel cursor-pointer'}`}
                  >
                    <IoChevronBack size={16} />
                  </button>

                  {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((pagina) => (
                    <button
                      key={pagina}
                      onClick={() => setPaginaAtual(pagina)}
                      className={`w-7 h-7 rounded-md text-xs font-bold flex justify-center items-center transition cursor-pointer ${paginaAtual === pagina ? 'bg-verde-musgo text-white' : 'text-verde-escuro hover:bg-verde-pastel'}`}
                    >
                      {pagina}
                    </button>
                  ))}

                  <button
                    onClick={() => setPaginaAtual((prev) => Math.min(prev + 1, totalPaginas))}
                    disabled={paginaAtual === totalPaginas || totalPaginas === 0}
                    className={`p-1.5 rounded-md transition ${paginaAtual === totalPaginas || totalPaginas === 0 ? 'text-verde-musgo opacity-40 cursor-not-allowed' : 'text-verde-escuro hover:bg-verde-pastel cursor-pointer'}`}
                  >
                    <IoChevronForward size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
            <div className="md:col-span-2 p-6 bg-[#E8EBDD] border border-verde-musgo rounded-2xl flex gap-4 items-start">
              <IoInformationCircleOutline size={22} className="text-verde-musgo shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1.5">
                <h4 className="text-verde-musgo font-bold text-base">Dica de Segurança</h4>
                <p className="text-verde-escuro text-xs sm:text-sm font-medium leading-relaxed">
                  Senhas redefinidas expiram em 24 horas caso não sejam alteradas pelo usuário.
                  Certifique-se de que o e-mail de recuperação está atualizado no perfil.
                </p>
              </div>
            </div>

            <div className="md:col-span-1 p-6 bg-verde-pastel rounded-2xl flex flex-col justify-between">
              <div className="flex flex-col gap-1.5 mb-4">
                <h4 className="text-verde-musgo font-bold text-sm">Relatório de Acessos</h4>
                <p className="text-verde-escuro text-xs font-medium leading-relaxed">
                  Exporte a lista completa de usuários ativos em formato CSV para auditoria
                  semestral.
                </p>
              </div>
              <button
                onClick={exportarParaCSV}
                className="flex items-center gap-1.5 text-verde-musgo hover:text-verde-escuro font-bold text-xs cursor-pointer w-fit"
              >
                Gerar CSV <IoDownloadOutline size={16} />
              </button>
            </div>
          </div>
        </div>
      </main>

      {modal.aberto && (
        <ModalConfirmacao
          aberto={modal.aberto}
          tipo={modal.tipo}
          titulo={modal.titulo}
          mensagem={modal.mensagem}
          textoConfirmar={modal.textoConfirmar || 'Inativar'}
          textoCancelar="Cancelar"
          onConfirmar={
            modal.tipo === 'confirmacao'
              ? handleConfirmarAlteracaoStatus
              : () => setModal((prev) => ({ ...prev, aberto: false }))
          }
          onCancelar={() => setModal((prev) => ({ ...prev, aberto: false }))}
        />
      )}
    </div>
  )
}
