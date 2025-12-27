// Party status validation and transition rules

import type { PartyStatus } from '@/lib/db/schema/parties';

// Define valid status transitions
const VALID_TRANSITIONS: Record<PartyStatus, PartyStatus[]> = {
  '모집 중': ['모집 완료', '진행 중', '종료'],
  '모집 완료': ['진행 중', '종료'],
  '진행 중': ['종료'],
  '종료': [], // 종료 상태에서는 더 이상 변경 불가
};

export function validateStatusTransition(
  currentStatus: PartyStatus,
  newStatus: PartyStatus
): { valid: boolean; error?: string } {
  // Same status is always valid (no-op)
  if (currentStatus === newStatus) {
    return { valid: true };
  }

  // Check if transition is allowed
  const allowedTransitions = VALID_TRANSITIONS[currentStatus];
  if (!allowedTransitions.includes(newStatus)) {
    return {
      valid: false,
      error: `${currentStatus} 상태에서 ${newStatus} 상태로 변경할 수 없습니다.`,
    };
  }

  return { valid: true };
}

export function getAvailableStatuses(currentStatus: PartyStatus): PartyStatus[] {
  return VALID_TRANSITIONS[currentStatus];
}

