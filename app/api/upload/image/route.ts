import { NextRequest, NextResponse } from 'next/server';
import { auth } from 'app/auth';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: '로그인이 필요합니다.' } },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: { code: 'NO_FILE', message: '파일을 선택해주세요.' } },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_FILE_TYPE',
            message: '지원하는 이미지 형식은 JPG, PNG, WEBP입니다.',
          },
        },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'FILE_TOO_LARGE',
            message: '파일 크기는 5MB 이하여야 합니다.',
          },
        },
        { status: 400 }
      );
    }

    // For MVP: Convert file to base64 data URL
    // In production, upload to Vercel Blob or external storage service
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    const dataUrl = `data:${file.type};base64,${base64}`;

    // Return the data URL (in production, return the uploaded file URL)
    return NextResponse.json({
      success: true,
      data: {
        url: dataUrl,
        // In production, this would be the uploaded file URL from storage service
        // url: `https://your-storage-service.com/uploads/${filename}`,
      },
    });
  } catch (error) {
    console.error('Image upload error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'UPLOAD_ERROR',
          message: '이미지 업로드 중 오류가 발생했습니다.',
        },
      },
      { status: 500 }
    );
  }
}

