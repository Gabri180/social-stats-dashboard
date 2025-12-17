// frontend/src/components/dashboard/ConnectPlatform.tsx
import { ExternalLink } from 'lucide-react';

interface ConnectPlatformProps {
  name: string;
  icon: string;
  description: string;
  connected: boolean;
  onConnect: () => void;
}

export default function ConnectPlatform({ name, icon, description, connected, onConnect }: ConnectPlatformProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all border-2 border-transparent hover:border-indigo-500">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="text-4xl">{icon}</div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{description}</p>
          </div>
        </div>
        {connected && (
          <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-sm font-semibold rounded-full">
            Connected
          </span>
        )}
      </div>
      
      <button
        onClick={onConnect}
        disabled={connected}
        className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-colors ${
          connected
            ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
            : 'bg-indigo-600 hover:bg-indigo-700 text-white'
        }`}
      >
        {connected ? 'Connected' : `Connect ${name}`}
        {!connected && <ExternalLink size={18} />}
      </button>
    </div>
  );
}
