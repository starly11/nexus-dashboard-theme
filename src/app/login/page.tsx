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
  defaultLoginStatusMessage,
  initialLoginState,
  loginFooterLinks,
} from "@/data/auth";
import { isValidEmail, sleep } from "@/lib/utils";
import type { LoginErrors, LoginFormState } from "@/types/auth";

function validateLoginForm(values: LoginFormState): LoginErrors {
  const errors: LoginErrors = {};

  if (!values.email.trim()) {
    errors.email = "Email is required.";
  } else if (!isValidEmail(values.email)) {
    errors.email = "Enter a valid work email.";
  }

  if (!values.password.trim()) {
    errors.password = "Security key is required.";
  } else if (values.password.length < 8) {
    errors.password = "Use at least 8 characters.";
  }

  return errors;
}

export default function LoginPage(): React.JSX.Element {
  const router = useRouter();
  const [formState, setFormState] = useState<LoginFormState>(initialLoginState);
  const [errors, setErrors] = useState<LoginErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>(defaultLoginStatusMessage);

  function updateField<Key extends keyof LoginFormState>(key: Key, value: LoginFormState[Key]): void {
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

    const nextErrors = validateLoginForm(formState);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setStatusMessage("Double-check the highlighted fields before accessing the dashboard.");
      return;
    }

    setIsSubmitting(true);
    setStatusMessage("Verifying credentials and preparing your workspace...");

    await new Promise<void>((resolve) => {
      window.setTimeout((): void => resolve(), 950);
    });

    setIsSubmitting(false);
    setStatusMessage("Access granted. Redirecting to the dashboard preview...");
    await sleep(400);
    router.push("/dashboard");
  }

  function handleGoogleContinue(): void {
    setStatusMessage("Google SSO is connected as a demo action in this template preview.");
  }

  return (
    <AuthShell
      brandSubtitle="Precision Engineered Analytics"
      showBrandIcon
      footerLinks={loginFooterLinks}
      afterCard={
        <p className="text-center text-sm text-on-surface-variant">
          New to the ecosystem?
          <Link href="/signup" className="ml-1 font-semibold text-primary transition-colors duration-200 hover:text-primary-container">
            Create an account
          </Link>
        </p>
      }
    >
      <section className="nocturnal-glass rounded-auth border border-outline-variant/15 p-8 shadow-panel sm:p-9">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-on-surface">Welcome Back</h1>
          <p className="mt-1 text-sm font-medium text-on-surface-variant">
            Enter your credentials to access the terminal.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <AuthInput
            id="email"
            label="Email Address"
            name="email"
            type="email"
            value={formState.email}
            placeholder="name@nexus-saas.com"
            autoComplete="email"
            error={errors.email ?? null}
            onChange={(value): void => updateField("email", value)}
          />

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <label htmlFor="password" className="ml-1 font-mono-data text-2xs uppercase tracking-label-4xl text-outline">
                Security Key
              </label>
              <button
                type="button"
                onClick={(): void => setStatusMessage("Password reset is available as part of the full production flow.")}
                className="font-mono-data text-2xs uppercase tracking-label-2xl text-primary transition-colors duration-200 hover:text-primary-container"
                aria-label="Request password recovery instructions"
              >
                Forgot password?
              </button>
            </div>
            <AuthInput
              id="password"
              label="Security Key"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formState.password}
              placeholder="••••••••"
              autoComplete="current-password"
              error={errors.password ?? null}
              hideLabel
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
          </div>

          <label className="flex items-center gap-3" htmlFor="remember">
            <input
              id="remember"
              type="checkbox"
              checked={formState.remember}
              onChange={(event): void => updateField("remember", event.target.checked)}
              className="h-4 w-4 rounded border-outline-variant/30 bg-surface-container-lowest text-primary-container focus:ring-2 focus:ring-primary/20"
            />
            <span className="text-xs font-medium text-on-surface-variant">Stay authenticated for 30 days</span>
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-container px-4 py-3.5 text-sm font-bold text-on-primary transition-all duration-200 hover:brightness-110 active:scale-[0.985] disabled:cursor-wait disabled:opacity-80"
          >
            {isSubmitting ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-on-primary/25 border-t-on-primary" aria-hidden="true" />
                Authenticating
              </>
            ) : (
              "Sign In to Dashboard"
            )}
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-outline-variant/10" />
          </div>
          <div className="relative flex justify-center">
            <span className="rounded-full bg-surface-container px-4 py-1 font-mono-data text-2xs uppercase tracking-label-2xl text-outline/70">
              Secure OAuth 2.0
            </span>
          </div>
        </div>

        <AuthProviderButton
          label="Continue with Google"
          onClick={handleGoogleContinue}
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-outline-variant/20 bg-surface-container-low px-4 py-3.5 text-sm font-semibold text-on-surface transition-all duration-200 hover:-translate-y-0.5 hover:bg-surface-container-high"
        />

        <AuthStatusMessage message={statusMessage} />
      </section>
    </AuthShell>
  );
}
