// Password validation schema using Zod
// Note: Install zod with: npm install zod

// Password requirements:
// - Minimum 8 characters
// - At least one uppercase letter
// - At least one lowercase letter
// - At least one number
// - At least one special character

export const passwordSchema = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSpecialChar: true,
};

export function validatePassword(password: string): { valid: boolean; error?: string } {
  if (password.length < passwordSchema.minLength) {
    return { valid: false, error: '비밀번호는 최소 8자 이상이어야 합니다.' };
  }

  if (passwordSchema.requireUppercase && !/[A-Z]/.test(password)) {
    return { valid: false, error: '비밀번호는 최소 하나의 대문자를 포함해야 합니다.' };
  }

  if (passwordSchema.requireLowercase && !/[a-z]/.test(password)) {
    return { valid: false, error: '비밀번호는 최소 하나의 소문자를 포함해야 합니다.' };
  }

  if (passwordSchema.requireNumber && !/[0-9]/.test(password)) {
    return { valid: false, error: '비밀번호는 최소 하나의 숫자를 포함해야 합니다.' };
  }

  if (passwordSchema.requireSpecialChar && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return { valid: false, error: '비밀번호는 최소 하나의 특수문자를 포함해야 합니다.' };
  }

  return { valid: true };
}

export function validateEmail(email: string): { valid: boolean; error?: string } {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: '유효한 이메일 주소를 입력해주세요.' };
  }
  return { valid: true };
}

