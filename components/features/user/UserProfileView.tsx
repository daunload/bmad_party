import type { User } from '@/lib/db/schema/users';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/layout/Header';

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
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="bg-gradient-to-br from-slate-50 via-blue-50/50 to-purple-50/50 py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
            {/* Profile Header */}
            <div className="border-b border-gray-100 px-8 py-12 text-center">
              {/* Profile Image */}
              {user.profileImage ? (
                <div className="relative mx-auto mb-6 h-32 w-32 overflow-hidden rounded-full ring-4 ring-white shadow-lg">
                  <Image
                    src={user.profileImage}
                    alt={user.name || user.email}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="mx-auto mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-accent-500 text-4xl font-semibold text-white ring-4 ring-white shadow-lg">
                  {(user.name || user.email)[0].toUpperCase()}
                </div>
              )}

              {/* User Name */}
              <div className="mb-4">
                <h1 className="mb-2 text-3xl font-bold text-gray-900">
                  {user.name || '이름 없음'}
                </h1>
                <p className="text-lg text-gray-600">{user.email}</p>
              </div>

              {/* Popularity Rating */}
              <div className="flex items-center justify-center gap-2">
                <span className="text-sm font-medium text-gray-600">인기도:</span>
                <span
                  className={`rounded-full px-4 py-1.5 text-sm font-semibold ${getPopularityBadgeColor(popularityRating)}`}
                >
                  {popularityRating}
                </span>
                {popularityScore !== null && (
                  <span className="text-sm text-gray-500">({popularityScore.toFixed(2)}점)</span>
                )}
              </div>
            </div>

            {/* Profile Information */}
            <div className="p-8">
              <h2 className="mb-6 text-2xl font-bold text-gray-900">프로필 정보</h2>
              <dl className="space-y-6">
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <dt className="mb-2 text-sm font-medium text-gray-600">이메일</dt>
                  <dd className="text-base text-gray-900">{user.email}</dd>
                </div>
                {user.name && (
                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                    <dt className="mb-2 text-sm font-medium text-gray-600">이름</dt>
                    <dd className="text-base text-gray-900">{user.name}</dd>
                  </div>
                )}
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <dt className="mb-2 text-sm font-medium text-gray-600">가입일</dt>
                  <dd className="text-base text-gray-900">
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
    </div>
  );
}

