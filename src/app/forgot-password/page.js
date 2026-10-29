'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/Header'
import { Input } from '@/components/Input'
import Link from 'next/link'
import { apiAuth } from '@/services/api'

export default function ForgotPassword() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  const handleEnviar = async (e) => {
    e.preventDefault()
    setErro('')

    if (!email.trim()) {
      setErro('Informe seu e-mail para continuar.')
      return
    }

    setCarregando(true)
    try {
      await apiAuth.esqueciSenha(email.trim())
      router.push(`/senhapt1?email=${encodeURIComponent(email.trim())}`)
    } catch {
      // Mesmo se o backend estiver offline em dev, permite visualizar a próxima etapa
      router.push(`/senhapt1?email=${encodeURIComponent(email.trim())}`)
    } finally {
      setCarregando(false)
    }
  }

  return (
    <>
      <Header />
      <main className="px-4 py-8 max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-center items-center gap-2 mt-6 sm:mt-12 text-center">
          <h1 className="font-bold text-3xl sm:text-4xl text-verde-escuro">ESQUECEU SUA SENHA?</h1>
          <span className="font-bold text-3xl sm:text-4xl text-verde-musgo">
            RECUPERE SEU ACESSO!
          </span>
        </div>

        <p className="flex justify-center mt-8 sm:mt-16 font-medium text-xl sm:text-2xl text-center px-4 max-w-2xl mx-auto">
          Informe seu e-mail e enviaremos as instruções para redefinir sua senha.
        </p>

        <form onSubmit={handleEnviar} className="mt-8">
          <Input value={email} onChange={setEmail} />

          {erro && <p className="mt-3 text-center text-sm font-semibold text-vermelho">{erro}</p>}

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-12 mt-8 sm:mt-10">
            <Link
              href="/login"
              className="flex items-center justify-center w-40 h-11 gap-2 rounded-xl bg-white border-2 border-verde-musgo font-bold text-verde-musgo text-base hover:brightness-50 duration-75 cursor-pointer"
            >
              Cancelar
            </Link>

            <button
              type="submit"
              disabled={carregando}
              className="flex w-40 h-11 items-center justify-center gap-2 rounded-xl bg-verde-limao border-b-6 border-verde-escuro font-bold text-verde-escuro hover:brightness-50 duration-75 cursor-pointer disabled:opacity-60"
            >
              <span>{carregando ? 'Enviando...' : 'Enviar'}</span>
            </button>
          </div>
        </form>
      </main>
    </>
  )
}
