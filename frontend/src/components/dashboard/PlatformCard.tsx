// frontend/src/components/dashboard/PlatformCard.tsx
import { CheckCircle, XCircle } from 'lucide-react';

interface PlatformCardProps {
  name: string;
  icon: string;
  connected: boolean;
  stats?: {
    followers?: string;
    views?: string;
    engagement?: string;
  };
  onClick: () => void;
}

export default function PlatformCard({ name, icon, connected, stats, onClick }: PlatformCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 border-transparent hover:border-indigo-500"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-4xl">{icon}</div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{name}</h3>
        </div>
        {connected ? (
          <CheckCircle className="text-green-500" size={24} />
        ) : (
          <XCircle className="text-gray-400" size={24} />
        )}
      </div>

      {connected && stats && (
        <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
          {stats.followers && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Followers</span>
              <span className="font-semibold text-gray-900 dark:text-white">{stats.followers}</span>
            </div>
          )}
          {stats.views && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Views</span>
              <span className="font-semibold text-gray-900 dark:text-white">{stats.views}</span>
            </div>
          )}
          {stats.engagement && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Engagement</span>
              <span className="font-semibold text-gray-900 dark:text-white">{stats.engagement}</span>
            </div>
          )}
        </div>
      )}

      {!connected && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
          Click to connect this platform
        </p>
      )}
    </div>
  );
}
