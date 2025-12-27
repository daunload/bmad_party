'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { updateParticipationStatusAction } from '@/app/actions/party-participation';
import type { PartyParticipant } from '@/lib/db/schema/party_participants';
import type { User } from '@/lib/db/schema/users';

interface ParticipationRequestsProps {
  requests: Array<PartyParticipant & { user: User }>;
  partyId: number;
}

export function ParticipationRequests({ requests, partyId }: ParticipationRequestsProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleStatusChange(participationId: number, status: 'approved' | 'rejected') {
    setIsPending(participationId);
    setError(null);

    const result = await updateParticipationStatusAction(participationId, status, partyId);

    if (result.success) {
      router.refresh();
    } else {
      setError(result.error || '상태 변경에 실패했습니다.');
      setIsPending(null);
    }
  }

  if (requests.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <p className="text-sm text-gray-600">대기 중인 참여 신청이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">{error}</div>
      )}
      {requests.map((request) => (
        <div
          key={request.id}
          className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4"
        >
          <div className="flex items-center space-x-3">
            {request.user.profileImage ? (
              <div className="relative h-12 w-12 overflow-hidden rounded-full">
                <Image
                  src={request.user.profileImage}
                  alt={request.user.name || request.user.email}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              </div>
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 text-lg font-semibold text-gray-500">
                {(request.user.name || request.user.email)[0].toUpperCase()}
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-gray-900">
                {request.user.name || '이름 없음'}
              </p>
              <p className="text-xs text-gray-500">{request.user.email}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => handleStatusChange(request.id, 'approved')}
              disabled={isPending === request.id}
              className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isPending === request.id ? '처리 중...' : '승인'}
            </button>
            <button
              type="button"
              onClick={() => handleStatusChange(request.id, 'rejected')}
              disabled={isPending === request.id}
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
            >
              거절
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

