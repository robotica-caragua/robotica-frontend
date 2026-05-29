import Image from 'next/image';
import React from 'react';
import homeBot from '../../assets/home.png';

export default function Home() {

  const items = [
    {
      title: "ROBÓTICA ACESSÍVEL",
      icon: (
        <div className="w-24 h-20 bg-[#FFFFF3] rounded-md" />
      ),
    },
    {
      title: "APRENDIZADO PRÁTICO",
      icon: (
        <div className="flex items-end gap-1">
          <div className="w-12 h-16 bg-[#FFFFF3] rounded-sm" />
          <div className="w-10 h-14 bg-[#FFFFF3] rounded-sm" />
        </div>
      ),
    },
    {
      title: "SUSTENTABILIDADE",
      icon: (
        <div className="w-24 h-20 bg-[#FFFFF3] rounded-md" />
      ),
    },
    {
      title: "COMUNIDADE",
      icon: (
        <div className="w-24 h-20 bg-[#FFFFF3] rounded-md" />
      ),
    },
  ];

            return (
              <>
                {/* HERO */}
                <section 
                
            id="inicio"
            className="
              w-full
              min-h-[80vh]
              bg-[#FFFFF3]
              px-8
              md:px-20
              flex
              flex-box
              items-center
              md:flex-row
              items-center
              justify-center
              gap-16
              mb-12

            "
          >
        {/* Textos */}
        <div className="max-w-2xl space-y-8 md:ml-100px">
          <h1 className="text-5xl md:text-6xl font-bold uppercase leading-tight">
            <span className="text-[#97E100]">Descubra,</span><br />
            <span className="text-[#002A15]">construa e</span><br />
            <span className="text-[#002A15]">compartilhe.</span>
          </h1>

          <p className="text-xl text-gray-800">
            Conectando escolas, estudantes e a comunidade de Caraguatatuba através da tecnologia.
          </p>

          <button className="flex items-center gap-4 px-8 py-4 bg-white text-[#506600] font-bold text-lg rounded-xl border-2 border-[#506600] hover:bg-[#506600] hover:text-white transition shadow-sm">
            Explorar Projetos

            <div className="w-5 h-5 bg-[#506600] rounded-sm"></div>
          </button>
        </div>

  <div className="relative w-full max-w-2xl h-[500px] overflow-hidden flex justify-end">
  <Image
    src={homeBot}
    alt="Ilustração principal de robótica"
    fill
    className="object-cover object-[85%_center]"
  />
</div>
      </section>

      {/* FEATURES */}
      <section className="w-full bg-[#97E100] rounded-md py-10 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center text-center"
            >
              <div className="mb-4 flex items-center justify-center">
                {item.icon}
              </div>

              <h3 className="text-[#FFFFF3] text-xl font-semibold drop-shadow-md tracking-wide">
                {item.title}
              </h3>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}