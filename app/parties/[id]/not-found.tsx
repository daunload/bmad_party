import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900">404</h1>
        <h2 className="mt-4 text-2xl font-semibold text-gray-700">파티를 찾을 수 없습니다</h2>
        <p className="mt-2 text-gray-500">
          요청하신 파티가 존재하지 않거나 삭제되었습니다.
        </p>
        <div className="mt-6 space-x-4">
          <Link
            href="/parties"
            className="inline-block rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            파티 목록 보기
          </Link>
          <Link
            href="/"
            className="inline-block rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            홈으로
          </Link>
        </div>
      </div>
    </div>
  );
}

