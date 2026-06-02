import { BsArchive } from 'react-icons/bs'
import { MdOutlineRecycling, MdCable, MdOutlinePrecisionManufacturing } from 'react-icons/md'
import { IoMdBatteryFull } from 'react-icons/io'
import { BiRuler } from 'react-icons/bi'
import { FaArrowRightLong } from 'react-icons/fa6'
import { GoLocation } from 'react-icons/go'

import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Material } from '@/components/Material'
import { Project } from '@/components/Project'

export default function DetalhesTutorial() {
  return (
    <>
      <Header />

      <div className="flex min-h-screen w-full flex-col items-center justify-center gap-20 mt-20 px-4">
        <div className="border border-verde-musgo justify-center items-center flex-col gap-4 flex rounded-lg p-6 w-full max-w-225 h-158 bg-white">
          <h1 className="text-verde-musgo font-bold text-3xl md:text-4xl text-center md:text-left w-full max-w-3xl">
            BRAÇO ROBÓTICO DE PAPELÃO
          </h1>
          <video className="w-full max-w-200 min-h-113 rounded-md" controls>
            <source src="/video-exemplo.mp4" type="video/mp4" />
            Seu navegador não suporta a tag de vídeo.
          </video>
          <p className="text-verde-escuro text-base text-center">
            Assista ao guia completo para a montagem e programação do Braço Robótico de Papelão.
          </p>
        </div>

        <div className="border border-verde-musgo justify-center items-center flex-col h-134 gap-4 flex rounded-lg p-6 w-full max-w-225 bg-white">
          <div className="flex items-center gap-4 w-full max-w-210 mb-4">
            <BsArchive className="fill-verde-musgo" size={40} />
            <h1 className="text-verde-escuro font-bold text-3xl md:text-4xl">
              Materiais Necessários
            </h1>
          </div>

          <div className="flex flex-col gap-4 w-full max-w-210">
            <Material>
              <MdOutlineRecycling className="fill-verde-musgo shrink-0" size={30} />
              <p className="text-xl ms-4">Papelão Reciclado</p>
            </Material>

            <Material>
              <MdOutlinePrecisionManufacturing className="fill-verde-musgo shrink-0" size={30} />
              <p className="text-xl ms-4">4x Servomotores SG90</p>
            </Material>

            <Material>
              <MdCable className="fill-verde-musgo shrink-0" size={30} />
              <p className="text-xl ms-4">Fios Jumper</p>
            </Material>

            <Material>
              <IoMdBatteryFull className="fill-verde-musgo shrink-0" size={30} />
              <p className="text-xl ms-4">Bateria 9V com Clip</p>
            </Material>

            <Material>
              <BiRuler className="fill-verde-musgo shrink-0" size={30} />
              <p className="text-xl ms-4">Palitos de Sorvete</p>
            </Material>
          </div>
        </div>
        <div className="border border-verde-musgo mb-40 gap-8 rounded-2xl min-h-86 flex flex-col md:flex-row justify-between p-8 w-full max-w-6xl bg-white">
          <div className="flex flex-col gap-3 w-full md:w-1/2">
            <h3 className="text-verde-musgo font-medium text-2xl md:text-3xl">
              EMEF MARIA DE LOURDES
            </h3>
            <div className="flex items-center text-verde-musgo">
              <GoLocation className="fill-verde-musgo shrink-0 mr-2" size={20} />
              <p className="text-lg">Caraguatatuba-SP - Bairro Perquê-Mirim</p>
            </div>
            <p className="text-xl md:text-2xl text-gray-700 mt-2">
              Referência regional em robótica educacional inclusiva. Nossa escola desenvolve
              projetos que integram tecnologia e consciência ambiental desde os anos iniciais.
            </p>
          </div>

          <div className="flex flex-col gap-3 w-full md:w-1/2">
            <p className="text-verde-escuro font-medium ms-2 text-xl">OUTROS PROJETOS DA UNIDADE</p>
            <Project>
              <p className="text-verde-musgo text-xl font-medium">Horta Automatizada v2</p>
              <FaArrowRightLong className="fill-verde-escuro" size={24} />
            </Project>
            <Project>
              <p className="text-verde-musgo text-xl font-medium">Sensor de Chuva IOT v2</p>
              <FaArrowRightLong className="fill-verde-escuro" size={24} />
            </Project>
            <Project>
              <p className="text-verde-musgo text-xl font-medium">Lixeira Inteligente v2</p>
              <FaArrowRightLong className="fill-verde-escuro" size={24} />
            </Project>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}
