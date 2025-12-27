'use server';

import { auth } from 'app/auth';
import { redirect } from 'next/navigation';
import { createParty, getPartyById, updateParty, deleteParty } from '@/lib/db/parties';
import { validatePartyCreateData } from '@/lib/validations/party';
import { validateStatusTransition } from '@/lib/validations/party-status';
import type { PartyCategory, PartyStatus, PopularityRating } from '@/lib/db/schema/parties';

export interface CreatePartyResult {
  success: boolean;
  error?: string;
  errors?: Record<string, string>;
  partyId?: number;
}

export async function createPartyAction(formData: FormData): Promise<CreatePartyResult> {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  const hostId = parseInt(session.user.id as string);

  // Extract form data
  const title = formData.get('title') as string;
  const description = formData.get('description') as string | null;
  const date = formData.get('date') as string;
  const time = formData.get('time') as string;
  const location = formData.get('location') as string;
  const maxParticipants = parseInt(formData.get('maxParticipants') as string);
  const category = formData.get('category') as string;
  const imageUrl = formData.get('imageUrl') as string | null;
  const minPopularityRating = (formData.get('minPopularityRating') as string) || null;

  // Validate data
  const validation = validatePartyCreateData({
    title,
    description: description || undefined,
    date,
    time,
    location,
    maxParticipants,
    category,
    imageUrl: imageUrl || undefined,
    minPopularityRating: minPopularityRating ? (minPopularityRating as PopularityRating) : undefined,
  });

  if (!validation.valid) {
    return {
      success: false,
      errors: validation.errors,
    };
  }

  // Create party
  try {
    const party = await createParty({
      title: title.trim(),
      description: description?.trim() || null,
      date,
      time,
      location: location.trim(),
      maxParticipants,
      category: category as PartyCategory,
      imageUrl: imageUrl?.trim() || null,
      status: '모집 중',
      hostId,
      minPopularityRating: minPopularityRating ? (minPopularityRating as PopularityRating) : null,
    });

    return {
      success: true,
      partyId: party.id,
    };
  } catch (error) {
    console.error('Party creation error:', error);
    return {
      success: false,
      error: '파티 생성 중 오류가 발생했습니다.',
    };
  }
}

export interface UpdatePartyResult {
  success: boolean;
  error?: string;
  errors?: Record<string, string>;
  partyId?: number;
}

export async function updatePartyAction(
  partyId: number,
  formData: FormData
): Promise<UpdatePartyResult> {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      error: '로그인이 필요합니다.',
    };
  }

  const userId = parseInt(session.user.id as string);

  // Check if party exists and user is the host
  const party = await getPartyById(partyId);
  if (!party) {
    return {
      success: false,
      error: '파티를 찾을 수 없습니다.',
    };
  }

  if (party.hostId !== userId) {
    return {
      success: false,
      error: '파티를 수정할 권한이 없습니다.',
    };
  }

  // Extract form data
  const title = formData.get('title') as string;
  const description = formData.get('description') as string | null;
  const date = formData.get('date') as string;
  const time = formData.get('time') as string;
  const location = formData.get('location') as string;
  const maxParticipants = parseInt(formData.get('maxParticipants') as string);
  const category = formData.get('category') as string;
  const imageUrl = formData.get('imageUrl') as string | null;
  const minPopularityRating = (formData.get('minPopularityRating') as string) || null;

  // Validate data
  const validation = validatePartyCreateData({
    title,
    description: description || undefined,
    date,
    time,
    location,
    maxParticipants,
    category,
    imageUrl: imageUrl || undefined,
    minPopularityRating: minPopularityRating ? (minPopularityRating as PopularityRating) : undefined,
  });

  if (!validation.valid) {
    return {
      success: false,
      errors: validation.errors,
    };
  }

  // Update party
  try {
    const updatedParty = await updateParty(partyId, {
      title: title.trim(),
      description: description?.trim() || null,
      date,
      time,
      location: location.trim(),
      maxParticipants,
      category: category as PartyCategory,
      imageUrl: imageUrl?.trim() || null,
      minPopularityRating: minPopularityRating ? (minPopularityRating as PopularityRating) : null,
    });

    return {
      success: true,
      partyId: updatedParty.id,
    };
  } catch (error) {
    console.error('Party update error:', error);
    return {
      success: false,
      error: '파티 수정 중 오류가 발생했습니다.',
    };
  }
}

export interface DeletePartyResult {
  success: boolean;
  error?: string;
}

export async function deletePartyAction(partyId: number): Promise<DeletePartyResult> {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      error: '로그인이 필요합니다.',
    };
  }

  const userId = parseInt(session.user.id as string);

  // Check if party exists and user is the host
  const party = await getPartyById(partyId);
  if (!party) {
    return {
      success: false,
      error: '파티를 찾을 수 없습니다.',
    };
  }

  if (party.hostId !== userId) {
    return {
      success: false,
      error: '파티를 삭제할 권한이 없습니다.',
    };
  }

  // Delete party (related data will be handled by cascade delete)
  try {
    await deleteParty(partyId);
    return {
      success: true,
    };
  } catch (error) {
    console.error('Party deletion error:', error);
    return {
      success: false,
      error: '파티 삭제 중 오류가 발생했습니다.',
    };
  }
}

export interface UpdatePartyStatusResult {
  success: boolean;
  error?: string;
}

export async function updatePartyStatusAction(
  partyId: number,
  newStatus: PartyStatus
): Promise<UpdatePartyStatusResult> {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      error: '로그인이 필요합니다.',
    };
  }

  const userId = parseInt(session.user.id as string);

  // Check if party exists and user is the host
  const party = await getPartyById(partyId);
  if (!party) {
    return {
      success: false,
      error: '파티를 찾을 수 없습니다.',
    };
  }

  if (party.hostId !== userId) {
    return {
      success: false,
      error: '파티 상태를 변경할 권한이 없습니다.',
    };
  }

  // Validate status transition
  const validation = validateStatusTransition(party.status, newStatus);
  if (!validation.valid) {
    return {
      success: false,
      error: validation.error || '상태 변경이 허용되지 않습니다.',
    };
  }

  // Update party status
  try {
    await updateParty(partyId, {
      status: newStatus,
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error('Party status update error:', error);
    return {
      success: false,
      error: '파티 상태 변경 중 오류가 발생했습니다.',
    };
  }
}

