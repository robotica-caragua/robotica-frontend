import Image from 'next/image'
import { ButtonGoBack } from '@/components/ButtonGoBack'
import { Label } from '@/components/Label'
import errorBot from '../assets/404.png'

export default function Page404() {
  return (
    <>
      <main className="min-h-screen flex flex-col lg:flex-row gap-8 lg:gap-36 justify-center items-center px-6 py-12 text-center lg:text-left">
        <Image
          src={errorBot}
          alt="Página não encontrada"
          width={652}
          height={652}
          className="w-full max-w-[280px] sm:max-w-md lg:max-w-163 h-auto"
          loading="lazy"
        />

        <div className="flex flex-col gap-6 lg:gap-10 items-center lg:items-start">
          <div className="flex flex-col gap-4 lg:gap-5 items-center lg:items-start">
            <Label>ERRO 404</Label>

            <h2 className="font-bold text-3xl sm:text-4xl lg:text-5xl">
              Ops! Parece que
              <br /> perdemos a conexão.
            </h2>

            <p className="text-verde-musgo text-base sm:text-lg">
              Você navegou para um endereço que não existe.
              <br /> Confirme se o link está correto ou retorne ao início para encontrar o que
              procura.
            </p>
          </div>

          <ButtonGoBack />
        </div>
      </main>
    </>
  )
}
