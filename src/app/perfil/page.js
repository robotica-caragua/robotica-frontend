'use client'

import { useEffect, useState } from 'react'
import {
  MdTrendingUp,
  MdOutlineRocketLaunch,
  MdOutlinePrecisionManufacturing,
  MdOutlineEventAvailable,
  MdPersonOutline,
  MdOutlineEdit,
  MdOutlineAccountBalance,
  MdOutlineLink,
  MdLockOutline,
  MdOutlineNotifications,
  MdOutlineSettings,
  MdPerson
} from 'react-icons/md'
import { IoCheckmarkCircle, IoRadioButtonOffOutline } from 'react-icons/io5'
import { AdminSidebar } from '@/components/AdminSidebar'

const RequisitoItem = ({ atendido, texto }) => (
  <div
    className={`flex items-center gap-2 text-sm transition-colors duration-300 ${
      atendido ? 'text-verde-escuro font-semibold' : 'text-verde-musgo opacity-60'
    }`}
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

const perfilInicial = {
  impacto: {
    tutoriais: 3,
    equipes: 4,
    eventos: 2
  },
  pessoal: {
    nome: 'Robson Nascimento',
    email: 'robson.nascimento@gmail.com',
    telefone: '(12) 98765-4321',
    matricula: '73915',
    cpf: '135.792.468-00',
    nascimento: '14/08/1985'
  },
  vinculos: [
    {
      id: 1,
      escola: 'EMEF Prof. Luiz Ribeiro Muniz',
      endereco: 'R. Analândia, 355 - Martim de Sá, Caraguatatuba - SP, 11662-320',
      ativo: true
    },
    {
      id: 2,
      escola: 'CIEFI Profª Edna Maria Nogueira Ferraz',
      endereco: 'R. Benedito Fortunato, 0 - Porto Novo, Caraguatatuba - SP, 11668-005',
      ativo: false
    }
  ]
}

export default function PerfilPage() {
  const [perfil, setPerfil] = useState(perfilInicial)
  const [editando, setEditando] = useState(false)
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [senha, setSenha] = useState('')

  const validacoes = {
    tamanho: senha.length >= 8,
    maiuscula: /[A-Z]/.test(senha),
    numero: /[0-9]/.test(senha),
    especial: /[^A-Za-z0-9]/.test(senha)
  }

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    if (!apiUrl) return

    fetch(`${apiUrl}/perfil`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setPerfil(data)
      })
      .catch(() => {})
  }, [])

  const cardsImpacto = [
    {
      label: 'Tutoriais Publicados',
      value: String(perfil.impacto.tutoriais).padStart(2, '0'),
      icon: MdOutlineRocketLaunch
    },
    {
      label: 'Equipes Orientadas',
      value: String(perfil.impacto.equipes).padStart(2, '0'),
      icon: MdOutlinePrecisionManufacturing
    },
    {
      label: 'Eventos Participados',
      value: String(perfil.impacto.eventos).padStart(2, '0'),
      icon: MdOutlineEventAvailable
    }
  ]

  const camposPessoais = [
    { key: 'nome', label: 'NOME COMPLETO' },
    { key: 'email', label: 'E-MAIL' },
    { key: 'telefone', label: 'TELEFONE' },
    { key: 'matricula', label: 'MATRÍCULA' },
    { key: 'cpf', label: 'CPF' },
    { key: 'nascimento', label: 'DATA DE NASCIMENTO' }
  ]

  function handleCampoChange(key, valor) {
    setPerfil((prev) => ({
      ...prev,
      pessoal: {
        ...prev.pessoal,
        [key]: valor
      }
    }))
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
            <h1 className="text-4xl font-bold text-verde-escuro">Configurações de Perfil</h1>
            <p className="mt-1 text-sm text-verde-musgo">
              Gerencie a identidade da sua conta, vínculos escolares e preferências de segurança.
            </p>
          </div>

          {/* Meu Impacto */}
          <section className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-verde-escuro">
              <MdTrendingUp size={20} className="text-verde-musgo" />
              <h2 className="text-base font-bold">Meu Impacto</h2>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {cardsImpacto.map(({ label, value, icon: Icon }) => (
                <div
                  key={label}
                  className="flex items-center gap-4 rounded-2xl bg-white px-5 py-4 shadow-sm"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-input-bg text-verde-musgo">
                    <Icon size={22} />
                  </div>
                  <div>
                    <p className="text-xl font-bold leading-tight text-verde-escuro">{value}</p>
                    <p className="text-xs text-verde-musgo">{label}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Informações Pessoais */}
          <section className="rounded-2xl bg-white p-7 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2 text-verde-escuro">
                <MdPersonOutline size={20} className="text-verde-musgo" />
                <h2 className="text-base font-bold">Informações Pessoais</h2>
              </div>

              <button
                type="button"
                onClick={() => setEditando((prev) => !prev)}
                className="flex items-center gap-1.5 text-xs font-bold text-verde-musgo hover:underline cursor-pointer"
              >
                <MdOutlineEdit size={16} />
                {editando ? 'Salvar' : 'Editar'}
              </button>
            </div>

            <div className="grid grid-cols-1 gap-x-12 gap-y-6 sm:grid-cols-2">
              {camposPessoais.map(({ key, label }) => (
                <div key={key}>
                  <p className="text-[11px] font-bold uppercase text-verde-musgo">{label}</p>
                  {editando ? (
                    <input
                      type="text"
                      value={perfil.pessoal[key]}
                      onChange={(e) => handleCampoChange(key, e.target.value)}
                      className="mt-1 w-full rounded-lg border border-verde-musgo bg-input-bg px-3 py-1.5 text-sm text-verde-escuro focus:outline-none"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-verde-escuro">{perfil.pessoal[key]}</p>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Vínculos Institucionais */}
          <section className="rounded-2xl bg-white p-7 shadow-sm">
            <div className="mb-5 flex items-center gap-2 text-verde-escuro">
              <MdOutlineAccountBalance size={20} className="text-verde-musgo" />
              <h2 className="text-base font-bold">Vínculos Institucionais</h2>
            </div>

            <div className="flex flex-col gap-3">
              {perfil.vinculos.map((vinculo) => (
                <div
                  key={vinculo.id}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-verde-musgo/20 bg-input-bg px-5 py-4"
                >
                  <div>
                    <h3 className="text-sm font-bold text-verde-escuro">{vinculo.escola}</h3>
                    <p className="mt-0.5 text-xs text-verde-musgo">{vinculo.endereco}</p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold
                      ${
                        vinculo.ativo
                          ? 'bg-verde-oliva text-verde-escuro'
                          : 'bg-verde-escuro/10 text-verde-escuro/70'
                      }`}
                  >
                    {vinculo.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
              ))}

              <button
                type="button"
                className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-verde-musgo/40 py-3 text-xs font-medium text-verde-musgo hover:bg-input-bg cursor-pointer"
              >
                <MdOutlineLink size={18} />
                Vincular Outra Escola
              </button>
            </div>
          </section>

          {/* Credenciais */}
          <section className="p-8 bg-white rounded-3xl shadow-sm border border-verde-musgo border-opacity-10 flex flex-col gap-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-verde-pastel bg-opacity-20 rounded-lg flex justify-center items-center text-verde-musgo">
                <MdLockOutline size={24} />
              </div>
              <h3 className="text-verde-escuro text-2xl font-semibold">Credenciais</h3>
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-start w-full justify-center">
              <div className="flex flex-col gap-2 max-w-lg flex-1 w-full">
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
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-verde-musgo hover:text-verde-escuro transition cursor-pointer"
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

                {/* Requisitos senha */}
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

              {/* Toggle permissões de admin */}
              <div className="flex-1 max-w-lg w-full p-5 bg-input-bg rounded-2xl border border-verde-musgo flex justify-between items-center md:mt-7">
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
          </section>
        </main>
      </div>
    </div>
  )
}
