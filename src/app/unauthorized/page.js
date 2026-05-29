import Image from 'next/image'
import { ButtonGoBack } from '../../components/ButtonGoBack'
import { Label } from '../../components/Label'
import errorBot from '../../assets/unauthorized.png'

export default function UnauthorizedPage() {
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
            <Label>ERRO 403</Label>

            <h2 className="font-bold text-5xl">Ops... Acesso restrito.</h2>

            <p className="text-verde-musgo text-lg max-w-lg">
              Parece que você está tentando acessar uma área restrita. Sem pânico! Para continuar e
              ver esse conteúdo, você só precisa fazer o login ou criar uma conta. É rapidinho,
              prometemos.
            </p>
          </div>

          <ButtonGoBack />
        </div>
      </div>
    </>
  )
}
