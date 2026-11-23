'use client'

// Seleção múltipla de escolas (vínculo N:N do docente), no mesmo padrão visual dos campos do painel.
export function MultiSelectEscolas({ escolas = [], selecionadas = [], onChange }) {
  const alternar = (id) => {
    const chave = String(id)
    onChange(
      selecionadas.includes(chave)
        ? selecionadas.filter((item) => item !== chave)
        : [...selecionadas, chave]
    )
  }

  if (escolas.length === 0) {
    return (
      <p className="w-full rounded-xl border border-verde-musgo bg-input-bg px-4 py-3 text-sm text-verde-escuro/70">
        Nenhuma escola cadastrada. Cadastre uma escola para vincular ao docente.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-2 w-full rounded-xl border border-verde-musgo bg-input-bg p-3 max-h-56 overflow-y-auto">
      {escolas.map((esc) => {
        const marcada = selecionadas.includes(String(esc.id))
        return (
          <label
            key={esc.id}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm sm:text-base text-verde-escuro cursor-pointer transition ${
              marcada ? 'bg-verde-pastel font-semibold' : 'hover:bg-verde-pastel/60'
            }`}
          >
            <input
              type="checkbox"
              checked={marcada}
              onChange={() => alternar(esc.id)}
              className="w-4 h-4 accent-verde-musgo cursor-pointer"
            />
            <span>{esc.name}</span>
          </label>
        )
      })}
    </div>
  )
}
