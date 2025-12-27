'use server';

import { auth } from 'app/auth';
import { createGuideline, updateGuideline, deleteGuideline } from '@/lib/db/admin';
import type { Guideline } from '@/lib/db/schema/admin';

export interface GuidelineActionResult {
  success: boolean;
  error?: string;
  guideline?: Guideline;
}

export async function createGuidelineAction(
  formData: FormData
): Promise<GuidelineActionResult> {
  const session = await auth();

  if (!session?.user || session.user.role !== '관리자') {
    return {
      success: false,
      error: '관리자 권한이 필요합니다.',
    };
  }

  const adminId = parseInt(session.user.id as string);
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const category = formData.get('category') as string | null;

  if (!title || !content) {
    return {
      success: false,
      error: '제목과 내용을 입력해주세요.',
    };
  }

  try {
    const guideline = await createGuideline({
      title,
      content,
      category: category || null,
      isActive: true,
      createdBy: adminId,
    });

    return {
      success: true,
      guideline,
    };
  } catch (error) {
    console.error('Create guideline error:', error);
    return {
      success: false,
      error: '가이드라인 생성 중 오류가 발생했습니다.',
    };
  }
}

export async function updateGuidelineAction(
  id: number,
  formData: FormData
): Promise<GuidelineActionResult> {
  const session = await auth();

  if (!session?.user || session.user.role !== '관리자') {
    return {
      success: false,
      error: '관리자 권한이 필요합니다.',
    };
  }

  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const category = formData.get('category') as string | null;
  const isActive = formData.get('isActive') === 'true';

  try {
    const guideline = await updateGuideline(id, {
      title,
      content,
      category: category || null,
      isActive,
    });

    return {
      success: true,
      guideline,
    };
  } catch (error) {
    console.error('Update guideline error:', error);
    return {
      success: false,
      error: '가이드라인 수정 중 오류가 발생했습니다.',
    };
  }
}

export async function deleteGuidelineAction(id: number): Promise<GuidelineActionResult> {
  const session = await auth();

  if (!session?.user || session.user.role !== '관리자') {
    return {
      success: false,
      error: '관리자 권한이 필요합니다.',
    };
  }

  try {
    await deleteGuideline(id);
    return {
      success: true,
    };
  } catch (error) {
    console.error('Delete guideline error:', error);
    return {
      success: false,
      error: '가이드라인 삭제 중 오류가 발생했습니다.',
    };
  }
}

