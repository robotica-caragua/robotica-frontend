'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Header } from '@/components/Header'
import { HiOutlineMail } from 'react-icons/hi'
import Link from 'next/link'
import { apiAuth } from '@/services/api'

function SenhaConteudo() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tokenUrl = searchParams.get('token') || ''
  const emailUrl = searchParams.get('email') || ''

  const [digitos, setDigitos] = useState(['', '', '', ''])
  const [novaSenha, setNovaSenha] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  const atualizarDigito = (index, valor) => {
    const proximo = [...digitos]
    proximo[index] = valor.slice(-1)
    setDigitos(proximo)
  }

  const handleReenviar = async () => {
    setMensagem('')
    setErro('')
    if (!emailUrl) {
      setMensagem('Solicite um novo código na tela anterior informando seu e-mail.')
      return
    }
    try {
      await apiAuth.esqueciSenha(emailUrl)
      setMensagem('Um novo link/código de verificação foi enviado para o seu e-mail.')
    } catch (err) {
      setErro(err.message || 'Não foi possível reenviar o código no momento.')
    }
  }

  const handleConfirmar = async (e) => {
    e.preventDefault()
    setErro('')
    setMensagem('')

    const tokenFinal = tokenUrl || digitos.join('')
    if (tokenFinal && novaSenha.length >= 8) {
      setCarregando(true)
      try {
        await apiAuth.redefinirSenha({ token: tokenFinal, password: novaSenha })
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
    <form onSubmit={handleConfirmar} className="px-4 py-8 max-w-4xl mx-auto">
      <h1 className="flex justify-center font-bold text-3xl sm:text-4xl mt-6 sm:mt-12 text-center">
        ESTAMOS QUASE LÁ,
      </h1>

      <h1 className="flex justify-center font-bold text-3xl sm:text-4xl text-verde-musgo text-center">
        VERIFIQUE O SEU E-MAIL!
      </h1>
      <div className="flex justify-center mt-6 sm:mt-10">
        <HiOutlineMail size="120" className="text-verde-musgo sm:size-48" />
      </div>

      <p className="text-xl sm:text-2xl font-medium mx-auto max-w-2xl mt-6 sm:mt-10 text-center">
        Enviamos um código de verificação para o seu e-mail. Insira o código abaixo para continuar
        com a redefinição da sua senha.
      </p>

      <div className="flex justify-center mt-8 gap-4 sm:gap-9">
        {digitos.map((digito, idx) => (
          <input
            key={idx}
            type="text"
            maxLength={1}
            value={digito}
            onChange={(e) => atualizarDigito(idx, e.target.value)}
            aria-label={`Dígito ${idx + 1}`}
            className="bg-verde-pastel border border-verde-musgo w-14 sm:w-18 h-18 sm:h-24 rounded-xl text-center font-medium text-2xl text-verde-escuro"
          />
        ))}
      </div>

      {tokenUrl && (
        <div className="mx-auto mt-6 max-w-md flex flex-col gap-2 px-4">
          <label htmlFor="nova-senha" className="text-base font-semibold text-verde-escuro">
            Nova senha (mínimo 8 caracteres)
          </label>
          <input
            id="nova-senha"
            type="password"
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
            placeholder="Digite sua nova senha..."
            className="h-11 rounded-md border border-verde-musgo bg-verde-pastel px-3 text-verde-escuro"
          />
        </div>
      )}

      <button
        type="button"
        onClick={handleReenviar}
        className="mx-auto text-lg sm:text-xl font-medium flex justify-center mt-8 cursor-pointer hover:underline text-verde-escuro"
      >
        REENVIAR CÓDIGO
      </button>

      {mensagem && (
        <p className="mt-4 text-center text-sm font-semibold text-verde-musgo">{mensagem}</p>
      )}
      {erro && <p className="mt-4 text-center text-sm font-semibold text-vermelho">{erro}</p>}

      <div className="mt-8 mb-8 flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-14">
        <Link
          href="/forgot-password"
          className="flex items-center justify-center w-40 sm:w-45 h-12 gap-2 rounded-xl bg-white border-2 border-verde-musgo font-bold text-verde-musgo text-base hover:brightness-50 duration-75 cursor-pointer"
        >
          Cancelar
        </Link>

        <button
          type="submit"
          disabled={carregando}
          className="flex items-center justify-center w-40 sm:w-45 h-12 rounded-xl bg-verde-limao border-b-8 border-verde-escuro font-bold text-verde-escuro hover:brightness-50 duration-75 cursor-pointer disabled:opacity-60"
        >
          {carregando ? 'Enviando...' : 'Enviar'}
        </button>
      </div>

      <p className="text-base sm:text-lg font-medium text-verde-musgo text-center m-6">
        Não recebeu o e-mail? Verifique a pasta de spam.
      </p>
    </form>
  )
}

export default function SenhaPage() {
  return (
    <>
      <Header />
      <Suspense fallback={null}>
        <SenhaConteudo />
      </Suspense>
    </>
  )
}
