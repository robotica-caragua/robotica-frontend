'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { SideBarAdmin } from '@/components/SideBarAdmin'
import { ModalConfirmacao } from '@/components/ModalConfirmacao'
import {
  apiEscolas,
  apiProjetos,
  apiTutoriais,
  apiUsuarios,
  mapearProjetoDaApi,
  mapearTutorialDaApi
} from '@/services/api'
import semaforo from '@/assets/semaforo.png'
import containerImg from '@/assets/container.png'
import {
  MdArrowBack,
  MdOutlineSchool,
  MdOutlineLocationOn,
  MdOutlineEdit,
  MdOutlineDeleteOutline,
  MdOutlineDescription,
  MdOutlineFolder,
  MdOutlineBuild,
  MdOutlinePeopleAlt,
  MdArrowForward
} from 'react-icons/md'

function extrairRegiao(endereco = '') {
  const upper = String(endereco || '').toUpperCase()
  if (upper.includes('SUL')) return 'Sul'
  if (upper.includes('CENTRO')) return 'Centro'
  return 'Norte'
}

export default function DetalhesEscolaAdminPage() {
  const params = useParams()
  const router = useRouter()
  const idEscola = Number(params?.id)

  const idValido = Boolean(idEscola && !Number.isNaN(idEscola))

  const [escola, setEscola] = useState(null)
  const [projetos, setProjetos] = useState([])
  const [tutoriais, setTutoriais] = useState([])
  const [professores, setProfessores] = useState([])
  const [carregando, setCarregando] = useState(idValido)
  const [modal, setModal] = useState({
    aberto: false,
    tipo: 'confirmacao',
    titulo: '',
    mensagem: ''
  })

  useEffect(() => {
    let ativo = true

    if (!idValido) {
      return
    }

    Promise.all([
      apiEscolas.buscarPorId(idEscola).catch(async () => {
        const lista = await apiEscolas.listar().catch(() => [])
        return lista.find((item) => Number(item.id) === idEscola) || null
      }),
      apiProjetos.listar().catch(() => []),
      apiTutoriais.listar().catch(() => []),
      apiUsuarios.listar().catch(() => [])
    ])
      .then(([escolaApi, listaProjetos, listaTutoriais, listaUsuarios]) => {
        if (!ativo) return
        setEscola(escolaApi || null)

        const projetosDaEscola = (Array.isArray(listaProjetos) ? listaProjetos : [])
          .filter(
            (p) =>
              Number(p.schoolId) === idEscola ||
              Number(p.school?.id) === idEscola ||
              (escolaApi?.name && p.school?.name === escolaApi.name)
          )
          .map((item, idx) => mapearProjetoDaApi(item, idx % 2 === 0 ? containerImg : semaforo))
        setProjetos(projetosDaEscola)

        const tutoriaisDaEscola = (Array.isArray(listaTutoriais) ? listaTutoriais : [])
          .filter(
            (t) =>
              Number(t.schoolId) === idEscola ||
              Number(t.school?.id) === idEscola ||
              (escolaApi?.name && t.school?.name === escolaApi.name)
          )
          .map((item, idx) => mapearTutorialDaApi(item, idx % 2 === 0 ? semaforo : containerImg))
        setTutoriais(tutoriaisDaEscola)

        const docentesDaEscola = (Array.isArray(listaUsuarios) ? listaUsuarios : []).filter(
          (u) =>
            Number(u.schoolId) === idEscola ||
            (Array.isArray(u.schools) && u.schools.some((s) => Number(s?.id) === idEscola))
        )
        setProfessores(docentesDaEscola)
      })
      .finally(() => {
        if (ativo) setCarregando(false)
      })

    return () => {
      ativo = false
    }
  }, [idEscola, idValido])

  const regiao = useMemo(() => extrairRegiao(escola?.address), [escola?.address])

  const descricaoCompleta = useMemo(() => {
    if (escola?.description && String(escola.description).trim()) {
      return String(escola.description).trim()
    }
    if (!escola) return ''
    return `A unidade ${escola.name} integra o circuito municipal de Robótica Educacional e Sustentável de Caraguatatuba (Região ${regiao}), desenvolvendo oficinas práticas, protótipos de baixo custo e projetos colaborativos com estudantes e docentes da rede.`
  }, [escola, regiao])

  const handleConfirmarExclusao = async () => {
    if (!escola?.id) return
    try {
      await apiEscolas.excluir(escola.id)
      setModal({
        aberto: true,
        tipo: 'sucesso',
        titulo: 'Escola excluída com sucesso!',
        mensagem: `A unidade "${escola.name}" foi removida da rede.`
      })
    } catch (err) {
      setModal({
        aberto: true,
        tipo: 'erro',
        titulo: 'Erro ao excluir escola',
        mensagem: err?.message || 'Não foi possível excluir esta unidade escolar.'
      })
    }
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full bg-background relative">
      <SideBarAdmin />

      <div className="flex flex-1 flex-col pb-16">
        <main className="w-full max-w-[1040px] mx-auto flex flex-col gap-6 sm:gap-8 py-8 lg:py-10 px-6 sm:px-10 lg:px-14">
          {/* Topo / Voltar */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link
              href="/escolas"
              className="inline-flex items-center gap-2 text-sm font-bold text-verde-musgo hover:text-verde-escuro transition"
            >
              <MdArrowBack size={18} />
              <span>Voltar para Gestão de Escolas</span>
            </Link>

            {escola && (
              <div className="flex items-center gap-3">
                <Link
                  href={`/cadastrarEscola?id=${escola.id}`}
                  className="inline-flex items-center gap-2 rounded-xl border border-verde-musgo bg-white hover:bg-verde-pastel px-4 py-2.5 text-xs sm:text-sm font-bold text-verde-escuro transition"
                >
                  <MdOutlineEdit size={18} />
                  <span>Editar Escola</span>
                </Link>
                <button
                  type="button"
                  onClick={() =>
                    setModal({
                      aberto: true,
                      tipo: 'confirmacao',
                      titulo: 'Excluir Escola?',
                      mensagem: `Deseja realmente remover a escola "${escola.name}" da rede?`
                    })
                  }
                  className="inline-flex items-center gap-2 rounded-xl border border-vermelho bg-white hover:bg-vermelho/5 px-4 py-2.5 text-xs sm:text-sm font-bold text-vermelho transition cursor-pointer"
                >
                  <MdOutlineDeleteOutline size={18} />
                  <span>Excluir</span>
                </button>
              </div>
            )}
          </div>

          {carregando ? (
            <p className="py-12 text-center text-verde-musgo font-medium">
              Carregando detalhes da unidade escolar...
            </p>
          ) : !escola ? (
            <section className="rounded-2xl border border-verde-musgo bg-white p-8 text-center flex flex-col items-center gap-4">
              <p className="text-lg font-bold text-verde-escuro">Unidade escolar não encontrada.</p>
              <p className="text-sm text-verde-musgo">
                Verifique se a escola selecionada ainda está cadastrada no sistema.
              </p>
              <Link
                href="/escolas"
                className="px-6 py-2.5 rounded-xl bg-verde-musgo text-white text-sm font-bold hover:opacity-90 transition"
              >
                Voltar para Escolas
              </Link>
            </section>
          ) : (
            <>
              {/* Card Principal da Escola */}
              <section className="rounded-2xl border border-verde-musgo bg-white p-6 sm:p-8 shadow-sm flex flex-col gap-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="rounded-xl bg-verde-pastel p-3.5 text-verde-musgo shrink-0">
                      <MdOutlineSchool size={30} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="w-fit rounded-full bg-verde-limao px-3 py-0.5 text-[10px] font-bold uppercase text-verde-escuro">
                          Polo Ativo
                        </span>
                        <span className="text-xs font-semibold text-verde-musgo">
                          Região {regiao}
                        </span>
                      </div>
                      <h1 className="text-2xl sm:text-3xl font-bold text-verde-escuro leading-tight">
                        {escola.name}
                      </h1>
                      <p className="inline-flex items-center gap-1.5 text-sm text-verde-musgo">
                        <MdOutlineLocationOn size={18} className="shrink-0" />
                        <span>{escola.address || `Região ${regiao} • Caraguatatuba - SP`}</span>
                      </p>
                    </div>
                  </div>

                  {escola.createdAt && (
                    <span className="text-xs font-semibold text-verde-musgo">
                      Registrada em {new Date(escola.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                  )}
                </div>

                {/* Estatísticas da Unidade */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-verde-escuro/10 pt-6">
                  <div className="rounded-xl border border-verde-musgo/30 bg-input-bg p-4 flex items-center gap-3.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-verde-pastel text-verde-musgo">
                      <MdOutlineFolder size={22} />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase text-verde-musgo">
                        Projetos Vinculados
                      </p>
                      <p className="text-2xl font-bold text-verde-escuro">{projetos.length}</p>
                    </div>
                  </div>

                  <div className="rounded-xl border border-verde-musgo/30 bg-input-bg p-4 flex items-center gap-3.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-verde-pastel text-verde-musgo">
                      <MdOutlinePeopleAlt size={22} />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase text-verde-musgo">
                        Docentes Vinculados
                      </p>
                      <p className="text-2xl font-bold text-verde-escuro">{professores.length}</p>
                    </div>
                  </div>

                  <div className="rounded-xl border border-verde-musgo/30 bg-input-bg p-4 flex items-center gap-3.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-verde-pastel text-verde-musgo">
                      <MdOutlineBuild size={22} />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase text-verde-musgo">
                        Tutoriais Publicados
                      </p>
                      <p className="text-2xl font-bold text-verde-escuro">{tutoriais.length}</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Descrição Completa da Escola */}
              <section className="rounded-2xl border border-verde-musgo bg-white p-6 sm:p-8 shadow-sm flex flex-col gap-4">
                <div className="flex items-center gap-2.5 text-verde-escuro">
                  <MdOutlineDescription size={22} className="text-verde-musgo shrink-0" />
                  <h2 className="text-lg sm:text-xl font-bold">Sobre a Unidade Escolar</h2>
                </div>
                <p className="text-sm sm:text-base text-verde-escuro/90 leading-relaxed whitespace-pre-line">
                  {descricaoCompleta}
                </p>

                {professores.length > 0 && (
                  <div className="pt-3 border-t border-verde-escuro/10 flex flex-col gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-verde-musgo">
                      Corpo Docente Vinculado
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {professores.map((prof) => (
                        <span
                          key={prof.id}
                          className="inline-flex items-center gap-1.5 rounded-full bg-verde-pastel px-3.5 py-1 text-xs font-bold text-verde-escuro"
                        >
                          {prof.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </section>

              {/* Listagem de Projetos Vinculados à Escola */}
              <section className="flex flex-col gap-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-verde-escuro">
                      Projetos Vinculados à Escola
                    </h2>
                    <p className="text-xs sm:text-sm text-verde-musgo">
                      Todos os projetos desenvolvidos por turmas e equipes desta unidade.
                    </p>
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-verde-musgo">
                    {projetos.length} {projetos.length === 1 ? 'projeto' : 'projetos'}
                  </span>
                </div>

                {projetos.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projetos.map((projeto) => (
                      <article
                        key={projeto.id}
                        className="bg-white rounded-2xl border border-verde-musgo shadow-sm overflow-hidden flex flex-col hover:shadow-md transition"
                      >
                        <div className="relative w-full h-40 bg-stone-100 overflow-hidden">
                          <Image
                            src={projeto.imagem || semaforo}
                            alt={projeto.titulo}
                            fill
                            className="object-cover"
                          />
                        </div>

                        <div className="p-5 flex flex-col gap-2.5 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="w-fit px-2.5 py-0.5 rounded-full bg-verde-limao text-verde-escuro text-[10px] font-bold uppercase">
                              Publicado
                            </span>
                            <span className="text-xs text-verde-musgo font-medium">
                              {projeto.infoData}
                            </span>
                          </div>

                          <h3 className="text-base sm:text-lg font-bold text-verde-escuro leading-snug line-clamp-2">
                            {projeto.titulo}
                          </h3>

                          <p className="text-xs sm:text-sm text-verde-escuro/80 line-clamp-3 leading-relaxed">
                            {projeto.descricao ||
                              'Projeto registrado na rede municipal de robótica.'}
                          </p>

                          <div className="mt-auto pt-3 border-t border-verde-escuro/10 flex items-center justify-between">
                            <Link
                              href={`/detalhesProjeto?id=${projeto.id}`}
                              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-verde-musgo hover:text-verde-escuro transition"
                            >
                              <span>Ver Projeto</span>
                              <MdArrowForward size={16} />
                            </Link>
                            <Link
                              href={`/editarProjeto?id=${projeto.id}`}
                              className="inline-flex items-center gap-1 text-xs font-bold text-verde-escuro/70 hover:text-verde-escuro transition"
                            >
                              <MdOutlineEdit size={15} />
                              <span>Editar</span>
                            </Link>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-verde-musgo bg-white p-8 text-center">
                    <p className="text-sm sm:text-base font-medium text-verde-musgo">
                      Nenhum projeto vinculado a esta escola até o momento.
                    </p>
                  </div>
                )}
              </section>

              {/* Listagem de Tutoriais Vinculados à Escola */}
              <section className="flex flex-col gap-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-verde-escuro">
                      Tutoriais Vinculados à Escola
                    </h2>
                    <p className="text-xs sm:text-sm text-verde-musgo">
                      Todos os tutoriais e guias práticos publicados pelos docentes desta unidade.
                    </p>
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-verde-musgo">
                    {tutoriais.length} {tutoriais.length === 1 ? 'tutorial' : 'tutoriais'}
                  </span>
                </div>

                {tutoriais.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tutoriais.map((tutorial) => (
                      <article
                        key={tutorial.id}
                        className="bg-white rounded-2xl border border-verde-musgo shadow-sm overflow-hidden flex flex-col hover:shadow-md transition"
                      >
                        <div className="relative w-full h-40 bg-stone-100 overflow-hidden">
                          <Image
                            src={tutorial.imagem || semaforo}
                            alt={tutorial.titulo}
                            fill
                            className="object-cover"
                          />
                        </div>

                        <div className="p-5 flex flex-col gap-2.5 flex-1">
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <div className="flex items-center gap-1.5">
                              <span className="w-fit px-2.5 py-0.5 rounded-full bg-verde-limao text-verde-escuro text-[10px] font-bold uppercase">
                                Publicado
                              </span>
                              {tutorial.nivel && (
                                <span className="w-fit px-2.5 py-0.5 rounded-full bg-verde-pastel text-verde-escuro text-[10px] font-bold uppercase">
                                  {tutorial.nivel}
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-verde-musgo font-medium">
                              {tutorial.infoData}
                            </span>
                          </div>

                          <h3 className="text-base sm:text-lg font-bold text-verde-escuro leading-snug line-clamp-2">
                            {tutorial.titulo}
                          </h3>

                          <p className="text-xs sm:text-sm text-verde-escuro/80 line-clamp-3 leading-relaxed">
                            {tutorial.descricao ||
                              'Tutorial prático desenvolvido por docentes da unidade.'}
                          </p>

                          <div className="mt-auto pt-3 border-t border-verde-escuro/10 flex items-center justify-between">
                            <Link
                              href={`/detalhesTutorial?id=${tutorial.id}`}
                              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-verde-musgo hover:text-verde-escuro transition"
                            >
                              <span>Ver Tutorial</span>
                              <MdArrowForward size={16} />
                            </Link>
                            <Link
                              href={`/editarTutorial?id=${tutorial.id}`}
                              className="inline-flex items-center gap-1 text-xs font-bold text-verde-escuro/70 hover:text-verde-escuro transition"
                            >
                              <MdOutlineEdit size={15} />
                              <span>Editar</span>
                            </Link>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-verde-musgo bg-white p-8 text-center">
                    <p className="text-sm sm:text-base font-medium text-verde-musgo">
                      Nenhum tutorial vinculado a esta escola até o momento.
                    </p>
                  </div>
                )}
              </section>
            </>
          )}
        </main>
      </div>

      <ModalConfirmacao
        aberto={modal.aberto}
        tipo={modal.tipo}
        titulo={modal.titulo}
        mensagem={modal.mensagem}
        textoConfirmar="Excluir"
        textoCancelar="Cancelar"
        onConfirmar={
          modal.tipo === 'confirmacao'
            ? handleConfirmarExclusao
            : () => {
                setModal((prev) => ({ ...prev, aberto: false }))
                if (modal.tipo === 'sucesso') router.push('/escolas')
              }
        }
        onCancelar={() => setModal((prev) => ({ ...prev, aberto: false }))}
      />
    </div>
  )
}
