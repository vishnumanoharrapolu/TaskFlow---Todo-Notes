import React, { useState } from 'react';
import { 
  Search, 
  Menu, 
  Plus, 
  Sun, 
  Moon, 
  LogOut, 
  User as UserIcon,
  CheckCircle2,
  Clock,
  Star,
  Tag,
  LayoutGrid,
  List as ListIcon,
  Filter
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTasks } from '../contexts/TaskContext';
import { Sidebar } from './Sidebar';
import { TaskCard } from './TaskCard';
import { TaskModal } from './TaskModal';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

export function Layout() {
  const { user, profile, logout } = useAuth();
  const { tasks, loading } = useTasks();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          task.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeFilter === 'completed') return matchesSearch && task.completed;
    if (activeFilter === 'important') return matchesSearch && task.pinned;
    if (activeFilter === 'pending') return matchesSearch && !task.completed;
    return matchesSearch;
  });

  const categories = Array.from(new Set(tasks.map(t => t.category))).filter(Boolean);

  return (
    <div className={cn(
      "min-h-screen flex transition-colors duration-300",
      isDarkMode ? "bg-[#121212] text-white" : "bg-[#f8f9fa] text-gray-900"
    )}>
      {/* Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        activeFilter={activeFilter} 
        setActiveFilter={setActiveFilter}
        categories={categories}
        isDarkMode={isDarkMode}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className={cn(
          "h-16 flex items-center justify-between px-6 sticky top-0 z-10 border-b",
          isDarkMode ? "bg-[#121212]/80 border-gray-800" : "bg-white/80 border-gray-200",
          "backdrop-blur-md"
        )}>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-xl font-bold tracking-tight hidden sm:block">TaskFlow</h1>
          </div>

          <div className="flex-1 max-w-2xl mx-8 hidden md:block">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search tasks, notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn(
                  "w-full pl-10 pr-4 py-2 rounded-xl outline-none transition-all border",
                  isDarkMode 
                    ? "bg-gray-900 border-gray-800 focus:border-blue-500" 
                    : "bg-gray-100 border-transparent focus:bg-white focus:border-blue-500"
                )}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              title={viewMode === 'grid' ? "Switch to List" : "Switch to Grid"}
            >
              {viewMode === 'grid' ? <ListIcon size={20} /> : <LayoutGrid size={20} />}
            </button>
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className="h-8 w-[1px] bg-gray-200 dark:bg-gray-800 mx-1" />
            <div className="flex items-center gap-3 pl-2">
              <img 
                src={profile?.photoURL || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'} 
                alt="Profile" 
                className="h-8 w-8 rounded-full border border-gray-200 dark:border-gray-700"
                referrerPolicy="no-referrer"
              />
              <button 
                onClick={logout}
                className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 rounded-full transition-colors"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold capitalize">{activeFilter.replace('-', ' ')} Tasks</h2>
                <p className="text-gray-500 text-sm mt-1">{filteredTasks.length} items found</p>
              </div>
              <button 
                onClick={() => {
                  setEditingTask(null);
                  setIsModalOpen(true);
                }}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-blue-500/20 active:scale-95"
              >
                <Plus size={20} />
                <span>New Task</span>
              </button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-96 text-center">
                <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-full mb-4">
                  <CheckCircle2 size={48} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold">No tasks found</h3>
                <p className="text-gray-500 mt-2 max-w-xs">Try adjusting your filters or create a new task to get started.</p>
              </div>
            ) : (
              <motion.div 
                layout
                className={cn(
                  "gap-6",
                  viewMode === 'grid' 
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                    : "flex flex-col"
                )}
              >
                <AnimatePresence mode="popLayout">
                  {filteredTasks.map((task) => (
                    <TaskCard 
                      key={task.id} 
                      task={task} 
                      viewMode={viewMode}
                      onEdit={() => {
                        setEditingTask(task);
                        setIsModalOpen(true);
                      }}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>
      </main>

      {/* Modals */}
      <TaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        task={editingTask}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}
