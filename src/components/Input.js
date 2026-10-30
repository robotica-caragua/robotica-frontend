export function Input({ value, onChange, placeholder = 'exemplo@gmail.com' }) {
  return (
    <div className="flex justify-center px-4">
      <div className="flex flex-col w-full max-w-3xl">
        <label htmlFor="email-field" className="mt-5 mb-3 text-xl text-verde-escuro font-medium">
          E-mail
        </label>
        <input
          className="h-12 w-full bg-verde-pastel rounded-md border border-verde-musgo px-3 text-verde-escuro"
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
