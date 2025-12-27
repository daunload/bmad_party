'use server';

import { auth } from 'app/auth';
import { redirect } from 'next/navigation';
import { updateUserProfile } from '@/lib/db/users';
import { validateName, validateProfileImage } from '@/lib/validations/user';

export async function updateProfile(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  const userId = parseInt(session.user.id as string);
  const name = formData.get('name') as string | null;
  const profileImage = formData.get('profileImage') as string | null;

  // Validate name
  const nameValidation = validateName(name);
  if (!nameValidation.valid) {
    return { error: nameValidation.error };
  }

  // Validate profile image
  const imageValidation = validateProfileImage(profileImage);
  if (!imageValidation.valid) {
    return { error: imageValidation.error };
  }

  // Update profile
  try {
    const updateData: { name?: string; profileImage?: string } = {};
    
    if (name !== null && name.trim() !== '') {
      updateData.name = name.trim();
    }

    if (profileImage !== null && profileImage.trim() !== '') {
      updateData.profileImage = profileImage.trim();
    }

    await updateUserProfile(userId, updateData);

    return { success: true };
  } catch (error) {
    console.error('Profile update error:', error);
    return { error: '프로필 업데이트 중 오류가 발생했습니다.' };
  }
}

