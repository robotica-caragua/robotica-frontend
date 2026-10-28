'use client'

import { useState } from 'react'
import Link from 'next/link'
import { SideBarAdmin } from '@/components/SideBarAdmin'
import { ModalConfirmacao } from '@/components/ModalConfirmacao'
import { IoClose, IoArrowForward, IoChevronDown } from 'react-icons/io5'
import { FaBuilding, FaMapMarkerAlt, FaAddressBook } from 'react-icons/fa'

export default function CadastrarEscola() {
  const [form, setForm] = useState({
    nomeEscola: '',
    codigoInep: '',
    tipoUnidade: '',
    endereco: '',
    bairro: '',
    regiao: '',
    telefone: '',
    email: '',
    statusPolo: 'ativo'
  })
  const [modal, setModal] = useState(null) // 'sucesso' | 'erro' | null

  const atualizar = (campo) => (e) => {
    setForm((prev) => ({ ...prev, [campo]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const valido =
      form.nomeEscola.trim() &&
      form.tipoUnidade &&
      form.endereco.trim() &&
      form.bairro.trim() &&
      form.regiao &&
      form.telefone.trim() &&
      form.email.trim()

    if (!valido) {
      setModal('erro')
      return
    }

    // TODO: integrar com a API de escolas
    setModal('sucesso')
  }

  return (
    <div className="flex min-h-screen bg-background relative">
      {/* MENU LATERAL (SIDEBAR) */}
      <SideBarAdmin />

      {/* ÁREA DIREITA (Conteúdo) */}
      <main className="flex-1 flex flex-col">
        {/* CONTEÚDO PRINCIPAL (Mesma largura e espaçamento do Cadastrar Professor) */}
        <div className="w-[75%] mx-auto py-12 px-8 flex flex-col gap-10">
          {/* CABEÇALHO DA PÁGINA */}
          <section className="flex flex-col gap-2 items-center text-center">
            <h2 className="text-verde-escuro text-5xl font-bold leading-tight">
              Cadastrar Nova Escola
            </h2>
            <p className="text-verde-musgo text-xl font-normal">
              Registre uma nova unidade escolar para que ela possa receber equipes e professores no
              circuito de robótica.
            </p>
          </section>

          {/* FORMULÁRIO DE CADASTRO */}
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-8 w-full">
            {/* SEÇÃO: INFORMAÇÕES DA UNIDADE */}
            <div className="w-full p-8 bg-white rounded-3xl shadow-sm border border-verde-musgo border-opacity-30 flex flex-col gap-8">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-verde-pastel rounded-lg flex justify-center items-center text-verde-musgo">
                  <FaBuilding size={18} />
                </div>
                <h3 className="text-verde-escuro text-2xl font-semibold">Informações da Unidade</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label
                    htmlFor="nomeEscola"
                    className="text-verde-musgo text-sm font-bold uppercase tracking-wide px-1"
                  >
                    Nome da Escola
                  </label>
                  <input
                    type="text"
                    id="nomeEscola"
                    value={form.nomeEscola}
                    onChange={atualizar('nomeEscola')}
                    placeholder="Ex: EMEF Prof. João Batista"
                    className="w-full px-4 py-3.5 bg-input-bg border border-verde-musgo rounded-xl text-verde-escuro placeholder-verde-escuro placeholder-opacity-50 focus:outline-none transition"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="codigoInep"
                    className="text-verde-musgo text-sm font-bold uppercase tracking-wide px-1"
                  >
                    Código INEP (Opcional)
                  </label>
                  <input
                    type="text"
                    id="codigoInep"
                    value={form.codigoInep}
                    onChange={atualizar('codigoInep')}
                    placeholder="Ex: 35001234"
                    className="w-full px-4 py-3.5 bg-input-bg border border-verde-musgo rounded-xl text-verde-escuro placeholder-verde-escuro placeholder-opacity-50 focus:outline-none transition"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="tipoUnidade"
                    className="text-verde-musgo text-sm font-bold uppercase tracking-wide px-1"
                  >
                    Tipo de Unidade
                  </label>
                  <div className="relative">
                    <select
                      id="tipoUnidade"
                      value={form.tipoUnidade}
                      onChange={atualizar('tipoUnidade')}
                      className="w-full px-4 py-3.5 pr-10 bg-input-bg border border-verde-musgo rounded-xl text-verde-escuro focus:outline-none appearance-none cursor-pointer"
                    >
                      <option value="" disabled className="text-verde-escuro text-opacity-50">
                        Selecione o tipo de unidade...
                      </option>
                      <option value="emef">EMEF</option>
                      <option value="emei">EMEI</option>
                    </select>
                    <IoChevronDown
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-verde-musgo pointer-events-none"
                      size={20}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SEÇÃO: LOCALIZAÇÃO */}
            <div className="w-full p-8 bg-white rounded-3xl shadow-sm border border-verde-musgo border-opacity-30 flex flex-col gap-8">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-verde-pastel rounded-lg flex justify-center items-center text-verde-musgo">
                  <FaMapMarkerAlt size={18} />
                </div>
                <h3 className="text-verde-escuro text-2xl font-semibold">Localização</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label
                    htmlFor="endereco"
                    className="text-verde-musgo text-sm font-bold uppercase tracking-wide px-1"
                  >
                    Endereço Completo
                  </label>
                  <input
                    type="text"
                    id="endereco"
                    value={form.endereco}
                    onChange={atualizar('endereco')}
                    placeholder="Ex: Rua das Flores, 123"
                    className="w-full px-4 py-3.5 bg-input-bg border border-verde-musgo rounded-xl text-verde-escuro placeholder-verde-escuro placeholder-opacity-50 focus:outline-none transition"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="bairro"
                    className="text-verde-musgo text-sm font-bold uppercase tracking-wide px-1"
                  >
                    Bairro
                  </label>
                  <input
                    type="text"
                    id="bairro"
                    value={form.bairro}
                    onChange={atualizar('bairro')}
                    placeholder="Ex: Tinga, Massaguaçu ou Perequê-Mirim"
                    className="w-full px-4 py-3.5 bg-input-bg border border-verde-musgo rounded-xl text-verde-escuro placeholder-verde-escuro placeholder-opacity-50 focus:outline-none transition"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="regiao"
                    className="text-verde-musgo text-sm font-bold uppercase tracking-wide px-1"
                  >
                    Região
                  </label>
                  <div className="relative">
                    <select
                      id="regiao"
                      value={form.regiao}
                      onChange={atualizar('regiao')}
                      className="w-full px-4 py-3.5 pr-10 bg-input-bg border border-verde-musgo rounded-xl text-verde-escuro focus:outline-none appearance-none cursor-pointer"
                    >
                      <option value="" disabled className="text-verde-escuro text-opacity-50">
                        Selecione a região...
                      </option>
                      <option value="norte">Norte</option>
                      <option value="sul">Sul</option>
                      <option value="centro">Centro</option>
                    </select>
                    <IoChevronDown
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-verde-musgo pointer-events-none"
                      size={20}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SEÇÃO: CONTATO E FUNCIONAMENTO */}
            <div className="w-full p-8 bg-white rounded-3xl shadow-sm border border-verde-musgo border-opacity-30 flex flex-col gap-8">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-verde-pastel rounded-lg flex justify-center items-center text-verde-musgo">
                  <FaAddressBook size={18} />
                </div>
                <h3 className="text-verde-escuro text-2xl font-semibold">
                  Contato e Funcionamento
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="telefone"
                    className="text-verde-musgo text-sm font-bold uppercase tracking-wide px-1"
                  >
                    Telefone da Secretaria
                  </label>
                  <input
                    type="tel"
                    id="telefone"
                    value={form.telefone}
                    onChange={atualizar('telefone')}
                    placeholder="+55 (00) 00000-0000"
                    className="w-full px-4 py-3.5 bg-input-bg border border-verde-musgo rounded-xl text-verde-escuro placeholder-verde-escuro placeholder-opacity-50 focus:outline-none transition"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="email"
                    className="text-verde-musgo text-sm font-bold uppercase tracking-wide px-1"
                  >
                    E-mail Institucional da Escola
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={form.email}
                    onChange={atualizar('email')}
                    placeholder="exemplo@educacao.sp.gov.br"
                    className="w-full px-4 py-3.5 bg-input-bg border border-verde-musgo rounded-xl text-verde-escuro placeholder-verde-escuro placeholder-opacity-50 focus:outline-none transition"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <span className="text-verde-musgo text-sm font-bold uppercase tracking-wide px-1">
                  Status do Polo
                </span>
                <div className="flex gap-6 px-1">
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="radio"
                      name="statusPolo"
                      value="ativo"
                      checked={form.statusPolo === 'ativo'}
                      onChange={atualizar('statusPolo')}
                      className="w-5 h-5 accent-verde-musgo"
                    />
                    <span className="text-base text-verde-escuro font-medium">Ativo</span>
                  </label>
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="radio"
                      name="statusPolo"
                      value="inativo"
                      checked={form.statusPolo === 'inativo'}
                      onChange={atualizar('statusPolo')}
                      className="w-5 h-5 accent-verde-musgo"
                    />
                    <span className="text-base text-verde-escuro font-medium">Inativo</span>
                  </label>
                </div>
              </div>
            </div>

            {/* BOTÕES DE AÇÃO DO FORMULÁRIO */}
            <div className="flex justify-between items-center pt-4">
              <Link
                href="/gestaoUsuarios"
                className="flex items-center gap-2 px-8 py-4 rounded-lg text-verde-escuro font-bold uppercase hover:bg-input-bg transition cursor-pointer"
              >
                <IoClose size={24} /> Cancelar
              </Link>

              <button
                type="submit"
                className="px-6 py-4 bg-verde-musgo hover:bg-white hover:text-verde-musgo hover:border hover:border-verde-musgo text-white text-base font-bold uppercase tracking-widest rounded-lg flex items-center gap-4 cursor-pointer transition-all"
              >
                Cadastrar Escola
                <IoArrowForward size={28} />
              </button>
            </div>
          </form>
        </div>
      </main>

      <ModalConfirmacao
        tipo={modal}
        tituloPrincipal={
          modal === 'sucesso' ? 'Escola cadastrada com' : 'Não foi possível cadastrar'
        }
        tituloDestaque={modal === 'sucesso' ? 'sucesso!' : 'a escola!'}
        mensagem={
          modal === 'sucesso'
            ? 'A nova unidade escolar foi registrada. Agora você já pode vincular professores e equipes!'
            : 'Verifique se todos os campos foram preenchidos corretamente e tente salvar mais uma vez.'
        }
        textoBotaoVoltar="Voltar para o Painel"
        hrefVoltar="/gestaoUsuarios"
        onTentarNovamente={() => setModal(null)}
      />
    </div>
  )
}
