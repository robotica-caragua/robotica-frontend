'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Header } from '@/components/Header'
import Link from 'next/link'
import { apiAuth } from '@/services/api'

function SenhaPt2Conteudo() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token') || ''

  const [senha, setSenha] = useState('')
  const [confirmacao, setConfirmacao] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false)
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErro('')

    if (senha.length < 8) {
      setErro('A senha deve ter no mínimo 8 caracteres.')
      return
    }

    if (senha !== confirmacao) {
      setErro('As duas senhas devem ser iguais.')
      return
    }

    if (token) {
      setCarregando(true)
      try {
        await apiAuth.redefinirSenha({ token, password: senha })
        router.push('/login')
        return
      } catch (err) {
        setErro(err.message || 'Token inválido ou expirado.')
      } finally {
        setCarregando(false)
      }
      return
    }

    router.push('/login')
  }

  return (
    <form onSubmit={handleSubmit} className="px-4 py-8 max-w-4xl mx-auto">
      <h1 className="flex justify-center font-extrabold text-3xl sm:text-4xl uppercase tracking-tight mt-6 sm:mt-12 text-center text-verde-escuro">
        CRIE UMA <span className="text-verde-musgo ml-2">NOVA SENHA!</span>
      </h1>

      <div className="mt-10 sm:mt-14 max-w-3xl mx-auto flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="nova-senha"
            className="text-base sm:text-lg font-bold text-verde-escuro uppercase tracking-wider"
          >
            Senha
          </label>
          <div className="relative">
            <input
              id="nova-senha"
              type={mostrarSenha ? 'text' : 'password'}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Digite a nova senha..."
              required
              className="h-12 bg-verde-pastel/60 rounded-xl border border-verde-musgo px-4 pe-12 text-verde-escuro text-sm sm:text-base focus:outline-none focus:ring-1 focus:ring-verde-musgo transition w-full"
            />
            <button
              type="button"
              onClick={() => setMostrarSenha((prev) => !prev)}
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
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="confirmar-senha"
            className="text-base sm:text-lg font-bold text-verde-escuro uppercase tracking-wider"
          >
            Confirme sua senha
          </label>
          <div className="relative">
            <input
              id="confirmar-senha"
              type={mostrarConfirmacao ? 'text' : 'password'}
              value={confirmacao}
              onChange={(e) => setConfirmacao(e.target.value)}
              placeholder="Confirme sua nova senha..."
              required
              className="h-12 bg-verde-pastel/60 rounded-xl border border-verde-musgo px-4 pe-12 text-verde-escuro text-sm sm:text-base focus:outline-none focus:ring-1 focus:ring-verde-musgo transition w-full"
            />
            <button
              type="button"
              onClick={() => setMostrarConfirmacao((prev) => !prev)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-verde-musgo hover:text-verde-escuro transition cursor-pointer"
              aria-label="Alternar visibilidade da confirmação de senha"
            >
              {mostrarConfirmacao ? (
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
          <p className="text-xs sm:text-sm font-semibold text-verde-musgo mt-1">
            As duas senhas devem ser iguais.
          </p>
        </div>

        {erro && <p className="text-center text-sm font-semibold text-vermelho">{erro}</p>}

        <div className="mt-6 mb-8 flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-14">
          <Link
            href="/senhapt1"
            className="flex items-center justify-center w-44 sm:w-52 h-13 gap-2 rounded-xl bg-white border-2 border-verde-musgo font-bold text-verde-musgo text-base hover:bg-verde-musgo hover:text-white transition cursor-pointer"
          >
            Cancelar
          </Link>

          <button
            type="submit"
            disabled={carregando}
            className="flex items-center justify-center w-44 sm:w-52 h-13 rounded-xl bg-verde-limao border-b-4 border-verde-escuro font-bold text-verde-escuro hover:brightness-95 transition cursor-pointer disabled:opacity-60"
          >
            {carregando ? 'Salvando...' : 'Confirmar'}
          </button>
        </div>
      </div>
    </form>
  )
}

export default function SenhaPt2Page() {
  return (
    <>
      <Header />
      <Suspense fallback={null}>
        <SenhaPt2Conteudo />
      </Suspense>
    </>
  )
}
