import Image from 'next/image'
import errorBot from '../assets/404.png'
import { ButtonGoBack } from '../components/ButtonGoBack'

export default function Page404() {
  return (
    <>
      <div className="min-h-screen flex flex-row gap-36 justify-center items-center">
        <Image
          src={errorBot}
          alt="Página não encontrada"
          width={652}
          height={652}
          className="w-full max-w-163 h-auto"
          loading="lazy"
        />

        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-5">
            <span className="py-1 px-4 bg-verde-limao rounded-full w-fit font-semibold">
              ERRO 404
            </span>

            <h2 className="font-bold text-5xl">
              Ops! Parece que
              <br /> perdemos a conexão.
            </h2>

            <p className="text-verde-musgo text-lg">
              A página ou o projeto que você está procurando pode ter
              <br /> sido movido, excluído, ou o link está quebrado. Nossos
              <br /> sistemas estão recalibrando.
            </p>
          </div>

          <ButtonGoBack />
        </div>
      </div>
    </>
  )
}
