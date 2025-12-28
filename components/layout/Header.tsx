import Link from 'next/link';
import { auth } from 'app/auth';

export default async function Header() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/80 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 text-xl shadow-lg shadow-primary-500/20">
            🎉
          </div>
          <span className="text-xl font-bold text-gray-900">Party</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/parties"
            className="text-sm font-medium text-gray-600 transition-colors hover:text-primary-600"
          >
            파티 둘러보기
          </Link>
          <Link
            href="/parties/search"
            className="text-sm font-medium text-gray-600 transition-colors hover:text-primary-600"
          >
            검색
          </Link>
          {session?.user && (
            <Link
              href="/dashboard"
              className="text-sm font-medium text-gray-600 transition-colors hover:text-primary-600"
            >
              대시보드
            </Link>
          )}
        </nav>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          {session?.user ? (
            <Link
              href="/dashboard"
              className="btn-primary text-sm"
            >
              대시보드
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden text-sm font-medium text-gray-600 transition-colors hover:text-primary-600 sm:block"
              >
                로그인
              </Link>
              <Link href="/register" className="btn-primary text-sm">
                시작하기
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

