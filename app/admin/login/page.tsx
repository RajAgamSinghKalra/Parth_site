import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { SESSION_COOKIE, verifySession } from "@/lib/session"
import LoginForm from "./login-form"

export default async function AdminLoginPage() {
  const token = cookies().get(SESSION_COOKIE)?.value
  if (token) {
    const session = await verifySession(token)
    if (session) {
      redirect("/admin")
    }
  }
  return (
    <div className="mx-auto w-full max-w-md">
      <h1 className="font-serif text-2xl font-semibold">Admin Login</h1>
      <p className="mt-1 text-sm text-muted-foreground">Enter your admin credentials to continue.</p>
      <div className="mt-6">
        <LoginForm />
      </div>
    </div>
  )
}
