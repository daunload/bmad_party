import Link from 'next/link';
import Header from '@/components/layout/Header';

export default function Page() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/50 to-purple-50/50 pt-20 pb-32">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary-200/20 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-accent-200/20 blur-3xl"></div>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            {/* Badge */}
            <div className="mb-8 inline-flex animate-fade-in items-center gap-2 rounded-full border border-primary-200 bg-primary-50/80 px-4 py-2 text-sm font-medium text-primary-700 backdrop-blur-sm">
              <span>✨</span>
              <span>새로운 사람들과 만나보세요</span>
            </div>

            {/* Main heading */}
            <h1 className="mb-6 animate-slide-up text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
              <span className="bg-gradient-to-r from-primary-600 via-accent-600 to-primary-600 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                Party
              </span>
              <br />
              <span className="text-gray-800">함께 만드는 즐거움</span>
            </h1>

            {/* Description */}
            <p className="mb-10 animate-fade-in text-xl text-gray-600 sm:text-2xl">
              다양한 파티를 찾고 참여하며
              <br className="hidden sm:block" />
              <span className="sm:hidden"> </span>
              새로운 사람들과 만나보세요
            </p>

            {/* CTA Buttons */}
            <div className="mb-16 flex flex-col items-center justify-center gap-4 sm:flex-row animate-slide-up">
              <Link
                href="/parties"
                className="btn-primary w-full sm:w-auto px-8 py-4 text-base"
              >
                파티 둘러보기
              </Link>
              <Link
                href="/register"
                className="btn-secondary w-full sm:w-auto px-8 py-4 text-base"
              >
                무료로 시작하기
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 animate-fade-in">
              <div>
                <div className="text-3xl font-bold text-gray-900">100+</div>
                <div className="mt-1 text-sm text-gray-600">활성 파티</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">500+</div>
                <div className="mt-1 text-sm text-gray-600">회원</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">4.8</div>
                <div className="mt-1 text-sm text-gray-600">평균 평점</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              왜 Party를 선택해야 할까요?
            </h2>
            <p className="text-lg text-gray-600">
              신뢰할 수 있는 커뮤니티에서 새로운 경험을 만들어보세요
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="group rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all duration-300 hover:border-primary-300 hover:shadow-lg">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 text-3xl shadow-lg shadow-primary-500/20 transition-transform duration-300 group-hover:scale-110">
                🔍
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">다양한 파티</h3>
              <p className="text-gray-600 leading-relaxed">
                보드게임부터 네트워킹까지 다양한 카테고리의 파티를 찾아보세요. 취향에 맞는 파티를 쉽게 발견할 수 있습니다.
              </p>
            </div>

            <div className="group rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all duration-300 hover:border-accent-300 hover:shadow-lg">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-500 to-accent-600 text-3xl shadow-lg shadow-accent-500/20 transition-transform duration-300 group-hover:scale-110">
                👥
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">신뢰할 수 있는 커뮤니티</h3>
              <p className="text-gray-600 leading-relaxed">
                인기도 시스템으로 신뢰할 수 있는 사람들과 함께하세요. 안전하고 즐거운 파티 경험을 보장합니다.
              </p>
            </div>

            <div className="group rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all duration-300 hover:border-emerald-300 hover:shadow-lg">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-3xl shadow-lg shadow-emerald-500/20 transition-transform duration-300 group-hover:scale-110">
                ⭐
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">평가 시스템</h3>
              <p className="text-gray-600 leading-relaxed">
                파티 후 서로를 평가하여 더 나은 커뮤니티를 만들어가요. 건설적인 피드백으로 모두가 성장합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary-50 via-white to-accent-50">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-4xl font-bold text-gray-900">
            지금 시작해보세요
          </h2>
          <p className="mb-8 text-lg text-gray-600">
            무료로 가입하고 첫 파티에 참여해보세요
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/register" className="btn-primary px-8 py-4 text-base">
              무료로 시작하기
            </Link>
            <Link
              href="/parties"
              className="btn-secondary px-8 py-4 text-base"
            >
              파티 둘러보기
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
