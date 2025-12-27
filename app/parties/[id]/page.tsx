import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { auth } from 'app/auth';
import { getPartyByIdWithHost } from '@/lib/db/parties';
import { getApprovedParticipants } from '@/lib/db/party-participants';
import { getUserById } from '@/lib/db/users';
import { DeletePartyButton } from '@/components/features/party/DeletePartyButton';
import { PartyStatusManager } from '@/components/features/party/PartyStatusManager';
import { PartyParticipationButton } from '@/components/features/party/PartyParticipationButton';
import { ParticipantList } from '@/components/features/party/ParticipantList';
import type { Metadata } from 'next';

interface PartyDetailPageProps {
  params: Promise<{ id: string }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PartyDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const partyId = parseInt(id);

  if (isNaN(partyId)) {
    return {
      title: '파티를 찾을 수 없습니다 | Party',
    };
  }

  const party = await getPartyByIdWithHost(partyId);

  if (!party) {
    return {
      title: '파티를 찾을 수 없습니다 | Party',
    };
  }

  return {
    title: `${party.title} | Party`,
    description: party.description || `${party.title} 파티 상세 정보`,
    openGraph: {
      title: party.title,
      description: party.description || `${party.title} 파티`,
      type: 'website',
      images: party.imageUrl ? [party.imageUrl] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: party.title,
      description: party.description || `${party.title} 파티`,
    },
  };
}

export default async function PartyDetailPage({ params }: PartyDetailPageProps) {
  const { id } = await params;
  const partyId = parseInt(id);

  if (isNaN(partyId)) {
    notFound();
  }

  const party = await getPartyByIdWithHost(partyId);

  if (!party) {
    notFound();
  }

  // Check if current user is the host
  const session = await auth();
  const isHost = Boolean(session?.user?.id && parseInt(session.user.id as string) === party.hostId);

  // Get approved participants
  const approvedParticipants = await getApprovedParticipants(party.id);
  const participantsWithUsers = await Promise.all(
    approvedParticipants.map(async (participant) => {
      const user = await getUserById(participant.userId);
      return {
        ...participant,
        user: user!,
      };
    })
  );

  // Format date and time
  const partyDate = new Date(party.date).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  // Create structured data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: party.title,
    description: party.description || `${party.title} 파티`,
    startDate: `${party.date}T${party.time}`,
    location: {
      '@type': 'Place',
      name: party.location,
    },
    organizer: {
      '@type': 'Person',
      name: party.host.name || party.host.email,
      email: party.host.email,
    },
    image: party.imageUrl,
    eventStatus: party.status === '모집 중' ? 'https://schema.org/EventScheduled' : 'https://schema.org/EventScheduled',
    maximumAttendeeCapacity: party.maxParticipants,
  };

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 px-4 py-8">
          <div className="mx-auto max-w-5xl">
          {/* Back Button and Action Buttons */}
          <div className="mb-6 flex items-center justify-between">
            <Link
              href="/parties"
              className="inline-flex items-center gap-2 rounded-xl bg-white/80 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-white hover:shadow-md"
            >
              <span>←</span>
              <span>파티 목록으로</span>
            </Link>
            {isHost && (
              <div className="flex gap-2">
                <Link
                  href={`/parties/${party.id}/edit`}
                  className="btn-primary text-sm"
                >
                  수정하기
                </Link>
                <DeletePartyButton partyId={party.id} partyTitle={party.title} />
              </div>
            )}
          </div>

          <div className="card-gradient overflow-hidden">
            {/* Header Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-primary-500 via-primary-600 to-accent-600 px-6 py-8 sm:px-12 sm:py-12">
              <div className="relative z-10">
                <div className="mb-4 flex items-center gap-3">
                  <span className="badge-success">{party.status}</span>
                  <span className="rounded-lg bg-white/20 px-3 py-1 text-sm font-medium text-white backdrop-blur-sm">
                    {party.category}
                  </span>
                </div>
                <h1 className="mb-4 text-3xl font-bold text-white sm:text-4xl">{party.title}</h1>
              </div>
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
              <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
            </div>

        <div className="flex flex-col space-y-6 p-6 sm:p-12">
          {party.imageUrl && (
            <div className="relative h-80 w-full overflow-hidden rounded-2xl shadow-lg">
              <Image
                src={party.imageUrl}
                alt={party.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          )}

          {party.description && (
            <div className="rounded-2xl bg-white/60 p-6 backdrop-blur-sm">
              <h2 className="mb-3 text-xl font-bold text-gray-900">설명</h2>
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{party.description}</p>
            </div>
          )}

            <div className="rounded-2xl bg-white/60 p-6 backdrop-blur-sm">
              <h2 className="mb-6 text-xl font-bold text-gray-900">파티 정보</h2>
              <dl className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100/50 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-500 text-xl text-white">
                    📅
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-gray-500">날짜</dt>
                    <dd className="mt-1 text-base font-semibold text-gray-900">{partyDate}</dd>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-xl bg-gradient-to-br from-accent-50 to-accent-100/50 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-500 text-xl text-white">
                    ⏰
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-gray-500">시간</dt>
                    <dd className="mt-1 text-base font-semibold text-gray-900">{party.time}</dd>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500 text-xl text-white">
                    📍
                  </div>
                  <div className="min-w-0 flex-1">
                    <dt className="text-xs font-medium text-gray-500">장소</dt>
                    <dd className="mt-1 text-base font-semibold text-gray-900">{party.location}</dd>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100/50 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500 text-xl text-white">
                    👥
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-gray-500">최대 인원</dt>
                    <dd className="mt-1 text-base font-semibold text-gray-900">{party.maxParticipants}명</dd>
                  </div>
                </div>
                {party.minPopularityRating && (
                  <div className="flex items-start gap-3 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100/50 p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-500 text-xl text-white">
                      ⭐
                    </div>
                    <div>
                      <dt className="text-xs font-medium text-gray-500">인기도 기준</dt>
                      <dd className="mt-1 text-base font-semibold text-gray-900">{party.minPopularityRating}</dd>
                    </div>
                  </div>
                )}
              </dl>
            </div>

            {/* Participation Button (only for non-hosts) */}
            {!isHost && (
              <div className="rounded-2xl bg-white/60 p-6 backdrop-blur-sm">
                <h2 className="mb-4 text-xl font-bold text-gray-900">참여 신청</h2>
                <PartyParticipationButton
                  party={party}
                  isHost={isHost}
                  currentUserId={session?.user?.id ? parseInt(session.user.id as string) : null}
                />
              </div>
            )}

            {/* Status Management (only for host) */}
            {isHost && (
              <div className="rounded-2xl bg-white/60 p-6 backdrop-blur-sm">
                <h2 className="mb-4 text-xl font-bold text-gray-900">상태 관리</h2>
                <PartyStatusManager partyId={party.id} currentStatus={party.status} />
              </div>
            )}

            {/* Participants List */}
            <div className="rounded-2xl bg-white/60 p-6 backdrop-blur-sm">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">참여자</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    {participantsWithUsers.length}/{party.maxParticipants}명
                  </p>
                </div>
                {isHost && (
                  <Link
                    href={`/parties/${party.id}/manage`}
                    className="btn-secondary text-sm"
                  >
                    관리하기
                  </Link>
                )}
              </div>
              <ParticipantList
                participants={participantsWithUsers}
                showFullInfo={isHost ?? false}
              />
            </div>

            {/* Host Information */}
            <div className="rounded-2xl bg-white/60 p-6 backdrop-blur-sm">
              <h2 className="mb-4 text-xl font-bold text-gray-900">주최자 정보</h2>
              <Link
                href={`/users/${party.host.id}`}
                className="group flex items-center gap-4 rounded-xl border-2 border-gray-200 bg-white/50 p-4 transition-all hover:border-primary-300 hover:bg-white hover:shadow-md"
              >
                {party.host.profileImage ? (
                  <div className="relative h-14 w-14 overflow-hidden rounded-full ring-2 ring-white">
                    <Image
                      src={party.host.profileImage}
                      alt={party.host.name || party.host.email}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-accent-400 text-xl font-semibold text-white ring-2 ring-white">
                    {(party.host.name || party.host.email)[0].toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-base font-semibold text-gray-900">
                    {party.host.name || '이름 없음'}
                  </p>
                  <p className="text-sm text-gray-500">{party.host.email}</p>
                </div>
                <span className="text-xl text-gray-400 transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
