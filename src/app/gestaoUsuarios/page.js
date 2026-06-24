"use client";

import { SideBarAdmin } from "@/components/SideBarAdmin";
import Link from "next/link";

import { 
  IoSearchOutline, 
  IoChevronDown, 
  IoChevronBack, 
  IoChevronForward, 
  IoInformationCircleOutline, 
  IoDownloadOutline,
  IoAddOutline 
} from "react-icons/io5";
import { MdOutlineEdit, MdOutlineVpnKey, MdOutlineBlock } from "react-icons/md";

export default function GestaoUsuarios() {
  // Simulando os dados que virão do seu banco de dados (Prisma)
  const listaUsuarios = [
    { id: 1, nome: "Carlos Eduardo", matricula: "#73915", escola: "EMEF Prof. João Batista", status: "Ativo" },
    { id: 2, nome: "Carlos Eduardo", matricula: "#73915", escola: "EMEF Prof. João Batista", status: "Ativo" },
    { id: 3, nome: "Carlos Eduardo", matricula: "#73915", escola: "EMEF Prof. João Batista", status: "Ativo" },
    { id: 4, nome: "Carlos Eduardo", matricula: "#73915", escola: "EMEF Prof. João Batista", status: "Bloqueado" },
  ];

  return (
    <div className="flex min-h-screen bg-background relative">
      
      {/* Menu Lateral */}
      <SideBarAdmin />

      <main className="flex-1 flex flex-col">
        
        {/* Container Principal */}
        <div className="w-[85%] max-w-6xl mx-auto py-12 px-8 flex flex-col gap-10">
          
          {/* Título e Botão Novo */}
          <div className="flex justify-between items-end">
            <section className="flex flex-col gap-2">
              <h2 className="text-verde-escuro text-5xl font-bold leading-tight">Gestão de Usuários</h2>
              <p className="text-verde-musgo text-xl font-normal">Adicione novos professores, redefina senhas ou suspenda acessos.</p>
            </section>
            
            <Link
            href="cadastrarUsuario"
            className="px-6 py-3 bg-verde-musgo hover:bg-white  text-white text-lg font-bold rounded-lg shadow-sm transition-colors flex items-center gap-2">
              <IoAddOutline size={24} /> Novo Professor
            </Link>
          </div>

          {/* Cards de Métricas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white rounded-3xl border border-verde-musgo border-opacity-30 shadow-sm flex flex-col gap-1">
              <span className="text-verde-musgo text-base font-medium">Total de Usuários</span>
              <span className="text-verde-escuro text-3xl font-semibold">1,284</span>
            </div>
            <div className="p-6 bg-white rounded-3xl border border-verde-musgo border-opacity-30 shadow-sm flex flex-col gap-1">
              <span className="text-verde-musgo text-base font-medium">Professores Ativos</span>
              <span className="text-verde-escuro text-3xl font-semibold">842</span>
            </div>
            <div className="p-6 bg-white rounded-3xl border border-verde-musgo border-opacity-30 shadow-sm flex flex-col gap-1">
              <span className="text-verde-musgo text-base font-medium">Pendentes de Acesso</span>
              <span className="text-verde-escuro text-3xl font-semibold">14</span>
            </div>
          </div>

          {/* Barra de Pesquisa e Filtro */}
          <div className="flex items-center gap-4 p-2 bg-white/50 backdrop-blur-sm border border-verde-musgo border-opacity-30 rounded-xl">
            <div className="flex-1 flex items-center gap-3 px-4 py-2">
              <IoSearchOutline size={22} className="text-verde-musgo" />
              <input 
                type="text" 
                placeholder="Buscar por nome, matrícula ou CPF..." 
                className="w-full bg-transparent text-lg focus:outline-none text-verde-escuro placeholder-verde-musgo placeholder-opacity-70" 
              />
            </div>
            <div className="w-px h-6 bg-verde-musgo opacity-30"></div>
            <div className="flex items-center gap-2 px-6 py-2 cursor-pointer hover:opacity-70 transition">
              <span className="text-verde-escuro text-lg font-semibold tracking-wide">Status: Ativos</span>
              <IoChevronDown size={20} className="text-verde-escuro" />
            </div>
          </div>

          {/* Tabela de Usuários */}
          <div className="bg-white rounded-3xl border border-verde-musgo border-opacity-10 shadow-sm flex flex-col overflow-hidden">
            
            {/* Cabeçalho da Tabela */}
            <div className="grid grid-cols-12 px-8 py-5 bg-input-bg border-b border-verde-musgo border-opacity-20 items-center">
              <span className="col-span-4 text-verde-musgo text-xs font-bold uppercase tracking-widest">Nome</span>
              <span className="col-span-2 text-verde-musgo text-xs font-bold uppercase tracking-widest">Matrícula</span>
              <span className="col-span-3 text-verde-musgo text-xs font-bold uppercase tracking-widest">Escola</span>
              <span className="col-span-2 text-verde-musgo text-xs font-bold uppercase tracking-widest">Status</span>
              <span className="col-span-1 text-verde-musgo text-xs font-bold uppercase tracking-widest text-center">Ações</span>
            </div>

            {/* Linhas da Tabela (Mapeadas do Array) */}
            <div className="flex flex-col">
              {listaUsuarios.map((usuario) => (
                <div key={usuario.id} className="grid grid-cols-12 px-8 py-5 items-center border-b border-gray-100 last:border-none hover:bg-gray-50 transition">
                  
                  {/* Nome e Avatar */}
                  <div className="col-span-4 flex items-center gap-4">
                    <div className="w-10 h-10 bg-verde-pastel rounded-full flex justify-center items-center">
                      <span className="text-verde-escuro text-sm font-bold uppercase">
                        {usuario.nome.split(" ").map(n => n[0]).join("").substring(0, 2)}
                      </span>
                    </div>
                    <span className="text-verde-escuro text-base font-bold">{usuario.nome}</span>
                  </div>

                  {/* Matrícula */}
                  <span className="col-span-2 text-verde-escuro font-medium">{usuario.matricula}</span>

                  {/* Escola */}
                  <span className="col-span-3 text-verde-escuro text-sm">{usuario.escola}</span>

                  {/* Status */}
                  <div className="col-span-2 flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${usuario.status === 'Ativo' ? 'bg-verde-oliva shadow-[0px_0px_8px_0px_rgba(185,246,0,0.60)]' : 'bg-vermelho shadow-[0px_0px_8px_0px_rgba(186,26,26,0.60)]'}`}></div>
                    <span className="text-verde-escuro text-sm font-semibold">{usuario.status}</span>
                  </div>

                  {/* Ações (Ícones) */}
                  <div className="col-span-1 flex justify-center items-center gap-3">
                    <button className="text-verde-musgo hover:text-verde-escuro transition" title="Editar">
                      <MdOutlineEdit size={20} />
                    </button>
                    <button className="text-verde-musgo hover:text-verde-escuro transition" title="Redefinir Senha">
                      <MdOutlineVpnKey size={20} />
                    </button>
                    <button className="text-vermelho hover:opacity-70 transition" title="Bloquear Acesso">
                      <MdOutlineBlock size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Paginação */}
            <div className="px-8 py-5 bg-input-bg border-t border-verde-musgo border-opacity-20 flex justify-between items-center">
              <span className="text-verde-musgo text-sm font-medium">Mostrando 1-10 de 1,284 usuários</span>
              
              <div className="flex items-center gap-2">
                <button className="p-2 text-verde-musgo opacity-50 cursor-not-allowed"><IoChevronBack size={18} /></button>
                <button className="w-8 h-8 rounded-lg bg-verde-musgo text-white text-sm font-bold flex justify-center items-center">1</button>
                <button className="w-8 h-8 rounded-lg text-verde-escuro hover:bg-verde-pastel text-sm font-bold flex justify-center items-center transition">2</button>
                <button className="w-8 h-8 rounded-lg text-verde-escuro hover:bg-verde-pastel text-sm font-bold flex justify-center items-center transition">3</button>
                <span className="text-verde-musgo px-1">...</span>
                <button className="w-8 h-8 rounded-lg text-verde-escuro hover:bg-verde-pastel text-sm font-bold flex justify-center items-center transition">129</button>
                <button className="p-2 text-verde-escuro hover:bg-verde-pastel rounded-lg transition"><IoChevronForward size={18} /></button>
              </div>
            </div>
          </div>

          {/* Cards de Rodapé (Dica e Relatório) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            
            <div className="col-span-2 p-6 bg-input-bg border border-verde-musgo border-opacity-30 rounded-3xl flex gap-4 items-start">
              <IoInformationCircleOutline size={24} className="text-verde-musgo flex-shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1">
                <h4 className="text-verde-musgo font-bold text-lg">Dica de Segurança</h4>
                <p className="text-verde-escuro text-base font-medium">Senhas redefinidas expiram em 24 horas caso não sejam alteradas pelo usuário. Certifique-se de que o e-mail de recuperação está atualizado no perfil.</p>
              </div>
            </div>

            <div className="col-span-1 p-6 bg-verde-pastel bg-opacity-50 border border-verde-musgo border-opacity-10 rounded-3xl flex flex-col justify-between">
              <div className="flex flex-col gap-1 mb-4">
                <h4 className="text-verde-musgo font-bold text-base">Relatório de Acessos</h4>
                <p className="text-verde-escuro text-sm font-medium">Exporte a lista completa de usuários ativos em formato CSV para auditoria semestral.</p>
              </div>
              <button className="flex items-center gap-2 text-verde-musgo hover:text-verde-escuro font-bold text-sm transition">
                Gerar CSV <IoDownloadOutline size={18} />
              </button>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}