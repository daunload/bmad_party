import Link from 'next/link';
import Image from 'next/image';
import type { Party } from '@/lib/db/schema/parties';
import type { User } from '@/lib/db/schema/users';

interface PartyCardProps {
  party: Party;
  host: {
    id: number;
    name: string | null;
    email: string;
    profileImage: string | null;
  };
}

export function PartyCard({ party, host }: PartyCardProps) {
  // Format date
  const partyDate = new Date(party.date).toLocaleDateString('ko-KR', {
    month: 'short',
    day: 'numeric',
    weekday: 'short',
  });

  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case '모집 중':
        return 'bg-green-100 text-green-800';
      case '모집 완료':
        return 'bg-yellow-100 text-yellow-800';
      case '진행 중':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Link
      href={`/parties/${party.id}`}
      className="group block overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm shadow-soft transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
    >
      {/* Image */}
      {party.imageUrl ? (
        <div className="relative h-56 w-full overflow-hidden">
          <Image
            src={party.imageUrl}
            alt={party.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          {/* Status Badge on Image */}
          <div className="absolute top-3 left-3">
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold backdrop-blur-sm ${
                party.status === '모집 중'
                  ? 'bg-emerald-500/90 text-white'
                  : party.status === '모집 완료'
                    ? 'bg-amber-500/90 text-white'
                    : party.status === '진행 중'
                      ? 'bg-blue-500/90 text-white'
                      : 'bg-gray-500/90 text-white'
              }`}
            >
              {party.status}
            </span>
          </div>
        </div>
      ) : (
        <div className="relative flex h-56 w-full items-center justify-center bg-gradient-to-br from-primary-100 to-accent-100">
          <span className="text-6xl">🎉</span>
          <div className="absolute top-3 left-3">
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                party.status === '모집 중'
                  ? 'bg-emerald-500 text-white'
                  : party.status === '모집 완료'
                    ? 'bg-amber-500 text-white'
                    : party.status === '진행 중'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-500 text-white'
              }`}
            >
              {party.status}
            </span>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-5">
        {/* Category */}
        <div className="mb-3">
          <span className="inline-flex items-center rounded-lg bg-primary-50 px-2.5 py-1 text-xs font-medium text-primary-700">
            {party.category}
          </span>
        </div>

        {/* Title */}
        <h3 className="mb-3 line-clamp-2 text-lg font-bold text-gray-900 transition-colors group-hover:text-primary-600">
          {party.title}
        </h3>

        {/* Date and Time */}
        <div className="mb-4 space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
              📅
            </div>
            <div>
              <span className="font-medium">{partyDate}</span>
              <span className="mx-2 text-gray-400">·</span>
              <span>{party.time}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-50 text-accent-600">
              📍
            </div>
            <span className="line-clamp-1">{party.location}</span>
          </div>
        </div>

        {/* Host Info */}
        <div className="flex items-center gap-3 border-t border-gray-100 pt-4">
          {host.profileImage ? (
            <div className="relative h-10 w-10 overflow-hidden rounded-full ring-2 ring-white">
              <Image
                src={host.profileImage}
                alt={host.name || host.email}
                fill
                className="object-cover"
                sizes="40px"
              />
            </div>
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-accent-400 text-sm font-semibold text-white ring-2 ring-white">
              {(host.name || host.email)[0].toUpperCase()}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-semibold text-gray-900">{host.name || '이름 없음'}</p>
            <p className="truncate text-xs text-gray-500">{host.email}</p>
          </div>
          <div className="flex items-center gap-1 rounded-lg bg-gray-50 px-3 py-1.5">
            <span className="text-sm font-bold text-gray-900">{party.maxParticipants}</span>
            <span className="text-xs text-gray-500">명</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

