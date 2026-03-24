import React from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Star, 
  MoreVertical, 
  Calendar, 
  Tag, 
  Trash2, 
  Edit3,
  Paperclip
} from 'lucide-react';
import { Task } from '../types';
import { useTasks } from '../contexts/TaskContext';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';

interface TaskCardProps {
  task: Task;
  viewMode: 'grid' | 'list';
  onEdit: () => void;
}

export function TaskCard({ task, viewMode, onEdit }: TaskCardProps) {
  const { toggleComplete, togglePinned, deleteTask } = useTasks();

  const priorityColors = {
    low: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      className={cn(
        "group relative rounded-2xl border transition-all duration-300 overflow-hidden",
        viewMode === 'grid' ? "flex flex-col h-full" : "flex items-center p-4 gap-4",
        task.completed ? "opacity-60 grayscale-[0.5]" : "opacity-100",
        "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-none"
      )}
      style={{ borderTop: `4px solid ${task.color}` }}
    >
      <div className={cn(
        "flex-1",
        viewMode === 'grid' ? "p-5" : "flex items-center gap-4 flex-1"
      )}>
        <div className="flex items-start justify-between mb-3">
          <button 
            onClick={() => toggleComplete(task.id)}
            className={cn(
              "p-1 rounded-full transition-colors",
              task.completed ? "text-green-500" : "text-gray-400 hover:text-blue-500"
            )}
          >
            {task.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
          </button>
          
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={() => togglePinned(task.id)}
              className={cn(
                "p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
                task.pinned ? "text-yellow-500" : "text-gray-400"
              )}
            >
              <Star size={18} fill={task.pinned ? "currentColor" : "none"} />
            </button>
            <button 
              onClick={onEdit}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-blue-500 transition-colors"
            >
              <Edit3 size={18} />
            </button>
            <button 
              onClick={() => deleteTask(task.id)}
              className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        <div className={cn(viewMode === 'list' && "flex-1")}>
          <h3 className={cn(
            "font-bold text-lg leading-tight mb-2",
            task.completed && "line-through text-gray-500"
          )}>
            {task.title}
          </h3>
          
          {viewMode === 'grid' && task.description && (
            <div className="text-gray-500 text-sm line-clamp-3 mb-4 prose prose-sm dark:prose-invert">
              <ReactMarkdown>{task.description}</ReactMarkdown>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mt-auto">
          <span className={cn(
            "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md",
            priorityColors[task.priority]
          )}>
            {task.priority}
          </span>
          {task.dueDate && (
            <span className="flex items-center gap-1 text-[10px] font-medium text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-md">
              <Calendar size={12} />
              {format(new Date(task.dueDate), 'MMM d')}
            </span>
          )}
          {task.category && (
            <span className="flex items-center gap-1 text-[10px] font-medium text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-md">
              <Tag size={12} />
              {task.category}
            </span>
          )}
        </div>
      </div>

      {viewMode === 'grid' && task.subtasks.length > 0 && (
        <div className="px-5 pb-5 pt-2 border-t dark:border-gray-800">
          <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
            <span>Subtasks</span>
            <span>{task.subtasks.filter(s => s.completed).length}/{task.subtasks.length}</span>
          </div>
          <div className="w-full bg-gray-100 dark:bg-gray-800 h-1 rounded-full overflow-hidden">
            <div 
              className="bg-blue-500 h-full transition-all duration-500" 
              style={{ width: `${(task.subtasks.filter(s => s.completed).length / task.subtasks.length) * 100}%` }}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
}
