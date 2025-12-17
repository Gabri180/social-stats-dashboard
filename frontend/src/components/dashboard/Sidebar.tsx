// frontend/src/components/dashboard/Sidebar.tsx
import { Home, BarChart2, Settings, Link as LinkIcon, LogOut } from 'lucide-react';

export default function Sidebar() {
  const menuItems = [
    { icon: Home, label: 'Dashboard', href: '/dashboard' },
    { icon: LinkIcon, label: 'Platforms', href: '/platforms' },
    { icon: BarChart2, label: 'Stats', href: '/stats/youtube' },
    { icon: Settings, label: 'Settings', href: '/settings' }
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-6 z-20">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">SocialStats</h1>
      </div>
      
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </a>
          );
        })}
      </nav>

      <button 
        onClick={handleLogout}
        className="absolute bottom-6 left-6 right-6 flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
      >
        <LogOut size={20} />
        <span className="font-medium">Logout</span>
      </button>
    </aside>
  );
}
