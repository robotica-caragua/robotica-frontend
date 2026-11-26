import Image from 'next/image'
import Link from 'next/link'
import { FaArrowLeft, FaArrowRightToBracket } from 'react-icons/fa6'
import { Label } from '@/components/Label'
import errorBot from '../../assets/unauthorized.png'

export default function UnauthorizedPage() {
  return (
    <main className="min-h-screen flex flex-col lg:flex-row gap-8 lg:gap-36 justify-center items-center px-6 py-12 text-center lg:text-left">
      <Image
        src={errorBot}
        alt="Acesso restrito"
        width={652}
        height={652}
        className="w-full max-w-[280px] sm:max-w-md lg:max-w-163 h-auto"
        loading="lazy"
      />

      <div className="flex flex-col gap-6 lg:gap-10 items-center lg:items-start">
        <div className="flex flex-col gap-4 lg:gap-5 items-center lg:items-start">
          <Label>ERRO 403</Label>

          <h2 className="font-bold text-2xl sm:text-3xl text-verde-escuro">
            Ops! Acesso restrito.
          </h2>

          <p className="text-verde-musgo text-base sm:text-lg max-w-lg leading-relaxed">
            O acesso a esta área é restrito exclusivamente a professores e administradores
            cadastrados pela rede municipal e pela administração do portal BIOBOT. Caso você já
            possua credenciais de acesso autorizadas, realize o login abaixo.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link
            href="/login"
            className="w-full sm:w-auto flex flex-row items-center justify-center gap-3 bg-verde-limao text-verde-escuro py-2.5 px-6 rounded-xl hover:brightness-90 text-sm sm:text-base font-semibold transition cursor-pointer"
          >
            <FaArrowRightToBracket className="shrink-0" />
            <span>Ir para Login</span>
          </Link>

          <Link
            href="/"
            className="w-full sm:w-auto flex flex-row items-center justify-center gap-3 bg-white border-2 border-verde-musgo text-verde-musgo hover:bg-verde-musgo hover:text-white py-2.5 px-6 rounded-xl text-sm sm:text-base font-semibold transition cursor-pointer shadow-xs"
          >
            <FaArrowLeft className="shrink-0" />
            <span>Voltar para o Início</span>
          </Link>
        </div>
      </div>
    </main>
  )
}
