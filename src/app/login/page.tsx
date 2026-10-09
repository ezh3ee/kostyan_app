import { redirect } from "next/navigation";

import { LoginForm } from "@/components/login-form";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const session = await getSession();
  if (session) redirect("/");

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-6 pt-10">
      <h1 className="text-lg font-medium">Вход</h1>
      <LoginForm />
    </div>
  );
}
