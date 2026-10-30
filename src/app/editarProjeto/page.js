'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  MdOutlineArticle,
  MdOutlineSubject,
  MdFormatBold,
  MdFormatItalic,
  MdFormatListBulleted,
  MdCode,
  MdOutlineImage,
  MdOutlineAddAPhoto,
  MdOutlineSave,
  MdOutlineDelete
} from 'react-icons/md'
import { IoIosArrowDown } from 'react-icons/io'
import { AdminSidebar } from '@/components/AdminSidebar'
import { ModalConfirmacao } from '@/components/ModalConfirmacao'
import { apiCategorias, apiEscolas, apiProjetos } from '@/services/api'

function ConteudoEditarProjeto() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const idParam = searchParams.get('id')

  const [idProjeto, setIdProjeto] = useState(idParam)
  const [nome, setNome] = useState('')
  const [categoria, setCategoria] = useState('')
  const [escola, setEscola] = useState('')
  const [descricao, setDescricao] = useState('')
  const [arquivos, setArquivos] = useState([])
  const [categoriasLista, setCategoriasLista] = useState([])
  const [escolasLista, setEscolasLista] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [modal, setModal] = useState({ aberto: false, tipo: 'sucesso', mensagemErro: '' })

  useEffect(() => {
    let ativo = true

    Promise.all([
      apiCategorias.listar().catch(() => []),
      apiEscolas.listar().catch(() => []),
      idParam
        ? apiProjetos.buscarPorId(idParam).catch(() => null)
        : apiProjetos
            .listar()
            .then((lista) => lista?.[0] || null)
            .catch(() => null)
    ])
      .then(([cats, escs, proj]) => {
        if (!ativo) return
        if (Array.isArray(cats)) {
          setCategoriasLista(cats.map((c) => c.name).filter(Boolean))
        }
        if (Array.isArray(escs)) {
          setEscolasLista(escs)
        }
        if (proj) {
          setIdProjeto(proj.id)
          setNome(proj.name || '')
          setCategoria(proj.categories?.[0] || '')
          setEscola(proj.school?.name || '')
          setDescricao(proj.description || '')
        }
      })
      .finally(() => {
        if (ativo) setCarregando(false)
      })

    return () => {
      ativo = false
    }
  }, [idParam])

  function handleArquivos(e) {
    const lista = Array.from(e.target.files || [])
    setArquivos(lista)
  }

  async function handleSalvar(e) {
    e.preventDefault()
    if (!nome.trim() || !escola || !descricao.trim()) {
      setModal({ aberto: true, tipo: 'erro', mensagemErro: '' })
      return
    }

    const escEncontrada = escolasLista.find((item) => item.name === escola)
    const schoolId = escEncontrada?.id || escolasLista[0]?.id

    if (!idProjeto || !schoolId) {
      setModal({
        aberto: true,
        tipo: 'erro',
        mensagemErro: 'Não foi possível identificar o projeto ou a escola selecionada.'
      })
      return
    }

    setSalvando(true)
    try {
      await apiProjetos.atualizar(idProjeto, {
        name: nome.trim(),
        description: descricao.trim(),
        schoolId
      })
      if (arquivos.length > 0 && idProjeto) {
        try {
          const reader = new FileReader()
          reader.onload = (ev) => {
            if (ev.target?.result) {
              window.localStorage.setItem(`foto_projeto_${idProjeto}`, ev.target.result)
            }
          }
          reader.readAsDataURL(arquivos[0])
        } catch {}
      }
      setModal({ aberto: true, tipo: 'sucesso', mensagemErro: '' })
    } catch (err) {
      setModal({
        aberto: true,
        tipo: 'erro',
        mensagemErro:
          err?.message ||
          'Verifique se todos os campos foram preenchidos corretamente e tente salvar mais uma vez.'
      })
    } finally {
      setSalvando(false)
    }
  }

  function handleExcluir() {
    setModal({
      aberto: true,
      tipo: 'confirmacao',
      titulo: 'Excluir Projeto?',
      mensagem: 'Deseja realmente remover esta publicação de projeto da rede?'
    });
  }

  async function handleConfirmarExclusao() {
    if (!idProjeto) return;
    try {
      await apiProjetos.excluir(idProjeto);
      setModal({
        aberto: true,
        tipo: 'sucesso',
        titulo: 'Projeto excluído com sucesso!',
        mensagem: 'O projeto foi removido do catálogo.',
        redirecionar: true
      });
    } catch (err) {
      setModal({
        aberto: true,
        tipo: 'erro',
        titulo: 'Erro ao excluir projeto',
        mensagem: err?.message || 'Não foi possível excluir o projeto.'
      });
    }
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <AdminSidebar variant="professor" />

      <div className="flex flex-1 flex-col px-4 sm:px-6 lg:px-10 pb-16">
        <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 pt-8 lg:pt-12">
          {/* Cabeçalho */}
          <div>
            <h1 className="text-2xl font-bold text-verde-escuro">Editar Projeto</h1>
            <p className="mt-1 text-sm text-verde-musgo">
              Atualize as informações, descrição ou mídias do projeto da sua turma.
            </p>
          </div>

          {carregando ? (
            <p className="py-10 text-center text-verde-musgo font-medium">
              Carregando dados do projeto...
            </p>
          ) : (
            <form onSubmit={handleSalvar} noValidate className="flex flex-col gap-6">
              {/* Informações Básicas */}
              <section className="flex flex-col gap-5 rounded-2xl border border-verde-musgo bg-white p-7">
                <div className="flex items-center gap-2 text-verde-escuro">
                  <MdOutlineArticle size={20} className="text-verde-musgo" />
                  <h2 className="text-sm font-bold uppercase">Informações Básicas</h2>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-verde-escuro">Nome do projeto</label>
                  <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Ex: Carrinho Movido a Elástico"
                    className="w-full rounded-lg border border-verde-musgo bg-input-bg px-4 py-3 text-sm text-verde-escuro placeholder-verde-musgo/80 focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-verde-escuro">Categorias</label>
                  <div className="relative">
                    <select
                      value={categoria}
                      onChange={(e) => setCategoria(e.target.value)}
                      className="w-full appearance-none rounded-lg border border-verde-musgo bg-input-bg px-4 py-3 pr-10 text-sm text-verde-musgo focus:outline-none cursor-pointer"
                    >
                      <option value="">Selecione o tema principal...</option>
                      {categoriasLista.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                      {categoria && !categoriasLista.includes(categoria) && (
                        <option value={categoria}>{categoria}</option>
                      )}
                    </select>
                    <IoIosArrowDown className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-lg text-verde-musgo" />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-verde-escuro">Nome da Escola</label>
                  <div className="relative">
                    <select
                      value={escola}
                      onChange={(e) => setEscola(e.target.value)}
                      className="w-full appearance-none rounded-lg border border-verde-musgo bg-input-bg px-4 py-3 pr-10 text-sm text-verde-musgo focus:outline-none cursor-pointer"
                    >
                      <option value="">
                        Selecione a unidade onde o professor lecionará as oficinas.
                      </option>
                      {escolasLista.map((esc) => (
                        <option key={esc.id || esc.name} value={esc.name}>
                          {esc.name}
                        </option>
                      ))}
                      {escola && !escolasLista.some((e) => e.name === escola) && (
                        <option value={escola}>{escola}</option>
                      )}
                    </select>
                    <IoIosArrowDown className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-lg text-verde-musgo" />
                  </div>
                </div>
              </section>

              {/* Descrição do Projeto */}
              <section className="flex flex-col gap-4 rounded-2xl border border-verde-musgo bg-white p-7">
                <div className="flex items-center gap-2 text-verde-escuro">
                  <MdOutlineSubject size={20} className="text-verde-musgo" />
                  <h2 className="text-sm font-bold uppercase">Descrição do Projeto</h2>
                </div>

                <div className="overflow-hidden rounded-xl border border-verde-musgo bg-input-bg">
                  <div className="flex items-center gap-4 border-b border-verde-musgo/20 bg-verde-pastel px-4 py-2.5 text-verde-escuro">
                    <button type="button" aria-label="Negrito" className="hover:text-verde-musgo">
                      <MdFormatBold size={18} />
                    </button>
                    <button type="button" aria-label="Itálico" className="hover:text-verde-musgo">
                      <MdFormatItalic size={18} />
                    </button>
                    <button type="button" aria-label="Lista" className="hover:text-verde-musgo">
                      <MdFormatListBulleted size={18} />
                    </button>
                    <button type="button" aria-label="Código" className="hover:text-verde-musgo">
                      <MdCode size={18} />
                    </button>
                  </div>

                  <textarea
                    rows={8}
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    placeholder="Descreva qual é o objetivo do projeto e como ele funciona na prática..."
                    className="w-full resize-none bg-transparent p-4 text-sm text-verde-escuro placeholder-verde-musgo/80 focus:outline-none"
                  />
                </div>
              </section>

              {/* Upload de Mídias */}
              <section className="flex flex-col gap-4 rounded-2xl border border-verde-musgo bg-white p-7">
                <div className="flex items-center gap-2 text-verde-escuro">
                  <MdOutlineImage size={20} className="text-verde-musgo" />
                  <h2 className="text-sm font-bold uppercase">Upload de Mídias</h2>
                </div>

                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-verde-musgo bg-input-bg px-6 py-12 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-verde-limao text-verde-escuro">
                    <MdOutlineAddAPhoto size={24} />
                  </div>

                  <p className="mt-4 text-xs font-bold uppercase text-verde-escuro">
                    Enviar mídias do projeto
                  </p>
                  <p className="mt-1 text-xs text-verde-musgo">
                    Formatos aceitos: JPG, PNG, MP4 ou MOV.
                    <br />
                    Tamanho máximo: 10MB (fotos) e 500MB (vídeos).
                  </p>

                  <label className="mt-5 rounded-md bg-verde-limao px-5 py-2 text-xs font-bold uppercase text-verde-escuro hover:brightness-95 cursor-pointer">
                    Selecionar Arquivos
                    <input
                      type="file"
                      multiple
                      accept=".jpg,.jpeg,.png,.mp4,.mov"
                      onChange={handleArquivos}
                      className="hidden"
                    />
                  </label>

                  {arquivos.length > 0 && (
                    <p className="mt-3 text-xs font-semibold text-verde-escuro">
                      {arquivos.length} arquivo(s) selecionado(s)
                    </p>
                  )}
                </div>
              </section>

              {/* Ações de Controle */}
              <section className="flex flex-col gap-4 rounded-2xl border border-verde-musgo bg-white p-6">
                <h2 className="text-xs font-bold uppercase text-verde-escuro">Ações de Controle</h2>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <button
                    type="submit"
                    disabled={salvando}
                    className="flex items-center justify-center gap-2 rounded-lg bg-verde-limao py-3 text-xs font-bold uppercase text-verde-escuro hover:brightness-95 cursor-pointer disabled:opacity-60"
                  >
                    <MdOutlineSave size={18} />
                    {salvando ? 'Salvando...' : 'Salvar Alterações'}
                  </button>

                  <button
                    type="button"
                    onClick={handleExcluir}
                    className="flex items-center justify-center gap-2 rounded-lg border border-vermelho bg-white py-3 text-xs font-bold uppercase text-vermelho hover:bg-vermelho/5 cursor-pointer"
                  >
                    <MdOutlineDelete size={18} />
                    Excluir Publicação
                  </button>
                </div>
              </section>
            </form>
          )}
        </main>
      </div>

      <ModalConfirmacao
        aberto={modal.aberto}
        tipo={modal.tipo}
        titulo={modal.tipo === 'sucesso' ? 'Projeto atualizado com' : 'Não foi possível editar'}
        destaque={modal.tipo === 'sucesso' ? 'sucesso!' : 'o projeto!'}
        mensagem={
          modal.tipo === 'sucesso'
            ? 'As alterações do projeto foram salvas e já estão disponíveis para toda a rede!'
            : modal.mensagemErro ||
              'Verifique se todos os campos foram preenchidos corretamente e tente salvar mais uma vez.'
        }
        textoBotaoSucesso="Voltar para Projetos"
        textoConfirmar={modal.tipo === 'confirmacao' ? 'Excluir' : undefined}
        onConfirmar={modal.tipo === 'confirmacao' ? handleConfirmarExclusao : () => {
          setModal({ aberto: false, tipo: 'sucesso', mensagemErro: '' })
          router.push('/projetos')
        }}
        onCancelar={() => {
          setModal({ aberto: false, tipo: 'sucesso', mensagemErro: '' })
          router.push('/projetos')
        }}
        onTentarNovamente={() => setModal({ aberto: false, tipo: 'sucesso', mensagemErro: '' })}
      />
    </div>
  )
}

export default function EditarProjetoPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <ConteudoEditarProjeto />
    </Suspense>
  )
}
