import type { AuthFooterLink, LoginFormState, SignupFormState } from "@/types/auth";

export const initialLoginState: LoginFormState = {
  email: "",
  password: "",
  remember: true,
};

export const loginFooterLinks: AuthFooterLink[] = [
  { href: "/login", label: "Privacy Policy" },
  { href: "/signup", label: "Terms of Service" },
  { href: "/support", label: "Security" },
];

export const defaultLoginStatusMessage =
  "Use any valid email and an 8+ character password to preview the auth flow.";

export const initialSignupState: SignupFormState = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export const signupFooterBadges = ["ISO 27001 Certified", "AES-256 Encrypted", "SLA 99.99%"] as const;
export const defaultSignupStatusMessage =
  "Create a workspace owner account to preview the onboarding flow.";
