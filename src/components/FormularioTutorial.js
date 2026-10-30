'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { SideBarProfessor } from '@/components/SideBarProfessor'
import { ModalConfirmacao } from '@/components/ModalConfirmacao'
import {
  apiCategorias,
  apiEscolas,
  apiTutoriais,
  converterNivelParaDificuldade
} from '@/services/api'
import { IoClose, IoArrowForward } from 'react-icons/io5'
import {
  MdInfoOutline,
  MdOutlineDescription,
  MdOutlineInventory2,
  MdOutlineVideocam,
  MdOutlineVideoCall,
  MdOutlineImage,
  MdOutlineAddAPhoto,
  MdKeyboardArrowDown,
  MdFormatBold,
  MdFormatItalic,
  MdFormatListBulleted,
  MdCode,
  MdOutlineDeleteOutline,
  MdOutlineSave,
  MdTag
} from 'react-icons/md'

const opcoesNivel = ['Iniciante', 'Intermediário', 'Avançado']

const SecaoTitulo = ({ icone: Icone, titulo }) => (
  <div className="flex items-center gap-3 text-verde-escuro">
    <Icone size={22} className="text-verde-musgo shrink-0" />
    <h2 className="text-2xl font-semibold uppercase tracking-wide">{titulo}</h2>
  </div>
)

export function FormularioTutorial({ modo = 'criar', dadosIniciais = {} }) {
  const router = useRouter()
  const ehEdicao = modo === 'editar'

  const [categorias, setCategorias] = useState([])
  const [escolas, setEscolas] = useState([])

  const [form, setForm] = useState({
    nome: dadosIniciais.titulo || dadosIniciais.nome || '',
    categoria: dadosIniciais.categoria || '',
    nivel: dadosIniciais.nivel || 'Intermediário',
    escola: dadosIniciais.escola || '',
    descricao: dadosIniciais.descricao || ''
  })

  const [materiais, setMateriais] = useState(
    Array.isArray(dadosIniciais.materiais) ? dadosIniciais.materiais.map((m) => ({ ...m })) : []
  )
  const [novoMaterial, setNovoMaterial] = useState('')
  const [_imagem, setImagem] = useState(null)
  const [imagemPreview, setImagemPreview] = useState(dadosIniciais.imagemUrl || '')
  const [video, setVideo] = useState(null)
  const [nomeVideoInicial] = useState(dadosIniciais.nomeVideo || '')
  const [erroVideo, setErroVideo] = useState('')
  const [modal, setModal] = useState(null) // 'sucesso' | 'erro' | null
  const [mensagemErroApi, setMensagemErroApi] = useState('')

  const descricaoRef = useRef(null)
  const videoInputRef = useRef(null)
  const imagemInputRef = useRef(null)

  useEffect(() => {
    let ativo = true
    apiCategorias
      .listar()
      .then((lista) => {
        if (!ativo || !Array.isArray(lista)) return
        setCategorias(lista)
      })
      .catch(() => {})

    apiEscolas
      .listar()
      .then((lista) => {
        if (!ativo || !Array.isArray(lista)) return
        setEscolas(lista)
      })
      .catch(() => {})

    return () => {
      ativo = false
    }
  }, [])

  const atualizar = (campo) => (e) => {
    setForm((prev) => ({ ...prev, [campo]: e.target.value }))
  }

  const aplicarFormatacao = (tipo) => {
    const textarea = descricaoRef.current
    if (!textarea) return

    const inicio = textarea.selectionStart
    const fim = textarea.selectionEnd
    const textoAtual = form.descricao
    const selecionado = textoAtual.slice(inicio, fim)

    const marcadores = {
      negrito: `**${selecionado || 'texto em negrito'}**`,
      italico: `*${selecionado || 'texto em itálico'}*`,
      lista: `\n- ${selecionado || 'item da lista'}`,
      codigo: `\`${selecionado || 'código'}\``
    }

    const substituto = marcadores[tipo] || selecionado
    const novoTexto = textoAtual.slice(0, inicio) + substituto + textoAtual.slice(fim)
    setForm((prev) => ({ ...prev, descricao: novoTexto }))
    textarea.focus()
  }

  const adicionarMaterial = () => {
    const limpo = novoMaterial.trim()
    if (!limpo) return
    setMateriais((prev) => [...prev, { id: Date.now(), nome: limpo, selecionado: false }])
    setNovoMaterial('')
  }

  const alternarMaterial = (id) => {
    setMateriais((prev) =>
      prev.map((m) => (m.id === id ? { ...m, selecionado: !m.selecionado } : m))
    )
  }

  const removerMaterial = (id) => {
    setMateriais((prev) => prev.filter((m) => m.id !== id))
  }

  const handleVideo = (arquivo) => {
    if (!arquivo) return
    const tiposPermitidos = ['video/mp4', 'video/quicktime']
    const extensaoValida = /\.(mp4|mov)$/i.test(arquivo.name)
    if (!tiposPermitidos.includes(arquivo.type) && !extensaoValida) {
      setErroVideo('Formato inválido. Envie um vídeo MP4 ou MOV.')
      return
    }
    if (arquivo.size > 500 * 1024 * 1024) {
      setErroVideo('O vídeo deve ter no máximo 500MB.')
      return
    }
    setErroVideo('')
    setVideo(arquivo)
  }

  const handleImagem = (arquivo) => {
    if (!arquivo) return
    const reader = new FileReader()
    reader.onload = (e) => {
      setImagemPreview(e.target?.result || '')
    }
    reader.readAsDataURL(arquivo)
    setImagem(arquivo)
  }

  const handleDropVideo = (e) => {
    e.preventDefault()
    handleVideo(e.dataTransfer.files?.[0])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const valido =
      form.nome.trim() &&
      form.categoria &&
      form.escola &&
      form.descricao.trim() &&
      materiais.length > 0

    if (!valido) {
      setMensagemErroApi('')
      setModal('erro')
      return
    }

    const catEncontrada = categorias.find((c) => c.name === form.categoria)
    const escEncontrada = escolas.find((s) => s.name === form.escola)
    const categoryId = catEncontrada?.id || dadosIniciais.categoryId || categorias[0]?.id
    const schoolId = escEncontrada?.id || dadosIniciais.schoolId || escolas[0]?.id

    if (!categoryId || !schoolId) {
      setMensagemErroApi(
        'Não foi possível identificar a categoria ou a escola selecionada no servidor.'
      )
      setModal('erro')
      return
    }

    const payload = {
      title: form.nome.trim(),
      description: form.descricao.trim(),
      categoryId,
      difficulty: converterNivelParaDificuldade(form.nivel),
      schoolId,
      materialsNeeded: materiais.map((m) => m.nome.slice(0, 80)),
      tutorialUrl: dadosIniciais.tutorialUrl
    }

    try {
      if (ehEdicao && dadosIniciais.id) {
        await apiTutoriais.atualizar(dadosIniciais.id, payload)
        if (imagemPreview) {
          try {
            window.localStorage.setItem(`foto_tutorial_${dadosIniciais.id}`, imagemPreview)
          } catch {}
        }
      } else {
        const criado = await apiTutoriais.criar(payload)
        if (imagemPreview && criado?.id) {
          try {
            window.localStorage.setItem(`foto_tutorial_${criado.id}`, imagemPreview)
          } catch {}
        }
      }
      setMensagemErroApi('')
      setModal('sucesso')
    } catch (err) {
      setMensagemErroApi(err?.message || '')
      setModal('erro')
    }
  }

  const handleExcluirPublicacao = async () => {
    if (!window.confirm('Deseja realmente excluir esta publicação?')) return
    try {
      if (dadosIniciais.id) {
        await apiTutoriais.excluir(dadosIniciais.id)
      }
      router.push('/gestaoTutoriais')
    } catch (err) {
      window.alert(err?.message || 'Não foi possível excluir esta publicação.')
    }
  }

  const rotuloVideo = video?.name || nomeVideoInicial

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-background relative">
      <SideBarProfessor />

      <main className="flex-1 flex flex-col">
        <div className="w-full max-w-5xl mx-auto py-8 sm:py-10 px-4 sm:px-6 lg:px-8 flex flex-col gap-8">
          {/* Cabeçalho */}
          <section className="flex flex-col gap-2.5">
            <h1 className="text-verde-escuro text-2xl font-bold leading-tight">
              {ehEdicao ? 'Editar Tutorial' : 'Criar Novo Tutorial'}
            </h1>
            <p className="text-verde-musgo text-base sm:text-xl font-normal">
              {ehEdicao
                ? 'Atualize as informações, adicione novos passos ou altere os materiais do seu protótipo.'
                : 'Transforme o trabalho da sua turma em um tutorial para toda a nossa rede.'}
            </p>
          </section>

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-12 w-full">
            {/* 1. Informações Básicas */}
            <section className="p-8 md:p-12 bg-white rounded-3xl shadow-sm border border-verde-musgo flex flex-col gap-6">
              <SecaoTitulo icone={MdInfoOutline} titulo="Informações Básicas" />

              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2.5">
                  <label htmlFor="nome-tutorial" className="text-verde-escuro text-xl font-normal">
                    {ehEdicao ? 'Nome da equipe' : 'Nome do tutorial'}
                  </label>
                  <input
                    id="nome-tutorial"
                    type="text"
                    value={form.nome}
                    onChange={atualizar('nome')}
                    placeholder="Ex: Carrinho Movido a Elástico"
                    className="w-full h-[60px] px-5 bg-input-bg border border-verde-musgo rounded-[5px] text-lg text-verde-escuro placeholder:text-verde-escuro/80 focus:outline-none focus:ring-1 focus:ring-verde-musgo"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2.5">
                    <label
                      htmlFor="categoria-tutorial"
                      className="text-verde-escuro text-xl font-normal"
                    >
                      Categorias
                    </label>
                    <div className="relative">
                      <select
                        id="categoria-tutorial"
                        value={form.categoria}
                        onChange={atualizar('categoria')}
                        className="w-full h-[60px] px-5 pr-12 appearance-none bg-input-bg border border-verde-musgo rounded-[5px] text-lg text-verde-escuro focus:outline-none focus:ring-1 focus:ring-verde-musgo cursor-pointer"
                      >
                        <option value="" disabled>
                          Selecione o tema principal...
                        </option>
                        {categorias.map((cat) => (
                          <option key={cat.id ?? cat.name} value={cat.name}>
                            {cat.name}
                          </option>
                        ))}
                        {form.categoria &&
                          !categorias.some((cat) => cat.name === form.categoria) && (
                            <option value={form.categoria}>{form.categoria}</option>
                          )}
                      </select>
                      <MdKeyboardArrowDown
                        size={26}
                        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-verde-escuro"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2.5">
                    <span className="text-verde-escuro text-xl font-normal">
                      Nível de Dificuldade
                    </span>
                    <div className="grid grid-cols-3 gap-3 h-[60px]">
                      {opcoesNivel.map((opcao) => {
                        const selecionado = form.nivel === opcao
                        return (
                          <button
                            key={opcao}
                            type="button"
                            onClick={() => setForm((prev) => ({ ...prev, nivel: opcao }))}
                            className={`h-full rounded-lg text-base transition cursor-pointer ${
                              selecionado
                                ? 'bg-verde-limao border-2 border-verde-musgo font-bold text-verde-escuro shadow-xs'
                                : 'bg-white hover:bg-input-bg border border-verde-musgo font-normal text-verde-escuro'
                            }`}
                          >
                            {opcao}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2.5">
                  <label
                    htmlFor="escola-tutorial"
                    className="text-verde-escuro text-xl font-normal"
                  >
                    Nome da Escola
                  </label>
                  <div className="relative">
                    <select
                      id="escola-tutorial"
                      value={form.escola}
                      onChange={atualizar('escola')}
                      className="w-full h-[68px] px-5 pr-12 appearance-none bg-input-bg border border-verde-musgo rounded-lg text-base text-verde-escuro focus:outline-none focus:ring-1 focus:ring-verde-musgo cursor-pointer"
                    >
                      <option value="" disabled>
                        Selecione a unidade onde o professor lecionará as oficinas.
                      </option>
                      {escolas.map((esc) => (
                        <option key={esc.id ?? esc.name} value={esc.name}>
                          {esc.name}
                        </option>
                      ))}
                      {form.escola && !escolas.some((esc) => esc.name === form.escola) && (
                        <option value={form.escola}>{form.escola}</option>
                      )}
                    </select>
                    <MdKeyboardArrowDown
                      size={26}
                      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-verde-escuro"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* 2. Descrição do Projeto */}
            <section className="p-8 md:p-12 bg-white rounded-3xl shadow-sm border border-verde-musgo flex flex-col gap-6">
              <SecaoTitulo icone={MdOutlineDescription} titulo="Descrição do Projeto" />

              <div className="w-full rounded-xl bg-input-bg border border-verde-musgo/20 overflow-hidden">
                <div className="flex items-center gap-3 px-4 py-3 bg-verde-pastel border-b border-verde-musgo/20 text-verde-escuro">
                  <button
                    type="button"
                    onClick={() => aplicarFormatacao('negrito')}
                    title="Negrito"
                    aria-label="Negrito"
                    className="p-1 rounded hover:bg-verde-oliva/40 transition cursor-pointer"
                  >
                    <MdFormatBold size={20} />
                  </button>
                  <button
                    type="button"
                    onClick={() => aplicarFormatacao('italico')}
                    title="Itálico"
                    aria-label="Itálico"
                    className="p-1 rounded hover:bg-verde-oliva/40 transition cursor-pointer"
                  >
                    <MdFormatItalic size={20} />
                  </button>
                  <button
                    type="button"
                    onClick={() => aplicarFormatacao('lista')}
                    title="Lista"
                    aria-label="Lista"
                    className="p-1 rounded hover:bg-verde-oliva/40 transition cursor-pointer"
                  >
                    <MdFormatListBulleted size={20} />
                  </button>
                  <button
                    type="button"
                    onClick={() => aplicarFormatacao('codigo')}
                    title="Código"
                    aria-label="Código"
                    className="p-1 rounded hover:bg-verde-oliva/40 transition cursor-pointer"
                  >
                    <MdCode size={20} />
                  </button>
                </div>

                <textarea
                  ref={descricaoRef}
                  rows={8}
                  value={form.descricao}
                  onChange={atualizar('descricao')}
                  placeholder="Descreva qual é o objetivo do projeto e como ela funciona na prática..."
                  className="w-full p-6 bg-transparent text-base text-verde-escuro placeholder:text-verde-escuro/80 focus:outline-none resize-none"
                />
              </div>
            </section>

            {/* 3. Materiais Necessários */}
            <section className="p-8 md:p-12 bg-white rounded-3xl shadow-sm border border-verde-musgo flex flex-col gap-6">
              <SecaoTitulo icone={MdOutlineInventory2} titulo="Materiais Necessários" />

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={novoMaterial}
                  onChange={(e) => setNovoMaterial(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      adicionarMaterial()
                    }
                  }}
                  placeholder="Novo Material / Componente"
                  className="flex-1 h-[74px] px-5 bg-input-bg border border-verde-escuro/10 rounded-lg text-lg text-verde-escuro placeholder:text-verde-escuro/80 focus:outline-none focus:ring-1 focus:ring-verde-musgo"
                />
                <button
                  type="button"
                  onClick={adicionarMaterial}
                  className="h-[74px] px-10 bg-verde-limao hover:bg-verde-oliva text-verde-escuro text-lg font-bold uppercase rounded-lg transition cursor-pointer shrink-0"
                >
                  Adicionar
                </button>
              </div>

              <div className="w-full rounded-xl bg-input-bg border border-verde-escuro/10 overflow-hidden">
                <div className="grid grid-cols-12 items-center px-6 py-3 bg-verde-pastel border-b border-verde-escuro/10 text-verde-escuro text-base">
                  <div className="col-span-2 sm:col-span-1 flex justify-center">
                    <MdTag size={16} />
                  </div>
                  <div className="col-span-8 sm:col-span-9 uppercase">Item</div>
                  <div className="col-span-2 text-center uppercase">Ação</div>
                </div>

                {materiais.length > 0 ? (
                  materiais.map((item) => (
                    <div
                      key={item.id}
                      className="grid grid-cols-12 items-center px-6 py-5 border-b border-verde-escuro/5 last:border-none"
                    >
                      <div className="col-span-2 sm:col-span-1 flex justify-center">
                        <input
                          type="checkbox"
                          checked={item.selecionado}
                          onChange={() => alternarMaterial(item.id)}
                          aria-label={`Selecionar ${item.nome}`}
                          className="size-5 rounded border border-[#C3CAAD] bg-white accent-verde-musgo cursor-pointer"
                        />
                      </div>
                      <div className="col-span-8 sm:col-span-9 text-base font-medium text-verde-escuro">
                        {item.nome}
                      </div>
                      <div className="col-span-2 flex justify-center">
                        <button
                          type="button"
                          onClick={() => removerMaterial(item.id)}
                          title={`Remover ${item.nome}`}
                          aria-label={`Remover ${item.nome}`}
                          className="p-1.5 text-[#434933] hover:text-vermelho transition cursor-pointer"
                        >
                          <MdOutlineDeleteOutline size={20} />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="py-6 text-center text-sm text-verde-musgo">
                    Nenhum material adicionado ainda.
                  </p>
                )}
              </div>

              <div className="flex justify-end">
                <span className="text-xs font-bold uppercase text-[#4C6700]">
                  {materiais.length}{' '}
                  {materiais.length === 1 ? 'componente listado' : 'componentes listados'}
                </span>
              </div>
            </section>

            {/* 4. Mídia do Projeto (Foto e Vídeo) */}
            <section className="p-8 md:p-12 bg-white rounded-3xl shadow-sm border border-verde-musgo flex flex-col gap-6">
              <SecaoTitulo icone={MdOutlineImage} titulo="Foto de Capa do Tutorial" />

              <div
                onClick={() => imagemInputRef.current?.click()}
                className="w-full min-h-[220px] bg-input-bg border-2 border-dashed border-verde-musgo rounded-3xl p-6 flex flex-col items-center justify-center gap-4 text-center cursor-pointer hover:bg-verde-pastel/40 transition overflow-hidden"
              >
                {imagemPreview ? (
                  <div className="flex flex-col items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imagemPreview}
                      alt="Capa do tutorial"
                      className="max-h-52 w-auto object-contain rounded-xl shadow-sm"
                    />
                    <span className="text-xs font-bold text-verde-escuro uppercase">
                      Clique para trocar a imagem
                    </span>
                  </div>
                ) : (
                  <>
                    <div className="flex size-14 items-center justify-center rounded-full bg-verde-limao text-verde-escuro">
                      <MdOutlineAddAPhoto size={26} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-verde-escuro text-base font-bold uppercase">
                        Enviar Imagem do Projeto
                      </span>
                      <span className="text-[#434933] text-sm">
                        Formatos aceitos: JPG, PNG, WEBP.
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        imagemInputRef.current?.click()
                      }}
                      className="px-6 py-2 bg-verde-limao hover:bg-verde-oliva rounded-lg text-verde-escuro text-xs font-bold uppercase transition cursor-pointer"
                    >
                      Selecionar Imagem
                    </button>
                  </>
                )}

                <input
                  ref={imagemInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="sr-only"
                  onChange={(e) => handleImagem(e.target.files?.[0])}
                />
              </div>
            </section>

            {/* 5. Vídeo Tutorial */}
            <section className="p-8 md:p-12 bg-white rounded-3xl shadow-sm border border-verde-musgo flex flex-col gap-6">
              <SecaoTitulo icone={MdOutlineVideocam} titulo="Vídeo Tutorial" />

              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDropVideo}
                onClick={() => videoInputRef.current?.click()}
                className="w-full min-h-[340px] bg-input-bg border-2 border-dashed border-verde-musgo rounded-3xl p-10 flex flex-col items-center justify-center gap-5 text-center cursor-pointer hover:bg-verde-pastel/40 transition"
              >
                <div className="flex size-16 items-center justify-center rounded-full bg-verde-limao text-verde-escuro">
                  <MdOutlineVideoCall size={32} />
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-verde-escuro text-lg font-bold uppercase">
                    {rotuloVideo || 'Enviar Vídeo Tutorial'}
                  </span>
                  <span className="text-[#434933] text-base">
                    Formatos aceitos: MP4 ou MOV. Tamanho máximo de 500MB.
                  </span>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    videoInputRef.current?.click()
                  }}
                  className="px-10 py-3 bg-verde-limao hover:bg-verde-oliva rounded-lg text-verde-escuro text-sm font-bold uppercase transition cursor-pointer"
                >
                  {rotuloVideo ? 'Trocar Vídeo' : 'Selecionar Vídeo'}
                </button>

                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/mp4,video/quicktime,.mp4,.mov"
                  className="sr-only"
                  onChange={(e) => handleVideo(e.target.files?.[0])}
                />
              </div>

              {erroVideo && (
                <span className="text-vermelho text-xs font-semibold px-1">{erroVideo}</span>
              )}
            </section>

            {/* Rodapé: Ações de Controle (Edição) ou Cancelar/Publicar (Criação) */}
            {ehEdicao ? (
              <section className="p-6 bg-white rounded-3xl shadow-sm border border-verde-musgo flex flex-col gap-5">
                <h2 className="pb-2 border-b border-verde-escuro/10 text-verde-escuro text-2xl font-semibold uppercase">
                  Ações de Controle
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <button
                    type="submit"
                    className="h-[52px] bg-verde-limao hover:bg-verde-oliva rounded-[10px] text-verde-escuro text-sm font-bold uppercase flex items-center justify-center gap-3 transition cursor-pointer"
                  >
                    <MdOutlineSave size={20} />
                    Salvar Alterações
                  </button>

                  <button
                    type="button"
                    onClick={handleExcluirPublicacao}
                    className="h-[52px] bg-white hover:bg-vermelho/5 border border-vermelho rounded-[10px] text-vermelho text-sm font-bold uppercase flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <MdOutlineDeleteOutline size={18} />
                    Excluir Publicação
                  </button>
                </div>
              </section>
            ) : (
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2">
                <Link
                  href="/gestaoTutoriais"
                  className="flex items-center gap-2.5 px-10 py-5 rounded-lg text-[#3F674D] text-xl font-bold uppercase hover:bg-input-bg transition"
                >
                  <IoClose size={22} />
                  Cancelar
                </Link>

                <button
                  type="submit"
                  className="px-10 py-5 bg-[#4C6700] hover:bg-white hover:text-verde-musgo border border-verde-musgo text-white text-lg font-bold uppercase rounded-lg shadow-md flex items-center gap-5 transition cursor-pointer"
                >
                  Publicar Tutorial
                  <IoArrowForward size={20} />
                </button>
              </div>
            )}
          </form>
        </div>
      </main>

      <ModalConfirmacao
        tipo={modal}
        tituloPrincipal={
          modal === 'sucesso'
            ? ehEdicao
              ? 'Tutorial atualizado com'
              : 'Tutorial publicado com'
            : ehEdicao
              ? 'Não foi possível atualizar'
              : 'Não foi possível publicar'
        }
        tituloDestaque={modal === 'sucesso' ? 'sucesso!' : 'o tutorial!'}
        mensagem={
          modal === 'sucesso'
            ? ehEdicao
              ? 'As alterações do tutorial foram registradas e já estão disponíveis para toda a rede!'
              : 'O novo tutorial foi registrado e já está visível para toda a rede escolar!'
            : mensagemErroApi ||
              'Verifique se todos os campos foram preenchidos corretamente e tente salvar mais uma vez.'
        }
        textoBotaoVoltar="Voltar para Tutoriais"
        hrefVoltar="/gestaoTutoriais"
        onTentarNovamente={() => setModal(null)}
      />
    </div>
  )
}
