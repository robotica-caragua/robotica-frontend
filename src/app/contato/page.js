export default function Contato() {
  return (
<main className="min-h-screen bg-bg-page py-16 font-sans">

  <div class="text-center justify-start"><span class="text-green-950 text-4xl font-bold font-['Work_Sans']">ESCREVA UMA MENSAGEM </span>
  <span class="text-lime-800 text-4xl font-bold font-['Work_Sans']">PARA NÓS! </span></div>

  {/* FORMULÁRIO */}
  <section
    className="
      w-1236px
      h-819px
      mx-auto
      bg-white
      rounded-[10px]
      border
      border-verde-musgo
      p-60px
    "
  >
    {/* LINHA 1 */}
    <div className="grid grid-cols-2 gap-54px mb-8">

      <div>
        <label className="block text-[23px] text-verde-escuro mb-2">
          Nome
        </label>

        <input
          placeholder="Digite seu nome..."
          className="
            w-full
            h-69px
            rounded-[5px]
            border
            border-verde-musgo
            bg-verde-pastel
            px-4
            text-[18px]
            outline-none
          "
        />
      </div>

      <div>
        <label className="block text-[23px] text-verde-escuro mb-2">
          Sobrenome
        </label>

        <input
          placeholder="Digite seu sobrenome..."
          className="
            w-full
            h-69px
            rounded-[5px]
            border
            border-verde-musgo
            bg-verde-pastel
            px-4
            text-[18px]
            outline-none
          "
        />
      </div>
    </div>

    {/* LINHA 2 */}
    <div className="grid grid-cols-2 gap-54px mb-8">

      <div>
        <label className="block text-[23px] text-verde-escuro mb-2">
          Email
        </label>

        <input
          placeholder="exemplo@gmail.com"
          className="
            w-full
            h-69px
            rounded-[5px]
            border
            border-verde-musgo
            bg-verde-pastel
            px-4
            text-[18px]
            outline-none
          "
        />
      </div>

      <div>
        <label className="block text-[23px] text-verde-escuro mb-2">
          Assunto
        </label>

        <input
          placeholder="Digite o assunto..."
          className="
            w-full
            h-69px
            rounded-[5px]
            border
            border-verde-musgo
            bg-verde-pastel
            px-4
            text-[18px]
            outline-none
          "
        />
      </div>
    </div>

    {/* TEXTO */}
    <textarea
      placeholder="Escreva sua mensagem aqui....."
      className="
        w-full
        h-325px
        rounded-[5px]
        border
        border-verde-musgo
        bg-verde-pastel
        p-4
        text-[18px]
        resize-none
        outline-none
      "
    />

    <p className="mt-3 text-[16px] text-verde-escuro/70">
      Por favor, coloque o máximo de informação possível...
    </p>

    <div className="flex justify-center mt-8">
      <button
        className="
          w-300px
          h-54px
          rounded-[13.5px]
          border
          border-verde-escuro
          bg-verde-limao
          text-[21px]
          font-bold
          text-verde-escuro
          hover:bg-verde-oliva
          transition
        "
      >
        Confirmar e enviar
      </button>
    </div>
  </section>

</main>
  )
}
