"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MdOutlineGridView, MdOutlinePeopleAlt, MdOutlineCalendarToday } from "react-icons/md";
import { FaRegBuilding } from "react-icons/fa";
import { IoHomeOutline } from "react-icons/io5";
import Logo from '../assets/logo.svg';

export function SideBarAdmin() {
  const pathname = usePathname(); 

  const isVisaoGeral = pathname === "/admin";
  const isUsuarios = pathname.includes("Usuario"); 
  const isEscolas = pathname.includes("Escola");
  const isEventos = pathname.includes("Evento");

  return(
    <aside className="w-64 shrink-0 flex flex-col border-r border-verde-pastel bg-bg-page px-6 py-8">
      <div className="mb-12 px-2">
        <Image 
          src={Logo} 
          alt="Logo Conexão Robótica" 
          width={180} 
          height={50} 
          style={{ width: "auto", height: "auto" }} 
        />
      </div>

      <nav className="flex-1 flex flex-col gap-2">
        <Link href="/admin" className={`flex items-center gap-3 p-3 rounded-lg transition-colors relative ${isVisaoGeral ? "bg-verde-limao" : "hover:bg-verde-pastel"}`}>
          <MdOutlineGridView size={28} className="text-verde-escuro" />
          <span className="text-verde-escuro text-lg font-semibold tracking-wide">Visão Geral</span>
          {isVisaoGeral && <div className="w-1 h-7 absolute left-0 top-1/2 -translate-y-1/2 bg-verde-escuro rounded-tr-sm rounded-br-sm"></div>}
        </Link>

        <Link href="/gestaoUsuarios" className={`flex items-center gap-3 p-3 rounded-lg transition-colors relative ${isUsuarios ? "bg-verde-limao" : "hover:bg-verde-pastel"}`}>
          <MdOutlinePeopleAlt size={28} className="text-verde-escuro" />
          <span className="text-verde-escuro text-lg font-semibold tracking-wide">Usuários</span>
          {isUsuarios && <div className="w-1 h-7 absolute left-0 top-1/2 -translate-y-1/2 bg-verde-escuro rounded-tr-sm rounded-br-sm"></div>}
        </Link>

        <Link href="/admin/escolas" className={`flex items-center gap-3 p-3 rounded-lg transition-colors relative ${isEscolas ? "bg-verde-limao" : "hover:bg-verde-pastel"}`}>
          <FaRegBuilding size={28} className="text-verde-escuro" />
          <span className="text-verde-escuro text-lg font-semibold tracking-wide">Escolas</span>
          {isEscolas && <div className="w-1 h-7 absolute left-0 top-1/2 -translate-y-1/2 bg-verde-escuro rounded-tr-sm rounded-br-sm"></div>}
        </Link>

        <Link href="/admin/eventos" className={`flex items-center gap-3 p-3 rounded-lg transition-colors relative ${isEventos ? "bg-verde-limao" : "hover:bg-verde-pastel"}`}>
          <MdOutlineCalendarToday size={28} className="text-verde-escuro" />
          <span className="text-verde-escuro text-lg font-semibold tracking-wide">Eventos</span>
          {isEventos && <div className="w-1 h-7 absolute left-0 top-1/2 -translate-y-1/2 bg-verde-escuro rounded-tr-sm rounded-br-sm"></div>}
        </Link>

        <Link href="/" className="flex items-center gap-3 p-3 rounded-lg hover:bg-verde-pastel transition-colors">
          <IoHomeOutline size={28} className="text-verde-escuro" />
          <span className="text-verde-escuro text-lg font-semibold tracking-wide">Portal Público</span>
        </Link>

      </nav>

      <div className="pt-6 mt-6 border-t border-verde-musgo border-opacity-30">
        <Link href="/admin/suporte" className="flex items-center gap-3 p-3 rounded-lg hover:bg-verde-pastel transition-colors">
          <div className="w-5 h-5 bg-verde-escuro rounded-full opacity-80"></div>
          <span className="text-verde-escuro text-sm font-semibold tracking-wide">Suporte</span>
        </Link>
      </div>
    </aside>
  );
}