'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  createGuidelineAction,
  updateGuidelineAction,
  deleteGuidelineAction,
} from '@/app/actions/admin-guidelines';
import type { Guideline } from '@/lib/db/schema/admin';

interface GuidelinesManagerProps {
  guidelines: Guideline[];
}

export function GuidelinesManager({ guidelines: initialGuidelines }: GuidelinesManagerProps) {
  const router = useRouter();
  const [guidelines, setGuidelines] = useState(initialGuidelines);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  async function handleCreate(formData: FormData) {
    setIsPending(true);
    setError(null);

    const result = await createGuidelineAction(formData);

    if (result.success && result.guideline) {
      setGuidelines([result.guideline, ...guidelines]);
      setShowCreateForm(false);
    } else {
      setError(result.error || '가이드라인 생성에 실패했습니다.');
    }
    setIsPending(false);
  }

  async function handleUpdate(id: number, formData: FormData) {
    setIsPending(true);
    setError(null);

    const result = await updateGuidelineAction(id, formData);

    if (result.success && result.guideline) {
      setGuidelines(guidelines.map((g) => (g.id === id ? result.guideline! : g)));
    } else {
      setError(result.error || '가이드라인 수정에 실패했습니다.');
    }
    setIsPending(false);
  }

  async function handleDelete(id: number) {
    if (!confirm('정말로 이 가이드라인을 삭제하시겠습니까?')) {
      return;
    }

    setIsPending(true);
    setError(null);

    const result = await deleteGuidelineAction(id);

    if (result.success) {
      setGuidelines(guidelines.filter((g) => g.id !== id));
    } else {
      setError(result.error || '가이드라인 삭제에 실패했습니다.');
    }
    setIsPending(false);
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">{error}</div>
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">가이드라인 목록</h2>
        <button
          type="button"
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          {showCreateForm ? '취소' : '+ 새 가이드라인'}
        </button>
      </div>

      {showCreateForm && (
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">새 가이드라인 생성</h3>
          <form action={handleCreate} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                제목
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                내용
              </label>
              <textarea
                id="content"
                name="content"
                rows={6}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                카테고리
              </label>
              <input
                type="text"
                id="category"
                name="category"
                placeholder="예: community, participation"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={isPending}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
            >
              {isPending ? '생성 중...' : '생성'}
            </button>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {guidelines.map((guideline) => (
          <div key={guideline.id} className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="mb-4 flex items-start justify-between">
              <div className="flex-1">
                <div className="mb-2 flex items-center space-x-2">
                  <h3 className="text-lg font-semibold text-gray-900">{guideline.title}</h3>
                  {guideline.category && (
                    <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600">
                      {guideline.category}
                    </span>
                  )}
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-semibold ${
                      guideline.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {guideline.isActive ? '활성' : '비활성'}
                  </span>
                </div>
                <p className="whitespace-pre-wrap text-sm text-gray-700">{guideline.content}</p>
                <p className="mt-2 text-xs text-gray-500">
                  생성일: {new Date(guideline.createdAt).toLocaleDateString('ko-KR')}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => handleDelete(guideline.id)}
                disabled={isPending}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
              >
                삭제
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

