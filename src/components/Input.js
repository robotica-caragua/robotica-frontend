export function Input() {
  return (
    <div className="flex justify-center">
      <form className="flex flex-col">
        <label htmlFor="email-field" className="mt-5 mb-3 text-xl text-verde-escuro font-medium">
          E-mail
        </label>
        <input
          className=" h-12 w-3xl bg-verde-pastel rounded-md border border-verde-musgo px-3"
          type="email"
          id="email-field"
          placeholder="exemplo@gmail.com"
        />
      </form>
    </div>
  )
}
