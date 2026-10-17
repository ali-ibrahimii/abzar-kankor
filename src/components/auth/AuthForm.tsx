"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, LogIn, UserRoundPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

type Labels = {
  name: string;
  email: string;
  password: string;
  confirm: string;
  login: string;
  register: string;
  noAccount: string;
  haveAccount: string;
  goRegister: string;
  goLogin: string;
  demo: string;
  successLogin: string;
  successRegister: string;
  errorPassword: string;
  errorMatch: string;
  errorEmail: string;
};

export default function AuthForm({ mode, labels }: { mode: "login" | "register"; labels: Labels }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setDone("");

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(labels.errorEmail);
      return;
    }
    if (password.length < 6) {
      setError(labels.errorPassword);
      return;
    }
    if (mode === "register" && password !== confirm) {
      setError(labels.errorMatch);
      return;
    }

    const user = {
      name: mode === "register" ? name.trim() : email.split("@")[0],
      email: email.trim().toLowerCase(),
      createdAt: new Date().toISOString(),
    };

    window.localStorage.setItem("abzar-user", JSON.stringify(user));
    window.dispatchEvent(new Event("abzar-user-change"));
    setDone(mode === "register" ? labels.successRegister : labels.successLogin);
    setTimeout(() => {
      router.push("/dashboard");
      router.refresh();
    }, 600);
  }

  return (
    <form onSubmit={handleSubmit} className="soft-card p-6 sm:p-8">
      <div className="grid gap-4">
        {mode === "register" ? (
          <div>
            <label className="field-label" htmlFor="auth-name">
              {labels.name}
            </label>
            <input
              id="auth-name"
              className="field-input"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </div>
        ) : null}

        <div>
          <label className="field-label" htmlFor="auth-email">
            {labels.email}
          </label>
          <input
            id="auth-email"
            type="email"
            dir="ltr"
            autoComplete="email"
            className="field-input"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <div>
          <label className="field-label" htmlFor="auth-password">
            {labels.password}
          </label>
          <input
            id="auth-password"
            type="password"
            dir="ltr"
            autoComplete={mode === "register" ? "new-password" : "current-password"}
            className="field-input"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>

        {mode === "register" ? (
          <div>
            <label className="field-label" htmlFor="auth-confirm">
              {labels.confirm}
            </label>
            <input
              id="auth-confirm"
              type="password"
              dir="ltr"
              autoComplete="new-password"
              className="field-input"
              value={confirm}
              onChange={(event) => setConfirm(event.target.value)}
              required
            />
          </div>
        ) : null}
      </div>

      {error ? (
        <p className="mt-4 rounded-xl bg-destructive/10 px-3 py-2 text-xs font-bold text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      {done ? (
        <p className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-500/10 px-3 py-2 text-xs font-bold text-emerald-600 dark:text-emerald-300" role="status">
          <Check size={14} />
          {done}
        </p>
      ) : null}

      <Button type="submit" className="mt-6 w-full">
        {mode === "login" ? <LogIn size={16} /> : <UserRoundPlus size={16} />}
        {mode === "login" ? labels.login : labels.register}
      </Button>

      <p className="mt-4 text-center text-xs text-muted-foreground">
        {mode === "login" ? labels.noAccount : labels.haveAccount}{" "}
        <Link
          href={mode === "login" ? "/register" : "/login"}
          className="font-black text-primary hover:underline"
        >
          {mode === "login" ? labels.goRegister : labels.goLogin}
        </Link>
      </p>

      <p className="mt-3 text-center text-[11px] leading-5 text-muted-foreground/80">{labels.demo}</p>
    </form>
  );
}
