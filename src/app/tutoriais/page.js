'use client'

import { useMemo, useState } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { FilterButton } from '@/components/FilterButton'
import { Card } from '@/components/Card'
import { SearchBar } from '@/components/SearchBar'
import { Category } from '@/components/Category'
import { Level } from '@/components/Level'
import { School } from '@/components/School'
import { BobIdea } from '@/components/BobIdea'
import { Page } from '@/components/Page'
import { correspondeBusca, opcoesUnicas, ordenacoes, ordenar, paginar } from '@/utils/filtros'

const ITENS_POR_PAGINA = 9

// TODO: substituir pelos dados da API quando estiver disponível
const listaTutoriais = [
  {
    id: 1,
    titulo: 'Braço Robótico de Papelão',
    autor: 'Profª Edna Maria Nogueira Ferraz',
    descricao: 'Um braço robótico funcional construído inteiramente com materiais recicláveis e…',
    categoria: 'Maker / Reciclagem (Sucata)',
    nivel: 'Iniciante',
    escola: 'EMEF Prof. Luiz Silvar do Prado',
    curtidas: 124,
    data: '2026-09-02'
  },
  {
    id: 2,
    titulo: 'Primeiro Circuito com LED',
    autor: 'Prof. Carlos Eduardo',
    descricao: 'Aprenda a montar um circuito simples com bateria, resistor e LED.',
    categoria: 'Eletrônica Básica',
    nivel: 'Iniciante',
    escola: 'EMEF Prof. Luiz Ribeiro Muniz',
    curtidas: 210,
    data: '2026-03-14'
  },
  {
    id: 3,
    titulo: 'Jogo de Labirinto no Scratch',
    autor: 'Profª Márcia Silva',
    descricao: 'Crie um jogo de labirinto com personagens, fases e pontuação usando blocos.',
    categoria: 'Programação em Blocos (Scratch)',
    nivel: 'Iniciante',
    escola: 'EMEF Profª Maria Aparecida De Carvalho',
    curtidas: 87,
    data: '2026-08-19'
  },
  {
    id: 4,
    titulo: 'Sensor de Distância com Arduino',
    autor: 'Prof. Fernando Costa',
    descricao: 'Use o sensor ultrassônico HC-SR04 para medir distâncias e acionar um buzzer.',
    categoria: 'Arduino e Automação (C++)',
    nivel: 'Intermediário',
    escola: 'EMEF Profª Maria Thereza de Souza Castro',
    curtidas: 164,
    data: '2026-10-05'
  },
  {
    id: 5,
    titulo: 'Carrinho Controlado por Bluetooth',
    autor: 'Prof. Roberto Alves',
    descricao: 'Monte um carrinho com motores DC e controle tudo pelo celular via Bluetooth.',
    categoria: 'Arduino e Automação (C++)',
    nivel: 'Avançado',
    escola: 'EMEF Prof. Luiz Ribeiro Muniz',
    curtidas: 192,
    data: '2026-07-21'
  },
  {
    id: 6,
    titulo: 'Animação Interativa no Scratch',
    autor: 'Profª Patricia Gomes',
    descricao: 'Programe uma história animada que responde aos cliques e ao teclado.',
    categoria: 'Programação em Blocos (Scratch)',
    nivel: 'Intermediário',
    escola: 'EMEF Prof. Luiz Silvar do Prado',
    curtidas: 54,
    data: '2026-05-30'
  },
  {
    id: 7,
    titulo: 'Robô Desenhista de Sucata',
    autor: 'Prof. Lucas Martins',
    descricao: 'Um robô vibratório feito com motor de brinquedo e canetinhas que cria desenhos.',
    categoria: 'Maker / Reciclagem (Sucata)',
    nivel: 'Intermediário',
    escola: 'EMEF Profª Maria Thereza de Souza Castro',
    curtidas: 143,
    data: '2026-09-25'
  },
  {
    id: 8,
    titulo: 'Semáforo com Protoboard',
    autor: 'Profª Amanda Santos',
    descricao: 'Simule um semáforo de trânsito com três LEDs e temporização no Arduino.',
    categoria: 'Arduino e Automação (C++)',
    nivel: 'Intermediário',
    escola: 'EMEF Profª Maria Aparecida De Carvalho',
    curtidas: 99,
    data: '2026-02-11'
  },
  {
    id: 9,
    titulo: 'Lanterna com Interruptor',
    autor: 'Prof. Ricardo Ferreira',
    descricao: 'Entenda circuitos em série e paralelo construindo uma lanterna caseira.',
    categoria: 'Eletrônica Básica',
    nivel: 'Intermediário',
    escola: 'EMEF Prof. Luiz Silvar do Prado',
    curtidas: 38,
    data: '2026-06-08'
  },
  {
    id: 10,
    titulo: 'Estação de Monitoramento IoT',
    autor: 'Profª Juliana Costa',
    descricao: 'Envie dados de temperatura e umidade para a nuvem usando ESP8266.',
    categoria: 'Arduino e Automação (C++)',
    nivel: 'Avançado',
    escola: 'EMEF Prof. Luiz Ribeiro Muniz',
    curtidas: 176,
    data: '2026-10-15'
  }
]

const categorias = opcoesUnicas(listaTutoriais, 'categoria')
const escolas = opcoesUnicas(listaTutoriais, 'escola')

export default function Tutoriais() {
  const [busca, setBusca] = useState('')
  const [categoria, setCategoria] = useState('')
  const [nivel, setNivel] = useState('')
  const [escola, setEscola] = useState('')
  const [ordenacao, setOrdenacao] = useState('recentes')
  const [paginaAtual, setPaginaAtual] = useState(1)

  const comReset = (setter) => (valor) => {
    setter(valor)
    setPaginaAtual(1)
  }

  const tutoriaisFiltrados = useMemo(() => {
    const filtrados = listaTutoriais.filter(
      (tutorial) =>
        correspondeBusca(
          busca,
          tutorial.titulo,
          tutorial.descricao,
          tutorial.autor,
          tutorial.categoria
        ) &&
        (!categoria || tutorial.categoria === categoria) &&
        (!nivel || tutorial.nivel === nivel) &&
        (!escola || tutorial.escola === escola)
    )
    return ordenar(filtrados, ordenacao)
  }, [busca, categoria, nivel, escola, ordenacao])

  const totalPaginas = Math.ceil(tutoriaisFiltrados.length / ITENS_POR_PAGINA)
  const tutoriaisPaginados = paginar(tutoriaisFiltrados, paginaAtual, ITENS_POR_PAGINA)

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="grow flex flex-col items-center">
        {/* Cabeçalho */}
        <section className="flex flex-col items-center text-center gap-4 mt-8 px-4">
          <h1 className="text-[40px] font-bold uppercase text-verde-escuro">
            Nossos <span className="text-verde-musgo">Tutoriais!</span>
          </h1>
          <p className="text-[28px] font-medium text-verde-escuro max-w-5xl leading-snug">
            Explore tutoriais práticos desenvolvidos pelas escolas do nosso circuito
          </p>
        </section>

        {/* Container principal: 1440px no Figma -> 47px esq + 350px filtros + 40px gap + 966px cards + 37px dir */}
        <div className="flex flex-col lg:flex-row w-full max-w-[1440px] mx-auto px-6 lg:pl-[47px] lg:pr-[37px] items-start justify-center gap-10 mt-14">
          {/* Coluna esquerda (350px no Figma) */}
          <aside className="flex w-full lg:w-[350px] shrink-0 flex-col">
            <div className="flex flex-col gap-2.5 w-full">
              <SearchBar
                value={busca}
                onChange={comReset(setBusca)}
                placeholder="Pesquisar por assunto..."
              />
              <p className="text-[#747A60] text-sm font-semibold">
                Mostrando {tutoriaisFiltrados.length}{' '}
                {tutoriaisFiltrados.length === 1 ? 'projeto' : 'projetos'}
              </p>
            </div>

            <div className="flex flex-col gap-[15px] mt-10">
              <Category value={categoria} onChange={comReset(setCategoria)} options={categorias} />
              <Level value={nivel} onChange={comReset(setNivel)} />
              <School value={escola} onChange={comReset(setEscola)} options={escolas} />
            </div>

            <BobIdea />
          </aside>

          {/* Coluna direita (966px no Figma): ordenação + grid 3x3 */}
          <div className="flex flex-col gap-[21px] flex-1 max-w-[966px] w-full">
            <div className="flex flex-row gap-2.5 flex-wrap">
              {ordenacoes.map(({ valor, texto }) => (
                <FilterButton
                  key={valor}
                  isActive={ordenacao === valor}
                  onClick={() => comReset(setOrdenacao)(valor)}
                >
                  {texto}
                </FilterButton>
              ))}
            </div>

            {tutoriaisPaginados.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-[15px] gap-y-10 place-items-center">
                {tutoriaisPaginados.map((tutorial) => (
                  <Card
                    key={tutorial.id}
                    title={tutorial.titulo}
                    author={tutorial.autor}
                    description={tutorial.descricao}
                    level={tutorial.nivel}
                    likes={tutorial.curtidas}
                    linkUrl="/detalhesTutorial"
                  />
                ))}
              </div>
            ) : (
              <p className="mt-12 text-center text-verde-musgo text-lg font-medium">
                Nenhum tutorial encontrado com os filtros atuais.
              </p>
            )}
          </div>
        </div>

        <Page currentPage={paginaAtual} totalPages={totalPaginas} onPageChange={setPaginaAtual} />
      </main>

      <Footer />
    </div>
  )
}
