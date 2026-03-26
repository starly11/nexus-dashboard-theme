export interface AuthFooterLink {
  href: string;
  label: string;
}

export interface LoginFormState {
  email: string;
  password: string;
  remember: boolean;
}

export interface LoginErrors {
  email?: string;
  password?: string;
}

export interface SignupFormState {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface SignupErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export interface PasswordStrength {
  label: string;
  score: number;
  tone: string;
}
