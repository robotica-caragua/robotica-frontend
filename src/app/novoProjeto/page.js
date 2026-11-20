'use client'

import { Select } from '@/components/Select'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  MdOutlineArticle,
  MdOutlineSubject,
  MdFormatBold,
  MdFormatItalic,
  MdFormatListBulleted,
  MdCode,
  MdOutlineImage,
  MdOutlineAddAPhoto,
  MdClose,
  MdArrowForward
} from 'react-icons/md'
import { AdminSidebar } from '@/components/AdminSidebar'
import { ModalConfirmacao } from '@/components/ModalConfirmacao'
import { apiCategorias, apiEscolas, apiProjetos, arquivoParaDataUrl } from '@/services/api'

export default function NovoProjetoPage() {
  const router = useRouter()
  const [nome, setNome] = useState('')
  const [categoria, setCategoria] = useState('')
  const [escola, setEscola] = useState('')
  const [descricao, setDescricao] = useState('')
  const [arquivos, setArquivos] = useState([])
  const [previews, setPreviews] = useState([])
  const [categoriasLista, setCategoriasLista] = useState([])
  const [escolasLista, setEscolasLista] = useState([])
  const [enviando, setEnviando] = useState(false)
  const [modal, setModal] = useState({ aberto: false, tipo: 'sucesso', mensagemErro: '' })

  useEffect(() => {
    let ativo = true

    apiCategorias
      .listar()
      .then((cats) => {
        if (ativo && Array.isArray(cats)) {
          setCategoriasLista(cats.map((c) => c.name).filter(Boolean))
        }
      })
      .catch(() => {})

    apiEscolas
      .listar()
      .then((escs) => {
        if (ativo && Array.isArray(escs)) {
          setEscolasLista(escs)
        }
      })
      .catch(() => {})

    return () => {
      ativo = false
    }
  }, [])

  async function handleArquivos(e) {
    const lista = Array.from(e.target.files || []).slice(0, 10 - arquivos.length)
    if (lista.length === 0) return
    const novasUrls = await Promise.all(lista.map(arquivoParaDataUrl)).catch(() => [])
    setArquivos((prev) => [...prev, ...lista].slice(0, 10))
    setPreviews((prev) => [...prev, ...novasUrls].slice(0, 10))
    e.target.value = ''
  }

  function removerArquivo(indice) {
    setArquivos((prev) => prev.filter((_, idx) => idx !== indice))
    setPreviews((prev) => prev.filter((_, idx) => idx !== indice))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!nome.trim() || !escola || !descricao.trim()) {
      setModal({ aberto: true, tipo: 'erro', mensagemErro: '' })
      return
    }

    const escEncontrada = escolasLista.find((item) => item.name === escola)
    const schoolId = escEncontrada?.id || escolasLista[0]?.id

    if (!schoolId) {
      setModal({
        aberto: true,
        tipo: 'erro',
        mensagemErro: 'Selecione uma escola válida cadastrada no sistema.'
      })
      return
    }

    setEnviando(true)
    try {
      const images =
        arquivos.length > 0 ? await Promise.all(arquivos.map(arquivoParaDataUrl)) : undefined

      await apiProjetos.criar({
        name: nome.trim(),
        description: descricao.trim(),
        schoolId,
        ...(images ? { images } : {})
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
      setEnviando(false)
    }
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full">
      <AdminSidebar variant="professor" />

      <div className="flex flex-1 flex-col pb-16">
        <main className="w-full max-w-[1040px] mx-auto flex flex-col gap-6 py-8 lg:py-10 px-6 sm:px-10 lg:px-14">
          {/* Cabeçalho */}
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-verde-escuro leading-tight">
              Criar Novo Projeto
            </h1>
            <p className="mt-1 text-sm sm:text-base text-verde-musgo">
              Transforme o trabalho da sua turma em um projeto para toda a nossa rede.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
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
                  required
                  className="w-full rounded-lg border border-verde-musgo bg-input-bg px-4 py-3 text-sm text-verde-escuro placeholder-verde-musgo/80 focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-verde-escuro">Categorias</label>
                <div className="relative">
                  <Select
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
                  </Select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-verde-escuro">Nome da Escola</label>
                <div className="relative">
                  <Select
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
                  </Select>
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
                  Formatos aceitos: JPG, PNG ou WEBP.
                  <br />
                  Tamanho máximo: 5MB por foto (até 10 imagens).
                </p>

                <label className="mt-5 rounded-md bg-verde-limao px-5 py-2 text-xs font-bold uppercase text-verde-escuro hover:brightness-95 cursor-pointer">
                  Selecionar Imagens
                  <input
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleArquivos}
                    className="hidden"
                  />
                </label>

                {previews.length > 0 && (
                  <div className="mt-6 w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {previews.map((src, idx) => (
                      <div
                        key={idx}
                        className="relative aspect-video rounded-xl overflow-hidden border border-verde-musgo/40 bg-white group"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={src}
                          alt={`Pré-visualização ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removerArquivo(idx)}
                          aria-label={`Remover imagem ${idx + 1}`}
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

            {/* Ações do rodapé */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex items-center gap-1.5 text-xs font-bold uppercase text-verde-musgo hover:text-verde-escuro cursor-pointer"
              >
                <MdClose size={16} />
                Cancelar
              </button>

              <button
                type="submit"
                disabled={enviando}
                className="flex items-center gap-3 rounded-md bg-verde-musgo px-6 py-3 text-xs font-bold uppercase text-white hover:brightness-90 cursor-pointer disabled:opacity-60"
              >
                {enviando ? 'Publicando...' : 'Publicar Projeto'}
                <MdArrowForward size={16} />
              </button>
            </div>
          </form>
        </main>
      </div>

      <ModalConfirmacao
        aberto={modal.aberto}
        tipo={modal.tipo}
        titulo={modal.tipo === 'sucesso' ? 'Projeto publicado com' : 'Não foi possível publicar'}
        destaque={modal.tipo === 'sucesso' ? 'sucesso!' : 'o projeto!'}
        mensagem={
          modal.tipo === 'sucesso'
            ? 'O novo projeto foi registrado e já está disponível no catálogo da rede.'
            : modal.mensagemErro ||
              'Verifique se todos os campos foram preenchidos corretamente e tente salvar mais uma vez.'
        }
        textoBotaoSucesso="Voltar"
        onConfirmar={() => {
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
