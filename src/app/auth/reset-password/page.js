import { redirect } from 'next/navigation'

export default async function ResetPasswordPage({ searchParams }) {
  const { token } = await searchParams
  if (!token) redirect('/forgot-password')
  redirect(`/senhapt2?token=${encodeURIComponent(token)}`)
}
