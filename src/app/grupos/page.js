'use client'

import { Select } from '@/components/Select'
import { useEffect, useState } from 'react'
import {
  MdAdd,
  MdAddCircleOutline,
  MdArrowForward,
  MdClose,
  MdFilterList,
  MdInfoOutline,
  MdOutlinePeopleAlt
} from 'react-icons/md'
import { IoSearchSharp } from 'react-icons/io5'
import { AdminSidebar } from '@/components/AdminSidebar'
import { ModalConfirmacao } from '@/components/ModalConfirmacao'
import { apiAuth, apiEscolas, apiGrupos, apiUsuarios, obterToken } from '@/services/api'

export function extrairAlunosOrdenados(textoBruto = '') {
  const textoSemSerie = String(textoBruto || '')
    .split('•')[0]
    .trim()
  if (!textoSemSerie || textoSemSerie === 'Equipe de Robótica') return []

  const nomes = textoSemSerie
    .split(/[,;\n]+|\s+e\s+/i)
    .map((n) => n.trim())
    .filter(Boolean)

  return [...nomes].sort((a, b) => a.localeCompare(b, 'pt-BR', { sensitivity: 'base' }))
}

export function formatarAlunosOrdenados(textoBruto = '') {
  const lista = extrairAlunosOrdenados(textoBruto)
  if (lista.length === 0) return ''
  if (lista.length === 1) return lista[0]
  return `${lista.slice(0, -1).join(', ')} e ${lista[lista.length - 1]}`
}

export default function GestaoGruposPage() {
  const [equipes, setEquipes] = useState([])
  const [escolasDisponiveis, setEscolasDisponiveis] = useState([])
  const [escolaPadrao, setEscolaPadrao] = useState('Rede Municipal de Caraguatatuba')
  const [escolaPadraoId, setEscolaPadraoId] = useState(null)
  const [escolaModalId, setEscolaModalId] = useState('')
  const [carregando, setCarregando] = useState(true)
  const [busca, setBusca] = useState('')
  const [modalAberto, setModalAberto] = useState(false)
  const [idEdicao, setIdEdicao] = useState(null)
  const [nomeEquipe, setNomeEquipe] = useState('')
  const [alunos, setAlunos] = useState('')
  const [serie, setSerie] = useState('')
  const [modalConfirmacao, setModalConfirmacao] = useState({
    aberto: false,
    tipo: 'sucesso',
    mensagemErro: ''
  })

  useEffect(() => {
    let ativo = true

    Promise.all([
      obterToken() ? apiAuth.me().catch(() => null) : Promise.resolve(null),
      apiEscolas.listarDoUsuarioLogado().catch(() => []),
      apiEscolas.listar().catch(() => [])
    ])
      .then(async ([user, escolasDoUsuario, todasEscolas]) => {
        if (!ativo) return

        const listaEscolas =
          Array.isArray(escolasDoUsuario) && escolasDoUsuario.length > 0
            ? escolasDoUsuario
            : Array.isArray(todasEscolas)
              ? todasEscolas
              : []

        setEscolasDisponiveis(listaEscolas)

        let escNome = listaEscolas?.[0]?.name || 'Rede Municipal de Caraguatatuba'
        let escId = listaEscolas?.[0]?.id || null

        if (user?.schoolId) {
          const encontrada = listaEscolas.find((e) => Number(e.id) === Number(user.schoolId))
          if (encontrada) {
            escId = encontrada.id
            escNome = encontrada.name
          } else if (user.id) {
            const escUsuario = await apiUsuarios.buscarEscolaDoUsuario(user.id).catch(() => null)
            if (escUsuario?.id) {
              escId = escUsuario.id
              escNome = escUsuario.name || escNome
            }
          }
        }

        if (!ativo) return
        setEscolaPadrao(escNome)
        setEscolaPadraoId(escId)
        setEscolaModalId(escId ? String(escId) : '')

        const listaGrupos = apiGrupos.listar()
        const equipesMapeadas = (Array.isArray(listaGrupos) ? listaGrupos : []).map((grp) => {
          const alunosOrdenados = formatarAlunosOrdenados(grp.students || '')
          return {
            id: grp.id,
            name: grp.name,
            school: grp.school || escNome,
            schoolId: grp.schoolId || escId,
            students: alunosOrdenados,
            studentsList: extrairAlunosOrdenados(grp.students || ''),
            grade: grp.grade || '8º Ano',
            active: true
          }
        })

        setEquipes(equipesMapeadas)
      })
      .finally(() => {
        if (ativo) setCarregando(false)
      })

    return () => {
      ativo = false
    }
  }, [])

  const equipesFiltradas = equipes.filter(
    (equipe) =>
      equipe.name.toLowerCase().includes(busca.toLowerCase()) ||
      equipe.students?.toLowerCase().includes(busca.toLowerCase())
  )

  async function handleSalvarEquipe(e) {
    e.preventDefault()
    if (!nomeEquipe.trim()) {
      setModalConfirmacao({ aberto: true, tipo: 'erro', mensagemErro: '' })
      return
    }

    const idEscolaEscolhida = Number(escolaModalId || escolaPadraoId || escolasDisponiveis[0]?.id)
    const objEscolaEscolhida = escolasDisponiveis.find(
      (esc) => Number(esc.id) === idEscolaEscolhida
    )
    const nomeEscolaEscolhida = objEscolaEscolhida?.name || escolaPadrao

    const alunosFormatados = formatarAlunosOrdenados(alunos)
    const listaAlunosOrdenados = extrairAlunosOrdenados(alunos)

    try {
      if (!idEscolaEscolhida) {
        throw new Error('Cadastre ao menos uma escola antes de registrar uma equipe.')
      }

      if (idEdicao) {
        const atualizado = apiGrupos.atualizar(idEdicao, {
          name: nomeEquipe.trim(),
          students: alunosFormatados,
          grade: serie || '8º Ano',
          schoolId: idEscolaEscolhida,
          schoolName: nomeEscolaEscolhida
        })
        setEquipes((prev) =>
          prev.map((eq) =>
            eq.id === idEdicao
              ? {
                  ...eq,
                  name: atualizado?.name || nomeEquipe.trim(),
                  school: nomeEscolaEscolhida,
                  schoolId: idEscolaEscolhida,
                  students: alunosFormatados,
                  studentsList: listaAlunosOrdenados,
                  grade: serie || eq.grade
                }
              : eq
          )
        )
      } else {
        const criado = apiGrupos.criar({
          name: nomeEquipe.trim(),
          students: alunosFormatados,
          grade: serie || '8º Ano',
          schoolId: idEscolaEscolhida,
          schoolName: nomeEscolaEscolhida
        })
        setEquipes((prev) => [
          ...prev,
          {
            id: criado.id,
            name: criado.name,
            school: criado.school || nomeEscolaEscolhida,
            schoolId: criado.schoolId || idEscolaEscolhida,
            students: alunosFormatados,
            studentsList: listaAlunosOrdenados,
            grade: serie || '8º Ano',
            active: true
          }
        ])
      }

      setIdEdicao(null)
      setNomeEquipe('')
      setAlunos('')
      setSerie('')
      setModalAberto(false)
      setModalConfirmacao({ aberto: true, tipo: 'sucesso', mensagemErro: '' })
    } catch (err) {
      setModalAberto(false)
      setModalConfirmacao({
        aberto: true,
        tipo: 'erro',
        mensagemErro: err?.message || ''
      })
    }
  }

  const totalFormatado = String(equipes.length).padStart(2, '0')

  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full bg-background relative">
      <AdminSidebar variant="professor" />

      <div className="flex flex-1 flex-col pb-16">
        <main className="w-full max-w-[1040px] mx-auto flex flex-col gap-6 sm:gap-8 py-8 lg:py-10 px-6 sm:px-10 lg:px-14">
          {/* Cabeçalho */}
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xl font-bold text-verde-musgo">{totalFormatado}</p>
              <h1 className="text-3xl sm:text-4xl font-bold text-verde-escuro leading-tight">
                Equipes Ativas
              </h1>
            </div>

            <button
              type="button"
              onClick={() => {
                setIdEdicao(null)
                setNomeEquipe('')
                setAlunos('')
                setSerie('')
                setEscolaModalId(
                  escolaPadraoId
                    ? String(escolaPadraoId)
                    : escolasDisponiveis[0]?.id
                      ? String(escolasDisponiveis[0].id)
                      : ''
                )
                setModalAberto(true)
              }}
              className="flex items-center gap-2 rounded-lg bg-verde-musgo hover:bg-white hover:text-verde-musgo border border-verde-musgo px-6 py-3 text-sm sm:text-base font-bold text-white shadow-sm transition cursor-pointer"
            >
              <MdAdd size={20} />
              Nova Equipe
            </button>
          </div>

          {/* Barra de busca e ordenação */}
          <div className="flex flex-wrap items-center gap-4 rounded-xl border border-verde-musgo bg-white px-4 py-3">
            <div className="flex flex-1 items-center gap-3">
              <IoSearchSharp className="text-xl text-verde-musgo" />
              <input
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar equipe ou aluno..."
                className="w-full bg-transparent text-sm text-verde-escuro placeholder-verde-musgo focus:outline-none"
              />
            </div>

            <button
              type="button"
              className="flex items-center gap-2 border-l border-verde-musgo/30 pl-5 text-xs font-bold uppercase text-verde-musgo hover:text-verde-escuro cursor-pointer"
            >
              <MdFilterList size={18} />
              Ordenar por mais recente
            </button>
          </div>

          {/* Grade de Equipes */}
          {carregando ? (
            <p className="py-10 text-center text-verde-musgo font-medium">Carregando equipes...</p>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {equipesFiltradas.map((equipe) => (
                <div
                  key={equipe.id}
                  className="flex flex-col rounded-2xl border border-verde-musgo bg-white p-5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex w-fit items-center gap-1.5 rounded-md bg-verde-oliva px-2.5 py-1 text-[10px] font-bold uppercase text-white">
                      <span className="h-1.5 w-1.5 rounded-full bg-white" />
                      Equipe Ativa
                    </span>
                    {equipe.grade && (
                      <span className="rounded-full bg-verde-pastel px-2.5 py-0.5 text-[11px] font-bold text-verde-musgo">
                        {equipe.grade}
                      </span>
                    )}
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-verde-escuro">{equipe.name}</h3>
                    <MdInfoOutline size={20} className="text-verde-escuro" />
                  </div>

                  <div className="mt-3 mb-3 border-l-2 border-verde-musgo pl-3">
                    <p className="text-xs font-semibold leading-relaxed text-verde-musgo">
                      {equipe.school}
                    </p>
                  </div>

                  {equipe.students && (
                    <div className="mb-5 rounded-xl bg-input-bg border border-verde-musgo/30 p-3">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase text-verde-musgo mb-1">
                        <MdOutlinePeopleAlt size={14} />
                        <span>Integrantes (A-Z)</span>
                      </div>
                      <p className="text-xs text-verde-escuro leading-relaxed">{equipe.students}</p>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setIdEdicao(equipe.id)
                      setNomeEquipe(equipe.name)
                      setAlunos(equipe.students || '')
                      setSerie(equipe.grade || '')
                      setEscolaModalId(
                        equipe.schoolId
                          ? String(equipe.schoolId)
                          : escolaPadraoId
                            ? String(escolaPadraoId)
                            : ''
                      )
                      setModalAberto(true)
                    }}
                    className="mx-auto mt-auto flex items-center justify-center gap-2 rounded-lg border border-b-3 border-verde-musgo bg-white px-5 py-2 text-xs font-bold text-verde-escuro hover:bg-verde-pastel cursor-pointer"
                  >
                    Editar Equipe
                    <MdArrowForward size={15} />
                  </button>
                </div>
              ))}

              {/* Card tracejado Criar Nova Equipe */}
              <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-verde-musgo bg-white/40 p-5 text-center">
                <MdAddCircleOutline size={36} className="text-verde-escuro" />
                <h3 className="mt-2 text-base font-bold text-verde-escuro">Criar Nova Equipe</h3>
                <p className="mt-1 mb-4 max-w-[13rem] text-xs leading-relaxed text-verde-musgo">
                  Organize seus alunos em times de trabalho para desenvolver novos projetos.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIdEdicao(null)
                    setNomeEquipe('')
                    setAlunos('')
                    setSerie('')
                    setEscolaModalId(
                      escolaPadraoId
                        ? String(escolaPadraoId)
                        : escolasDisponiveis[0]?.id
                          ? String(escolasDisponiveis[0].id)
                          : ''
                    )
                    setModalAberto(true)
                  }}
                  className="rounded-lg border-b-3 border-verde-escuro bg-verde-limao px-5 py-2 text-xs font-bold text-verde-escuro hover:brightness-95 cursor-pointer"
                >
                  Adicionar Equipe
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modal Nova/Editar Equipe */}
      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="relative w-full max-w-xl rounded-[36px] border border-verde-musgo bg-white p-10 shadow-xl">
            <button
              type="button"
              onClick={() => setModalAberto(false)}
              aria-label="Fechar modal"
              className="absolute top-8 right-8 text-verde-musgo hover:text-verde-escuro cursor-pointer"
            >
              <MdClose size={24} />
            </button>

            <h2 className="text-2xl font-bold text-verde-escuro">
              {idEdicao ? 'Editar ' : 'Nova '}
              <span className="text-verde-musgo">Equipe!</span>
            </h2>

            <form onSubmit={handleSalvarEquipe} className="mt-6 flex flex-col gap-5">
              <div>
                <label className="mb-1.5 block text-base font-medium text-verde-escuro">
                  Nome da equipe
                </label>
                <input
                  type="text"
                  value={nomeEquipe}
                  onChange={(e) => setNomeEquipe(e.target.value)}
                  placeholder="Ex: Robôs do 8º Ano"
                  required
                  className="w-full rounded-lg border border-verde-musgo bg-input-bg px-4 py-3 text-sm text-verde-escuro placeholder-verde-musgo/70 focus:outline-none"
                />
              </div>

              {escolasDisponiveis.length > 0 && (
                <div>
                  <label className="mb-1.5 block text-base font-medium text-verde-escuro">
                    Unidade Escolar
                  </label>
                  <Select
                    value={escolaModalId}
                    onChange={(e) => setEscolaModalId(e.target.value)}
                    className="w-full appearance-none rounded-lg border border-verde-musgo bg-input-bg px-4 py-3 pr-10 text-sm text-verde-escuro focus:outline-none cursor-pointer"
                  >
                    {escolasDisponiveis.map((esc) => (
                      <option key={esc.id} value={String(esc.id)}>
                        {esc.name}
                      </option>
                    ))}
                  </Select>
                </div>
              )}

              <div>
                <label className="mb-1.5 block text-base font-medium text-verde-escuro">
                  Alunos integrantes
                </label>
                <input
                  type="text"
                  value={alunos}
                  onChange={(e) => setAlunos(e.target.value)}
                  placeholder="Ex: João, Ana Laura, Sthefany, Fernanda..."
                  className="w-full rounded-lg border border-verde-musgo bg-input-bg px-4 py-3 text-sm text-verde-escuro placeholder-verde-musgo/70 focus:outline-none"
                />
                {alunos.trim() && (
                  <p className="mt-1.5 text-xs text-verde-musgo">
                    Ordem alfabética: <strong>{formatarAlunosOrdenados(alunos)}</strong>
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-base font-medium text-verde-escuro">
                  Série
                </label>
                <div className="relative">
                  <Select
                    value={serie}
                    onChange={(e) => setSerie(e.target.value)}
                    className="w-full appearance-none rounded-lg border border-verde-musgo bg-input-bg px-4 py-3 pr-10 text-sm text-verde-musgo focus:outline-none cursor-pointer"
                  >
                    <option value="">Selecione a série...</option>
                    <option value="6º Ano">6º Ano</option>
                    <option value="7º Ano">7º Ano</option>
                    <option value="8º Ano">8º Ano</option>
                    <option value="9º Ano">9º Ano</option>
                  </Select>
                </div>
              </div>

              <button
                type="submit"
                className="mx-auto mt-3 rounded-xl border-b-4 border-verde-escuro bg-verde-limao px-6 py-2.5 text-sm font-bold text-verde-escuro hover:brightness-95 cursor-pointer"
              >
                {idEdicao ? 'Salvar Alterações' : 'Adicionar Equipe'}
              </button>
            </form>
          </div>
        </div>
      )}

      <ModalConfirmacao
        aberto={modalConfirmacao.aberto}
        tipo={modalConfirmacao.tipo}
        titulo={
          modalConfirmacao.tipo === 'sucesso' ? 'Equipe salva com' : 'Não foi possível salvar'
        }
        destaque={modalConfirmacao.tipo === 'sucesso' ? 'sucesso!' : 'a equipe!'}
        mensagem={
          modalConfirmacao.tipo === 'sucesso'
            ? 'A equipe foi registrada no servidor. Agora você já pode vincular novos projetos!'
            : modalConfirmacao.mensagemErro ||
              'Verifique se todos os campos foram preenchidos corretamente e tente salvar mais uma vez.'
        }
        textoBotaoSucesso="Voltar"
        onConfirmar={() =>
          setModalConfirmacao({ aberto: false, tipo: 'sucesso', mensagemErro: '' })
        }
        onCancelar={() => setModalConfirmacao({ aberto: false, tipo: 'sucesso', mensagemErro: '' })}
        onTentarNovamente={() =>
          setModalConfirmacao({ aberto: false, tipo: 'sucesso', mensagemErro: '' })
        }
      />
    </div>
  )
}
