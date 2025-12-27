'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deletePartyAction } from '@/app/actions/party';

interface DeletePartyButtonProps {
  partyId: number;
  partyTitle: string;
}

export function DeletePartyButton({ partyId, partyTitle }: DeletePartyButtonProps) {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setIsDeleting(true);
    setError(null);

    const result = await deletePartyAction(partyId);

    if (result.success) {
      router.push('/parties');
    } else {
      setError(result.error || '파티 삭제에 실패했습니다.');
      setIsDeleting(false);
      setShowConfirm(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setShowConfirm(true)}
        className="inline-flex items-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
      >
        삭제하기
      </button>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900">파티 삭제 확인</h3>
            <p className="mt-2 text-sm text-gray-600">
              정말로 &quot;{partyTitle}&quot; 파티를 삭제하시겠습니까?
            </p>
            <p className="mt-1 text-xs text-gray-500">
              이 작업은 되돌릴 수 없으며, 파티와 관련된 모든 데이터가 삭제됩니다.
            </p>

            {error && (
              <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-800">{error}</div>
            )}

            <div className="mt-6 flex space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowConfirm(false);
                  setError(null);
                }}
                disabled={isDeleting}
                className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {isDeleting ? '삭제 중...' : '삭제'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

