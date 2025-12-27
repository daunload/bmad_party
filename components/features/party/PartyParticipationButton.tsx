'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { applyToPartyAction } from '@/app/actions/party-participation';
import type { Party } from '@/lib/db/schema/parties';

interface PartyParticipationButtonProps {
  party: Party;
  isHost: boolean;
  currentUserId: number | null;
}

export function PartyParticipationButton({
  party,
  isHost,
  currentUserId,
}: PartyParticipationButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (isHost || !currentUserId) {
    return null;
  }

  if (party.status !== '모집 중') {
    return (
      <div className="rounded-md bg-gray-100 px-4 py-2 text-sm text-gray-600">
        {party.status === '모집 완료' ? '모집이 완료되었습니다.' : '이 파티는 더 이상 모집하지 않습니다.'}
      </div>
    );
  }

  async function handleApply() {
    setError(null);
    setSuccess(false);

    startTransition(async () => {
      const result = await applyToPartyAction(party.id);

      if (result.success) {
        setSuccess(true);
        router.refresh();
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(result.error || '참여 신청에 실패했습니다.');
      }
    });
  }

  return (
    <div className="space-y-2">
      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">{error}</div>
      )}
      {success && (
        <div className="rounded-md bg-green-50 p-3 text-sm text-green-800">
          참여 신청이 완료되었습니다. 주최자의 승인을 기다려주세요.
        </div>
      )}
      <button
        type="button"
        onClick={handleApply}
        disabled={isPending || success}
        className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {isPending ? '신청 중...' : success ? '신청 완료' : '참여 신청'}
      </button>
    </div>
  );
}

