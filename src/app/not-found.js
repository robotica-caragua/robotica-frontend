import Image from 'next/image'
import { ButtonGoBack } from '@/components/ButtonGoBack'
import { Label } from '@/components/Label'
import errorBot from '../assets/404.png'

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
            <Label>ERRO 404</Label>

            <h2 className="font-bold text-5xl">
              Ops! Parece que
              <br /> perdemos a conexão.
            </h2>

            <p className="text-verde-musgo text-lg">
              Você navegou para um endereço que não existe. 
              <br /> Confirme se o link está correto ou retorne ao início para 
              <br /> encontrar o que procura.
            </p>
          </div>

          <ButtonGoBack />
        </div>
      </div>
    </>
  )
}
