import { memo, useEffect, useRef, useState, type FormEvent } from "react";
import { Check, Loader2, Send } from "lucide-react";
import { motion } from "framer-motion";
import { SectionHeader } from "../components/common/SectionHeader";
import { CONTACT_COPY, SECTION_LABELS, SITE } from "../content/siteContent";
import { useReveal } from "../hooks/useReveal";
import { revealContainer, revealItem } from "../utils/animation";

type FormValues = {
  name: string;
  email: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;
type SubmitState = "idle" | "loading" | "success";

const initialValues: FormValues = {
  name: "",
  email: "",
  message: "",
};

const ContactComponent = () => {
  const { ref, isInView } = useReveal();
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const submitTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (submitTimeoutRef.current) {
        window.clearTimeout(submitTimeoutRef.current);
      }
    };
  }, []);

  const validate = () => {
    const nextErrors: FormErrors = {};
    const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email);

    if (!values.name.trim()) nextErrors.name = CONTACT_COPY.errors.name;
    if (!emailIsValid) nextErrors.email = CONTACT_COPY.errors.email;
    if (values.message.trim().length < 12) {
      nextErrors.message = CONTACT_COPY.errors.message;
    }

    return nextErrors;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    setSubmitState("loading");
    if (submitTimeoutRef.current) {
      window.clearTimeout(submitTimeoutRef.current);
    }

    submitTimeoutRef.current = window.setTimeout(() => {
      setSubmitState("success");
      setValues(initialValues);
    }, 1100);
  };

  const fieldClass = (field: keyof FormValues) =>
    `mt-2 w-full rounded-md border bg-base/65 px-4 py-3 font-body text-sm text-primary outline-none transition placeholder:text-muted ${
      errors[field]
        ? "border-rose-400/70 focus:border-rose-300"
        : "border-white/10 focus:border-accent focus:shadow-cyan-sm"
    }`;

  return (
    <motion.section
      animate={isInView ? "visible" : "hidden"}
      className="section-frame"
      id="contact"
      initial="hidden"
      ref={ref}
      variants={revealContainer}
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeader heading={CONTACT_COPY.heading} label={SECTION_LABELS.contact} />

        <div className="grid gap-6 lg:grid-cols-[0.38fr_0.62fr]">
          <motion.aside
            className="command-border glass-panel relative overflow-hidden rounded-lg p-6 sm:p-8"
            variants={revealItem}
          >
            <div className="absolute inset-x-0 top-0 h-px signal-line" />
            <p className="font-body text-lg leading-8 text-secondary">
              {CONTACT_COPY.intro}
            </p>
            <p className="mt-6 font-mono text-xs uppercase tracking-signal text-accent">
              {CONTACT_COPY.response}
            </p>

            <div className="mt-8 space-y-3">
              {CONTACT_COPY.channelCards.map((card) => (
                <div
                  className="rounded-lg border border-white/10 bg-base/55 p-4"
                  key={card.label}
                >
                  <p className="font-mono text-[10px] uppercase tracking-signal text-muted">
                    {card.label}
                  </p>
                  <p className="mt-2 break-words font-body text-sm text-primary">
                    {card.value}
                  </p>
                </div>
              ))}
            </div>
          </motion.aside>

          <motion.form
            className="glass-panel rounded-lg p-5 sm:p-7"
            onSubmit={handleSubmit}
            variants={revealItem}
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="font-mono text-xs uppercase tracking-signal text-secondary">
                {CONTACT_COPY.labels.name}
                <input
                  className={fieldClass("name")}
                  onChange={(event) => {
                    setValues((current) => ({ ...current, name: event.target.value }));
                    setErrors((current) => ({ ...current, name: undefined }));
                    setSubmitState("idle");
                  }}
                  placeholder={CONTACT_COPY.placeholders.name}
                  value={values.name}
                />
                {errors.name ? (
                  <span className="mt-2 block text-[11px] normal-case tracking-normal text-rose-300">
                    {errors.name}
                  </span>
                ) : null}
              </label>

              <label className="font-mono text-xs uppercase tracking-signal text-secondary">
                {CONTACT_COPY.labels.email}
                <input
                  className={fieldClass("email")}
                  onChange={(event) => {
                    setValues((current) => ({ ...current, email: event.target.value }));
                    setErrors((current) => ({ ...current, email: undefined }));
                    setSubmitState("idle");
                  }}
                  placeholder={CONTACT_COPY.placeholders.email}
                  type="email"
                  value={values.email}
                />
                {errors.email ? (
                  <span className="mt-2 block text-[11px] normal-case tracking-normal text-rose-300">
                    {errors.email}
                  </span>
                ) : null}
              </label>
            </div>

            <label className="mt-5 block font-mono text-xs uppercase tracking-signal text-secondary">
              {CONTACT_COPY.labels.message}
              <textarea
                className={`${fieldClass("message")} min-h-44 resize-none`}
                onChange={(event) => {
                  setValues((current) => ({ ...current, message: event.target.value }));
                  setErrors((current) => ({ ...current, message: undefined }));
                  setSubmitState("idle");
                }}
                placeholder={CONTACT_COPY.placeholders.message}
                value={values.message}
              />
              {errors.message ? (
                <span className="mt-2 block text-[11px] normal-case tracking-normal text-rose-300">
                  {errors.message}
                </span>
              ) : null}
            </label>

            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <button
                className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-cta-gradient px-6 py-3 font-body text-sm font-semibold text-[#061017] shadow-cyan transition disabled:cursor-not-allowed disabled:opacity-80 sm:w-auto"
                disabled={submitState === "loading"}
                type="submit"
              >
                {submitState === "loading" ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : submitState === "success" ? (
                  <Check size={16} />
                ) : (
                  <Send size={16} />
                )}
                {CONTACT_COPY.submit[submitState]}
              </button>

              <p className="text-center font-body text-sm text-secondary sm:text-right">
                {CONTACT_COPY.direct}{" "}
                <a className="text-accent transition hover:text-primary" href={SITE.links.email}>
                  {SITE.email}
                </a>
              </p>
            </div>
          </motion.form>
        </div>
      </div>
    </motion.section>
  );
};

export const Contact = memo(ContactComponent);
