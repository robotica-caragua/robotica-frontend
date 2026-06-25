import { Header } from '@/components/Header'
import { Input } from '@/components/Input'
import { Button } from '@/components/Button'
import Link from 'next/link'

export default function ForgotPassword() {
  return (
    <>
      <Header />
      <div className="flex flex-row justify-center gap-2 mt-12">
        <h1 className="font-bold text-4xl text-verde-escuro">ESQUECEU SUA SENHA?</h1>
        <span className="font-bold text-4xl text-verde-musgo">RECUPERE SEU ACESSO!</span>
      </div>

      <p className="flex justify-center mt-22 font-medium text-3xl">
        Informe seu e-mail e enviaremos as instruções para redefinir sua senha.
      </p>

      <Input />

      <div className="flex justify-center">
        <Link
          href='/login'
          className="flex items-center justify-center w-35 h-10 gap-2 rounded-xl bg-white border-2 border-verde-musgo font-bold text-verde-musgo text-base hover:brightness-50 duration-75 cursor-pointer mt-10"
        >
          Cancelar
        </Link>

        <div className="ml-20">
          <Button goTo="/senhapt1">Enviar</Button>
        </div>
      </div>
    </>
  )
}
