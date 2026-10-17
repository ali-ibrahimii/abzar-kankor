"use client";

import { FormEvent, useState } from "react";
import { Check, Mail, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addMessage } from "@/lib/store";

type Labels = {
  formTitle: string;
  formCopy: string;
  name: string;
  namePlaceholder: string;
  email: string;
  emailPlaceholder: string;
  message: string;
  messagePlaceholder: string;
  send: string;
  success: string;
  mailto: string;
  required: string;
};

export default function ContactForm({ labels, email }: { labels: Labels; email: string }) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const entry = {
      id: `${Date.now()}`,
      name: name.trim(),
      email: address.trim(),
      message: message.trim(),
      createdAt: new Date().toISOString(),
    };

    addMessage(entry);

    setSent(true);
    setName("");
    setAddress("");
    setMessage("");
  }

  return (
    <form onSubmit={handleSubmit} className="soft-card p-6 sm:p-8">
      <h2 className="text-lg font-black text-foreground">{labels.formTitle}</h2>
      <p className="mt-1 text-sm leading-7 text-muted-foreground">{labels.formCopy}</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="contact-name">
            {labels.name}
          </label>
          <input
            id="contact-name"
            className="field-input"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder={labels.namePlaceholder}
            required
          />
        </div>
        <div>
          <label className="field-label" htmlFor="contact-email">
            {labels.email}
          </label>
          <input
            id="contact-email"
            type="email"
            className="field-input"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            placeholder={labels.emailPlaceholder}
            dir="ltr"
            required
          />
        </div>
      </div>

      <div className="mt-4">
        <label className="field-label" htmlFor="contact-message">
          {labels.message}
        </label>
        <textarea
          id="contact-message"
          className="field-input min-h-32 resize-y"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder={labels.messagePlaceholder}
          required
        />
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button type="submit">
          <Send size={16} />
          {labels.send}
        </Button>
        <a
          href={`mailto:${email}`}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl px-3 text-xs font-bold text-muted-foreground transition hover:text-primary"
        >
          <Mail size={14} />
          {labels.mailto}
        </a>
      </div>

      {sent ? (
        <p
          className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-300"
          role="status"
        >
          <Check size={14} />
          {labels.success}
        </p>
      ) : null}
    </form>
  );
}
