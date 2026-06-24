import { CardEvento } from '@/components/CardEvento'
import { CardEscola } from '@/components/CardEscola'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { IoRocketOutline } from 'react-icons/io5'

export default function Rede() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="grow flex flex-col items-center ">
        {/* Título da página */}
        <div className="flex flex-row items-center justify-center gap-2 mb-4">
          <h1 className="font-bold text-4xl text-verde-escuro uppercase">Nossa</h1>
          <h1 className="font-bold text-4xl text-verde-musgo uppercase">Rede!</h1>
        </div>

        {/* Descrição da página */}
        <div className="items-center justify-center gap-4 text-xl text-center font-medium">
          <p>
            Conheça as escolas parceiras e acompanhe tudo o que
            <br />
            movimenta o nosso circuito de robótica.
          </p>
        </div>

        {/* Sessão Eventos em Destaque */}
        <div className="flex flex-col my-20 w-[75%] bg-white border-2 border-verde-musgo rounded-lg py-10 px-2 gap-5 mb-20">
          {/* Título da sessão */}
          <div className="flex flex-row items-center gap-5 text-verde-musgo ml-8">
            <IoRocketOutline size={30} />
            <h1 className="font-semibold text-2xl">Eventos em Destaque</h1>
          </div>

          {/* Conteúdo da sessão */}
          <div className="flex flex-wrap gap-4 justify-center">
            <CardEvento
              title="Torneio Regional FLL"
              date="PRÓXIMO EVENTO • 04 AGO"
              location="Ginásio do Tinga, Caraguatatuba"
              linkUrl="/detalhesEvento"
            />
            <CardEvento
              title="Hackathon Sustentável"
              date="INSCRIÇÕES • 13 AGO"
              location="FATEC Caraguatatuba"
              linkUrl="/detalhesEvento"
            />
            <CardEvento
              title="Hackathon Sustentável"
              date="INSCRIÇÕES • 13 AGO"
              location="FATEC Caraguatatuba"
              linkUrl="/detalhesEvento"
            />
            <CardEvento
              title="Hackathon Sustentável"
              date="INSCRIÇÕES • 13 AGO"
              location="FATEC Caraguatatuba"
              linkUrl="/detalhesEvento"
            />
            <CardEvento
              title="Hackathon Sustentável"
              date="INSCRIÇÕES • 13 AGO"
              location="FATEC Caraguatatuba"
              linkUrl="/detalhesEvento"
            />
            <CardEvento
              title="Hackathon Sustentável"
              date="INSCRIÇÕES • 13 AGO"
              location="FATEC Caraguatatuba"
              linkUrl="/detalhesEvento"
            />
            <CardEvento
              title="Hackathon Sustentável"
              date="INSCRIÇÕES • 13 AGO"
              location="FATEC Caraguatatuba"
              linkUrl="/detalhesEvento"
            />
            <CardEvento
              title="Hackathon Sustentável"
              date="INSCRIÇÕES • 13 AGO"
              location="FATEC Caraguatatuba"
              linkUrl="/detalhesEvento"
            />
          </div>
        </div>

        <div className="flex flex-col w-[75%] py-10 px-2 gap-5 mb-20 justify-center items-center">
          {/* Título da Sessão */}
          <div className="flex flex-row gap-2 mb-12">
            <h1 className="font-bold text-4xl text-verde-escuro uppercase">conheça nossas</h1>
            <h1 className="font-bold text-4xl text-verde-musgo uppercase">Escolas!</h1>
          </div>

          <div className="flex flex-wrap gap-10 justify-center w-[70%]">
            <CardEscola
              name="EMEF Profª Maria Aparecida De Carvalho"
              location="R. Seishi Yoshimoto, 120 - Getuba, Caraguatatuba - SP, 11676-403"
              linkUrl="https://maps.app.goo.gl/pH6TnrBJsTyLY3gK8"
            />
            <CardEscola
              name="EMEF Prof. Luiz Ribeiro Muniz"
              location="R. Analândia, 355 - Martim de Sá, Caraguatatuba - SP, 11662-320"
              linkUrl="https://maps.app.goo.gl/ueybEfw95rgpqRYU6"
            />
            <CardEscola
              name="EMEF Prof. Luiz Silvar do Prado"
              location="R. José Pedro de Oliveira Barbosa, 805 - Jardim Casa Branca, Caraguatatuba - SP"
              linkUrl="https://maps.app.goo.gl/43diBvZfvfCGr3iZA"
            />
            <CardEscola
              name="EMEF Profª Maria Thereza de Souza Castro"
              location="R. Seishi Yoshimoto, 120 - Getuba, Caraguatatuba - SP, 11676-403"
              linkUrl="https://maps.app.goo.gl/TWYSGxUgsena9FTCA"
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
