export default function Header() {
  return (
    <div className="w-full h-16 flex items-center justify-end">
        <nav className="bg-slate-900 p-4 shadow-md flex items-center justify-between">
            <ul className="flex items-center gap-6 list-none m-0 p-0">
                <li> <p className="text-2xl font-bold text-white">Início</p> </li>
                <li> <p className="text-2xl font-bold text-white">Rede</p> </li>
                <li> <p className="text-2xl font-bold text-white">Tutoriais</p> </li>
                <li> <p className="text-2xl font-bold text-white">Contato</p> </li>
            </ul>
        </nav>
    </div>
  );
}