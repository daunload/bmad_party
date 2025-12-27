'use server';

import { auth } from 'app/auth';
import { getPartyById } from '@/lib/db/parties';
import { getUserById } from '@/lib/db/users';
import {
  createParticipationRequest,
  getParticipationRequest,
  updateParticipationStatus,
  getApprovedParticipants,
} from '@/lib/db/party-participants';

export interface ApplyToPartyResult {
  success: boolean;
  error?: string;
}

export async function applyToPartyAction(partyId: number): Promise<ApplyToPartyResult> {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      error: '로그인이 필요합니다.',
    };
  }

  const userId = parseInt(session.user.id as string);

  // Check if party exists
  const party = await getPartyById(partyId);
  if (!party) {
    return {
      success: false,
      error: '파티를 찾을 수 없습니다.',
    };
  }

  // Check if user is the host
  if (party.hostId === userId) {
    return {
      success: false,
      error: '자신이 주최한 파티에는 참여 신청할 수 없습니다.',
    };
  }

  // Check if party is still accepting applications
  if (party.status !== '모집 중') {
    return {
      success: false,
      error: '이 파티는 더 이상 참여 신청을 받지 않습니다.',
    };
  }

  // Check if already applied
  const existingRequest = await getParticipationRequest(partyId, userId);
  if (existingRequest) {
    return {
      success: false,
      error: '이미 참여 신청을 하셨습니다.',
    };
  }

  // Check popularity rating if required
  if (party.minPopularityRating) {
    const user = await getUserById(userId);
    if (!user) {
      return {
        success: false,
        error: '사용자 정보를 찾을 수 없습니다.',
      };
    }

    const userRating = (user as any).popularityRating || '보통';
    const ratingOrder = { 낮음: 0, 보통: 1, 높음: 2 };
    const minRatingOrder = ratingOrder[party.minPopularityRating as keyof typeof ratingOrder] ?? 0;
    const userRatingOrder = ratingOrder[userRating as keyof typeof ratingOrder] ?? 1;

    if (userRatingOrder < minRatingOrder) {
      return {
        success: false,
        error: `인기도 기준을 충족하지 않습니다. (필요: ${party.minPopularityRating}, 현재: ${userRating})`,
      };
    }
  }

  // Create participation request
  try {
    await createParticipationRequest({
      partyId,
      userId,
      status: 'pending',
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error('Participation request error:', error);
    return {
      success: false,
      error: '참여 신청 중 오류가 발생했습니다.',
    };
  }
}

export interface UpdateParticipationStatusResult {
  success: boolean;
  error?: string;
}

export async function updateParticipationStatusAction(
  participationId: number,
  status: 'approved' | 'rejected',
  partyId: number
): Promise<UpdateParticipationStatusResult> {
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
      error: '파티 주최자만 참여 신청을 승인/거절할 수 있습니다.',
    };
  }

  // Check if party has capacity
  if (status === 'approved') {
    const approvedCount = (await getApprovedParticipants(partyId)).length;
    if (approvedCount >= party.maxParticipants) {
      return {
        success: false,
        error: '파티 인원이 가득 찼습니다.',
      };
    }
  }

  // Update participation status
  try {
    await updateParticipationStatus(participationId, status);
    return {
      success: true,
    };
  } catch (error) {
    console.error('Update participation status error:', error);
    return {
      success: false,
      error: '상태 변경 중 오류가 발생했습니다.',
    };
  }
}

