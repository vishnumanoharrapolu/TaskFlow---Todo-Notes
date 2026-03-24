import React from 'react';
import { 
  Inbox, 
  CheckCircle2, 
  Star, 
  Clock, 
  Tag, 
  Folder,
  Hash
} from 'lucide-react';
import { cn } from '../lib/utils';

interface SidebarProps {
  isOpen: boolean;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  categories: string[];
  isDarkMode: boolean;
}

export function Sidebar({ isOpen, activeFilter, setActiveFilter, categories, isDarkMode }: SidebarProps) {
  const menuItems = [
    { id: 'all', label: 'All Tasks', icon: Inbox },
    { id: 'pending', label: 'Pending', icon: Clock },
    { id: 'important', label: 'Important', icon: Star },
    { id: 'completed', label: 'Completed', icon: CheckCircle2 },
  ];

  return (
    <aside className={cn(
      "h-screen sticky top-0 flex flex-col transition-all duration-300 border-r overflow-hidden z-20",
      isOpen ? "w-64" : "w-0 sm:w-20",
      isDarkMode ? "bg-[#121212] border-gray-800" : "bg-white border-gray-200"
    )}>
      <div className="p-6 flex items-center gap-3">
        <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shrink-0">
          <CheckCircle2 size={20} />
        </div>
        <span className={cn("font-bold text-lg transition-opacity", !isOpen && "opacity-0")}>TaskFlow</span>
      </div>

      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        <div className="mb-4">
          <p className={cn("px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider", !isOpen && "hidden")}>Main</p>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveFilter(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group",
                activeFilter === item.id 
                  ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400" 
                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              )}
            >
              <item.icon size={20} className={cn("shrink-0", activeFilter === item.id ? "text-blue-600 dark:text-blue-400" : "text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300")} />
              <span className={cn("font-medium transition-opacity", !isOpen && "opacity-0")}>{item.label}</span>
            </button>
          ))}
        </div>

        {categories.length > 0 && (
          <div className="mt-8">
            <p className={cn("px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider", !isOpen && "hidden")}>Categories</p>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group",
                  activeFilter === cat 
                    ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400" 
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                )}
              >
                <Folder size={20} className="text-gray-400 shrink-0" />
                <span className={cn("font-medium transition-opacity", !isOpen && "opacity-0")}>{cat}</span>
              </button>
            ))}
          </div>
        )}
      </nav>

      <div className="p-4 border-t dark:border-gray-800">
        <div className={cn("bg-gray-50 dark:bg-gray-900 p-4 rounded-2xl transition-opacity", !isOpen && "opacity-0")}>
          <p className="text-xs font-medium text-gray-500">Pro Plan</p>
          <p className="text-sm font-bold mt-1">Unlimited Tasks</p>
          <button className="w-full mt-3 bg-white dark:bg-gray-800 text-xs font-bold py-2 rounded-lg border dark:border-gray-700 shadow-sm">
            Upgrade
          </button>
        </div>
      </div>
    </aside>
  );
}
