import { BsArchive } from "react-icons/bs";
import { MdOutlineRecycling } from "react-icons/md";
import { MdCable } from "react-icons/md";
import { IoMdBatteryFull } from "react-icons/io";
import { MdOutlinePrecisionManufacturing } from "react-icons/md";
import { BiRuler } from "react-icons/bi";

import { Header } from "@/components/header";


export default function DetalhesTutorial() {
  return (
    <>
     <Header/>
    
    <div className="flex min-h-screen min-w-screen items-center justify-center flex flex-col gap-20 mt-20">
      <div
        className="border-1 border-verde-musgo justify-center items-center flex-col gap-4 flex rounded-lg"
        style={{
          width: "900px",
          height: "629px",
          backgroundColor: "#FFFFFF",
        }}
      >
        <h1 className="text-verde-musgo me-56 font-bold text-4xl">
          BRAÇO ROBÓTICO DE PAPELÃO
        </h1>
        <video className="ms-4" width="800px" height="441px" controls>
          <source src="/video-exemplo.mp4" type="video/mp4" />
          Seu navegador não suporta a tag de vídeo.
        </video>
        <p className="color-verde-escuro text-base ">
          Assista ao guia completo para a montagem e programação do Braço
          Robótico de Papelão.
        </p>
      </div>
      <div className="border-1 border-verde-musgo justify-center items-center flex-col gap-4 flex rounded-lg"
        style={{
          width: "900px",
          height: "534px",
          backgroundColor: "#FFFFFF",
        }}>
      <div className="flex gap-4">
        <BsArchive className="ms-4  fill-verde-musgo" size={40}/>
        <h1 className="color-verde-escuro me-100 font-bold text-4xl mb-6 ">Materiais Necessários</h1>
        </div>  

        {/* Lista de materiais */}
        <div className="flex flex-col gap-4">
          <div className=" flex items-center border-1 border-verde-musgo"
          style={{
            backgroundColor: "var(--color-verde-pastel)",
             width: "838px",
            height: "54.88px",
            borderRadius: "15px",
          }}>
            <MdOutlineRecycling className="ms-4  fill-verde-musgo" size={30}/>
            <p className="text-xl ms-4">Papelão Reciclado</p>
          </div>
          <div className=" flex items-center gap-4 border-1  border-verde-musgo gap-4"
          style={{
            backgroundColor: "var(--color-verde-pastel)",
             width: "838px",
            height: "54.88px",
            borderRadius: "15px",
      
          }}>
            <MdOutlinePrecisionManufacturing className="ms-4  fill-verde-musgo" size={30}/>
            <p className="text-xl">4x Servomotores SG90</p>
          </div>
          <div className=" flex items-center gap-4 border-1  border-verde-musgo gap-4"
          style={{
            backgroundColor: "var(--color-verde-pastel)",
             width: "838px",
            height: "54.88px",
            borderRadius: "15px",
          }}>
            <MdCable className="ms-4 fill-verde-musgo" size={30}/>
            <p className="text-xl">Fios Jumper</p>
          </div>
          <div className=" flex items-center gap-4 border-1  border-verde-musgo gap-4"
          style={{
            backgroundColor: "var(--color-verde-pastel)",
             width: "838px",
            height: "54.88px",
            borderRadius: "15px",
          }}>
            <IoMdBatteryFull className="ms-4  fill-verde-musgo" size={30}/>
            <p className="text-xl">Bateria 9V com Clip</p>
          </div>
          <div className=" flex items-center gap-4 border-1  border-verde-musgo gap-4"
          style={{
            backgroundColor: "var(--color-verde-pastel)",
             width: "838px",
            height: "54.88px",
            borderRadius: "15px",
          }}>
            <BiRuler className="ms-4  fill-verde-musgo" size={30}/>
            <p className="text-xl">Palitos de Sorvete</p>
          </div>

        </div>
      </div>
      <div className="border-1 border-verde-musgo justify-center items-center flex-col gap-4 flex rounded-lg"
      style={{
        width: "1152px",
        height: "312px",
        borderRadius: "15px",
      }}>
        <div className="flex-col">
        <h3>EMEF MARIA DE LOURDES</h3>
        <p>Caraguatatuba - SP</p>
        <p>Referência regional em robótica educacional inclusiva. Nossa escola desenvolve projetos que integram tecnologia e consciência ambiental desde os anos iniciais.</p>
        </div>
      </div>
    </div>
    </>
  );
}
