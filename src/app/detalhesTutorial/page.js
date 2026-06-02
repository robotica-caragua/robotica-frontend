import { BsArchive } from "react-icons/bs";
import { MdOutlineRecycling, MdCable, MdOutlinePrecisionManufacturing } from "react-icons/md";
import { IoMdBatteryFull } from "react-icons/io";
import { BiRuler } from "react-icons/bi";
import { FaArrowRightLong } from "react-icons/fa6";
import { GoLocation } from "react-icons/go";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function DetalhesTutorial() {
  return (
    <>
      <Header />
    
      <div className="flex min-h-screen w-full flex-col items-center justify-center gap-20 mt-20 px-4">
        <div 
          className="border border-verde-musgo justify-center items-center flex-col gap-4 flex rounded-lg p-6 w-full max-w-[900px] bg-white"
          style={{ height: "629px" }}
        >
          <h1 className="text-verde-musgo font-bold text-3xl md:text-4xl text-center md:text-left w-full max-w-3xl">
            BRAÇO ROBÓTICO DE PAPELÃO
          </h1>
          <video className="w-full max-w-[800px] min-h-[450px] rounded-md" controls>
            <source src="/video-exemplo.mp4" type="video/mp4" />
            Seu navegador não suporta a tag de vídeo.
          </video>
          <p className="text-verde-escuro text-base text-center">
            Assista ao guia completo para a montagem e programação do Braço Robótico de Papelão.
          </p>
        </div>

        <div 
          className="border border-verde-musgo justify-center items-center flex-col gap-4 flex rounded-lg p-6 w-full max-w-[900px] bg-white"
          style={{ height: "534px" }}
        >
          <div className="flex items-center gap-4 w-full max-w-[838px] mb-4">
            <BsArchive className="fill-verde-musgo" size={40} />
            <h1 className="text-verde-escuro font-bold text-3xl md:text-4xl">Materiais Necessários</h1>
          </div>

          <div className="flex flex-col gap-4 w-full max-w-[838px]">
            <div 
              className="flex items-center border border-verde-musgo px-4 bg-[var(--color-verde-pastel)]"
              style={{ height: "54.88px", borderRadius: "15px" }}
            >
              <MdOutlineRecycling className="fill-verde-musgo flex-shrink-0" size={30} />
              <p className="text-xl ms-4">Papelão Reciclado</p>
            </div>
            <div 
              className="flex items-center border border-verde-musgo px-4 bg-[var(--color-verde-pastel)]"
              style={{ height: "54.88px", borderRadius: "15px" }}
            >
              <MdOutlinePrecisionManufacturing className="fill-verde-musgo flex-shrink-0" size={30} />
              <p className="text-xl ms-4">4x Servomotores SG90</p>
            </div>
            <div 
              className="flex items-center border border-verde-musgo px-4 bg-[var(--color-verde-pastel)]"
              style={{ height: "54.88px", borderRadius: "15px" }}
            >
              <MdCable className="fill-verde-musgo flex-shrink-0" size={30} />
              <p className="text-xl ms-4">Fios Jumper</p>
            </div>
            <div 
              className="flex items-center border border-verde-musgo px-4 bg-[var(--color-verde-pastel)]"
              style={{ height: "54.88px", borderRadius: "15px" }}
            >
              <IoMdBatteryFull className="fill-verde-musgo flex-shrink-0" size={30} />
              <p className="text-xl ms-4">Bateria 9V com Clip</p>
            </div>
            <div 
              className="flex items-center border border-verde-musgo px-4 bg-[var(--color-verde-pastel)]"
              style={{ height: "54.88px", borderRadius: "15px" }}
            >
              <BiRuler className="fill-verde-musgo flex-shrink-0" size={30} />
              <p className="text-xl ms-4">Palitos de Sorvete</p>
            </div>
          </div>
        </div>

        <div 
          className="border border-verde-musgo mb-40 gap-8 rounded-[15px] flex flex-col md:flex-row justify-between p-8 w-full max-w-[1152px] bg-white"
          style={{ minHeight: "345px" }}
        >
          <div className="flex flex-col gap-3 w-full md:w-1/2">
            <h3 className="text-verde-musgo font-medium text-2xl md:text-3xl">EMEF MARIA DE LOURDES</h3>
            <div className="flex items-center text-verde-musgo">
              <GoLocation className="fill-verde-musgo flex-shrink-0 mr-2" size={20} />
              <p className="text-lg">Caraguatatuba-SP - Bairro Perquê-Mirim</p>
            </div>
            <p className="text-xl md:text-2xl text-gray-700 mt-2">
              Referência regional em robótica educacional inclusiva. Nossa escola desenvolve projetos que integram tecnologia e consciência ambiental desde os anos iniciais.
            </p>
          </div>

          <div className="flex flex-col gap-3 w-full md:w-1/2">
            <p className="text-verde-escuro font-medium text-xl">OUTROS PROJETOS DA UNIDADE</p>
            <div 
              className="flex items-center justify-between px-6 bg-[var(--color-verde-pastel)] w-full max-w-[487px]"
              style={{ height: "60px", borderRadius: "15px" }}
            >
              <p className="text-verde-musgo text-xl font-medium">Horta Automatizada v2</p>
              <FaArrowRightLong className="fill-verde-escuro" size={24} />
            </div>
            <div 
              className="flex items-center justify-between px-6 bg-[var(--color-verde-pastel)] w-full max-w-[487px]"
              style={{ height: "60px", borderRadius: "15px" }}
            >
              <p className="text-verde-musgo text-xl font-medium">Horta Automatizada v2</p>
              <FaArrowRightLong className="fill-verde-escuro" size={24} />
            </div>
            <div 
              className="flex items-center justify-between px-6 bg-[var(--color-verde-pastel)] w-full max-w-[487px]"
              style={{ height: "60px", borderRadius: "15px" }}
            >
              <p className="text-verde-musgo text-xl font-medium">Horta Automatizada v2</p>
              <FaArrowRightLong className="fill-verde-escuro" size={24} />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}