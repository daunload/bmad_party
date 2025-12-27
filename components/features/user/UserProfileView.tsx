import type { User } from '@/lib/db/schema/users';
import Image from 'next/image';
import Link from 'next/link';

interface UserProfileViewProps {
  user: User;
}

// Get popularity rating from user data
function getPopularityRating(user: User): '높음' | '보통' | '낮음' {
  return (user as any).popularityRating || '보통';
}

// Get popularity badge color
function getPopularityBadgeColor(rating: '높음' | '보통' | '낮음'): string {
  switch (rating) {
    case '높음':
      return 'bg-green-100 text-green-800';
    case '보통':
      return 'bg-yellow-100 text-yellow-800';
    case '낮음':
      return 'bg-red-100 text-red-800';
  }
}

export function UserProfileView({ user }: UserProfileViewProps) {
  const popularityRating = getPopularityRating(user);
  const popularityScore = (user as any).popularityScore ? parseFloat((user as any).popularityScore) : null;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-8">
      <div className="z-10 w-full max-w-2xl overflow-hidden rounded-2xl border border-gray-100 shadow-xl">
        <div className="flex flex-col items-center justify-center space-y-4 border-b border-gray-200 bg-white px-4 py-8 text-center sm:px-16">
          {/* Profile Image */}
          {user.profileImage ? (
            <div className="relative h-32 w-32 overflow-hidden rounded-full">
              <Image
                src={user.profileImage}
                alt={user.name || user.email}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gray-200 text-4xl font-semibold text-gray-500">
              {(user.name || user.email)[0].toUpperCase()}
            </div>
          )}

          {/* User Name */}
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              {user.name || '이름 없음'}
            </h1>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>

          {/* Popularity Rating */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">인기도:</span>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${getPopularityBadgeColor(popularityRating)}`}
            >
              {popularityRating}
            </span>
            {popularityScore !== null && (
              <span className="text-xs text-gray-500">({popularityScore.toFixed(2)}점)</span>
            )}
          </div>
        </div>

        {/* Profile Information */}
        <div className="flex flex-col space-y-4 bg-gray-50 px-4 py-8 sm:px-16">
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">프로필 정보</h2>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm font-medium text-gray-500">이메일</dt>
                <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
              </div>
              {user.name && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">이름</dt>
                  <dd className="mt-1 text-sm text-gray-900">{user.name}</dd>
                </div>
              )}
              <div>
                <dt className="text-sm font-medium text-gray-500">가입일</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : '알 수 없음'}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

