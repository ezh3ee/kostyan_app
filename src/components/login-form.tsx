"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { authClient } from "@/lib/auth-client";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={async (e) => {
        e.preventDefault();
        setPending(true);
        setError(null);

        const { error: signInError } = await authClient.signIn.email({
          email,
          password,
        });

        if (signInError) {
          setError("Неверная почта или пароль");
          setPending(false);
          return;
        }

        router.push("/");
        router.refresh();
      }}
    >
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-black/60 dark:text-white/60">Почта</span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="username"
          className="rounded-lg border border-black/15 bg-transparent px-3 py-2 dark:border-white/20"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span className="text-black/60 dark:text-white/60">Пароль</span>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          className="rounded-lg border border-black/15 bg-transparent px-3 py-2 dark:border-white/20"
        />
      </label>

      {error ? (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-black"
      >
        {pending ? "Вхожу…" : "Войти"}
      </button>
    </form>
  );
}
