'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createPartyAction } from '@/app/actions/party';
import Image from 'next/image';

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

export function PartyCreateForm() {
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    setErrors({});

    const result = await createPartyAction(formData);

    if (result.success && result.partyId) {
      router.push(`/parties/${result.partyId}`);
    } else {
      if (result.errors) {
        setErrors(result.errors);
      } else if (result.error) {
        setErrors({ general: result.error });
      }
      setIsSubmitting(false);
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setErrors({ imageFile: '지원하는 이미지 형식은 JPG, PNG, WEBP입니다.' });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors({ imageFile: '파일 크기는 5MB 이하여야 합니다.' });
      return;
    }

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('imageFile', file);

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: uploadFormData,
      });

      const data = await response.json();

      if (data.success && data.imageUrl) {
        // Set preview
        setImagePreview(data.imageUrl);
        // Set hidden input value
        const imageUrlInput = document.getElementById('imageUrl') as HTMLInputElement;
        if (imageUrlInput) {
          imageUrlInput.value = data.imageUrl;
        }
        setErrors({});
      } else {
        setErrors({ imageFile: data.error?.message || '이미지 업로드에 실패했습니다.' });
      }
    } catch (error) {
      setErrors({ imageFile: '이미지 업로드 중 오류가 발생했습니다.' });
    }
  }

  return (
    <form action={handleSubmit} className="flex flex-col space-y-4 bg-gray-50 px-4 py-8 sm:px-16">
      {errors.general && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">{errors.general}</div>
      )}

      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          제목 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          placeholder="파티 제목을 입력하세요"
        />
        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          설명
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          placeholder="파티에 대한 설명을 입력하세요"
        />
      </div>

      {/* Date and Time */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
            날짜 <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="date"
            name="date"
            required
            min={new Date().toISOString().split('T')[0]}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          />
          {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
        </div>
        <div>
          <label htmlFor="time" className="block text-sm font-medium text-gray-700">
            시간 <span className="text-red-500">*</span>
          </label>
          <input
            type="time"
            id="time"
            name="time"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          />
          {errors.time && <p className="mt-1 text-sm text-red-600">{errors.time}</p>}
        </div>
      </div>

      {/* Location */}
      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700">
          장소 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="location"
          name="location"
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          placeholder="파티 장소를 입력하세요"
        />
        {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
      </div>

      {/* Max Participants and Category */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="maxParticipants" className="block text-sm font-medium text-gray-700">
            최대 인원 <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="maxParticipants"
            name="maxParticipants"
            required
            min={2}
            max={100}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          />
          {errors.maxParticipants && (
            <p className="mt-1 text-sm text-red-600">{errors.maxParticipants}</p>
          )}
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            카테고리 <span className="text-red-500">*</span>
          </label>
          <select
            id="category"
            name="category"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          >
            <option value="">선택하세요</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
        </div>
      </div>

      {/* Min Popularity Rating */}
      <div>
        <label htmlFor="minPopularityRating" className="block text-sm font-medium text-gray-700">
          최소 인기도 기준
        </label>
        <select
          id="minPopularityRating"
          name="minPopularityRating"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
        >
          <option value="">제한 없음</option>
          <option value="높음">높음</option>
          <option value="보통">보통 이상</option>
          <option value="낮음">낮음 이상</option>
        </select>
      </div>

      {/* Image Upload */}
      <div>
        <label htmlFor="imageFile" className="block text-sm font-medium text-gray-700">
          이미지
        </label>
        <input
          type="file"
          id="imageFile"
          name="imageFile"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleImageUpload}
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
        />
        <input type="hidden" id="imageUrl" name="imageUrl" />
        {errors.imageFile && <p className="mt-1 text-sm text-red-600">{errors.imageFile}</p>}
        {imagePreview && (
          <div className="relative mt-4 h-48 w-full overflow-hidden rounded-lg">
            <Image src={imagePreview} alt="Preview" fill className="object-cover" />
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isSubmitting ? '생성 중...' : '파티 생성'}
        </button>
      </div>
    </form>
  );
}

