"use client"

import { useState } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"

const FormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  remember: z.boolean().default(true),
})

type FormValues = z.infer<typeof FormSchema>

export default function LoginForm() {
  const router = useRouter()
  const params = useSearchParams()
  const next = params.get("next") || "/admin"
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: { email: "admin@gmail.com", password: "password", remember: true },
  })

  async function onSubmit(values: FormValues) {
    setLoading(true)
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(values),
        credentials: "same-origin", // ensure Set-Cookie is honored in all browsers for same-origin requests
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || "Login failed")
      }
      toast({ title: "Signed in", description: "Welcome back." })
      router.replace(next)
      router.refresh()
    } catch (e: any) {
      toast({ title: "Error", description: e.message || "Unable to sign in", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault()
        void form.handleSubmit(onSubmit)()
      }}
    >
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="admin@gmail.com" {...form.register("email")} />
        {form.formState.errors.email && (
          <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" placeholder="••••••••" {...form.register("password")} />
        {form.formState.errors.password && (
          <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Checkbox
          id="remember"
          checked={form.watch("remember")}
          onCheckedChange={(v) => form.setValue("remember", Boolean(v))}
        />
        <Label htmlFor="remember" className="text-sm">
          Remember me
        </Label>
      </div>
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Signing in…" : "Sign In"}
      </Button>
    </form>
  )
}
