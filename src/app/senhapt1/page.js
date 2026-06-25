import { Header } from '@/components/Header'
import { HiOutlineMail } from 'react-icons/hi'
import Link from 'next/link'

export default function SenhaPage() {
  return (
    <>
      <Header />

      <h1 className="flex justify-center font-bold text-4xl mt-12">ESTAMOS QUASE LÁ,</h1>

      <h1 className="flex justify-center font-bold text-4xl text-verde-musgo">
        VERIFIQUE O SEU E-MAIL!
      </h1>
      <div className="flex justify-center mt-10">
        <HiOutlineMail size={'196'} className="text-verde-musgo" />
      </div>

      <p className="text-3xl font-medium mx-auto max-w-4xl mt-10">
        Enviamos um código de verificação para o seu e-mail. Insira o código abaixo para continuar
        com a redefinição da sua senha.
      </p>

      <div className="flex justify-center mt-10 gap-9">
        <input
          type="text"
          maxLength={1}
          className="bg-verde-pastel border border-verde-musgo w-18 h-24 rounded-xl text-center font-medium text-2xl"
        ></input>

        <input
          type="text"
          maxLength={1}
          className="bg-verde-pastel border border-verde-musgo w-18 h-24 rounded-xl text-center font-medium text-2xl"
        ></input>

        <input
          type="text"
          maxLength={1}
          className="bg-verde-pastel border border-verde-musgo w-18 h-24 rounded-xl text-center font-medium text-2xl"
        ></input>

        <input
          type="text"
          maxLength={1}
          className="bg-verde-pastel border border-verde-musgo w-18 h-24 rounded-xl text-center font-medium text-2xl"
        ></input>
      </div>

      <a className="text-xl font-medium flex justify-center mt-10 cursor-pointer">
        REENVIAR CÓDIGO
      </a>

      <div className="mt-10 mb-10 flex justify-center gap-14">
        <Link
          href="/forgot-password"
          className="flex items-center justify-center w-45 h-12 gap-2 rounded-xl bg-white border-2 border-verde-musgo font-bold text-verde-musgo text-base hover:brightness-50 duration-75 cursor-pointer"
        >
          Cancelar
        </Link>

        <button
          type="submit"
          className="w-45 h-12 rounded-xl bg-verde-limao border-b-8 border-verde-escuro font-bold text-verde-escuro hover:brightness-50 duration-75 cursor-pointer"
        >
          {' '}
          Enviar
        </button>
      </div>

      <p className="text-xl font-medium text-verde-musgo flex justify-center m-10">
        Não recebeu o e-mail? Verifique a pasta de spam.
      </p>
    </>
  )
}
