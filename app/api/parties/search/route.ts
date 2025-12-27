import { NextRequest, NextResponse } from 'next/server';
import { searchParties } from '@/lib/db/parties';

export interface SearchPartiesResponse {
  success: boolean;
  data?: {
    parties: Array<{
      id: number;
      title: string;
      description: string | null;
      date: string;
      time: string;
      location: string;
      maxParticipants: number;
      category: string;
      imageUrl: string | null;
      status: string;
      hostId: number;
      minPopularityRating: string | null;
      createdAt: Date;
      updatedAt: Date;
      host: {
        id: number;
        name: string | null;
        email: string;
        profileImage: string | null;
      };
    }>;
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  error?: {
    code: string;
    message: string;
  };
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const keyword = searchParams.get('keyword') || undefined;
    const category = searchParams.get('category') || undefined;
    const location = searchParams.get('location') || undefined;
    const dateFrom = searchParams.get('dateFrom') || undefined;
    const dateTo = searchParams.get('dateTo') || undefined;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    // Validate pagination parameters
    if (page < 1) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_PAGE',
            message: '페이지 번호는 1 이상이어야 합니다.',
          },
        } as SearchPartiesResponse,
        { status: 400 }
      );
    }

    if (limit < 1 || limit > 100) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_LIMIT',
            message: '페이지당 결과 수는 1에서 100 사이여야 합니다.',
          },
        } as SearchPartiesResponse,
        { status: 400 }
      );
    }

    // Perform search
    const startTime = Date.now();
    const { parties, total } = await searchParties({
      keyword,
      category,
      location,
      dateFrom,
      dateTo,
      page,
      limit,
    });
    const responseTime = Date.now() - startTime;

    // Log performance warning if response time exceeds 500ms
    if (responseTime > 500) {
      console.warn(`Search API response time: ${responseTime}ms (exceeds 500ms threshold)`);
    }

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: {
        parties: parties.map((party) => ({
          ...party,
          date: party.date instanceof Date ? party.date.toISOString().split('T')[0] : party.date,
          createdAt: party.createdAt,
          updatedAt: party.updatedAt,
        })),
        total,
        page,
        limit,
        totalPages,
      },
    } as SearchPartiesResponse);
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SEARCH_ERROR',
          message: '검색 중 오류가 발생했습니다.',
        },
      } as SearchPartiesResponse,
      { status: 500 }
    );
  }
}

