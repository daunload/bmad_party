'use client';

import { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface PartySearchFiltersProps {
  initialKeyword?: string;
  initialCategory?: string;
  initialLocation?: string;
  initialDateFrom?: string;
  initialDateTo?: string;
  categories: readonly string[];
}

export function PartySearchFilters({
  initialKeyword = '',
  initialCategory = '',
  initialLocation = '',
  initialDateFrom = '',
  initialDateTo = '',
  categories,
}: PartySearchFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [keyword, setKeyword] = useState(initialKeyword);
  const [category, setCategory] = useState(initialCategory);
  const [location, setLocation] = useState(initialLocation);
  const [dateFrom, setDateFrom] = useState(initialDateFrom);
  const [dateTo, setDateTo] = useState(initialDateTo);

  function handleSearch() {
    startTransition(() => {
      const params = new URLSearchParams();
      if (keyword.trim()) params.set('keyword', keyword.trim());
      if (category) params.set('category', category);
      if (location.trim()) params.set('location', location.trim());
      if (dateFrom) params.set('dateFrom', dateFrom);
      if (dateTo) params.set('dateTo', dateTo);
      params.set('page', '1'); // Reset to first page on new search

      router.push(`/parties/search?${params.toString()}`);
    });
  }

  function handleReset() {
    setKeyword('');
    setCategory('');
    setLocation('');
    setDateFrom('');
    setDateTo('');
    startTransition(() => {
      router.push('/parties/search');
    });
  }

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="space-y-6">
        {/* Keyword Search */}
        <div>
          <label htmlFor="keyword" className="mb-2 block text-sm font-semibold text-gray-900">
            키워드 검색
          </label>
          <input
            type="text"
            id="keyword"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="제목, 설명, 카테고리로 검색"
            className="input-modern"
          />
        </div>

        {/* Category and Location */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="category" className="mb-2 block text-sm font-semibold text-gray-900">
              카테고리
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input-modern"
            >
              <option value="">전체</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="location" className="mb-2 block text-sm font-semibold text-gray-900">
              지역
            </label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="예: 서울, 강남구"
              className="input-modern"
            />
          </div>
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="dateFrom" className="mb-2 block text-sm font-semibold text-gray-900">
              시작 날짜
            </label>
            <input
              type="date"
              id="dateFrom"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              min={today}
              className="input-modern"
            />
          </div>

          <div>
            <label htmlFor="dateTo" className="mb-2 block text-sm font-semibold text-gray-900">
              종료 날짜
            </label>
            <input
              type="date"
              id="dateTo"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              min={dateFrom || today}
              className="input-modern"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={handleSearch}
            disabled={isPending}
            className="btn-primary flex-1"
          >
            {isPending ? '검색 중...' : '검색'}
          </button>
          <button
            type="button"
            onClick={handleReset}
            disabled={isPending}
            className="btn-secondary"
          >
            초기화
          </button>
        </div>
      </div>
    </div>
  );
}

