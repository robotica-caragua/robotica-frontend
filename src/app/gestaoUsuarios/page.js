"use client";

import { useState, useMemo } from "react";
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
import { MdOutlineEdit, MdLockReset, MdOutlineBlock } from "react-icons/md";

export default function GestaoUsuarios() {
  const listaUsuarios = [
    { id: 1, nome: "Carlos Eduardo", matricula: "#73915", escola: "EMEF Prof. João Batista", status: "Ativo" },
    { id: 2, nome: "Márcia Silva", matricula: "#82641", escola: "EMEF Prof. Ana Santos", status: "Ativo" },
    { id: 3, nome: "Fernando Costa", matricula: "#71203", escola: "EMEF Prof. José Pereira", status: "Ativo" },
    { id: 4, nome: "Beatriz Oliveira", matricula: "#84729", escola: "EMEF Prof. Maria Souza", status: "Bloqueado" },
    { id: 5, nome: "Roberto Alves", matricula: "#75814", escola: "EMEF Prof. João Batista", status: "Ativo" },
    { id: 6, nome: "Patricia Gomes", matricula: "#81536", escola: "EMEF Prof. Ana Santos", status: "Ativo" },
    { id: 7, nome: "Lucas Martins", matricula: "#79642", escola: "EMEF Prof. José Pereira", status: "Ativo" },
    { id: 8, nome: "Amanda Santos", matricula: "#83927", escola: "EMEF Prof. Maria Souza", status: "Ativo" },
    { id: 9, nome: "Ricardo Ferreira", matricula: "#72481", escola: "EMEF Prof. João Batista", status: "Pendente" },
    { id: 10, nome: "Juliana Costa", matricula: "#85643", escola: "EMEF Prof. Ana Santos", status: "Ativo" },
    { id: 11, nome: "Camila Rocha", matricula: "#85644", escola: "EMEF Prof. Ana Santos", status: "Pendente" },
    { id: 12, nome: "Thiago Mendes", matricula: "#85645", escola: "EMEF Prof. Maria Souza", status: "Bloqueado" },
  ];

  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("Todos");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 5;

  const totalUsuarios = listaUsuarios.length;
  const totalAtivos = listaUsuarios.filter(u => u.status === "Ativo").length;
  const totalPendentes = listaUsuarios.filter(u => u.status === "Pendente").length;

  const usuariosFiltrados = useMemo(() => {
    return listaUsuarios.filter(usuario => {
      const matchBusca = 
        usuario.nome.toLowerCase().includes(busca.toLowerCase()) || 
        usuario.matricula.toLowerCase().includes(busca.toLowerCase());
      const matchStatus = filtroStatus === "Todos" || usuario.status === filtroStatus;
      
      return matchBusca && matchStatus;
    });
  }, [busca, filtroStatus]);

  const totalPaginas = Math.ceil(usuariosFiltrados.length / itensPorPagina);
  const startIndex = (paginaAtual - 1) * itensPorPagina;
  const usuariosPaginados = usuariosFiltrados.slice(startIndex, startIndex + itensPorPagina);

  const exportarParaCSV = () => {

    const separador = ";"; 

    const cabecalho = ["Nome", "Matricula", "Escola", "Status"];
    
    const linhas = usuariosFiltrados.map(u => 
      [u.nome, u.matricula, u.escola, u.status]
        .map(campo => `"${campo}"`) 
        .join(separador)            
    );

    const csvContent = "\ufeff" + [cabecalho.join(separador), ...linhas].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "relatorio_usuarios.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleFiltroChange = (e) => {
    setFiltroStatus(e.target.value);
    setPaginaAtual(1);
  };
  
  const handleBuscaChange = (e) => {
    setBusca(e.target.value);
    setPaginaAtual(1);
  };

  return (
    <div className="flex min-h-screen bg-background relative">
      
      <SideBarAdmin />

      <main className="flex-1 flex flex-col">
        
        <div className="w-[85%] max-w-6xl mx-auto py-12 px-8 flex flex-col gap-10">
          <div className="flex justify-between items-end">
            <section className="flex flex-col gap-2">
              <h2 className="text-verde-escuro text-5xl font-bold leading-tight">Gestão de Usuários</h2>
              <p className="text-verde-musgo text-xl font-normal">Adicione novos professores, redefina senhas ou suspenda acessos.</p>
            </section>
            
            <Link
            href="cadastrarUsuario"
            className="px-6 py-3 bg-verde-musgo hover:bg-white hover:text-verde-musgo hover:border hover:border-verde-musgo text-white text-lg font-bold rounded-lg shadow-sm  flex items-center gap-2 transition">
              <IoAddOutline size={24} /> Novo Professor
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white rounded-3xl border border-verde-musgo border-opacity-30 shadow-sm flex flex-col gap-1">
              <span className="text-verde-musgo text-base font-medium">Total de Usuários</span>
              <span className="text-verde-escuro text-3xl font-semibold">{totalUsuarios}</span>
            </div>
            <div className="p-6 bg-white rounded-3xl border border-verde-musgo border-opacity-30 shadow-sm flex flex-col gap-1">
              <span className="text-verde-musgo text-base font-medium">Professores Ativos</span>
              <span className="text-verde-escuro text-3xl font-semibold">{totalAtivos}</span>
            </div>
            <div className="p-6 bg-white rounded-3xl border border-verde-musgo border-opacity-30 shadow-sm flex flex-col gap-1">
              <span className="text-verde-musgo text-base font-medium">Pendentes de Acesso</span>
              <span className="text-verde-escuro text-3xl font-semibold">{totalPendentes}</span>
            </div>
          </div>
          <div className="flex items-center gap-4 p-2 bg-white/50 backdrop-blur-sm border border-verde-musgo border-opacity-30 rounded-xl">
            <div className="flex-1 flex items-center gap-3 px-4 py-2">
              <IoSearchOutline size={22} className="text-verde-musgo" />
              <input 
                type="text" 
                value={busca}
                onChange={handleBuscaChange}
                placeholder="Buscar por nome ou matrícula..." 
                className="w-full bg-transparent text-lg focus:outline-none text-verde-escuro placeholder-verde-musgo placeholder-opacity-70" 
              />
            </div>
            <div className="w-px h-6 bg-verde-musgo opacity-30"></div>
            
            <div className="relative flex items-center px-6 py-2 cursor-pointer hover:opacity-70 transition group">
              <select 
                value={filtroStatus}
                onChange={handleFiltroChange}
                className="appearance-none bg-transparent text-verde-escuro text-lg font-semibold tracking-wide pr-8 focus:outline-none cursor-pointer z-10"
              >
                <option value="Todos">Status: Todos</option>
                <option value="Ativo">Status: Ativos</option>
                <option value="Bloqueado">Status: Bloqueados</option>
                <option value="Pendente">Status: Pendentes</option>
              </select>
              <IoChevronDown size={20} className="text-verde-escuro absolute right-6 z-0 pointer-events-none" />
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-verde-musgo border-opacity-10 shadow-sm flex flex-col overflow-hidden">
            
            <div className="grid grid-cols-12 px-8 py-5 bg-input-bg border-b border-verde-musgo border-opacity-20 items-center">
              <span className="col-span-4 text-verde-musgo text-xs font-bold uppercase tracking-widest">Nome</span>
              <span className="col-span-2 text-verde-musgo text-xs font-bold uppercase tracking-widest">Matrícula</span>
              <span className="col-span-3 text-verde-musgo text-xs font-bold uppercase tracking-widest">Escola</span>
              <span className="col-span-2 text-verde-musgo text-xs font-bold uppercase tracking-widest">Status</span>
              <span className="col-span-1 text-verde-musgo text-xs font-bold uppercase tracking-widest text-center">Ações</span>
            </div>

            <div className="flex flex-col min-h-[350px]">
              {usuariosPaginados.length > 0 ? (
                usuariosPaginados.map((usuario) => (
                  <div key={usuario.id} className="grid grid-cols-12 px-8 py-5 items-center border-b border-gray-100 last:border-none hover:bg-gray-50 transition">
                    
                    <div className="col-span-4 flex items-center gap-4">
                      <div className="w-10 h-10 bg-verde-pastel rounded-full flex justify-center items-center">
                        <span className="text-verde-escuro text-sm font-bold uppercase">
                          {usuario.nome.split(" ").map(n => n[0]).join("").substring(0, 2)}
                        </span>
                      </div>
                      <span className="text-verde-escuro text-base font-bold">{usuario.nome}</span>
                    </div>

                    <span className="col-span-2 text-verde-escuro font-medium">{usuario.matricula}</span>

                    <span className="col-span-3 text-verde-escuro text-sm">{usuario.escola}</span>

                    <div className="col-span-2 flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        usuario.status === 'Ativo' ? 'bg-verde-oliva shadow-[0px_0px_8px_0px_rgba(185,246,0,0.60)]' : 
                        usuario.status === 'Pendente' ? 'bg-yellow-500 shadow-[0px_0px_8px_0px_rgba(234,179,8,0.60)]' :
                        'bg-vermelho shadow-[0px_0px_8px_0px_rgba(186,26,26,0.60)]'
                      }`}></div>
                      <span className="text-verde-escuro text-sm font-semibold">{usuario.status}</span>
                    </div>

                    <div className="col-span-1 flex justify-center items-center gap-3">
                      <button className="text-verde-musgo hover:text-verde-escuro transition" title="Editar">
                        <MdOutlineEdit size={20} />
                      </button>

                      <button className="text-blue-500 hover:text-blue-700 transition" title="Redefinir Senha">
  <MdLockReset size={20} />
</button>

                      <button className="text-vermelho hover:opacity-70 transition" title="Bloquear Acesso">
                        <MdOutlineBlock size={20} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex-1 flex justify-center items-center py-10 text-verde-musgo">
                  Nenhum usuário encontrado com os filtros atuais.
                </div>
              )}
            </div>

            <div className="px-8 py-5 bg-input-bg border-t border-verde-musgo border-opacity-20 flex justify-between items-center">
              <span className="text-verde-musgo text-sm font-medium">
                Mostrando {usuariosFiltrados.length === 0 ? 0 : startIndex + 1}-{Math.min(startIndex + itensPorPagina, usuariosFiltrados.length)} de {usuariosFiltrados.length} usuários
              </span>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setPaginaAtual(prev => Math.max(prev - 1, 1))}
                  disabled={paginaAtual === 1}
                  className={`p-2 rounded-lg transition ${paginaAtual === 1 ? 'text-verde-musgo opacity-50 cursor-not-allowed' : 'text-verde-escuro hover:bg-verde-pastel'}`}
                >
                  <IoChevronBack size={18} />
                </button>
                
                {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(pagina => (
                  <button 
                    key={pagina}
                    onClick={() => setPaginaAtual(pagina)}
                    className={`w-8 h-8 rounded-lg text-sm font-bold flex justify-center items-center transition ${paginaAtual === pagina ? 'bg-verde-musgo text-white' : 'text-verde-escuro hover:bg-verde-pastel'}`}
                  >
                    {pagina}
                  </button>
                ))}

                <button 
                  onClick={() => setPaginaAtual(prev => Math.min(prev + 1, totalPaginas))}
                  disabled={paginaAtual === totalPaginas || totalPaginas === 0}
                  className={`p-2 rounded-lg transition ${paginaAtual === totalPaginas || totalPaginas === 0 ? 'text-verde-musgo opacity-50 cursor-not-allowed' : 'text-verde-escuro hover:bg-verde-pastel'}`}
                >
                  <IoChevronForward size={18} />
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            
            <div className="col-span-2 p-6 bg-input-bg border border-verde-musgo border-opacity-30 rounded-3xl flex gap-4 items-start">
              <IoInformationCircleOutline size={24} className="text-verde-musgo flex-shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1">
                <h4 className="text-verde-musgo font-bold text-lg">Dica de Segurança</h4>
                <p className="text-verde-escuro text-base font-medium">Senhas redefinidas expiram em 24 horas caso não sejam alteradas pelo usuário. Certifique-se de que o e-mail de recuperação está atualizado no perfil.</p>
              </div>
            </div>

            <div className="col-span-1 p-6 bg-input-bg border border-verde-musgo border-opacity-10 rounded-3xl flex flex-col justify-between">
              <div className="flex flex-col gap-1 mb-4">
                <h4 className="text-verde-musgo font-bold text-base">Relatório de Acessos</h4>
                <p className="text-verde-escuro text-sm font-medium">Exporte a lista completa de usuários ativos em formato CSV para auditoria semestral.</p>
              </div>
<button 
  onClick={exportarParaCSV}
  className="flex items-center gap-2 text-verde-musgo hover:text-verde-escuro font-bold text-sm"
>
  Gerar CSV <IoDownloadOutline size={18} />
</button>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}