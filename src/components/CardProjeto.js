export function CardProjeto({ title, description, linkUrl }) {
  return (
    <div className="size-lf-stretch bg-white rounded-lg outline -outline-offset-1 outline-verde-musgo inline-flex flex-col justify-start items-start overflow-hidden">
      {/* Imagem do projeto */}
      <div className="self-stretch h-48 relative flex flex-col justify-center items-start overflow-hidden">
        <div className="size- px-3 py-1 left-[294.64px] top-3 absolute bg-verde-limao rounded-xl backdrop-blur-[2px] flex flex-col justify-start items-start">
          <p className="justify-center text-verde-musgo text-base font-normal whitespace-nowrap">
            Em Destaque
          </p>
        </div>
      </div>
      <div className="self-stretch p-6 flex flex-col justify-start items-start gap-3">
        <div className="self-stretch inline-flex justify-start items-start gap-1">
          <div className="self-stretch px-3 py-0.5 bg-verde-limao/20 rounded-xl inline-flex flex-col justify-start items-start">
            <div className="justify-center text-verde-musgo text-xs font-normal">Arduino</div>
          </div>
          <div className="self-stretch px-3 py-0.5 bg-verde-limao/20 rounded-xl inline-flex flex-col justify-start items-start">
            <div className="justify-center text-verde-musgo text-xs font-normal">Smart City</div>
          </div>
        </div>
        <div className="self-stretch flex flex-col justify-start items-start gap-1">
          <div className="self-stretch flex flex-col justify-start items-start">
            <div className="self-stretch justify-center text-verde-escuro text-2xl font-semibold">
              Semáforo Inteligente
            </div>
          </div>
          <div className="self-stretch flex flex-col justify-start items-start">
            <div className="self-stretch justify-center text-verde-musgo text-sm font-semibold tracking-wide">
              Colégio Tech Future • Equipe Alpha
            </div>
          </div>
        </div>
        <div className="self-stretch flex flex-col justify-start items-start overflow-hidden">
          <div className="self-stretch justify-center text-verde-musgo text-base font-normal">
            Sistema de tráfego adaptativo que utiliza
            <br />
            sensores ultrassônicos para otimizar o…
          </div>
        </div>
        <div className="self-stretch pr-[0.01px] pt-6 border-t border-verde-musgo inline-flex justify-between items-center">
          <div className="size- flex justify-start items-center gap-1">
            <div className="size- inline-flex flex-col justify-start items-start">
              <div className="size-3.5 bg-verde-musgo" />
            </div>
            <div className="size- inline-flex flex-col justify-start items-start">
              <div className="justify-center text-verde-musgo text-xs font-normal">124</div>
            </div>
          </div>
          <div className="size- flex justify-start items-center gap-1">
            <div className="text-center justify-center text-verde-musgo text-base font-bold">
              Ver Detalhes
            </div>
            <div className="size- inline-flex flex-col justify-start items-center">
              <div className="size-4 bg-verde-musgo" />
            </div>
          </div>
        </div>
    </article>
  )
}
