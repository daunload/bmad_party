import { auth } from 'app/auth';
import { redirect } from 'next/navigation';
import { getUserById, updateUserProfile } from '@/lib/db/users';
import { validateName, validateProfileImage } from '@/lib/validations/user';
import { ProfileForm } from '@/components/features/user/ProfileForm';

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  const userId = parseInt(session.user.id as string);
  const user = await getUserById(userId);

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-8">
      <div className="z-10 w-full max-w-2xl overflow-hidden rounded-2xl border border-gray-100 shadow-xl">
        <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center sm:px-16">
          <h1 className="text-2xl font-semibold">프로필 관리</h1>
          <p className="text-sm text-gray-500">
            프로필 정보를 수정할 수 있습니다
          </p>
        </div>
        <ProfileForm user={user} />
      </div>
    </div>
  );
}

