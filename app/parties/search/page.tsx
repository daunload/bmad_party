import { searchParties } from '@/lib/db/parties';
import { PartyList } from '@/components/features/party/PartyList';
import { PartyPagination } from '@/components/features/party/PartyPagination';
import { PartySearchFilters } from '@/components/features/party/PartySearchFilters';
import Header from '@/components/layout/Header';
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
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="bg-gradient-to-br from-slate-50 via-blue-50/50 to-purple-50/50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12">
            <h1 className="mb-3 text-4xl font-bold text-gray-900 sm:text-5xl">
              파티 검색
            </h1>
            <p className="text-lg text-gray-600">
              원하는 파티를 검색하고 필터링하세요
            </p>
          </div>

          {/* Filters */}
          <div className="mb-8">
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
            <div className="mb-6 rounded-xl border border-gray-200 bg-white px-6 py-4 shadow-sm">
              <p className="text-base font-medium text-gray-900">
                총 <span className="text-primary-600">{total}</span>개의 파티를 찾았습니다.
              </p>
            </div>
          )}

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
    </div>
  );
}

