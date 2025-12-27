// User validation schemas
// Note: Install zod with: npm install zod
// For now, using manual validation functions

export interface UserProfileUpdate {
  name?: string;
  profileImage?: string;
}

export function validateName(name: string | null | undefined): { valid: boolean; error?: string } {
  if (!name) {
    return { valid: true }; // Name is optional
  }

  if (name.length < 2) {
    return { valid: false, error: '이름은 최소 2자 이상이어야 합니다.' };
  }

  if (name.length > 100) {
    return { valid: false, error: '이름은 100자 이하여야 합니다.' };
  }

  return { valid: true };
}

export function validateProfileImage(url: string | null | undefined): { valid: boolean; error?: string } {
  if (!url) {
    return { valid: true }; // Profile image is optional
  }

  // Basic URL validation
  try {
    new URL(url);
    return { valid: true };
  } catch {
    return { valid: false, error: '유효한 이미지 URL을 입력해주세요.' };
  }
}

