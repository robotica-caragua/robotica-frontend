'use client'

import { useState } from 'react'
import { Button } from '@/components/Button'
import { Header } from '@/components/Header'
import { login } from '@/lib/api'
import Image from 'next/image'
import Link from 'next/link'
import boblogin from '@/assets/boblogin.png'
import google from '@/assets/google.png'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const result = await login({ email, password })
      window.localStorage.setItem('accessToken', result.accessToken)
      window.location.assign('/admin/admin')
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Header />
      <div>
        <div className="flex flex-row gap-2 justify-center">
          <h1 className="font-bold text-4xl text-verde-escuro">
            ACESSE SUA <span className="text-verde-musgo">CONTA!</span>
          </h1>
        </div>

        <div className="mx-auto flex flex-row bg-white w-5xl rounded-lg border-2 border-verde-musgo my-10">
          <div>
            <Image src={boblogin} alt="Robô BioBot" width={540} height={540} loading="eager" />
          </div>

          <div>
            <form className="flex flex-col" onSubmit={handleSubmit}>
              <label
                htmlFor="email-field"
                className="mt-22 mb-2 text-xl text-verde-escuro font-medium"
              >
                E-mail
              </label>
              <input
                className="mb-5 h-10 bg-verde-pastel rounded-md border border-verde-musgo px-3"
                type="email"
                id="email-field"
                placeholder="exemplo@gmail.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
              <label
                htmlFor="password-field"
                className="mb-2 text-xl text-verde-escuro font-medium"
              >
                Senha
              </label>
              <input
                className="h-10 bg-verde-pastel rounded-md border border-verde-musgo px-3"
                type="password"
                id="password-field"
                placeholder="Digite sua senha..."
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
              <Link
                href="/forgot-password"
                className="mt-2 text-sm text-verde-musgo underline hover:brightness-50 duration-75"
              >
                Esqueceu sua senha?
              </Link>

              {error && (
                <p className="mt-4 text-sm text-red-700" role="alert">
                  {error}
                </p>
              )}
              <Button>{isSubmitting ? 'Entrando...' : 'Entrar'}</Button>
            </form>

            <div className="flex items-center gap-4 w-92 mt-8">
              <div className="h-px flex-1 bg-gray-600"></div>

              <span>OU</span>

              <div className="h-px flex-1 bg-gray-600"></div>
            </div>

            <div className="mt-5 flex justify-center">
              <button
                type="button"
                className="flex items-center gap-3 h-8 w-56 px-3 bg-verde-pastel rounded-md font-medium text-xs text-verde-escuro"
              >
                <Image src={google} alt="Logo da Google" width={18} height={18} loading="eager" />
                <a className="cursor-pointer">CONTINUAR COM O GOOGLE</a>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
