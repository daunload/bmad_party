'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { updatePartyStatusAction } from '@/app/actions/party';
import type { PartyStatus } from '@/lib/db/schema/parties';
import { getAvailableStatuses } from '@/lib/validations/party-status';

interface PartyStatusManagerProps {
  partyId: number;
  currentStatus: PartyStatus;
}

const STATUS_LABELS: Record<PartyStatus, string> = {
  '모집 중': '모집 중',
  '모집 완료': '모집 완료',
  '진행 중': '진행 중',
  '종료': '종료',
};

const STATUS_COLORS: Record<PartyStatus, string> = {
  '모집 중': 'bg-green-100 text-green-800 border-green-300',
  '모집 완료': 'bg-yellow-100 text-yellow-800 border-yellow-300',
  '진행 중': 'bg-blue-100 text-blue-800 border-blue-300',
  '종료': 'bg-gray-100 text-gray-800 border-gray-300',
};

export function PartyStatusManager({ partyId, currentStatus }: PartyStatusManagerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const availableStatuses = getAvailableStatuses(currentStatus);

  async function handleStatusChange(newStatus: PartyStatus) {
    setError(null);
    setSuccess(false);

    startTransition(async () => {
      const result = await updatePartyStatusAction(partyId, newStatus);

      if (result.success) {
        setSuccess(true);
        router.refresh();
        // Clear success message after 2 seconds
        setTimeout(() => setSuccess(false), 2000);
      } else {
        setError(result.error || '상태 변경에 실패했습니다.');
      }
    });
  }

  if (availableStatuses.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-700">현재 상태</p>
            <span
              className={`mt-1 inline-block rounded-full border px-3 py-1 text-xs font-semibold ${STATUS_COLORS[currentStatus]}`}
            >
              {STATUS_LABELS[currentStatus]}
            </span>
          </div>
          <p className="text-xs text-gray-500">더 이상 상태를 변경할 수 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      {error && (
        <div className="mb-3 rounded-md bg-red-50 p-3 text-sm text-red-800">{error}</div>
      )}
      {success && (
        <div className="mb-3 rounded-md bg-green-50 p-3 text-sm text-green-800">
          상태가 성공적으로 변경되었습니다.
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-700">현재 상태</p>
          <span
            className={`mt-1 inline-block rounded-full border px-3 py-1 text-xs font-semibold ${STATUS_COLORS[currentStatus]}`}
          >
            {STATUS_LABELS[currentStatus]}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">상태 변경:</span>
          {availableStatuses.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => handleStatusChange(status)}
              disabled={isPending}
              className={`rounded-md border px-3 py-1 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 ${
                STATUS_COLORS[status]
              } hover:opacity-80 focus:ring-gray-500`}
            >
              {STATUS_LABELS[status]}로 변경
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

