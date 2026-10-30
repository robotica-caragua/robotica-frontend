'use client'

import { useEffect, useState } from 'react'
import {
  MdAdd,
  MdAddCircleOutline,
  MdArrowForward,
  MdClose,
  MdFilterList,
  MdInfoOutline
} from 'react-icons/md'
import { IoSearchSharp } from 'react-icons/io5'
import { IoIosArrowDown } from 'react-icons/io'
import { AdminSidebar } from '@/components/AdminSidebar'
import { ModalConfirmacao } from '@/components/ModalConfirmacao'
import { apiAuth, apiEscolas, apiProjetos, apiUsuarios, obterToken } from '@/services/api'

export default function GestaoGruposPage() {
  const [equipes, setEquipes] = useState([])
  const [escolaPadrao, setEscolaPadrao] = useState('Rede Municipal de Caraguatatuba')
  const [escolaPadraoId, setEscolaPadraoId] = useState(null)
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
      apiEscolas.listar().catch(() => []),
      apiProjetos.listar().catch(() => [])
    ])
      .then(async ([user, listaEscolas, listaProjetos]) => {
        if (!ativo) return

        let escNome = listaEscolas?.[0]?.name || 'Rede Municipal de Caraguatatuba'
        let escId = listaEscolas?.[0]?.id || null

        if (user?.schoolId) {
          escId = user.schoolId
          const encontrada = listaEscolas.find((e) => e.id === user.schoolId)
          if (encontrada?.name) {
            escNome = encontrada.name
          } else if (user.id) {
            const escUsuario = await apiUsuarios.buscarEscolaDoUsuario(user.id).catch(() => null)
            if (escUsuario?.name) escNome = escUsuario.name
          }
        }

        if (!ativo) return
        setEscolaPadrao(escNome)
        setEscolaPadraoId(escId)

        const equipesMapeadas = (Array.isArray(listaProjetos) ? listaProjetos : []).map((proj) => ({
          id: proj.id,
          name: proj.name,
          school: proj.school?.name || escNome,
          schoolId: proj.schoolId || escId,
          students: proj.description || '',
          grade: '8º Ano',
          active: true
        }))

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

    const descricaoEquipe = [alunos.trim(), serie].filter(Boolean).join(' • ')

    try {
      if (idEdicao && escolaPadraoId) {
        const atualizado = await apiProjetos.atualizar(idEdicao, {
          name: nomeEquipe.trim(),
          description: descricaoEquipe || 'Equipe de Robótica',
          schoolId: escolaPadraoId
        })
        setEquipes((prev) =>
          prev.map((eq) =>
            eq.id === idEdicao
              ? {
                  ...eq,
                  name: atualizado?.name || nomeEquipe.trim(),
                  students: alunos.trim(),
                  grade: serie || eq.grade
                }
              : eq
          )
        )
      } else if (escolaPadraoId) {
        const criado = await apiProjetos.criar({
          name: nomeEquipe.trim(),
          description: descricaoEquipe || 'Equipe de Robótica',
          schoolId: escolaPadraoId
        })
        setEquipes((prev) => [
          ...prev,
          {
            id: criado?.id || Date.now(),
            name: criado?.name || nomeEquipe.trim(),
            school: criado?.school?.name || escolaPadrao,
            schoolId: criado?.schoolId || escolaPadraoId,
            students: alunos.trim(),
            grade: serie || '8º Ano',
            active: true
          }
        ])
      } else {
        throw new Error('Faça login e selecione uma escola vinculada para cadastrar a equipe.')
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
    <div className="flex flex-col lg:flex-row min-h-screen">
      <AdminSidebar variant="professor" />

      <div className="flex flex-1 flex-col px-4 sm:px-6 lg:px-10 pb-16">
        <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 pt-8 lg:pt-12">
          {/* Cabeçalho */}
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xl font-bold text-verde-musgo">{totalFormatado}</p>
              <h1 className="text-2xl font-bold text-verde-escuro">Equipes Ativas</h1>
            </div>

            <button
              type="button"
              onClick={() => {
                setIdEdicao(null)
                setNomeEquipe('')
                setAlunos('')
                setSerie('')
                setModalAberto(true)
              }}
              className="flex items-center gap-3 rounded-lg bg-verde-musgo px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:brightness-90 cursor-pointer"
            >
              <MdAdd size={18} />
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
                  <span className="inline-flex w-fit items-center gap-1.5 rounded-md bg-verde-oliva px-2.5 py-1 text-[10px] font-bold uppercase text-white">
                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    Equipe Ativa
                  </span>

                  <div className="mt-4 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-verde-escuro">{equipe.name}</h3>
                    <MdInfoOutline size={20} className="text-verde-escuro" />
                  </div>

                  <div className="mt-3 mb-6 border-l-2 border-verde-musgo pl-3">
                    <p className="max-w-[11rem] text-xs leading-relaxed text-verde-musgo">
                      {equipe.school}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIdEdicao(equipe.id)
                      setNomeEquipe(equipe.name)
                      setAlunos(equipe.students || '')
                      setSerie(equipe.grade || '')
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

              <div>
                <label className="mb-1.5 block text-base font-medium text-verde-escuro">
                  Alunos integrantes
                </label>
                <input
                  type="text"
                  value={alunos}
                  onChange={(e) => setAlunos(e.target.value)}
                  placeholder="Digite o nome dos alunos integrantes..."
                  className="w-full rounded-lg border border-verde-musgo bg-input-bg px-4 py-3 text-sm text-verde-escuro placeholder-verde-musgo/70 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-base font-medium text-verde-escuro">
                  Série
                </label>
                <div className="relative">
                  <select
                    value={serie}
                    onChange={(e) => setSerie(e.target.value)}
                    className="w-full appearance-none rounded-lg border border-verde-musgo bg-input-bg px-4 py-3 pr-10 text-sm text-verde-musgo focus:outline-none cursor-pointer"
                  >
                    <option value="">Selecione a série...</option>
                    <option value="6º Ano">6º Ano</option>
                    <option value="7º Ano">7º Ano</option>
                    <option value="8º Ano">8º Ano</option>
                    <option value="9º Ano">9º Ano</option>
                  </select>
                  <IoIosArrowDown className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-xl text-verde-musgo" />
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
        textoBotaoSucesso="Voltar para Equipes"
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
