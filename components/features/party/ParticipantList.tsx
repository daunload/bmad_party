import Image from 'next/image';
import Link from 'next/link';
import type { PartyParticipant } from '@/lib/db/schema/party_participants';
import type { User } from '@/lib/db/schema/users';

interface ParticipantListProps {
  participants: Array<PartyParticipant & { user: User }>;
  showFullInfo?: boolean;
}

export function ParticipantList({ participants, showFullInfo = false }: ParticipantListProps) {
  if (participants.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <p className="text-sm text-gray-600">참여자가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {participants.map((participant) => (
        <Link
          key={participant.id}
          href={`/users/${participant.user.id}`}
          className="flex items-center space-x-3 rounded-lg border border-gray-200 bg-white p-3 transition-all hover:bg-gray-50"
        >
          {participant.user.profileImage ? (
            <div className="relative h-10 w-10 overflow-hidden rounded-full">
              <Image
                src={participant.user.profileImage}
                alt={participant.user.name || participant.user.email}
                fill
                className="object-cover"
                sizes="40px"
              />
            </div>
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold text-gray-500">
              {(participant.user.name || participant.user.email)[0].toUpperCase()}
            </div>
          )}
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">
              {participant.user.name || '이름 없음'}
            </p>
            {showFullInfo && (
              <p className="text-xs text-gray-500">{participant.user.email}</p>
            )}
          </div>
          <span className="text-xs text-gray-400">→</span>
        </Link>
      ))}
    </div>
  );
}

