import { auth } from 'app/auth';
import { redirect } from 'next/navigation';
import { PartyCreateForm } from '@/components/features/party/PartyCreateForm';

export default async function CreatePartyPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-8">
      <div className="z-10 w-full max-w-2xl overflow-hidden rounded-2xl border border-gray-100 shadow-xl">
        <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center sm:px-16">
          <h1 className="text-2xl font-semibold">파티 생성</h1>
          <p className="text-sm text-gray-500">
            새로운 파티를 생성하고 참여자를 모집하세요
          </p>
        </div>
        <PartyCreateForm />
      </div>
    </div>
  );
}

