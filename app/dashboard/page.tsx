import { auth } from 'app/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header';

export default async function Dashboard() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="bg-gradient-to-br from-slate-50 via-blue-50/50 to-purple-50/50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Welcome Card */}
          <div className="mb-12 rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
            <div className="mb-4 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 text-3xl shadow-lg shadow-primary-500/20">
                👋
              </div>
            </div>
            <h1 className="mb-2 text-3xl font-bold text-gray-900">환영합니다!</h1>
            <p className="text-lg text-gray-600">
              {session.user.email}님, 파티 커뮤니티에 오신 것을 환영합니다
            </p>
          </div>

          {/* Quick Actions */}
          <div className="mb-12">
            <h2 className="mb-6 text-2xl font-bold text-gray-900">빠른 시작</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              <Link
                href="/parties"
                className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all duration-300 hover:border-emerald-300 hover:shadow-lg"
              >
                <div className="relative z-10">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-3xl shadow-lg shadow-emerald-500/20 transition-transform duration-300 group-hover:scale-110">
                    🎉
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-gray-900">파티 둘러보기</h3>
                  <p className="text-sm text-gray-600">다양한 파티를 찾아보세요</p>
                </div>
              </Link>

              <Link
                href="/parties/create"
                className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all duration-300 hover:border-primary-300 hover:shadow-lg"
              >
                <div className="relative z-10">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-accent-600 text-3xl shadow-lg shadow-primary-500/20 transition-transform duration-300 group-hover:scale-110">
                    ✨
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-gray-900">파티 만들기</h3>
                  <p className="text-sm text-gray-600">새로운 파티를 생성하세요</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Menu Items */}
          <div className="mb-8">
            <h2 className="mb-6 text-2xl font-bold text-gray-900">메뉴</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Link
                href="/profile"
                className="group flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-gray-300 hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 text-xl">
                  👤
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-gray-900">프로필 관리</h3>
                  <p className="text-sm text-gray-500">내 정보 수정하기</p>
                </div>
                <span className="text-gray-400 transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>

              {session.user.role === '관리자' && (
                <Link
                  href="/admin"
                  className="group flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-red-300 hover:shadow-md"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-red-100 to-red-200 text-xl">
                    🛡️
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-semibold text-gray-900">관리자 대시보드</h3>
                    <p className="text-sm text-gray-500">커뮤니티 관리</p>
                  </div>
                  <span className="text-gray-400 transition-transform duration-300 group-hover:translate-x-1">→</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

