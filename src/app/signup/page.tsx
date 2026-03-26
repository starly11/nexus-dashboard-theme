"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { AuthProviderButton } from "@/components/auth/AuthProviderButton";
import { AuthInput } from "@/components/auth/AuthInput";
import { AuthShell } from "@/components/auth/AuthShell";
import { AuthStatusMessage } from "@/components/auth/AuthStatusMessage";
import { PasswordVisibilityButton } from "@/components/auth/PasswordVisibilityButton";
import {
  defaultSignupStatusMessage,
  initialSignupState,
  signupFooterBadges,
} from "@/data/auth";
import { isValidEmail, sleep } from "@/lib/utils";
import type { PasswordStrength, SignupErrors, SignupFormState } from "@/types/auth";

function getPasswordStrength(password: string): PasswordStrength {
  if (!password) {
    return { label: "Waiting for input", score: 0, tone: "bg-outline-variant/30" };
  }

  let score = 0;

  if (password.length >= 8) {
    score += 1;
  }

  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) {
    score += 1;
  }

  if (/\d/.test(password)) {
    score += 1;
  }

  if (/[^A-Za-z0-9]/.test(password)) {
    score += 1;
  }

  if (score <= 1) {
    return { label: "Weak", score, tone: "bg-error" };
  }

  if (score <= 2) {
    return { label: "Fair", score, tone: "bg-warning" };
  }

  if (score === 3) {
    return { label: "Strong", score, tone: "bg-info" };
  }

  return { label: "Excellent", score, tone: "bg-success" };
}

function validateSignupForm(values: SignupFormState): SignupErrors {
  const errors: SignupErrors = {};

  if (!values.fullName.trim()) {
    errors.fullName = "Full name is required.";
  } else if (values.fullName.trim().length < 3) {
    errors.fullName = "Use at least 3 characters.";
  }

  if (!values.email.trim()) {
    errors.email = "Corporate email is required.";
  } else if (!isValidEmail(values.email)) {
    errors.email = "Enter a valid work email.";
  }

  if (!values.password.trim()) {
    errors.password = "Password is required.";
  } else if (values.password.length < 8) {
    errors.password = "Use at least 8 characters.";
  }

  if (!values.confirmPassword.trim()) {
    errors.confirmPassword = "Confirm your password.";
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = "Passwords do not match.";
  }

  return errors;
}

export default function SignupPage(): React.JSX.Element {
  const router = useRouter();
  const [formState, setFormState] = useState<SignupFormState>(initialSignupState);
  const [errors, setErrors] = useState<SignupErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>(defaultSignupStatusMessage);

  const passwordStrength = getPasswordStrength(formState.password);

  function updateField<Key extends keyof SignupFormState>(key: Key, value: SignupFormState[Key]): void {
    setFormState((currentState) => ({
      ...currentState,
      [key]: value,
    }));
    setErrors((currentErrors) => ({
      ...currentErrors,
      [key]: undefined,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    const nextErrors = validateSignupForm(formState);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setStatusMessage("Finish the highlighted fields to create your workspace.");
      return;
    }

    setIsSubmitting(true);
    setStatusMessage("Provisioning your Nexus instance and securing the workspace...");

    await new Promise<void>((resolve) => {
      window.setTimeout((): void => resolve(), 1050);
    });

    setIsSubmitting(false);
    setStatusMessage("Workspace created. Redirecting you to sign in...");
    await sleep(450);
    router.push("/login");
  }

  function handleGoogleContinue(): void {
    setStatusMessage("Identity provider onboarding is available as a connected demo action in this template.");
  }

  return (
    <AuthShell
      brandSubtitle="B2B Analytics Precision Engineered"
      footerBadges={[...signupFooterBadges]}
      afterCard={
        <p className="text-center text-xs text-on-surface-variant">
          Already operational?
          <Link href="/login" className="ml-1 font-semibold text-primary transition-colors duration-200 hover:text-primary-container">
            Login to Instance
          </Link>
        </p>
      }
    >
      <section className="nocturnal-glass rounded-auth border border-outline-variant/15 p-8 shadow-panel sm:p-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-on-surface">Architect Your Future</h1>
          <p className="mt-2 text-sm text-on-surface-variant">Join the elite network of data-driven enterprises.</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <AuthInput
            id="fullName"
            label="Full Name"
            name="fullName"
            type="text"
            value={formState.fullName}
            placeholder="ALEXANDER VANCE"
            autoComplete="name"
            icon="person"
            error={errors.fullName ?? null}
            onChange={(value): void => updateField("fullName", value)}
          />

          <AuthInput
            id="email"
            label="Corporate Email"
            name="email"
            type="email"
            value={formState.email}
            placeholder="vance@nexus-saas.com"
            autoComplete="email"
            icon="alternate_email"
            error={errors.email ?? null}
            onChange={(value): void => updateField("email", value)}
          />

          <div className="grid gap-4 md:grid-cols-2">
            <AuthInput
              id="password"
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formState.password}
              placeholder="••••••••"
              autoComplete="new-password"
              error={errors.password ?? null}
              onChange={(value): void => updateField("password", value)}
              rightElement={
                <PasswordVisibilityButton
                  isVisible={showPassword}
                  onToggle={(): void => setShowPassword((currentValue) => !currentValue)}
                  showLabel="Show password"
                  hideLabel="Hide password"
                />
              }
            />

            <AuthInput
              id="confirmPassword"
              label="Confirm"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={formState.confirmPassword}
              placeholder="••••••••"
              autoComplete="new-password"
              error={errors.confirmPassword ?? null}
              onChange={(value): void => updateField("confirmPassword", value)}
              rightElement={
                <PasswordVisibilityButton
                  isVisible={showConfirmPassword}
                  onToggle={(): void => setShowConfirmPassword((currentValue) => !currentValue)}
                  showLabel="Show confirm password"
                  hideLabel="Hide confirm password"
                />
              }
            />
          </div>

          <div className="rounded-xl border border-outline-variant/10 bg-surface-container-low px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono-data text-2xs uppercase tracking-label-xl text-outline">Password strength</span>
              <span className="text-xs font-semibold text-on-surface">{passwordStrength.label}</span>
            </div>
            <div className="mt-3 grid grid-cols-4 gap-2" aria-hidden="true">
              {Array.from({ length: 4 }).map((_, index) => (
                <span
                  key={`strength-${index + 1}`}
                  className={`h-1.5 rounded-full ${index < passwordStrength.score ? passwordStrength.tone : "bg-outline-variant/30"}`}
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-container px-4 py-4 text-sm font-bold text-on-primary transition-all duration-200 hover:brightness-110 active:scale-[0.985] disabled:cursor-wait disabled:opacity-80"
          >
            {isSubmitting ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-on-primary/25 border-t-on-primary" aria-hidden="true" />
                Creating Workspace
              </>
            ) : (
              <>
                Create Account
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </>
            )}
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-outline-variant/10" />
          </div>
          <div className="relative flex justify-center">
            <span className="rounded-full bg-surface-container px-4 py-1 font-mono-data text-2xs uppercase tracking-label-xl text-outline/70">
              Or Establish via Identity Provider
            </span>
          </div>
        </div>

        <AuthProviderButton
          label="Continue with Google"
          onClick={handleGoogleContinue}
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-outline-variant/10 bg-surface-container-high px-4 py-4 text-sm font-bold text-on-surface transition-all duration-200 hover:bg-surface-bright"
          iconClassName="h-4 w-4"
        />

        <AuthStatusMessage message={statusMessage} tone="secondary" />
      </section>
    </AuthShell>
  );
}
