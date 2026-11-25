'use client'

import { Select } from '@/components/Select'
import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { SideBarAdmin } from '@/components/SideBarAdmin'
import { ModalConfirmacao } from '@/components/ModalConfirmacao'
import { apiEscolas, apiEventos, arquivoParaDataUrl } from '@/services/api'
import {
  IoClose,
  IoArrowForward,
  IoAddOutline,
  IoTrashOutline,
  IoDocumentAttachOutline,
  IoLinkOutline
} from 'react-icons/io5'
import {
  MdInfoOutline,
  MdOutlineLocationOn,
  MdOutlineImage,
  MdOutlinePhotoCamera,
  MdOutlineHowToReg,
  MdOutlineSchedule,
  MdOutlineDescription
} from 'react-icons/md'

const inputClass =
  'w-full px-4 py-3 bg-input-bg border border-verde-musgo rounded-xl text-sm sm:text-base text-verde-escuro placeholder:text-verde-escuro/60 focus:outline-none focus:ring-1 focus:ring-verde-musgo transition'

const labelClass = 'text-verde-escuro text-sm font-semibold'

const SecaoTitulo = ({ icone: Icone, titulo }) => (
  <div className="flex items-center gap-2.5 text-verde-escuro">
    <Icone size={20} className="text-verde-musgo shrink-0" />
    <h3 className="text-base sm:text-lg font-bold uppercase tracking-wide">{titulo}</h3>
  </div>
)

const estadoInicial = {
  nome: '',
  tipo: 'torneio',
  descricao: '',
  data: '',
  horarioInicio: '',
  horarioFim: '',
  local: '',
  inscricoes: 'abertas'
}

function extrairHorarios(textoHorario = '') {
  const partes = String(textoHorario || '')
    .split(/\s*[-–aà]\s*/i)
    .map((p) => p.trim())
    .filter(Boolean)
  return {
    horarioInicio: partes[0] || '',
    horarioFim: partes[1] || ''
  }
}

function CadastrarEventoConteudo() {
  const searchParams = useSearchParams()
  const idEdicao = searchParams.get('id')

  const [form, setForm] = useState(estadoInicial)
  const [agenda, setAgenda] = useState([])
  const [documentos, setDocumentos] = useState([])
  const [escolas, setEscolas] = useState([])
  const [statusCarregado, setStatusCarregado] = useState('')
  const [banner, setBanner] = useState(null)
  const [bannerPreview, setBannerPreview] = useState('')
  const [erroBanner, setErroBanner] = useState('')
  const [modal, setModal] = useState(null) // 'sucesso' | 'erro' | null
  const [mensagemErroApi, setMensagemErroApi] = useState('')

  useEffect(() => {
    let ativo = true

    apiEscolas
      .listar()
      .then((lista) => {
        if (!ativo || !Array.isArray(lista)) return
        setEscolas(lista)
      })
      .catch(() => {})

    if (idEdicao) {
      apiEventos
        .buscarPorId(idEdicao)
        .then((ev) => {
          if (!ativo || !ev) return
          const { horarioInicio, horarioFim } = extrairHorarios(ev.time)
          setForm({
            nome: ev.title || '',
            tipo: ev.type || 'torneio',
            descricao: ev.description || '',
            data: (ev.date || '').slice(0, 10),
            horarioInicio,
            horarioFim,
            local: ev.location || ev.school?.name || '',
            inscricoes: ev.registration || 'abertas'
          })
          setStatusCarregado(ev.status || 'agendado')
          setAgenda(
            Array.isArray(ev.agenda)
              ? ev.agenda.map((a) => {
                  const { horarioInicio: hi, horarioFim: hf } = extrairHorarios(a?.horario)
                  return {
                    ...a,
                    horarioInicio: a?.horarioInicio || hi || '',
                    horarioFim: a?.horarioFim || hf || '',
                    titulo: a?.titulo || ''
                  }
                })
              : []
          )
          setDocumentos(
            Array.isArray(ev.documents)
              ? ev.documents.map((d) => ({
                  ...d,
                  modo: d?.url?.startsWith('data:application/pdf') ? 'pdf' : 'link',
                  nomeArquivo: d?.nomeArquivo || ''
                }))
              : []
          )
        })
        .catch(() => {})
    }

    return () => {
      ativo = false
    }
  }, [idEdicao])

  const atualizar = (campo) => (e) => setForm({ ...form, [campo]: e.target.value })

  const adicionarItemAgenda = () => {
    setAgenda((prev) => [...prev, { horarioInicio: '', horarioFim: '', horario: '', titulo: '' }])
  }

  const atualizarItemAgenda = (idx, campo, valor) => {
    setAgenda((prev) =>
      prev.map((item, i) => {
        if (i !== idx) return item
        const atualizado = { ...item, [campo]: valor }
        const hi = String(atualizado.horarioInicio || '').trim()
        const hf = String(atualizado.horarioFim || '').trim()
        atualizado.horario = hi && hf ? `${hi} - ${hf}` : hi || hf || ''
        return atualizado
      })
    )
  }

  const removerItemAgenda = (idx) => {
    setAgenda((prev) => prev.filter((_, i) => i !== idx))
  }

  const adicionarDocumento = () => {
    setDocumentos((prev) => [...prev, { nome: '', url: '', modo: 'pdf', nomeArquivo: '' }])
  }

  const atualizarDocumento = (idx, campo, valor) => {
    setDocumentos((prev) => prev.map((item, i) => (i === idx ? { ...item, [campo]: valor } : item)))
  }

  const handleUploadPdfDocumento = async (idx, arquivo) => {
    if (!arquivo) return
    try {
      const dataUrl = await arquivoParaDataUrl(arquivo)
      setDocumentos((prev) =>
        prev.map((item, i) =>
          i === idx
            ? {
                ...item,
                nome: item.nome?.trim() ? item.nome : arquivo.name.replace(/\.pdf$/i, ''),
                url: dataUrl,
                nomeArquivo: arquivo.name,
                modo: 'pdf'
              }
            : item
        )
      )
    } catch {}
  }

  const removerDocumento = (idx) => {
    setDocumentos((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleBanner = (arquivo) => {
    if (!arquivo) return
    const tiposPermitidos = ['image/jpeg', 'image/png']
    if (!tiposPermitidos.includes(arquivo.type)) {
      setErroBanner('Formato inválido. Use JPG ou PNG.')
      return
    }
    if (arquivo.size > 5 * 1024 * 1024) {
      setErroBanner('O arquivo deve ter no máximo 5MB.')
      return
    }
    setErroBanner('')
    setBanner(arquivo)
    if (bannerPreview) URL.revokeObjectURL(bannerPreview)
    setBannerPreview(URL.createObjectURL(arquivo))
  }

  const handleDrop = (e) => {
    e.preventDefault()
    handleBanner(e.dataTransfer.files?.[0])
  }

  const limparFormulario = () => {
    setForm(estadoInicial)
    setAgenda([])
    setDocumentos([])
    setBanner(null)
    if (bannerPreview) URL.revokeObjectURL(bannerPreview)
    setBannerPreview('')
    setErroBanner('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const valido = form.nome.trim() && form.data && form.local.trim()

    if (!valido) {
      setMensagemErroApi('')
      setModal('erro')
      return
    }

    const escEncontrada = escolas.find(
      (s) => s.name.toLowerCase() === form.local.trim().toLowerCase()
    )
    const schoolId = escEncontrada?.id || null

    const agendaValida = agenda
      .map((a) => {
        const hi = String(a.horarioInicio || '').trim()
        const hf = String(a.horarioFim || '').trim()
        const horarioFormatado =
          hi && hf ? `${hi} - ${hf}` : hi || hf || String(a.horario || '').trim()
        return {
          horario: horarioFormatado,
          titulo: String(a.titulo || '').trim()
        }
      })
      .filter((a) => a.horario || a.titulo)

    const documentosValidos = documentos
      .map((d) => ({
        nome: String(d.nome || '').trim(),
        ...(d.url?.trim() ? { url: d.url.trim() } : {})
      }))
      .filter((d) => d.nome)

    const horarioCombinado = [form.horarioInicio?.trim(), form.horarioFim?.trim()]
      .filter(Boolean)
      .join(' - ')

    const payload = {
      title: form.nome.trim(),
      type: form.tipo,
      description: form.descricao.trim(),
      date: form.data,
      time: horarioCombinado,
      location: form.local.trim(),
      registration: form.inscricoes,
      status: idEdicao ? statusCarregado || 'agendado' : 'agendado',
      agenda: agendaValida.length > 0 ? agendaValida : null,
      documents: documentosValidos.length > 0 ? documentosValidos : null,
      schoolId
    }

    try {
      if (idEdicao) {
        await apiEventos.atualizar(idEdicao, payload)
      } else {
        await apiEventos.criar(payload)
      }
      setMensagemErroApi('')
      setModal('sucesso')
      if (!idEdicao) limparFormulario()
    } catch (err) {
      setMensagemErroApi(err?.message || '')
      setModal('erro')
    }
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full bg-background relative">
      <SideBarAdmin />

      <div className="flex-1 flex flex-col pb-16">
        <main className="w-full max-w-[1040px] mx-auto py-8 lg:py-10 px-6 sm:px-10 lg:px-14 flex flex-col gap-6 sm:gap-8">
          <section className="flex flex-col gap-2">
            <h1 className="text-verde-escuro text-3xl sm:text-4xl font-bold leading-tight">
              {idEdicao ? 'Editar Evento' : 'Criar Novo Evento'}
            </h1>
            <p className="text-verde-musgo text-sm sm:text-base">
              Preencha os detalhes para agendar uma nova feira, mostra ou torneio de robótica na
              rede.
            </p>
          </section>

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6 w-full">
            {/* Informações básicas */}
            <div className="p-6 sm:p-8 bg-white rounded-2xl shadow-sm border border-verde-musgo flex flex-col gap-5">
              <SecaoTitulo icone={MdInfoOutline} titulo="Informações Básicas" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label htmlFor="nome" className={labelClass}>
                    Nome do Evento
                  </label>
                  <input
                    id="nome"
                    type="text"
                    value={form.nome}
                    onChange={atualizar('nome')}
                    placeholder="Ex: Grand Prix de Robótica 2026"
                    className={inputClass}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="tipo" className={labelClass}>
                    Tipo de Evento
                  </label>
                  <div className="relative">
                    <Select
                      id="tipo"
                      value={form.tipo}
                      onChange={atualizar('tipo')}
                      className={`${inputClass} appearance-none cursor-pointer pe-10`}
                    >
                      <option value="torneio">Torneio</option>
                      <option value="feira">Feira</option>
                      <option value="mostra">Mostra</option>
                      <option value="oficina">Oficina</option>
                    </Select>
                  </div>
                </div>

                <div className="flex flex-col gap-2 md:col-span-2">
                  <label htmlFor="descricao" className={labelClass}>
                    Descrição do Evento
                  </label>
                  <textarea
                    id="descricao"
                    rows={4}
                    value={form.descricao}
                    onChange={atualizar('descricao')}
                    placeholder="Descreva os objetivos, público-alvo e detalhes técnicos..."
                    className={`${inputClass} resize-none`}
                  />
                </div>
              </div>
            </div>

            {/* Data & Localização */}
            <div className="p-6 sm:p-8 bg-white rounded-2xl shadow-sm border border-verde-musgo flex flex-col gap-5">
              <SecaoTitulo icone={MdOutlineLocationOn} titulo="Data & Localização" />

              <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                <div className="flex flex-col gap-2">
                  <label htmlFor="data" className={labelClass}>
                    Data do Evento
                  </label>
                  <input
                    id="data"
                    type="date"
                    value={form.data}
                    onChange={atualizar('data')}
                    className={inputClass}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="horarioInicio" className={labelClass}>
                    Horário de Início
                  </label>
                  <input
                    id="horarioInicio"
                    type="time"
                    value={form.horarioInicio}
                    onChange={atualizar('horarioInicio')}
                    className={inputClass}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="horarioFim" className={labelClass}>
                    Horário de Término
                  </label>
                  <input
                    id="horarioFim"
                    type="time"
                    value={form.horarioFim}
                    onChange={atualizar('horarioFim')}
                    className={inputClass}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="local" className={labelClass}>
                    Local
                  </label>
                  <input
                    id="local"
                    type="text"
                    value={form.local}
                    onChange={atualizar('local')}
                    placeholder="Ginásio do Tinga, Caraguatatuba"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            {/* Agenda e Documentação (Opcionais) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-white rounded-2xl shadow-sm border border-verde-musgo/40 flex flex-col gap-4 overflow-hidden">
                <div className="flex items-center justify-between gap-2">
                  <SecaoTitulo icone={MdOutlineSchedule} titulo="Agenda (Opcional)" />
                  <button
                    type="button"
                    onClick={adicionarItemAgenda}
                    className="inline-flex items-center gap-1 text-xs font-bold text-verde-musgo hover:text-verde-escuro cursor-pointer shrink-0"
                  >
                    <IoAddOutline size={16} /> Adicionar horário
                  </button>
                </div>

                {agenda.length === 0 ? (
                  <p className="text-xs text-stone-500">
                    Nenhum item de agenda adicionado. Caso fique vazio, a seção Agenda não será
                    exibida na página do evento.
                  </p>
                ) : (
                  <div className="flex flex-col gap-3.5">
                    {agenda.map((item, idx) => {
                      const hi = String(item.horarioInicio || '').trim()
                      const hf = String(item.horarioFim || '').trim()
                      const faixa = hi && hf ? `${hi} - ${hf}` : hi || hf || item.horario || ''
                      return (
                        <div
                          key={idx}
                          className="flex flex-col gap-2.5 p-3.5 rounded-xl border border-verde-musgo/40 bg-input-bg/40"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <div className="flex flex-col gap-1 flex-1">
                                <span className="text-[11px] font-bold uppercase text-verde-musgo">
                                  Início
                                </span>
                                <input
                                  type="time"
                                  value={item.horarioInicio || ''}
                                  onChange={(e) =>
                                    atualizarItemAgenda(idx, 'horarioInicio', e.target.value)
                                  }
                                  aria-label={`Horário de início da atividade ${idx + 1}`}
                                  className="w-full px-3 py-2 bg-input-bg border border-verde-musgo rounded-xl text-sm text-verde-escuro focus:outline-none focus:ring-1 focus:ring-verde-musgo transition"
                                />
                              </div>

                              <span className="mt-4 text-verde-musgo font-bold">—</span>

                              <div className="flex flex-col gap-1 flex-1">
                                <span className="text-[11px] font-bold uppercase text-verde-musgo">
                                  Término
                                </span>
                                <input
                                  type="time"
                                  value={item.horarioFim || ''}
                                  onChange={(e) =>
                                    atualizarItemAgenda(idx, 'horarioFim', e.target.value)
                                  }
                                  aria-label={`Horário de término da atividade ${idx + 1}`}
                                  className="w-full px-3 py-2 bg-input-bg border border-verde-musgo rounded-xl text-sm text-verde-escuro focus:outline-none focus:ring-1 focus:ring-verde-musgo transition"
                                />
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => removerItemAgenda(idx)}
                              aria-label="Remover item da agenda"
                              className="mt-4 p-1.5 text-verde-musgo hover:text-vermelho cursor-pointer shrink-0"
                            >
                              <IoTrashOutline size={18} />
                            </button>
                          </div>

                          <input
                            type="text"
                            value={item.titulo}
                            onChange={(e) => atualizarItemAgenda(idx, 'titulo', e.target.value)}
                            placeholder="Ex: Credenciamento das equipes e montagem dos estandes"
                            className="w-full px-3.5 py-2.5 bg-input-bg border border-verde-musgo rounded-xl text-sm text-verde-escuro placeholder:text-verde-escuro/60 focus:outline-none focus:ring-1 focus:ring-verde-musgo transition"
                          />

                          {(faixa || item.titulo) && (
                            <p className="text-xs text-verde-musgo flex items-center gap-1.5 flex-wrap">
                              {faixa && (
                                <span className="px-2 py-0.5 rounded-md bg-verde-pastel font-mono font-bold text-verde-escuro">
                                  {faixa}
                                </span>
                              )}
                              {item.titulo && <span>— {item.titulo}</span>}
                            </p>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              <div className="p-6 bg-white rounded-2xl shadow-sm border border-verde-musgo/40 flex flex-col gap-4 overflow-hidden">
                <div className="flex items-center justify-between gap-2">
                  <SecaoTitulo icone={MdOutlineDescription} titulo="Documentação (Opcional)" />
                  <button
                    type="button"
                    onClick={adicionarDocumento}
                    className="inline-flex items-center gap-1 text-xs font-bold text-verde-musgo hover:text-verde-escuro cursor-pointer shrink-0"
                  >
                    <IoAddOutline size={16} /> Adicionar documento
                  </button>
                </div>

                {documentos.length === 0 ? (
                  <p className="text-xs text-stone-500">
                    Nenhum documento adicionado. Caso fique vazio, a seção Documentação não será
                    exibida na página do evento.
                  </p>
                ) : (
                  <div className="flex flex-col gap-4">
                    {documentos.map((doc, idx) => {
                      const modoAtual = doc.modo || 'pdf'
                      return (
                        <div
                          key={idx}
                          className="flex flex-col gap-2.5 p-3.5 rounded-xl border border-verde-musgo/40 bg-input-bg/40"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="inline-flex rounded-lg border border-verde-musgo overflow-hidden text-xs font-bold">
                              <button
                                type="button"
                                onClick={() => atualizarDocumento(idx, 'modo', 'pdf')}
                                className={`px-3 py-1.5 flex items-center gap-1.5 cursor-pointer transition ${
                                  modoAtual === 'pdf'
                                    ? 'bg-verde-limao text-verde-escuro'
                                    : 'bg-white text-verde-escuro hover:bg-verde-pastel/50'
                                }`}
                              >
                                <IoDocumentAttachOutline size={14} />
                                Arquivo PDF
                              </button>
                              <button
                                type="button"
                                onClick={() => atualizarDocumento(idx, 'modo', 'link')}
                                className={`px-3 py-1.5 flex items-center gap-1.5 cursor-pointer transition ${
                                  modoAtual === 'link'
                                    ? 'bg-verde-limao text-verde-escuro'
                                    : 'bg-white text-verde-escuro hover:bg-verde-pastel/50'
                                }`}
                              >
                                <IoLinkOutline size={14} />
                                Link
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => removerDocumento(idx)}
                              aria-label="Remover documento"
                              className="p-1.5 text-verde-musgo hover:text-vermelho cursor-pointer shrink-0"
                            >
                              <IoTrashOutline size={18} />
                            </button>
                          </div>

                          <input
                            type="text"
                            value={doc.nome}
                            onChange={(e) => atualizarDocumento(idx, 'nome', e.target.value)}
                            placeholder="Título do documento (ex: Regulamento Oficial)"
                            className="w-full px-3.5 py-2.5 bg-input-bg border border-verde-musgo rounded-xl text-sm text-verde-escuro placeholder:text-verde-escuro/60 focus:outline-none focus:ring-1 focus:ring-verde-musgo transition"
                          />

                          {modoAtual === 'pdf' ? (
                            <label className="flex items-center justify-between gap-2 px-3.5 py-2.5 bg-input-bg border border-dashed border-verde-musgo rounded-xl text-xs sm:text-sm text-verde-escuro cursor-pointer hover:bg-verde-pastel/40 transition">
                              <span className="truncate font-medium">
                                {doc.nomeArquivo ||
                                  (doc.url?.startsWith('data:application/pdf')
                                    ? 'PDF anexado (clique para trocar)'
                                    : 'Selecionar arquivo PDF do computador...')}
                              </span>
                              <span className="shrink-0 px-2.5 py-1 rounded-md bg-verde-limao text-verde-escuro text-xs font-bold uppercase">
                                Escolher PDF
                              </span>
                              <input
                                type="file"
                                accept="application/pdf,.pdf"
                                className="sr-only"
                                onChange={(e) => handleUploadPdfDocumento(idx, e.target.files?.[0])}
                              />
                            </label>
                          ) : (
                            <input
                              type="url"
                              value={doc.url?.startsWith('data:') ? '' : doc.url || ''}
                              onChange={(e) => atualizarDocumento(idx, 'url', e.target.value)}
                              placeholder="https://exemplo.com/regulamento.pdf"
                              className="w-full px-3.5 py-2.5 bg-input-bg border border-verde-musgo rounded-xl text-sm text-verde-escuro placeholder:text-verde-escuro/60 focus:outline-none focus:ring-1 focus:ring-verde-musgo transition"
                            />
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Mídia + Inscrições */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 p-6 bg-white rounded-2xl shadow-sm border border-verde-musgo/40 flex flex-col gap-5">
                <SecaoTitulo icone={MdOutlineImage} titulo="Mídia do Evento" />

                <label
                  htmlFor="banner"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  className="relative flex flex-col items-center justify-center gap-2 min-h-40 rounded-xl border-2 border-dashed border-verde-musgo/50 px-4 py-6 text-center cursor-pointer overflow-hidden hover:bg-input-bg transition"
                >
                  {bannerPreview ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={bannerPreview}
                        alt="Pré-visualização do banner"
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                      <span className="relative z-10 rounded-md bg-white/90 px-3 py-1 text-xs font-semibold text-verde-escuro">
                        {banner?.name} — clique para trocar
                      </span>
                    </>
                  ) : (
                    <>
                      <div className="flex size-11 items-center justify-center rounded-full bg-verde-limao text-verde-escuro">
                        <MdOutlinePhotoCamera size={22} />
                      </div>
                      <span className="text-verde-escuro text-sm font-bold">
                        Upload do Banner Principal
                      </span>
                      <span className="text-verde-musgo text-xs">
                        Arraste um arquivo ou clique para selecionar (JPG, PNG, max 5MB)
                      </span>
                    </>
                  )}
                  <input
                    id="banner"
                    type="file"
                    accept="image/png, image/jpeg"
                    className="sr-only"
                    onChange={(e) => handleBanner(e.target.files?.[0])}
                  />
                </label>
                {erroBanner && (
                  <span className="text-vermelho text-xs font-semibold px-1">{erroBanner}</span>
                )}
              </div>

              <div className="p-6 sm:p-8 bg-white rounded-2xl shadow-sm border border-verde-musgo flex flex-col gap-5">
                <SecaoTitulo icone={MdOutlineHowToReg} titulo="Inscrições" />

                <div className="flex flex-col gap-5 py-4">
                  {[
                    { valor: 'abertas', texto: 'Abertas', cor: 'bg-verde-oliva' },
                    { valor: 'fechadas', texto: 'Fechadas', cor: 'bg-vermelho' }
                  ].map(({ valor, texto, cor }) => (
                    <label key={valor} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="inscricoes"
                        value={valor}
                        checked={form.inscricoes === valor}
                        onChange={atualizar('inscricoes')}
                        className="size-4 accent-verde-escuro cursor-pointer"
                      />
                      <span className={`size-1.5 rounded-full ${cor}`} />
                      <span className="text-verde-escuro text-sm font-semibold">{texto}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Ações */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4">
              <Link
                href="/gestaoEventos"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-verde-escuro font-bold uppercase text-sm tracking-wide hover:bg-input-bg transition"
              >
                <IoClose size={20} /> Cancelar
              </Link>

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 bg-verde-musgo hover:bg-white hover:text-verde-musgo border border-verde-musgo text-white text-sm font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-3 cursor-pointer transition"
              >
                {idEdicao ? 'Salvar Alterações' : 'Publicar Evento'}
                <IoArrowForward size={20} />
              </button>
            </div>
          </form>
        </main>
      </div>

      <ModalConfirmacao
        tipo={modal}
        tituloPrincipal={
          modal === 'sucesso'
            ? idEdicao
              ? 'Evento atualizado com'
              : 'Evento criado com'
            : 'Não foi possível salvar'
        }
        tituloDestaque={modal === 'sucesso' ? 'sucesso!' : 'o evento!'}
        mensagem={
          modal === 'sucesso'
            ? 'O evento foi registrado e já está visível para toda a rede escolar!'
            : mensagemErroApi ||
              'Verifique se todos os campos foram preenchidos corretamente e tente salvar mais uma vez.'
        }
        textoBotaoVoltar="Voltar"
        hrefVoltar="/gestaoEventos"
        onTentarNovamente={() => setModal(null)}
      />
    </div>
  )
}

export default function CadastrarEvento() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <CadastrarEventoConteudo />
    </Suspense>
  )
}
