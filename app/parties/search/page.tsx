import { searchParties } from '@/lib/db/parties';
import { PartyList } from '@/components/features/party/PartyList';
import { PartyPagination } from '@/components/features/party/PartyPagination';
import { PartySearchFilters } from '@/components/features/party/PartySearchFilters';
import type { Metadata } from 'next';

interface SearchPageProps {
  searchParams: Promise<{
    keyword?: string;
    category?: string;
    location?: string;
    dateFrom?: string;
    dateTo?: string;
    page?: string;
  }>;
}

export const metadata: Metadata = {
  title: '파티 검색 | Party',
  description: '원하는 파티를 검색하고 필터링하세요',
};

const PARTIES_PER_PAGE = 20;

const CATEGORIES = [
  '보드게임',
  '네트워킹',
  '취미 활동',
  '스포츠',
  '음식/맛집',
  '문화/예술',
  '여행',
  '기타',
] as const;

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const keyword = params.keyword;
  const category = params.category;
  const location = params.location;
  const dateFrom = params.dateFrom;
  const dateTo = params.dateTo;
  const currentPage = parseInt(params.page || '1', 10);
  const validPage = currentPage > 0 ? currentPage : 1;

  const { parties, total } = await searchParties({
    keyword,
    category,
    location,
    dateFrom,
    dateTo,
    page: validPage,
    limit: PARTIES_PER_PAGE,
  });

  const totalPages = Math.ceil(total / PARTIES_PER_PAGE);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">파티 검색</h1>
          <p className="mt-2 text-gray-600">원하는 파티를 검색하고 필터링하세요</p>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <PartySearchFilters
            initialKeyword={keyword}
            initialCategory={category}
            initialLocation={location}
            initialDateFrom={dateFrom}
            initialDateTo={dateTo}
            categories={CATEGORIES}
          />
        </div>

        {/* Results Count */}
        {total > 0 && (
          <div className="mb-4 text-sm text-gray-600">
            총 {total}개의 파티를 찾았습니다.
          </div>
        )}

        {/* Party List */}
        <PartyList parties={parties} />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8">
            <PartyPagination currentPage={validPage} totalPages={totalPages} />
          </div>
        )}
      </div>
    </div>
  );
}

