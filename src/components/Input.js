export function Input({ value, onChange, placeholder = 'exemplo@gmail.com' }) {
  return (
    <div className="flex justify-center px-4">
      <div className="flex flex-col w-full max-w-3xl">
        <label
          htmlFor="email-field"
          className="mt-4 mb-2 text-xs sm:text-sm text-verde-escuro font-bold uppercase tracking-wider"
        >
          E-mail
        </label>
        <input
          className="h-11 sm:h-12 w-full bg-verde-pastel rounded-xl border border-verde-musgo px-4 text-sm sm:text-base text-verde-escuro focus:outline-none focus:ring-2 focus:ring-verde-musgo/30"
          type="email"
          id="email-field"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
        />
      </div>
    </div>
  )
}
