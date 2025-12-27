import { NextRequest, NextResponse } from 'next/server';
import { getUserById } from '@/lib/db/users';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const userIdNum = parseInt(userId);

    if (isNaN(userIdNum)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_USER_ID',
            message: '유효하지 않은 사용자 ID입니다.',
          },
        },
        { status: 400 }
      );
    }

    const user = await getUserById(userIdNum);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'USER_NOT_FOUND',
            message: '사용자를 찾을 수 없습니다.',
          },
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        userId: user.id,
        popularityScore: (user as any).popularityScore ? parseFloat((user as any).popularityScore) : null,
        popularityRating: (user as any).popularityRating || '보통',
      },
    });
  } catch (error) {
    console.error('Popularity API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: '인기도 조회 중 오류가 발생했습니다.',
        },
      },
      { status: 500 }
    );
  }
}

