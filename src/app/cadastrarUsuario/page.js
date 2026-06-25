'use client'

import { useState } from 'react'
import { SideBarAdmin } from '@/components/SideBarAdmin'
import {
  IoClose,
  IoArrowForward,
  IoCheckmarkCircle,
  IoRadioButtonOffOutline
} from 'react-icons/io5'
import { FaRegUser } from 'react-icons/fa6'
import { MdLockOutline } from 'react-icons/md'

const RequisitoItem = ({ atendido, texto }) => (
  <div
    className={`flex items-center gap-2 text-sm transition-colors duration-300 ${atendido ? 'text-verde-escuro font-semibold' : 'text-verde-musgo opacity-60'}`}
  >
    {atendido ? (
      <IoCheckmarkCircle
        size={18}
        className="text-verde-oliva shadow-[0px_0px_8px_0px_rgba(185,246,0,0.40)] rounded-full"
      />
    ) : (
      <IoRadioButtonOffOutline size={18} />
    )}
    <span>{texto}</span>
  </div>
)

export default function CadastrarUsuario() {
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [senha, setSenha] = useState('')
  const [cpf, setCpf] = useState('')
  const [telefone, setTelefone] = useState('')
  const [email, setEmail] = useState('')
  const [erroEmail, setErroEmail] = useState('')

  const validacoes = {
    tamanho: senha.length >= 8,
    maiuscula: /[A-Z]/.test(senha),
    numero: /[0-9]/.test(senha),
    especial: /[^A-Za-z0-9]/.test(senha)
  }

  const validarEmail = (valor) => {
    setEmail(valor)
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (valor.length === 0) {
      setErroEmail('')
      return
    }

    if (!regexEmail.test(valor)) {
      setErroEmail('Insira um e-mail válido (ex: nome@gmail.com).')
    } else {
      setErroEmail('')
    }
  }

  const handleCPF = (e) => {
    let valor = e.target.value.replace(/\D/g, '')
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2')
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2')
    valor = valor.replace(/(\d{3})(\d{1,2})/, '$1-$2')
    setCpf(valor.substring(0, 14))
  }

  const handleTelefone = (e) => {
    let valor = e.target.value.replace(/\D/g, '')
    valor = valor.replace(/^(\d{2})(\d)/g, '+$1 ($2')
    valor = valor.replace(/(\(\d{2})(\d)/g, '$1) $2')
    valor = valor.replace(/(\d{5})(\d)/g, '$1-$2')
    setTelefone(valor.substring(0, 19))
  }

  return (
    <div className="flex min-h-screen bg-background relative">
      <SideBarAdmin />

      <main className="flex-1 flex flex-col">
        <div className="w-[75%] mx-auto py-12 px-8 flex flex-col gap-10">
          <section className="flex flex-col gap-2 items-center">
            <h2 className="text-verde-escuro text-5xl font-bold leading-tight">
              Cadastrar Novo Professor
            </h2>
            <p className="text-verde-musgo text-xl font-normal">
              Configure as credenciais e acessos do novo docente no sistema.
            </p>
          </section>

          <form className="flex flex-col gap-8 w-full">
            <div className="w-full p-8 bg-white rounded-3xl shadow-sm border border-verde-musgo border-opacity-30 flex flex-col gap-8">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-verde-pastel rounded-lg flex justify-center items-center text-verde-musgo">
                  <FaRegUser size={18} />
                </div>
                <h3 className="text-verde-escuro text-2xl font-semibold">Dados Pessoais</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-verde-musgo text-sm font-bold uppercase tracking-wide px-1">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    placeholder="Digite o nome completo do professor..."
                    className="w-full px-4 py-3.5 bg-input-bg border border-verde-musgo rounded-xl text-verde-escuro placeholder-verde-escuro placeholder-opacity-50 focus:outline-none transition"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-verde-musgo text-sm font-bold uppercase tracking-wide px-1">
                    Matrícula
                  </label>
                  <input
                    type="text"
                    placeholder="Digite a matrícula..."
                    className="w-full px-4 py-3.5 bg-input-bg border border-verde-musgo rounded-xl text-verde-escuro placeholder-verde-escuro placeholder-opacity-50 focus:outline-none transition"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-verde-musgo text-sm font-bold uppercase tracking-wide px-1">
                    E-mail
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => validarEmail(e.target.value)}
                    placeholder="name@roboticsportal.edu"
                    className={`w-full px-4 py-3.5 bg-input-bg border rounded-xl text-verde-escuro placeholder-verde-escuro placeholder-opacity-50 focus:outline-none transition ${erroEmail ? 'border-vermelho focus:ring-vermelho' : 'border-verde-musgo'}`}
                  />
                  {erroEmail && (
                    <span className="text-vermelho text-xs font-semibold px-1">{erroEmail}</span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-verde-musgo text-sm font-bold uppercase tracking-wide px-1">
                    CPF
                  </label>
                  <input
                    type="text"
                    value={cpf}
                    onChange={handleCPF}
                    placeholder="000.000.000-00"
                    className="w-full px-4 py-3.5 bg-input-bg border border-verde-musgo rounded-xl text-verde-escuro placeholder-verde-escuro placeholder-opacity-50 focus:outline-none transition"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-verde-musgo text-sm font-bold uppercase tracking-wide px-1">
                    Telefone
                  </label>
                  <input
                    type="text"
                    value={telefone}
                    onChange={handleTelefone}
                    placeholder="+55 (00) 00000-0000"
                    className="w-full px-4 py-3.5 bg-input-bg border border-verde-musgo rounded-xl text-verde-escuro placeholder-verde-escuro placeholder-opacity-50 focus:outline-none transition"
                  />
                </div>

                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-verde-musgo text-sm font-bold uppercase tracking-wide px-1">
                    Escola Vinculada
                  </label>
                  <select
                    defaultValue=""
                    className="w-full px-4 py-3.5 bg-input-bg border border-verde-musgo rounded-xl text-verde-escuro focus:outline-none appearance-none cursor-pointer"
                  >
                    <option value="" disabled>
                      Selecione a unidade onde o professor lecionará as oficinas...
                    </option>
                    <option value="1">EMEF Prof. Luiz Silvar do Prado</option>
                    <option value="2">EMEF Profª Maria Aparecida De Carvalho</option>
                    <option value="3">EMEF Profª Maria Thereza de Souza Castro</option>
                    <option value="4">EMEF Prof. Luiz Ribeiro Muniz</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="p-8 bg-white rounded-3xl shadow-sm border border-verde-musgo border-opacity-10 flex flex-col gap-8">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-verde-pastel bg-opacity-20 rounded-lg flex justify-center items-center text-verde-musgo">
                  <MdLockOutline size={24} />
                </div>
                <h3 className="text-verde-escuro text-2xl font-semibold">Credenciais</h3>
              </div>

              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2 max-w-lg">
                  <label className="text-verde-musgo text-sm font-bold uppercase tracking-wide px-1">
                    Senha temporária
                  </label>
                  <div className="relative">
                    <input
                      type={mostrarSenha ? 'text' : 'password'}
                      placeholder="Digite a senha..."
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                      className="w-full px-4 py-3.5 pe-12 bg-input-bg border border-verde-musgo rounded-xl text-verde-musgo focus:outline-none transition"
                    />

                    <button
                      type="button"
                      onClick={() => setMostrarSenha(!mostrarSenha)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-verde-musgo hover:text-verde-escuro transition"
                      aria-label="Alternar visibilidade da senha"
                    >
                      {mostrarSenha ? (
                        <svg
                          className="shrink-0 size-5"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      ) : (
                        <svg
                          className="shrink-0 size-5"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                          <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                          <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                          <line x1="2" x2="22" y1="2" y2="22" />
                        </svg>
                      )}
                    </button>
                  </div>
                  <span className="text-verde-musgo opacity-75 text-xs px-1 mb-2">
                    O usuário deverá alterar a senha no primeiro acesso.
                  </span>

                  <div className="flex flex-col gap-2 p-4 bg-input-bg rounded-xl border border-verde-musgo border-opacity-20">
                    <span className="text-verde-escuro text-sm font-bold mb-1">
                      A senha deve conter:
                    </span>
                    <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                      <RequisitoItem atendido={validacoes.tamanho} texto="Mínimo 8 caracteres" />
                      <RequisitoItem atendido={validacoes.maiuscula} texto="1 letra maiúscula" />
                      <RequisitoItem atendido={validacoes.numero} texto="1 número" />
                      <RequisitoItem atendido={validacoes.especial} texto="1 caractere especial" />
                    </div>
                  </div>
                </div>

                <div className="w-full p-5 bg-input-bg rounded-2xl border border-verde-musgo flex justify-between items-center mt-2">
                  <div className="flex flex-col">
                    <span className="text-verde-escuro text-base font-bold">
                      Permissões de Administrador
                    </span>
                    <span className="text-verde-musgo text-sm">
                      Acesso completo a todos os controles.
                    </span>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-verde-oliva"></div>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4">
              <button
                type="button"
                className="flex items-center gap-2 px-8 py-4 rounded-lg text-verde-escuro font-bold uppercase hover:bg-input-bg transition cursor-pointer"
              >
                <IoClose size={24} /> Cancelar
              </button>

              <button
                type="submit"
                className="px-6 py-4 bg-verde-musgo hover:bg-white hover:text-verde-musgo hover:border hover:border-verde-musgo text-white text-base font-bold uppercase tracking-widest rounded-lg flex items-center gap-4 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cadastrar Professor
                <IoArrowForward size={28} />
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
