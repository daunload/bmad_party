'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { updateProfile } from '@/app/actions/profile';
import type { User } from '@/lib/db/schema/users';

interface ProfileFormProps {
  user: User;
}

export function ProfileForm({ user }: ProfileFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError(null);
    setSuccess(false);

    startTransition(async () => {
      try {
        const result = await updateProfile(formData);
        
        if (result.error) {
          setError(result.error);
        } else {
          setSuccess(true);
          router.refresh();
        }
      } catch (err) {
        setError('프로필 업데이트 중 오류가 발생했습니다.');
      }
    });
  }

  return (
    <form action={handleSubmit} className="flex flex-col space-y-4 bg-gray-50 px-4 py-8 sm:px-16">
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {success && (
        <div className="rounded-md bg-green-50 p-4">
          <p className="text-sm text-green-800">프로필이 성공적으로 업데이트되었습니다.</p>
        </div>
      )}

      <div>
        <label
          htmlFor="email"
          className="block text-xs font-medium text-gray-700 uppercase mb-1"
        >
          이메일
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={user.email}
          disabled
          className="mt-1 block w-full appearance-none rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-gray-500 shadow-sm sm:text-sm"
        />
        <p className="mt-1 text-xs text-gray-500">이메일은 변경할 수 없습니다.</p>
      </div>

      <div>
        <label
          htmlFor="name"
          className="block text-xs font-medium text-gray-700 uppercase mb-1"
        >
          이름
        </label>
        <input
          id="name"
          name="name"
          type="text"
          defaultValue={user.name || ''}
          placeholder="이름을 입력하세요"
          className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="profileImage"
          className="block text-xs font-medium text-gray-700 uppercase mb-1"
        >
          프로필 이미지 URL
        </label>
        <input
          id="profileImage"
          name="profileImage"
          type="url"
          defaultValue={user.profileImage || ''}
          placeholder="https://example.com/image.jpg"
          className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
        />
        <p className="mt-1 text-xs text-gray-500">프로필 이미지 URL을 입력하세요.</p>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="flex h-10 w-full items-center justify-center rounded-md border text-sm transition-all focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 bg-black text-white hover:bg-gray-800"
      >
        {isPending ? '저장 중...' : '프로필 저장'}
      </button>
    </form>
  );
}

