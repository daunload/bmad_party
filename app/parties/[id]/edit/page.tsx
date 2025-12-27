import { auth } from 'app/auth';
import { redirect, notFound } from 'next/navigation';
import { getPartyByIdWithHost } from '@/lib/db/parties';
import { PartyEditForm } from '@/components/features/party/PartyEditForm';

interface PartyEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function PartyEditPage({ params }: PartyEditPageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  const { id } = await params;
  const partyId = parseInt(id);

  if (isNaN(partyId)) {
    notFound();
  }

  const party = await getPartyByIdWithHost(partyId);

  if (!party) {
    notFound();
  }

  const userId = parseInt(session.user.id as string);

  // Check if user is the host
  if (party.hostId !== userId) {
    redirect(`/parties/${partyId}`);
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-8">
      <div className="z-10 w-full max-w-2xl overflow-hidden rounded-2xl border border-gray-100 shadow-xl">
        <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center sm:px-16">
          <h1 className="text-2xl font-semibold">파티 수정</h1>
          <p className="text-sm text-gray-500">파티 정보를 수정하세요</p>
        </div>
        <PartyEditForm party={party} />
      </div>
    </div>
  );
}

