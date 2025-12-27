import { getActiveParties } from '@/lib/db/parties';
import { PartyList } from '@/components/features/party/PartyList';
import { PartyPagination } from '@/components/features/party/PartyPagination';
import type { Metadata } from 'next';

interface PartiesPageProps {
  searchParams: Promise<{ page?: string }>;
}

export const metadata: Metadata = {
  title: '파티 목록 | Party',
  description: '다양한 파티를 찾아보고 참여하세요',
  openGraph: {
    title: '파티 목록 | Party',
    description: '다양한 파티를 찾아보고 참여하세요',
    type: 'website',
  },
};

const PARTIES_PER_PAGE = 20;

export default async function PartiesPage({ searchParams }: PartiesPageProps) {
  const { page } = await searchParams;
  const currentPage = parseInt(page || '1', 10);
  const validPage = currentPage > 0 ? currentPage : 1;

  const { parties, total } = await getActiveParties({
    page: validPage,
    limit: PARTIES_PER_PAGE,
  });

  const totalPages = Math.ceil(total / PARTIES_PER_PAGE);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 px-4 py-12">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-10 animate-slide-up">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="mb-2 text-4xl font-bold text-gray-900 sm:text-5xl">
                파티 목록
              </h1>
              <p className="text-lg text-gray-600">
                다양한 파티를 찾아보고 참여하세요
              </p>
            </div>
            <a
              href="/parties/search"
              className="btn-primary w-full sm:w-auto"
            >
              🔍 상세 검색
            </a>
          </div>
        </div>

        {/* Party List */}
        <div className="mb-8">
          <PartyList parties={parties} />
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <PartyPagination currentPage={validPage} totalPages={totalPages} />
          </div>
        )}
      </div>
    </div>
  );
}

