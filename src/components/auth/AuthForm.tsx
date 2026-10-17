"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Check,
  GraduationCap,
  KeyRound,
  LoaderCircle,
  LogIn,
  Presentation,
  UserRoundPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Dictionary } from "@/lib/locales";
import type { DemoSeed } from "@/lib/types";
import { ensureDemoData, loginUser, registerUser } from "@/lib/store";

type AuthLabels = Dictionary["pages"]["auth"];

export default function AuthForm({
  mode,
  labels,
  demo,
}: {
  mode: "login" | "register";
  labels: AuthLabels;
  demo: DemoSeed;
}) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [role, setRole] = useState<"student" | "teacher">("student");
  const [error, setError] = useState("");
  const [done, setDone] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    ensureDemoData(demo);
  }, [demo]);

  function goDashboard() {
    let destination = "/dashboard";
    if (typeof window !== "undefined") {
      const next = new URLSearchParams(window.location.search).get("next");
      if (next && next.startsWith("/") && !next.startsWith("//")) destination = next;
    }
    router.push(destination);
    router.refresh();
  }

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

    if (mode === "login") {
      const result = loginUser(email, password);
      if (result.error === "notFound") {
        setError(labels.errorNotFound);
        return;
      }
      if (result.error === "wrongPassword") {
        setError(labels.errorWrongPassword);
        return;
      }
      setDone(labels.successLogin);
      setTimeout(goDashboard, 500);
      return;
    }

    if (!name.trim()) {
      setError(labels.name);
      return;
    }

    const result = registerUser({ name, email, password, role });
    if (result.error === "exists") {
      setError(labels.errorExists);
      return;
    }
    setDone(labels.successRegister);
    setTimeout(goDashboard, 500);
  }

  function quickLogin(target: "teacher" | "student") {
    setError("");
    setBusy(true);
    ensureDemoData(demo);
    const address =
      target === "teacher" ? demo.credentials.teacherEmail : demo.credentials.studentEmail;
    const result = loginUser(address, demo.credentials.password);
    setBusy(false);
    if (result.user) {
      setDone(labels.successLogin);
      goDashboard();
    } else {
      setError(labels.errorNotFound);
    }
  }

  const roles = [
    {
      id: "student" as const,
      label: labels.studentRole,
      hint: labels.studentHint,
      Icon: GraduationCap,
    },
    {
      id: "teacher" as const,
      label: labels.teacherRole,
      hint: labels.teacherHint,
      Icon: Presentation,
    },
  ];

  return (
    <div className="grid gap-5">
      <form onSubmit={handleSubmit} className="soft-card p-6 sm:p-8">
        <div className="grid gap-4">
          {mode === "register" ? (
            <>
              <div>
                <label className="field-label" htmlFor="auth-name">
                  {labels.name}
                </label>
                <input
                  id="auth-name"
                  className="field-input"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  autoComplete="name"
                  required
                />
              </div>
              <fieldset>
                <legend className="field-label">{labels.role}</legend>
                <p className="mb-2 text-xs text-muted-foreground">{labels.roleHint}</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {roles.map((item) => {
                    const active = role === item.id;
                    return (
                      <label
                        key={item.id}
                        className={[
                          "flex cursor-pointer items-start gap-3 rounded-2xl border p-3.5 transition",
                          active
                            ? "border-primary/50 bg-primary/[0.06] ring-2 ring-primary/15"
                            : "border-border/80 bg-card hover:border-primary/25",
                        ].join(" ")}
                      >
                        <input
                          type="radio"
                          name="role"
                          value={item.id}
                          checked={active}
                          onChange={() => setRole(item.id)}
                          className="sr-only"
                        />
                        <span
                          className={[
                            "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl",
                            active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                          ].join(" ")}
                        >
                          <item.Icon size={17} />
                        </span>
                        <span className="min-w-0">
                          <span className="flex items-center gap-1.5 text-sm font-black text-foreground">
                            {item.label}
                            {active ? <Check size={13} className="text-primary" /> : null}
                          </span>
                          <span className="mt-0.5 block text-[11px] leading-5 text-muted-foreground">
                            {item.hint}
                          </span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            </>
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
          <p className="mt-4 rounded-xl bg-emerald-500/10 px-3 py-2 text-xs font-bold text-emerald-700 dark:text-emerald-300">
            {done}
          </p>
        ) : null}

        <Button type="submit" className="mt-5 w-full" size="lg" disabled={busy}>
          {mode === "login" ? <LogIn size={17} /> : <UserRoundPlus size={17} />}
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
        <p className="mt-4 rounded-xl bg-muted/60 px-3 py-2 text-center text-[11px] leading-5 text-muted-foreground">
          {labels.demo}
        </p>
      </form>

      {mode === "login" ? (
        <div className="soft-card p-5 sm:p-6">
          <div className="flex items-center gap-2 text-sm font-black text-foreground">
            <KeyRound size={16} className="text-primary" />
            {labels.demoLogin}
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <Button
              type="button"
              variant="dark"
              onClick={() => quickLogin("teacher")}
              disabled={busy}
            >
              {busy ? <LoaderCircle size={16} className="animate-spin" /> : <Presentation size={16} />}
              {labels.demoTeacher}
            </Button>
            <Button
              type="button"
              variant="mint"
              onClick={() => quickLogin("student")}
              disabled={busy}
            >
              {busy ? <LoaderCircle size={16} className="animate-spin" /> : <GraduationCap size={16} />}
              {labels.demoStudent}
            </Button>
          </div>
          <dl className="mt-3 space-y-1 rounded-xl bg-muted/50 px-3 py-2 text-[11px] text-muted-foreground">
            <div className="flex items-center justify-between gap-3">
              <dt>{labels.demoCredentials}</dt>
              <dd className="font-mono text-foreground" dir="ltr">
                {demo.credentials.teacherEmail} / {demo.credentials.password}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt>{labels.studentRole}</dt>
              <dd className="font-mono text-foreground" dir="ltr">
                {demo.credentials.studentEmail}
              </dd>
            </div>
          </dl>
        </div>
      ) : null}
    </div>
  );
}
