import { Button } from '@/components/Button'
import { Header } from '@/components/Header'
import Image from 'next/image'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <>
      <Header />
      <div>
        <div className="flex flex-row gap-2 justify-center">
          <h1 className="font-bold text-4xl text-verde-escuro">ACESSE SUA</h1>
          <h1 className="font-bold text-4xl text-verde-musgo">CONTA!</h1>
        </div>

        <div className="flex flex-row">
          <div>
            <Image
              className=""
              src="https://placehold.co/540x540.png"
              alt=""
              width={540}
              height={540}
              loading="lazy"
            />
          </div>

          <div>
            <form>
              <label htmlFor="email-field">E-mail</label>
              <input type="email" id="email-field" placeholder="exemplo@gmail.com" />
              <label htmlFor="password-field">Senha</label>
              <input type="password" id="password-field" placeholder="Digite sua senha..." />
              <Link href="/">Esqueceu sua senha?</Link>

              <Button />
            </form>

            <div>
              <div className="flex flex-row">
                <div className="flex items-center gap-4 w-[370px] mt-8">
                  <div className="h-px flex-1 bg-gray-600"></div>
                </div>

                <span>OU</span>

                <div className="flex items-center gap-4 w-[370px] mt-8">
                  <div className="h-px flex-1 bg-gray-600"></div>
                </div>
              </div>

              <div>
                <button type="button">
                  <Image
                    src="https://placehold.co/18x18.png"
                    alt=""
                    width={18}
                    height={18}
                    loading="lazy"
                  />
                  <span>CONTINUAR COM O GOOGLE</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
