'use client'

import { Select } from '@/components/Select'
import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  MdAdd,
  MdAddCircleOutline,
  MdOutlineEdit,
  MdOutlineDeleteOutline,
  MdClose,
  MdArrowForward,
  MdOutlineLink,
  MdOutlineCheckCircle
} from 'react-icons/md'
import { IoSearchSharp } from 'react-icons/io5'
import { AdminSidebar } from '@/components/AdminSidebar'
import { CardEscolaAdmin } from '@/components/CardEscolaAdmin'
import { ModalConfirmacao } from '@/components/ModalConfirmacao'
import {
  apiEscolas,
  apiProjetos,
  apiSolicitacoesVinculo,
  apiUsuarios,
  lerIdsEscolasInativas,
  salvarIdsEscolasInativas
} from '@/services/api'
import { correspondeBusca } from '@/utils/filtros'

function formatarDataHora(valorData) {
  if (!valorData) return 'Recente'
  const data = new Date(valorData)
  if (Number.isNaN(data.getTime())) return 'Recente'
  return `${data.toLocaleDateString('pt-BR')} às ${data.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  })}`
}

function Filtro({ label, value, onChange, children }) {
  return (
    <div className="flex flex-col w-full sm:w-auto border-t sm:border-t-0 sm:border-l border-verde-musgo/20 pt-3 sm:pt-0 sm:pl-6 min-w-[170px]">
      <span className="text-xs font-bold uppercase text-verde-escuro">{label}</span>
      <div className="relative">
        <Select
          value={value}
          onChange={onChange}
          className="w-full appearance-none bg-transparent pr-14 text-sm text-verde-musgo focus:outline-none cursor-pointer"
        >
          {children}
        </Select>
      </div>
    </div>
  )
}

export default function GestaoEscolas() {
  const [escolas, setEscolas] = useState([])
  const [totalDocentes, setTotalDocentes] = useState(0)
  const [totalProjetos, setTotalProjetos] = useState(0)
  const [carregando, setCarregando] = useState(true)
  const [busca, setBusca] = useState('')
  const [regiaoSelecionada, setRegiaoSelecionada] = useState('')
  const [statusSelecionado, setStatusSelecionado] = useState('Todas')
  const [escolaSelecionada, setEscolaSelecionada] = useState(null)
  const [solicitacoesVinculo, setSolicitacoesVinculo] = useState([])

  // Estado para os Modais de Confirmação, Sucesso e Erro
  const [modal, setModal] = useState({
    aberto: false,
    tipo: 'confirmacao',
    acao: 'excluir', // 'excluir' | 'status'
    titulo: '',
    mensagem: '',
    textoConfirmar: 'Excluir',
    escolaAlvo: null
  })

  const carregarDados = () => {
    return Promise.all([
      apiEscolas.listar().catch(() => []),
      apiUsuarios.listar().catch(() => []),
      apiProjetos.listar().catch(() => [])
    ]).then(([listaEscolas, listaUsuarios, listaProjetos]) => {
      const projsPorEscola = new Map()
      for (const p of Array.isArray(listaProjetos) ? listaProjetos : []) {
        const sid = p.schoolId || p.school?.id
        if (sid) projsPorEscola.set(sid, (projsPorEscola.get(sid) || 0) + 1)
      }

      const apenasDocentes = (Array.isArray(listaUsuarios) ? listaUsuarios : []).filter(
        (u) =>
          u.role !== 'ADMIN' && u.perfil !== 'ADMINISTRADOR' && u.permissaoAdministrador !== true
      )

      const docentesPorEscola = new Map()
      for (const u of apenasDocentes) {
        const idsVinculados = new Set(
          [u.schoolId, ...(Array.isArray(u.schools) ? u.schools.map((s) => s?.id) : [])]
            .map(Number)
            .filter((n) => Number.isInteger(n) && n > 0)
        )
        for (const sid of idsVinculados) {
          docentesPorEscola.set(sid, (docentesPorEscola.get(sid) || 0) + 1)
        }
      }

      const idsInativas = lerIdsEscolasInativas()

      setEscolas(
        (Array.isArray(listaEscolas) ? listaEscolas : []).map((item) => ({
          id: item.id,
          name: item.name,
          address: item.address || '',
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          ativo: !idsInativas.has(Number(item.id)),
          region: item.address?.toUpperCase().includes('SUL')
            ? 'Sul'
            : item.address?.toUpperCase().includes('CENTRO')
              ? 'Centro'
              : 'Norte',
          teams: projsPorEscola.get(item.id) || 0,
          teachers: docentesPorEscola.get(Number(item.id)) ?? 0
        }))
      )

      setTotalDocentes(apenasDocentes.length)
      setTotalProjetos(Array.isArray(listaProjetos) ? listaProjetos.length : 0)
      setSolicitacoesVinculo(
        apiSolicitacoesVinculo.listar().filter((s) => s.status === 'em_analise')
      )
    })
  }

  useEffect(() => {
    let ativo = true
    carregarDados().finally(() => {
      if (ativo) setCarregando(false)
    })

    return () => {
      ativo = false
    }
  }, [])

  const escolasFiltradas = useMemo(
    () =>
      escolas.filter((escola) => {
        const matchBusca = correspondeBusca(busca, escola.name, escola.region, escola.address)
        const matchRegiao = !regiaoSelecionada || `Região ${escola.region}` === regiaoSelecionada
        const matchStatus =
          statusSelecionado === 'Todas' ||
          (statusSelecionado === 'Ativas' && escola.ativo) ||
          (statusSelecionado === 'Inativas' && !escola.ativo)
        return matchBusca && matchRegiao && matchStatus
      }),
    [busca, escolas, regiaoSelecionada, statusSelecionado]
  )

  const handleAbrirConfirmacaoExcluir = (id, nome) => {
    setModal({
      aberto: true,
      tipo: 'confirmacao',
      acao: 'excluir',
      titulo: 'Excluir Escola?',
      mensagem: `Deseja realmente remover a escola "${nome}" da rede? Todos os vínculos associados serão atualizados.`,
      textoConfirmar: 'Excluir',
      escolaAlvo: { id, nome }
    })
  }

  const handleAbrirConfirmacaoStatus = (id, nome, ativoAtual) => {
    const vaiReativar = !ativoAtual
    setModal({
      aberto: true,
      tipo: 'confirmacao',
      acao: 'status',
      titulo: vaiReativar ? 'Reativar Escola?' : 'Inativar Escola?',
      mensagem: vaiReativar
        ? `Deseja reativar a unidade escolar "${nome}" no portal?`
        : `Deseja realmente inativar a unidade escolar "${nome}"? Ela ficará marcada como Polo Inativo.`,
      textoConfirmar: vaiReativar ? 'Reativar' : 'Inativar',
      escolaAlvo: { id, nome, ativoAtual }
    })
  }

  const handleConfirmarAcao = async () => {
    if (!modal.escolaAlvo) return
    const { id, nome, ativoAtual } = modal.escolaAlvo

    if (modal.acao === 'status') {
      const vaiReativar = !ativoAtual
      const inativas = lerIdsEscolasInativas()
      if (vaiReativar) {
        inativas.delete(Number(id))
      } else {
        inativas.add(Number(id))
      }
      salvarIdsEscolasInativas(inativas)
      setEscolas((prev) =>
        prev.map((e) => (Number(e.id) === Number(id) ? { ...e, ativo: vaiReativar } : e))
      )
      setModal({
        aberto: true,
        tipo: 'sucesso',
        acao: 'status',
        titulo: vaiReativar ? 'Escola reativada com sucesso!' : 'Escola inativada com sucesso!',
        mensagem: vaiReativar
          ? `A unidade "${nome}" agora está marcada como Polo Ativo.`
          : `A unidade "${nome}" agora está marcada como Polo Inativo.`,
        textoConfirmar: 'Entendido',
        escolaAlvo: null
      })
      return
    }

    try {
      await apiEscolas.excluir(id)
      const inativas = lerIdsEscolasInativas()
      inativas.delete(Number(id))
      salvarIdsEscolasInativas(inativas)
      setEscolas((prev) => prev.filter((e) => e.id !== id))
      setModal({
        aberto: true,
        tipo: 'sucesso',
        acao: 'excluir',
        titulo: 'Escola excluída com sucesso!',
        mensagem: `A unidade "${nome}" foi removida do sistema com sucesso.`,
        textoConfirmar: 'Entendido',
        escolaAlvo: null
      })
    } catch (err) {
      setModal({
        aberto: true,
        tipo: 'erro',
        acao: 'excluir',
        titulo: 'Erro ao excluir escola',
        mensagem:
          err?.message || 'Não foi possível excluir a escola. Verifique se o servidor está ativo.',
        textoConfirmar: 'Entendido',
        escolaAlvo: null
      })
    }
  }

  const handleAprovarSolicitacao = async (sol) => {
    await apiSolicitacoesVinculo.aprovar(sol.id)
    await carregarDados()
    setModal({
      aberto: true,
      tipo: 'sucesso',
      acao: 'vinculo',
      titulo: 'Vínculo aprovado com sucesso!',
      mensagem: `O vínculo de "${sol.userName}" com a unidade "${sol.schoolName}" foi aprovado e já está ativo.`,
      textoConfirmar: 'Entendido',
      escolaAlvo: null
    })
  }

  const handleRecusarSolicitacao = (sol) => {
    apiSolicitacoesVinculo.recusar(sol.id)
    setSolicitacoesVinculo((prev) => prev.filter((item) => String(item.id) !== String(sol.id)))
    setModal({
      aberto: true,
      tipo: 'sucesso',
      acao: 'vinculo',
      titulo: 'Solicitação recusada',
      mensagem: `A solicitação de vínculo de "${sol.userName}" para "${sol.schoolName}" foi recusada.`,
      textoConfirmar: 'Entendido',
      escolaAlvo: null
    })
  }

  const estatisticas = [
    { label: 'Total de Escolas', value: escolas.length },
    { label: 'Corpo Docente', value: totalDocentes },
    { label: 'Projetos na Rede', value: totalProjetos }
  ]

  const atividadesRecentes = [...escolas]
    .sort((a, b) => {
      const dataA = new Date(a.createdAt || a.updatedAt || 0).getTime()
      const dataB = new Date(b.createdAt || b.updatedAt || 0).getTime()
      if (dataB !== dataA) return dataB - dataA
      return (Number(b.id) || 0) - (Number(a.id) || 0)
    })
    .slice(0, 5)

  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full bg-background relative">
      <AdminSidebar variant="admin" />

      <div className="flex flex-1 flex-col pb-16">
        <main className="w-full max-w-[1040px] mx-auto flex flex-col gap-6 sm:gap-8 py-8 lg:py-10 px-6 sm:px-10 lg:px-14">
          {/* Título da página */}
          <div className="mb-2 flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-[560px]">
              <h1 className="text-3xl sm:text-4xl font-bold text-verde-escuro leading-tight">
                Gestão de Escolas
              </h1>
              <p className="mt-2 max-w-md text-sm sm:text-base text-verde-musgo">
                Administre as unidades da rede conectadas ao sistema.
              </p>
            </div>
            <Link
              href="/cadastrarEscola"
              className="flex items-center gap-2 rounded-lg bg-verde-musgo hover:bg-white hover:text-verde-musgo border border-verde-musgo px-6 py-3 text-sm sm:text-base font-bold text-white shadow-sm transition cursor-pointer"
            >
              <MdAdd size={20} />
              Nova Escola
            </Link>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {estatisticas.map(({ label, value }) => (
              <div
                key={label}
                className="rounded-2xl border border-verde-musgo bg-white p-6 shadow-sm"
              >
                <p className="text-xs sm:text-sm font-semibold text-verde-musgo">{label}</p>
                <p className="mt-2 text-2xl sm:text-3xl font-bold text-verde-escuro">{value}</p>
              </div>
            ))}
          </div>

          {/* Busca e filtros */}
          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 sm:gap-6 rounded-2xl border border-b-4 border-verde-musgo bg-white px-5 py-4">
            <div className="flex flex-1 items-center gap-3 min-w-[200px]">
              <IoSearchSharp className="text-xl text-verde-musgo shrink-0" />
              <input
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar pelo nome da escola..."
                className="w-full bg-transparent text-sm text-verde-escuro placeholder-verde-musgo focus:outline-none"
              />
            </div>
            <Filtro
              label="Região"
              value={regiaoSelecionada}
              onChange={(e) => setRegiaoSelecionada(e.target.value)}
            >
              <option value="">Todas as Regiões</option>
              <option value="Região Norte">Região Norte</option>
              <option value="Região Sul">Região Sul</option>
              <option value="Região Centro">Região Centro</option>
            </Filtro>
            <Filtro
              label="Status"
              value={statusSelecionado}
              onChange={(e) => setStatusSelecionado(e.target.value)}
            >
              <option value="Todas">Todas</option>
              <option value="Ativas">Ativas</option>
              <option value="Inativas">Inativas</option>
            </Filtro>
          </div>

          {/* Solicitações de Vínculos */}
          <section className="rounded-2xl border border-verde-musgo bg-white px-5 sm:px-8 py-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 text-verde-escuro">
                <MdOutlineLink size={22} className="text-verde-musgo shrink-0" />
                <h2 className="text-xl font-bold text-verde-escuro">Solicitações de Vínculos</h2>
              </div>
              <span className="rounded-full bg-verde-pastel px-3 py-1 text-xs font-bold text-verde-musgo">
                {solicitacoesVinculo.length}{' '}
                {solicitacoesVinculo.length === 1 ? 'pendente' : 'pendentes'}
              </span>
            </div>

            {solicitacoesVinculo.length > 0 ? (
              <div className="flex flex-col gap-3.5">
                {solicitacoesVinculo.map((sol) => (
                  <div
                    key={sol.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-verde-musgo/30 bg-input-bg px-5 py-4"
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm sm:text-base font-bold text-verde-escuro">
                          {sol.userName}
                        </span>
                        {sol.userMatricula && (
                          <span className="text-xs font-semibold text-verde-musgo">
                            ({sol.userMatricula})
                          </span>
                        )}
                        <span className="rounded-full bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-500/50 px-2.5 py-0.5 text-[11px] font-bold">
                          Em Análise
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-verde-escuro">
                        Solicitou vínculo com: <strong>{sol.schoolName}</strong>
                      </p>
                      <p className="text-xs text-verde-musgo">
                        {sol.userEmail ? `${sol.userEmail} • ` : ''}
                        {formatarDataHora(sol.createdAt)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleAprovarSolicitacao(sol)}
                        className="flex items-center gap-1.5 rounded-xl bg-verde-musgo hover:bg-white hover:text-verde-musgo border border-verde-musgo px-4 py-2 text-xs font-bold uppercase text-white transition cursor-pointer"
                      >
                        <MdOutlineCheckCircle size={16} />
                        Aprovar
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRecusarSolicitacao(sol)}
                        className="flex items-center gap-1.5 rounded-xl border border-vermelho bg-white text-vermelho hover:bg-vermelho hover:text-white px-4 py-2 text-xs font-bold uppercase transition cursor-pointer"
                      >
                        <MdClose size={16} />
                        Recusar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-verde-musgo">
                Nenhuma solicitação de vínculo pendente de análise no momento.
              </p>
            )}
          </section>

          {/* Atividade recente */}
          <section className="rounded-2xl border border-verde-musgo bg-white px-5 sm:px-8 py-6">
            <h2 className="mb-5 text-xl font-bold text-verde-escuro">Atividade Recente</h2>
            {atividadesRecentes.length > 0 ? (
              <ul className="flex flex-col gap-4">
                {atividadesRecentes.map((esc) => (
                  <li key={esc.id} className="flex items-start gap-3">
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-verde-musgo" />
                    <div>
                      <p className="text-sm font-bold text-verde-escuro">
                        Unidade registrada: {esc.name}
                      </p>
                      <p className="text-xs text-verde-musgo">
                        {formatarDataHora(esc.createdAt)} • {esc.address || `Região ${esc.region}`}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-verde-musgo">Nenhuma atividade recente encontrada.</p>
            )}
          </section>

          {/* Escolas */}
          {carregando ? (
            <p className="py-10 text-center text-verde-musgo font-medium">Carregando escolas...</p>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {escolasFiltradas.map((escola) => (
                <CardEscolaAdmin
                  key={escola.id}
                  {...escola}
                  hrefDetalhes={`/admin/escolas/${escola.id}`}
                  onExcluir={handleAbrirConfirmacaoExcluir}
                  onAlternarStatus={handleAbrirConfirmacaoStatus}
                />
              ))}

              <Link
                href="/cadastrarEscola"
                className="flex min-h-56 flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-verde-musgo bg-white/50 text-verde-musgo hover:bg-verde-pastel cursor-pointer transition"
              >
                <MdAddCircleOutline size={36} />
                <span className="text-sm font-bold">Registrar Nova Escola</span>
              </Link>
            </div>
          )}

          {/* Modal / Card Detalhes da Escola (Figma 889:414) */}
          {escolaSelecionada && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4"
              onClick={() => setEscolaSelecionada(null)}
            >
              <div
                className="w-full max-w-[900px] rounded-2xl border border-verde-musgo bg-white p-6 sm:p-8 shadow-2xl flex flex-col gap-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-col gap-2">
                    <span className="w-fit rounded-full bg-verde-limao px-3 py-0.5 text-[10px] font-bold uppercase text-verde-escuro">
                      Polo Ativo
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-verde-escuro">
                      {escolaSelecionada.name}
                    </h3>
                    <p className="text-sm text-verde-musgo">
                      {escolaSelecionada.address ||
                        `Região ${escolaSelecionada.region} • Caraguatatuba - SP`}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href={`/cadastrarEscola?id=${escolaSelecionada.id}`}
                      title="Editar escola"
                      className="p-2 text-verde-musgo hover:text-verde-escuro transition"
                    >
                      <MdOutlineEdit size={20} />
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        const esc = escolaSelecionada
                        setEscolaSelecionada(null)
                        handleAbrirConfirmacaoExcluir(esc.id, esc.name)
                      }}
                      title="Excluir escola"
                      className="p-2 text-vermelho hover:opacity-75 transition cursor-pointer"
                    >
                      <MdOutlineDeleteOutline size={20} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setEscolaSelecionada(null)}
                      title="Fechar"
                      className="p-2 text-verde-escuro hover:bg-stone-100 rounded-lg transition cursor-pointer"
                    >
                      <MdClose size={22} />
                    </button>
                  </div>
                </div>

                <div className="border-t border-verde-escuro/15 pt-6 grid grid-cols-2 sm:grid-cols-4 items-center gap-6">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-verde-musgo">
                      Professores
                    </span>
                    <span className="text-2xl font-bold text-verde-escuro">
                      {escolaSelecionada.teachers}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-verde-musgo">
                      Equipes
                    </span>
                    <span className="text-2xl font-bold text-verde-escuro">
                      {escolaSelecionada.teams}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-verde-musgo">
                      Projetos
                    </span>
                    <span className="text-2xl font-bold text-verde-escuro">
                      {escolaSelecionada.teams}
                    </span>
                  </div>

                  <div className="flex sm:justify-end">
                    <Link
                      href={`/projetos?escola=${encodeURIComponent(escolaSelecionada.name)}`}
                      className="inline-flex items-center gap-2 text-sm font-bold text-verde-musgo hover:text-verde-escuro transition"
                    >
                      <span>Ver Detalhes</span>
                      <MdArrowForward size={18} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modal Interativo Padronizado (Confirmação / Sucesso / Erro) */}
      {modal.aberto && (
        <ModalConfirmacao
          aberto={modal.aberto}
          tipo={modal.tipo}
          titulo={modal.titulo}
          mensagem={modal.mensagem}
          textoConfirmar={modal.textoConfirmar || 'Excluir'}
          textoCancelar="Cancelar"
          onConfirmar={
            modal.tipo === 'confirmacao'
              ? handleConfirmarAcao
              : () => setModal((prev) => ({ ...prev, aberto: false }))
          }
          onCancelar={() => setModal((prev) => ({ ...prev, aberto: false }))}
        />
      )}
    </div>
  )
}
