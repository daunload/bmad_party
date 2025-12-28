import { auth } from 'app/auth';
import { redirect } from 'next/navigation';
import { getUserById, updateUserProfile } from '@/lib/db/users';
import { validateName, validateProfileImage } from '@/lib/validations/user';
import { ProfileForm } from '@/components/features/user/ProfileForm';
import Header from '@/components/layout/Header';

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
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="bg-gradient-to-br from-slate-50 via-blue-50/50 to-purple-50/50 py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-8 py-8 text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 text-3xl shadow-lg shadow-primary-500/20">
                  👤
                </div>
              </div>
              <h1 className="mb-2 text-3xl font-bold text-gray-900">프로필 관리</h1>
              <p className="text-sm text-gray-600">
                프로필 정보를 수정할 수 있습니다
              </p>
            </div>
            <div className="p-8">
              <ProfileForm user={user} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

