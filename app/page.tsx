import Link from 'next/link';

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-primary-50 via-white to-accent-50 px-4 py-12">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary-200/30 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent-200/30 blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-4xl text-center">
        {/* Logo/Icon */}
        <div className="mb-8 animate-scale-in">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-primary-500 to-accent-500 shadow-2xl shadow-primary-500/30">
            <span className="text-5xl">🎉</span>
          </div>
        </div>

        {/* Main heading */}
        <h1 className="mb-6 animate-slide-up text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl md:text-7xl">
          <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
            Party
          </span>
          <br />
          <span className="text-gray-800">함께 만드는 즐거움</span>
        </h1>

        {/* Description */}
        <p className="mb-12 animate-fade-in text-lg text-gray-600 sm:text-xl">
          다양한 파티를 찾고 참여하며
          <br className="sm:hidden" />
          새로운 사람들과 만나보세요
        </p>

        {/* CTA Buttons */}
        <div className="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row animate-slide-up">
          <Link href="/parties" className="btn-primary w-full sm:w-auto">
            파티 둘러보기
          </Link>
          <Link href="/register" className="btn-secondary w-full sm:w-auto">
            시작하기
          </Link>
        </div>

        {/* Features */}
        <div className="grid gap-6 sm:grid-cols-3 animate-fade-in">
          <div className="card-gradient p-6 text-left">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 text-2xl">
              🔍
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">다양한 파티</h3>
            <p className="text-sm text-gray-600">
              보드게임부터 네트워킹까지 다양한 카테고리의 파티를 찾아보세요
            </p>
          </div>

          <div className="card-gradient p-6 text-left">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-accent-500 to-accent-600 text-2xl">
              👥
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">신뢰할 수 있는 커뮤니티</h3>
            <p className="text-sm text-gray-600">
              인기도 시스템으로 신뢰할 수 있는 사람들과 함께하세요
            </p>
          </div>

          <div className="card-gradient p-6 text-left">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-2xl">
              ⭐
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">평가 시스템</h3>
            <p className="text-sm text-gray-600">
              파티 후 서로를 평가하여 더 나은 커뮤니티를 만들어가요
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
