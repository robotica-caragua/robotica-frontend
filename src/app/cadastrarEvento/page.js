'use client'

import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { SideBarAdmin } from '@/components/SideBarAdmin'
import { ModalConfirmacao } from '@/components/ModalConfirmacao'
import { apiEscolas, apiProjetos } from '@/services/api'
import { IoClose, IoArrowForward } from 'react-icons/io5'
import {
  MdInfoOutline,
  MdOutlineLocationOn,
  MdOutlineImage,
  MdOutlinePhotoCamera,
  MdOutlineHowToReg,
  MdKeyboardArrowDown
} from 'react-icons/md'

const inputClass =
  'w-full px-4 py-3 bg-input-bg border border-verde-musgo/40 rounded-lg text-sm text-verde-escuro placeholder:text-verde-escuro/50 focus:outline-none focus:ring-1 focus:ring-verde-musgo transition'

const labelClass = 'text-verde-escuro text-sm font-semibold px-1'

const SecaoTitulo = ({ icone: Icone, titulo }) => (
  <div className="flex items-center gap-2 text-verde-escuro">
    <Icone size={18} />
    <h3 className="text-xs font-bold uppercase tracking-wider">{titulo}</h3>
  </div>
)

const estadoInicial = {
  nome: '',
  tipo: 'torneio',
  descricao: '',
  data: '',
  horario: '',
  local: '',
  inscricoes: 'abertas'
}

function CadastrarEventoConteudo() {
  const searchParams = useSearchParams()
  const idEdicao = searchParams.get('id')

  const [form, setForm] = useState(estadoInicial)
  const [escolas, setEscolas] = useState([])
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
      apiProjetos
        .buscarPorId(idEdicao)
        .then((proj) => {
          if (!ativo || !proj) return
          setForm((prev) => ({
            ...prev,
            nome: proj.name || '',
            descricao: proj.description || '',
            local: proj.school?.name || '',
            data: (proj.createdAt || '').slice(0, 10)
          }))
        })
        .catch(() => {})
    }

    return () => {
      ativo = false
    }
  }, [idEdicao])

  const atualizar = (campo) => (e) => setForm({ ...form, [campo]: e.target.value })

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
    const schoolId = escEncontrada?.id || escolas[0]?.id

    if (!schoolId) {
      setMensagemErroApi('Cadastre ao menos uma escola antes de registrar eventos.')
      setModal('erro')
      return
    }

    const descricaoCompleta = [
      form.descricao.trim(),
      `Data: ${form.data}`,
      form.horario ? `Horário: ${form.horario}` : '',
      `Local: ${form.local.trim()}`
    ]
      .filter(Boolean)
      .join(' | ')

    try {
      if (idEdicao) {
        await apiProjetos.atualizar(idEdicao, {
          name: form.nome.trim(),
          description: descricaoCompleta,
          schoolId
        })
      } else {
        await apiProjetos.criar({
          name: form.nome.trim(),
          description: descricaoCompleta,
          schoolId
        })
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
    <div className="flex flex-col lg:flex-row min-h-screen bg-background relative">
      <SideBarAdmin />

      <div className="flex-1 flex flex-col">
        <main className="w-full max-w-5xl mx-auto py-8 lg:py-12 px-4 sm:px-8 flex flex-col gap-8">
          <section className="flex flex-col gap-2">
            <h1 className="text-verde-escuro text-2xl font-bold leading-tight">
              {idEdicao ? 'Editar Evento' : 'Criar Novo Evento'}
            </h1>
            <p className="text-verde-musgo text-base sm:text-lg">
              Preencha os detalhes para agendar uma nova feira, mostra ou torneio de robótica na
              rede.
            </p>
          </section>

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6 w-full">
            {/* Informações básicas */}
            <div className="p-6 bg-white rounded-2xl shadow-sm border border-verde-musgo/40 flex flex-col gap-5">
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
                    placeholder="Ex: Grand Prix de Robótica 2024"
                    className={inputClass}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="tipo" className={labelClass}>
                    Tipo de Evento
                  </label>
                  <div className="relative">
                    <select
                      id="tipo"
                      value={form.tipo}
                      onChange={atualizar('tipo')}
                      className={`${inputClass} appearance-none cursor-pointer pe-10`}
                    >
                      <option value="torneio">Torneio</option>
                      <option value="feira">Feira</option>
                      <option value="mostra">Mostra</option>
                      <option value="oficina">Oficina</option>
                    </select>
                    <MdKeyboardArrowDown
                      size={20}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-verde-escuro"
                    />
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
            <div className="p-6 bg-white rounded-2xl shadow-sm border border-verde-musgo/40 flex flex-col gap-5">
              <SecaoTitulo icone={MdOutlineLocationOn} titulo="Data & Localização" />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
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
                  <label htmlFor="horario" className={labelClass}>
                    Horário (Início - Fim)
                  </label>
                  <input
                    id="horario"
                    type="text"
                    value={form.horario}
                    onChange={atualizar('horario')}
                    placeholder="08:00 - 18:00"
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
                    placeholder="Seduc - São Paulo"
                    className={inputClass}
                  />
                </div>
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

              <div className="p-6 bg-white rounded-2xl shadow-sm border border-verde-musgo/40 flex flex-col gap-5">
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
        textoBotaoVoltar="Voltar para Eventos"
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
