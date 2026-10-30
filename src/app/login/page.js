'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/Button'
import { Header } from '@/components/Header'
import Image from 'next/image'
import Link from 'next/link'
import boblogin from '@/assets/boblogin.png'
import google from '@/assets/google.png'
import { apiAuth } from '@/services/api'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErro('')

    if (!email.trim() || !senha.trim()) {
      setErro('Preencha o e-mail e a senha para entrar.')
      return
    }

    setCarregando(true)
    try {
      const dados = await apiAuth.login({ email: email.trim(), password: senha })
      const destino = dados?.user?.role === 'ADMIN' ? '/gestaoUsuarios' : '/painelProfessor'
      router.push(destino)
    } catch (err) {
      setErro(err.message || 'Credenciais inválidas ou servidor indisponível.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <>
      <Header />
      <main className="px-4 py-8">
        <div className="flex flex-row gap-2 justify-center text-center">
          <h1 className="font-bold text-3xl sm:text-4xl text-verde-escuro">
            ACESSE SUA <span className="text-verde-musgo">CONTA!</span>
          </h1>
        </div>

        <div className="mx-auto flex flex-col lg:flex-row items-center justify-center bg-white w-full max-w-5xl rounded-2xl border-2 border-verde-musgo my-6 lg:my-10 p-6 lg:p-0 overflow-hidden">
          <div className="w-48 sm:w-72 lg:w-[540px] flex justify-center">
            <Image
              src={boblogin}
              alt="Robô BioBot"
              width={540}
              height={540}
              className="w-full h-auto object-contain"
              loading="eager"
            />
          </div>

          <div className="w-full lg:w-auto lg:flex-1 lg:pr-8 flex flex-col items-center lg:items-start">
            <form onSubmit={handleSubmit} className="flex flex-col w-full max-w-md">
              <label
                htmlFor="email-field"
                className="mt-6 lg:mt-16 mb-2 text-xl text-verde-escuro font-medium"
              >
                E-mail
              </label>
              <input
                className="mb-5 h-11 bg-verde-pastel rounded-md border border-verde-musgo px-3 text-verde-escuro w-full"
                type="email"
                id="email-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemplo@gmail.com"
              />
              <label
                htmlFor="password-field"
                className="mb-2 text-xl text-verde-escuro font-medium"
              >
                Senha
              </label>
              <input
                className="h-11 bg-verde-pastel rounded-md border border-verde-musgo px-3 text-verde-escuro w-full"
                type="password"
                id="password-field"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Digite sua senha..."
              />

              {erro && <p className="mt-2 text-xs font-semibold text-vermelho">{erro}</p>}

              <Link
                href="/forgot-password"
                className="mt-2 text-sm text-verde-musgo underline hover:brightness-50 duration-75"
              >
                Esqueceu sua senha?
              </Link>

              <Button>{carregando ? 'Entrando...' : 'Entrar'}</Button>
            </form>

            <div className="flex items-center gap-4 w-full max-w-md mt-6">
              <div className="h-px flex-1 bg-gray-600"></div>

              <span>OU</span>

              <div className="h-px flex-1 bg-gray-600"></div>
            </div>

            <div className="mt-5 flex justify-center w-full max-w-md">
              <Link
                href="/painelProfessor"
                className="flex items-center justify-center gap-3 h-10 w-full sm:w-64 px-3 bg-verde-pastel rounded-md font-medium text-xs text-verde-escuro hover:brightness-95 transition"
              >
                <Image src={google} alt="Logo da Google" width={18} height={18} loading="eager" />
                <span>CONTINUAR COM O GOOGLE</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
