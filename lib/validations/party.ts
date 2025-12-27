// Party validation schemas
// Note: Install zod with: npm install zod
// For now, using manual validation functions

export interface PartyCreateData {
  title: string;
  description?: string;
  date: string;
  time: string;
  location: string;
  maxParticipants: number;
  category: string;
  imageUrl?: string;
  minPopularityRating?: '높음' | '보통' | '낮음';
}

export function validatePartyTitle(title: string): { valid: boolean; error?: string } {
  if (!title || title.trim().length === 0) {
    return { valid: false, error: '제목을 입력해주세요.' };
  }

  if (title.length > 200) {
    return { valid: false, error: '제목은 200자 이하여야 합니다.' };
  }

  return { valid: true };
}

export function validatePartyDate(date: string): { valid: boolean; error?: string } {
  if (!date) {
    return { valid: false, error: '날짜를 선택해주세요.' };
  }

  const selectedDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (selectedDate < today) {
    return { valid: false, error: '과거 날짜는 선택할 수 없습니다.' };
  }

  return { valid: true };
}

export function validatePartyTime(time: string): { valid: boolean; error?: string } {
  if (!time) {
    return { valid: false, error: '시간을 입력해주세요.' };
  }

  // Basic time format validation (HH:MM)
  const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
  if (!timeRegex.test(time)) {
    return { valid: false, error: '올바른 시간 형식(HH:MM)을 입력해주세요.' };
  }

  return { valid: true };
}

export function validatePartyLocation(location: string): { valid: boolean; error?: string } {
  if (!location || location.trim().length === 0) {
    return { valid: false, error: '장소를 입력해주세요.' };
  }

  if (location.length > 255) {
    return { valid: false, error: '장소는 255자 이하여야 합니다.' };
  }

  return { valid: true };
}

export function validateMaxParticipants(maxParticipants: number): { valid: boolean; error?: string } {
  if (!maxParticipants || isNaN(maxParticipants)) {
    return { valid: false, error: '인원을 입력해주세요.' };
  }

  if (maxParticipants < 2) {
    return { valid: false, error: '최소 인원은 2명 이상이어야 합니다.' };
  }

  if (maxParticipants > 100) {
    return { valid: false, error: '최대 인원은 100명 이하여야 합니다.' };
  }

  return { valid: true };
}

export function validatePartyCategory(category: string): { valid: boolean; error?: string } {
  const validCategories = [
    '보드게임',
    '네트워킹',
    '취미 활동',
    '스포츠',
    '음식/맛집',
    '문화/예술',
    '여행',
    '기타',
  ];

  if (!category || !validCategories.includes(category)) {
    return { valid: false, error: '유효한 카테고리를 선택해주세요.' };
  }

  return { valid: true };
}

export function validatePartyImageUrl(imageUrl?: string): { valid: boolean; error?: string } {
  if (!imageUrl || imageUrl.trim().length === 0) {
    return { valid: true }; // Image is optional
  }

  try {
    new URL(imageUrl);
    return { valid: true };
  } catch {
    return { valid: false, error: '유효한 이미지 URL을 입력해주세요.' };
  }
}

export function validateMinPopularityRating(
  rating?: '높음' | '보통' | '낮음'
): { valid: boolean; error?: string } {
  if (!rating || rating.trim().length === 0) {
    return { valid: true }; // Optional
  }

  const validRatings = ['높음', '보통', '낮음'];
  if (!validRatings.includes(rating)) {
    return { valid: false, error: '유효한 인기도 기준을 선택해주세요.' };
  }

  return { valid: true };
}

export function validatePartyCreateData(data: PartyCreateData): { valid: boolean; errors?: Record<string, string> } {
  const errors: Record<string, string> = {};

  const titleValidation = validatePartyTitle(data.title);
  if (!titleValidation.valid) {
    errors.title = titleValidation.error!;
  }

  const dateValidation = validatePartyDate(data.date);
  if (!dateValidation.valid) {
    errors.date = dateValidation.error!;
  }

  const timeValidation = validatePartyTime(data.time);
  if (!timeValidation.valid) {
    errors.time = timeValidation.error!;
  }

  const locationValidation = validatePartyLocation(data.location);
  if (!locationValidation.valid) {
    errors.location = locationValidation.error!;
  }

  const participantsValidation = validateMaxParticipants(data.maxParticipants);
  if (!participantsValidation.valid) {
    errors.maxParticipants = participantsValidation.error!;
  }

  const categoryValidation = validatePartyCategory(data.category);
  if (!categoryValidation.valid) {
    errors.category = categoryValidation.error!;
  }

  const imageValidation = validatePartyImageUrl(data.imageUrl);
  if (!imageValidation.valid) {
    errors.imageUrl = imageValidation.error!;
  }

  const popularityRatingValidation = validateMinPopularityRating(data.minPopularityRating);
  if (!popularityRatingValidation.valid) {
    errors.minPopularityRating = popularityRatingValidation.error!;
  }

  if (Object.keys(errors).length > 0) {
    return { valid: false, errors };
  }

  return { valid: true };
}

