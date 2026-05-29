import { Button } from '@/components/Button'
import Image from 'next/image'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <>
      <div>
        <div>
          <h1>ACESSE SUA</h1>
          <h1>CONTA</h1>
        </div>

        <div>
          <div>
            <Image src="https://placehold.co/540x540.png" alt="" width={540} height={540} />
          </div>

          <div>
            <label htmlFor="email-field">E-mail</label>
            <input type="email" id="email-field" placeholder="exemplo@gmail.com" />
            <label htmlFor="password-field">Senha</label>
            <input type="password" id="password-field" placeholder="Digite sua senha..." />
            <Link href="/">Esqueceu sua senha?</Link>
          </div>

          <Button />

          <div className="flex items-center gap-4 w-[370px] mt-8">
            <div className="h-px flex-1 bg-gray-600"></div>
          </div>

          <span>OU</span>

          <div className="flex items-center gap-4 w-[370px] mt-8">
            <div className="h-px flex-1 bg-gray-600"></div>
          </div>
        </div>
      </div>
    </>
  )
}
