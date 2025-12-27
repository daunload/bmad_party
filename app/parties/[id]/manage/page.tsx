import { auth } from 'app/auth';
import { redirect, notFound } from 'next/navigation';
import { getPartyByIdWithHost } from '@/lib/db/parties';
import { getPendingParticipants } from '@/lib/db/party-participants';
import { getUserById } from '@/lib/db/users';
import { ParticipationRequests } from '@/components/features/party/ParticipationRequests';

interface PartyManagePageProps {
  params: Promise<{ id: string }>;
}

export default async function PartyManagePage({ params }: PartyManagePageProps) {
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

  // Get pending participants with user info
  const pendingRequests = await getPendingParticipants(partyId);
  const requestsWithUsers = await Promise.all(
    pendingRequests.map(async (request) => {
      const user = await getUserById(request.userId);
      return {
        ...request,
        user: user!,
      };
    })
  );

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">파티 관리: {party.title}</h1>

        <div className="space-y-6">
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">대기 중인 참여 신청</h2>
            <ParticipationRequests requests={requestsWithUsers} partyId={partyId} />
          </div>
        </div>
      </div>
    </div>
  );
}

