'use client'

import { Select } from '@/components/Select'
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
  MdOutlineDelete,
  MdClose
} from 'react-icons/md'
import { AdminSidebar } from '@/components/AdminSidebar'
import { ModalConfirmacao } from '@/components/ModalConfirmacao'
import { apiCategorias, apiEscolas, apiProjetos, arquivoParaDataUrl } from '@/services/api'

function ConteudoEditarProjeto() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const idParam = searchParams.get('id')

  const [idProjeto, setIdProjeto] = useState(idParam)
  const [nome, setNome] = useState('')
  const [categoria, setCategoria] = useState('')
  const [escola, setEscola] = useState('')
  const [descricao, setDescricao] = useState('')
  const [imagensExistentes, setImagensExistentes] = useState([])
  const [arquivos, setArquivos] = useState([])
  const [novosPreviews, setNovosPreviews] = useState([])
  const [categoriasLista, setCategoriasLista] = useState([])
  const [escolasLista, setEscolasLista] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [modal, setModal] = useState({ aberto: false, tipo: 'sucesso', mensagemErro: '' })

  useEffect(() => {
    let ativo = true

    Promise.all([
      apiCategorias.listar().catch(() => []),
      apiEscolas.listarDoUsuarioLogado().catch(() => []),
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
          const listaEsc = Array.isArray(escs) ? escs : []
          const nomeEscProj = proj.school?.name || ''
          const vinculadaAoProj = listaEsc.find(
            (e) => e.name === nomeEscProj || Number(e.id) === Number(proj.schoolId)
          )
          setEscola(vinculadaAoProj?.name || (listaEsc.length === 1 ? listaEsc[0].name : ''))
          setDescricao(proj.description || '')
          const atuais =
            Array.isArray(proj.images) && proj.images.length > 0
              ? proj.images
              : proj.imageUrl
                ? [proj.imageUrl]
                : []
          setImagensExistentes(atuais)
        }
      })
      .finally(() => {
        if (ativo) setCarregando(false)
      })

    return () => {
      ativo = false
    }
  }, [idParam])

  async function processarListaArquivos(fileList) {
    const limiteRestante = Math.max(0, 10 - imagensExistentes.length - arquivos.length)
    const lista = Array.from(fileList || [])
      .filter((f) => /^image\/(jpeg|jpg|png|webp)$/i.test(f.type))
      .slice(0, limiteRestante)
    if (lista.length === 0) return
    const novasUrls = await Promise.all(lista.map(arquivoParaDataUrl)).catch(() => [])
    setArquivos((prev) => [...prev, ...lista])
    setNovosPreviews((prev) => [...prev, ...novasUrls])
  }

  async function handleArquivos(e) {
    await processarListaArquivos(e.target.files)
    e.target.value = ''
  }

  async function handleDropImagens(e) {
    e.preventDefault()
    e.stopPropagation()
    await processarListaArquivos(e.dataTransfer?.files)
  }

  function removerImagemExistente(indice) {
    setImagensExistentes((prev) => prev.filter((_, idx) => idx !== indice))
  }

  function removerNovoArquivo(indice) {
    setArquivos((prev) => prev.filter((_, idx) => idx !== indice))
    setNovosPreviews((prev) => prev.filter((_, idx) => idx !== indice))
  }

  async function handleSalvar(e) {
    e.preventDefault()
    if (!nome.trim() || !escola || !descricao.trim()) {
      setModal({ aberto: true, tipo: 'erro', mensagemErro: '' })
      return
    }

    const escEncontrada = escolasLista.find((item) => item.name === escola)
    const schoolId = escEncontrada?.id

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
      const novasImagens =
        arquivos.length > 0 ? await Promise.all(arquivos.map(arquivoParaDataUrl)) : []
      const todasImagens = [...imagensExistentes, ...novasImagens]

      await apiProjetos.atualizar(idProjeto, {
        name: nome.trim(),
        description: descricao.trim(),
        schoolId,
        images: todasImagens
      })
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
    })
  }

  async function handleConfirmarExclusao() {
    if (!idProjeto) return
    try {
      await apiProjetos.excluir(idProjeto)
      setModal({
        aberto: true,
        tipo: 'sucesso',
        titulo: 'Projeto excluído com sucesso!',
        mensagem: 'O projeto foi removido do catálogo.',
        redirecionar: true
      })
    } catch (err) {
      setModal({
        aberto: true,
        tipo: 'erro',
        titulo: 'Erro ao excluir projeto',
        mensagem: err?.message || 'Não foi possível excluir o projeto.'
      })
    }
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full bg-background relative">
      <AdminSidebar variant="professor" />

      <div className="flex flex-1 flex-col pb-16">
        <main className="w-full max-w-[1040px] mx-auto flex flex-col gap-6 sm:gap-8 py-8 lg:py-10 px-6 sm:px-10 lg:px-14">
          {/* Cabeçalho */}
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-verde-escuro leading-tight">
              Editar Projeto
            </h1>
            <p className="mt-1 text-sm sm:text-base text-verde-musgo">
              Atualize as informações, descrição ou mídias do projeto da sua turma.
            </p>
          </div>

          {carregando ? (
            <p className="py-10 text-center text-verde-musgo font-medium">
              Carregando dados do projeto...
            </p>
          ) : (
            <form onSubmit={handleSalvar} noValidate className="flex flex-col gap-6 w-full">
              {/* Informações Básicas */}
              <section className="flex flex-col gap-5 rounded-2xl border border-verde-musgo bg-white p-6 sm:p-8 shadow-sm">
                <div className="flex items-center gap-2.5 text-verde-escuro">
                  <MdOutlineArticle size={20} className="text-verde-musgo shrink-0" />
                  <h2 className="text-base sm:text-lg font-bold uppercase tracking-wide">
                    Informações Básicas
                  </h2>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-verde-escuro">Nome do projeto</label>
                  <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Ex: Carrinho Movido a Elástico"
                    className="w-full h-12 rounded-xl border border-verde-musgo bg-input-bg px-4 text-sm sm:text-base text-verde-escuro placeholder:text-verde-escuro/60 focus:outline-none focus:ring-1 focus:ring-verde-musgo transition"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-verde-escuro">Categorias</label>
                  <div className="relative">
                    <Select
                      value={categoria}
                      onChange={(e) => setCategoria(e.target.value)}
                      className="w-full h-12 appearance-none rounded-xl border border-verde-musgo bg-input-bg px-4 pr-10 text-sm sm:text-base text-verde-escuro focus:outline-none focus:ring-1 focus:ring-verde-musgo cursor-pointer transition"
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
                    </Select>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-verde-escuro">Nome da Escola</label>
                  <div className="relative">
                    <Select
                      value={escola}
                      onChange={(e) => setEscola(e.target.value)}
                      className="w-full h-12 appearance-none rounded-xl border border-verde-musgo bg-input-bg px-4 pr-10 text-sm sm:text-base text-verde-escuro focus:outline-none focus:ring-1 focus:ring-verde-musgo cursor-pointer transition"
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
                    </Select>
                  </div>
                </div>
              </section>

              {/* Descrição do Projeto */}
              <section className="flex flex-col gap-5 rounded-2xl border border-verde-musgo bg-white p-6 sm:p-8 shadow-sm">
                <div className="flex items-center gap-2.5 text-verde-escuro">
                  <MdOutlineSubject size={20} className="text-verde-musgo shrink-0" />
                  <h2 className="text-base sm:text-lg font-bold uppercase tracking-wide">
                    Descrição do Projeto
                  </h2>
                </div>

                <div className="overflow-hidden rounded-xl border border-verde-musgo bg-input-bg">
                  <div className="flex items-center gap-3 border-b border-verde-musgo/20 bg-verde-pastel px-4 py-2.5 text-verde-escuro">
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
                    rows={7}
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    placeholder="Descreva qual é o objetivo do projeto e como ele funciona na prática..."
                    className="w-full resize-none bg-transparent p-4 text-sm sm:text-base text-verde-escuro placeholder:text-verde-escuro/60 focus:outline-none"
                  />
                </div>
              </section>

              {/* Upload de Mídias */}
              <section className="flex flex-col gap-5 rounded-2xl border border-verde-musgo bg-white p-6 sm:p-8 shadow-sm">
                <div className="flex items-center gap-2.5 text-verde-escuro">
                  <MdOutlineImage size={20} className="text-verde-musgo shrink-0" />
                  <h2 className="text-base sm:text-lg font-bold uppercase tracking-wide">
                    Upload de Mídias
                  </h2>
                </div>

                <div
                  onDragOver={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                  onDrop={handleDropImagens}
                  className="flex min-h-[200px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-verde-musgo bg-input-bg hover:bg-verde-pastel/30 transition p-6 sm:p-8 text-center"
                >
                  <div className="flex size-12 items-center justify-center rounded-full bg-verde-limao text-verde-escuro">
                    <MdOutlineAddAPhoto size={24} />
                  </div>

                  <p className="mt-3 text-sm font-bold uppercase text-verde-escuro">
                    Arraste imagens para cá ou selecione do computador
                  </p>
                  <p className="mt-1 text-xs sm:text-sm text-verde-musgo">
                    Formatos aceitos: JPG, PNG ou WEBP.
                    <br />
                    Tamanho máximo: 5MB por foto (até 10 imagens).
                  </p>

                  <label className="mt-4 rounded-lg bg-verde-limao px-6 py-2.5 text-xs font-bold uppercase text-verde-escuro hover:bg-verde-oliva transition cursor-pointer">
                    Selecionar Imagens
                    <input
                      type="file"
                      multiple
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleArquivos}
                      className="hidden"
                    />
                  </label>

                  {(imagensExistentes.length > 0 || novosPreviews.length > 0) && (
                    <div className="mt-6 w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {imagensExistentes.map((src, idx) => (
                        <div
                          key={`existente-${idx}`}
                          className="relative aspect-video rounded-xl overflow-hidden border border-verde-musgo/40 bg-white"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={src}
                            alt={`Imagem salva ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removerImagemExistente(idx)}
                            aria-label={`Remover imagem salva ${idx + 1}`}
                            className="absolute top-1.5 right-1.5 size-6 rounded-full bg-vermelho text-white flex items-center justify-center shadow-sm hover:opacity-90 cursor-pointer"
                          >
                            <MdClose size={14} />
                          </button>
                        </div>
                      ))}
                      {novosPreviews.map((src, idx) => (
                        <div
                          key={`nova-${idx}`}
                          className="relative aspect-video rounded-xl overflow-hidden border border-verde-musgo bg-white"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={src}
                            alt={`Nova imagem ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removerNovoArquivo(idx)}
                            aria-label={`Remover nova imagem ${idx + 1}`}
                            className="absolute top-1.5 right-1.5 size-6 rounded-full bg-vermelho text-white flex items-center justify-center shadow-sm hover:opacity-90 cursor-pointer"
                          >
                            <MdClose size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>

              {/* Ações de Controle */}
              <section className="flex flex-col gap-5 rounded-2xl border border-verde-musgo bg-white p-6 sm:p-8 shadow-sm">
                <h2 className="pb-2 border-b border-verde-escuro/10 text-base sm:text-lg font-bold uppercase tracking-wide text-verde-escuro">
                  Ações de Controle
                </h2>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <button
                    type="submit"
                    disabled={salvando}
                    className="h-12 flex items-center justify-center gap-2.5 rounded-xl bg-verde-limao text-sm font-bold uppercase text-verde-escuro hover:bg-verde-oliva transition cursor-pointer disabled:opacity-60"
                  >
                    <MdOutlineSave size={18} />
                    {salvando ? 'Salvando...' : 'Salvar Alterações'}
                  </button>

                  <button
                    type="button"
                    onClick={handleExcluir}
                    className="h-12 flex items-center justify-center gap-2 rounded-xl border border-vermelho bg-white text-sm font-bold uppercase text-vermelho hover:bg-vermelho/5 transition cursor-pointer"
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
        textoBotaoSucesso="Voltar"
        textoConfirmar={modal.tipo === 'confirmacao' ? 'Excluir' : undefined}
        onConfirmar={
          modal.tipo === 'confirmacao'
            ? handleConfirmarExclusao
            : () => {
                setModal({ aberto: false, tipo: 'sucesso', mensagemErro: '' })
                router.push('/gestaoProjetos')
              }
        }
        onCancelar={() => {
          setModal({ aberto: false, tipo: 'sucesso', mensagemErro: '' })
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
