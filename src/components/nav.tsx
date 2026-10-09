"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";

const TABS = [
  { href: "/", label: "Календарь" },
  { href: "/balance", label: "Баланс" },
];

export function Nav({
  isAdmin,
  isAuthenticated,
}: {
  isAdmin: boolean;
  isAuthenticated: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const tabs = isAdmin
    ? [...TABS, { href: "/admin", label: "Админка" }]
    : TABS;

  return (
    <header className="border-b border-black/10 dark:border-white/15">
      <div className="mx-auto flex w-full max-w-3xl items-center gap-1 px-4 py-3">
        {tabs.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                active
                  ? "bg-black text-white dark:bg-white dark:text-black"
                  : "text-black/60 hover:bg-black/5 dark:text-white/60 dark:hover:bg-white/10"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}

        <div className="ml-auto">
          {isAuthenticated ? (
            <button
              type="button"
              onClick={async () => {
                await authClient.signOut();
                router.push("/login");
                router.refresh();
              }}
              className="rounded-lg px-3 py-1.5 text-sm text-black/50 hover:bg-black/5 dark:text-white/50 dark:hover:bg-white/10"
            >
              Выйти
            </button>
          ) : (
            <Link
              href="/login"
              className="rounded-lg px-3 py-1.5 text-sm text-black/50 hover:bg-black/5 dark:text-white/50 dark:hover:bg-white/10"
            >
              Войти
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
