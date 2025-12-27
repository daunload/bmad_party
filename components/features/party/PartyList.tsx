import { PartyCard } from './PartyCard';
import type { PartyWithHost } from '@/lib/db/parties';

interface PartyListProps {
  parties: PartyWithHost[];
}

export function PartyList({ parties }: PartyListProps) {
  if (parties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl bg-white/50 p-12 backdrop-blur-sm">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 text-4xl">
          🎈
        </div>
        <p className="text-xl font-semibold text-gray-900">등록된 파티가 없습니다</p>
        <p className="mt-2 text-sm text-gray-500">첫 번째 파티를 생성해보세요!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {parties.map((party, index) => (
        <div
          key={party.id}
          className="animate-slide-up"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <PartyCard party={party} host={party.host} />
        </div>
      ))}
    </div>
  );
}

