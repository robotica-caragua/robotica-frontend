'use client'

import { useState } from 'react'
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
  MdArrowForward,
  MdOutlineNotifications,
  MdOutlineSettings,
  MdPerson
} from 'react-icons/md'
import { IoIosArrowDown } from 'react-icons/io'
import { AdminSidebar } from '@/components/AdminSidebar'

export default function NovoProjetoPage() {
  const router = useRouter()
  const [nome, setNome] = useState('')
  const [categoria, setCategoria] = useState('')
  const [escola, setEscola] = useState('')
  const [descricao, setDescricao] = useState('')
  const [arquivos, setArquivos] = useState([])

  function handleArquivos(e) {
    const lista = Array.from(e.target.files || [])
    setArquivos(lista)
  }

  function handleSubmit(e) {
    e.preventDefault()
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    if (apiUrl) {
      fetch(`${apiUrl}/projetos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, categoria, escola, descricao })
      }).catch(() => {})
    }
    router.push('/projetos')
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar variant="professor" />

      <div className="flex flex-1 flex-col px-10 pb-16">
        {/* Topo */}
        <div className="flex h-16 items-center justify-end gap-4 text-verde-escuro">
          <div className="relative">
            <MdOutlineNotifications size={22} />
            <span className="absolute top-0.5 right-0.5 h-2 w-2 rounded-full bg-vermelho" />
          </div>
          <MdOutlineSettings size={22} />
          <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-verde-musgo bg-verde-escuro text-verde-pastel">
            <MdPerson size={24} />
          </div>
        </div>

        <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 pt-10">
          {/* Cabeçalho */}
          <div>
            <h1 className="text-4xl font-bold text-verde-escuro">Criar Novo Projeto</h1>
            <p className="mt-1 text-sm text-verde-musgo">
              Transforme o trabalho da sua turma em um tutorial para toda a nossa rede.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Informações Básicas */}
            <section className="flex flex-col gap-5 rounded-2xl border border-verde-musgo bg-white p-7">
              <div className="flex items-center gap-2 text-verde-escuro">
                <MdOutlineArticle size={20} className="text-verde-musgo" />
                <h2 className="text-sm font-bold uppercase">Informações Básicas</h2>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-verde-escuro">Nome do tutorial</label>
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
                  <select
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    className="w-full appearance-none rounded-lg border border-verde-musgo bg-input-bg px-4 py-3 pr-10 text-sm text-verde-musgo focus:outline-none cursor-pointer"
                  >
                    <option value="">Selecione o tema principal...</option>
                    <option value="Maker / Reciclagem">Maker / Reciclagem</option>
                    <option value="Eletrônica">Eletrônica</option>
                    <option value="Mecânica">Mecânica</option>
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
                    <option value="EMEF Prof. Luiz Ribeiro Muniz">
                      EMEF Prof. Luiz Ribeiro Muniz
                    </option>
                    <option value="EMEF Prof. Luiz Silvar do Prado">
                      EMEF Prof. Luiz Silvar do Prado
                    </option>
                    <option value="EMEF Profª Maria Aparecida De Carvalho">
                      EMEF Profª Maria Aparecida De Carvalho
                    </option>
                    <option value="EMEF Profª Maria Thereza de Souza Castro">
                      EMEF Profª Maria Thereza de Souza Castro
                    </option>
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
                className="flex items-center gap-3 rounded-md bg-verde-musgo px-6 py-3 text-xs font-bold uppercase text-white hover:brightness-90 cursor-pointer"
              >
                Publicar Projeto
                <MdArrowForward size={16} />
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  )
}
