'use client'

import { Select } from '@/components/Select'
import { useState } from 'react'
import Link from 'next/link'
import { SideBarAdmin } from '@/components/SideBarAdmin'
import { ModalConfirmacao } from '@/components/ModalConfirmacao'
import { apiEscolas } from '@/services/api'
import { IoClose, IoArrowForward } from 'react-icons/io5'
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
  const [mensagemErroApi, setMensagemErroApi] = useState('')

  const atualizar = (campo) => (e) => {
    setForm((prev) => ({ ...prev, [campo]: e.target.value }))
  }

  const handleSubmit = async (e) => {
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
      setMensagemErroApi('')
      setModal('erro')
      return
    }

    const enderecoCompleto = `${form.endereco.trim()} - ${form.bairro.trim()}, Caraguatatuba - SP (${form.regiao.toUpperCase()})`

    try {
      await apiEscolas.criar({
        name: form.nomeEscola.trim(),
        address: enderecoCompleto
      })
      setMensagemErroApi('')
      setModal('sucesso')
    } catch (err) {
      setMensagemErroApi(err?.message || '')
      setModal('erro')
    }
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full bg-background relative">
      {/* MENU LATERAL (SIDEBAR) */}
      <SideBarAdmin />

      {/* ÁREA DIREITA (Conteúdo) */}
      <main className="flex-1 flex flex-col">
        <div className="w-full max-w-[1040px] mx-auto py-8 lg:py-10 px-6 sm:px-10 lg:px-14 flex flex-col gap-8">
          {/* CABEÇALHO DA PÁGINA */}
          <section className="flex flex-col gap-2">
            <h1 className="text-verde-escuro text-3xl sm:text-4xl font-bold leading-tight">
              Cadastrar Nova Escola
            </h1>
            <p className="text-verde-musgo text-sm sm:text-base font-normal">
              Registre uma nova unidade escolar para que ela possa receber equipes e professores no
              circuito de robótica.
            </p>
          </section>

          {/* FORMULÁRIO DE CADASTRO */}
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6 w-full">
            {/* SEÇÃO: INFORMAÇÕES DA UNIDADE */}
            <div className="w-full p-6 sm:p-8 bg-white rounded-2xl shadow-sm border border-verde-musgo flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-verde-pastel rounded-lg flex justify-center items-center text-verde-musgo shrink-0">
                  <FaBuilding size={18} />
                </div>
                <h3 className="text-verde-escuro text-base sm:text-lg font-bold uppercase tracking-wide">
                  Informações da Unidade
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label htmlFor="nomeEscola" className="text-verde-escuro text-sm font-semibold">
                    Nome da Escola
                  </label>
                  <input
                    type="text"
                    id="nomeEscola"
                    value={form.nomeEscola}
                    onChange={atualizar('nomeEscola')}
                    placeholder="Ex: EMEF Prof. João Batista"
                    className="w-full h-12 px-4 bg-input-bg border border-verde-musgo rounded-xl text-sm sm:text-base text-verde-escuro placeholder:text-verde-escuro/60 focus:outline-none focus:ring-1 focus:ring-verde-musgo transition"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="codigoInep" className="text-verde-escuro text-sm font-semibold">
                    Código INEP (Opcional)
                  </label>
                  <input
                    type="text"
                    id="codigoInep"
                    value={form.codigoInep}
                    onChange={atualizar('codigoInep')}
                    placeholder="Ex: 35001234"
                    className="w-full h-12 px-4 bg-input-bg border border-verde-musgo rounded-xl text-sm sm:text-base text-verde-escuro placeholder:text-verde-escuro/60 focus:outline-none focus:ring-1 focus:ring-verde-musgo transition"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="tipoUnidade" className="text-verde-escuro text-sm font-semibold">
                    Tipo de Unidade
                  </label>
                  <div className="relative">
                    <Select
                      id="tipoUnidade"
                      value={form.tipoUnidade}
                      onChange={atualizar('tipoUnidade')}
                      className="w-full h-12 px-4 pr-10 bg-input-bg border border-verde-musgo rounded-xl text-sm sm:text-base text-verde-escuro focus:outline-none focus:ring-1 focus:ring-verde-musgo appearance-none cursor-pointer transition"
                    >
                      <option value="" disabled className="text-verde-escuro text-opacity-50">
                        Selecione o tipo de unidade...
                      </option>
                      <option value="emef">EMEF</option>
                      <option value="emei">EMEI</option>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {/* SEÇÃO: LOCALIZAÇÃO */}
            <div className="w-full p-6 sm:p-8 bg-white rounded-2xl shadow-sm border border-verde-musgo flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-verde-pastel rounded-lg flex justify-center items-center text-verde-musgo shrink-0">
                  <FaMapMarkerAlt size={18} />
                </div>
                <h3 className="text-verde-escuro text-base sm:text-lg font-bold uppercase tracking-wide">
                  Localização
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label htmlFor="endereco" className="text-verde-escuro text-sm font-semibold">
                    Endereço Completo
                  </label>
                  <input
                    type="text"
                    id="endereco"
                    value={form.endereco}
                    onChange={atualizar('endereco')}
                    placeholder="Ex: Rua das Flores, 123"
                    className="w-full h-12 px-4 bg-input-bg border border-verde-musgo rounded-xl text-sm sm:text-base text-verde-escuro placeholder:text-verde-escuro/60 focus:outline-none focus:ring-1 focus:ring-verde-musgo transition"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="bairro" className="text-verde-escuro text-sm font-semibold">
                    Bairro
                  </label>
                  <input
                    type="text"
                    id="bairro"
                    value={form.bairro}
                    onChange={atualizar('bairro')}
                    placeholder="Ex: Tinga, Massaguaçu ou Perequê-Mirim"
                    className="w-full h-12 px-4 bg-input-bg border border-verde-musgo rounded-xl text-sm sm:text-base text-verde-escuro placeholder:text-verde-escuro/60 focus:outline-none focus:ring-1 focus:ring-verde-musgo transition"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="regiao" className="text-verde-escuro text-sm font-semibold">
                    Região
                  </label>
                  <div className="relative">
                    <Select
                      id="regiao"
                      value={form.regiao}
                      onChange={atualizar('regiao')}
                      className="w-full h-12 px-4 pr-10 bg-input-bg border border-verde-musgo rounded-xl text-sm sm:text-base text-verde-escuro focus:outline-none focus:ring-1 focus:ring-verde-musgo appearance-none cursor-pointer transition"
                    >
                      <option value="" disabled className="text-verde-escuro text-opacity-50">
                        Selecione a região...
                      </option>
                      <option value="norte">Norte</option>
                      <option value="sul">Sul</option>
                      <option value="centro">Centro</option>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {/* SEÇÃO: CONTATO E FUNCIONAMENTO */}
            <div className="w-full p-6 sm:p-8 bg-white rounded-2xl shadow-sm border border-verde-musgo flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-verde-pastel rounded-lg flex justify-center items-center text-verde-musgo shrink-0">
                  <FaAddressBook size={18} />
                </div>
                <h3 className="text-verde-escuro text-base sm:text-lg font-bold uppercase tracking-wide">
                  Contato e Funcionamento
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="telefone" className="text-verde-escuro text-sm font-semibold">
                    Telefone da Secretaria
                  </label>
                  <input
                    type="tel"
                    id="telefone"
                    value={form.telefone}
                    onChange={atualizar('telefone')}
                    placeholder="+55 (00) 00000-0000"
                    className="w-full h-12 px-4 bg-input-bg border border-verde-musgo rounded-xl text-sm sm:text-base text-verde-escuro placeholder:text-verde-escuro/60 focus:outline-none focus:ring-1 focus:ring-verde-musgo transition"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="email" className="text-verde-escuro text-sm font-semibold">
                    E-mail Institucional da Escola
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={form.email}
                    onChange={atualizar('email')}
                    placeholder="exemplo@educacao.sp.gov.br"
                    className="w-full h-12 px-4 bg-input-bg border border-verde-musgo rounded-xl text-sm sm:text-base text-verde-escuro placeholder:text-verde-escuro/60 focus:outline-none focus:ring-1 focus:ring-verde-musgo transition"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <span className="text-verde-escuro text-sm font-semibold">Status do Polo</span>
                <div className="flex gap-6">
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="radio"
                      name="statusPolo"
                      value="ativo"
                      checked={form.statusPolo === 'ativo'}
                      onChange={atualizar('statusPolo')}
                      className="w-4 h-4 accent-verde-musgo"
                    />
                    <span className="text-sm sm:text-base text-verde-escuro font-medium">
                      Ativo
                    </span>
                  </label>
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="radio"
                      name="statusPolo"
                      value="inativo"
                      checked={form.statusPolo === 'inativo'}
                      onChange={atualizar('statusPolo')}
                      className="w-4 h-4 accent-verde-musgo"
                    />
                    <span className="text-sm sm:text-base text-verde-escuro font-medium">
                      Inativo
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* BOTÕES DE AÇÃO DO FORMULÁRIO */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2">
              <Link
                href="/escolas"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm text-[#3F674D] font-bold uppercase hover:bg-input-bg transition cursor-pointer"
              >
                <IoClose size={18} /> Cancelar
              </Link>

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 bg-verde-musgo hover:bg-white hover:text-verde-musgo border border-verde-musgo text-white text-sm font-bold uppercase tracking-wider rounded-xl shadow-sm flex items-center justify-center gap-3 cursor-pointer transition-all"
              >
                Cadastrar Escola
                <IoArrowForward size={18} />
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
            : mensagemErroApi ||
              'Verifique se todos os campos foram preenchidos corretamente e tente salvar mais uma vez.'
        }
        textoBotaoVoltar="Voltar"
        hrefVoltar="/escolas"
        onTentarNovamente={() => setModal(null)}
      />
    </div>
  )
}
