import { notFound } from 'next/navigation';
import { getUserById } from '@/lib/db/users';
import { UserProfileView } from '@/components/features/user/UserProfileView';
import type { Metadata } from 'next';

interface UserProfilePageProps {
  params: Promise<{ id: string }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: UserProfilePageProps): Promise<Metadata> {
  const { id } = await params;
  const userId = parseInt(id);

  if (isNaN(userId)) {
    return {
      title: '사용자를 찾을 수 없습니다 | Party',
    };
  }

  const user = await getUserById(userId);

  if (!user) {
    return {
      title: '사용자를 찾을 수 없습니다 | Party',
    };
  }

  return {
    title: `${user.name || user.email}의 프로필 | Party`,
    description: `${user.name || user.email}님의 프로필 페이지입니다.`,
    openGraph: {
      title: `${user.name || user.email}의 프로필`,
      description: `${user.name || user.email}님의 프로필 페이지입니다.`,
      type: 'profile',
    },
  };
}

export default async function UserProfilePage({ params }: UserProfilePageProps) {
  const { id } = await params;
  const userId = parseInt(id);

  if (isNaN(userId)) {
    notFound();
  }

  const user = await getUserById(userId);

  if (!user) {
    notFound();
  }

  return <UserProfileView user={user} />;
}

