import React, { useState, useEffect } from 'react';
import { 
  X, 
  Plus, 
  Calendar, 
  Tag, 
  Flag, 
  Palette, 
  CheckCircle2, 
  Trash2,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTasks } from '../contexts/TaskContext';
import { Task, Priority, Subtask } from '../types';
import { cn } from '../lib/utils';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task | null;
  isDarkMode: boolean;
}

export function TaskModal({ isOpen, onClose, task, isDarkMode }: TaskModalProps) {
  const { addTask, updateTask } = useTasks();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [category, setCategory] = useState('General');
  const [dueDate, setDueDate] = useState('');
  const [color, setColor] = useState('#ffffff');
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [newSubtask, setNewSubtask] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setPriority(task.priority);
      setCategory(task.category);
      setDueDate(task.dueDate || '');
      setColor(task.color);
      setSubtasks(task.subtasks);
    } else {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setCategory('General');
      setDueDate('');
      setColor('#ffffff');
      setSubtasks([]);
    }
  }, [task, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const taskData = {
      title,
      description,
      priority,
      category,
      dueDate: dueDate || null,
      color,
      subtasks,
    };

    if (task) {
      await updateTask(task.id, taskData);
    } else {
      await addTask(taskData);
    }
    onClose();
  };

  const addSubtask = () => {
    if (!newSubtask.trim()) return;
    setSubtasks([...subtasks, { id: Date.now().toString(), title: newSubtask, completed: false }]);
    setNewSubtask('');
  };

  const toggleSubtask = (id: string) => {
    setSubtasks(subtasks.map(s => s.id === id ? { ...s, completed: !s.completed } : s));
  };

  const removeSubtask = (id: string) => {
    setSubtasks(subtasks.filter(s => s.id !== id));
  };

  const colors = [
    '#ffffff', '#f28b82', '#fbbc04', '#fff475', 
    '#ccff90', '#a7ffeb', '#cbf0f8', '#aecbfa', 
    '#d7aefb', '#fdcfe8', '#e6c9a8', '#e8eaed'
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className={cn(
            "relative w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]",
            isDarkMode ? "bg-[#1e1e1e] text-white" : "bg-white text-gray-900"
          )}
          style={{ borderTop: `8px solid ${color}` }}
        >
          <div className="flex items-center justify-between p-6 border-b dark:border-gray-800">
            <h2 className="text-xl font-bold">{task ? 'Edit Task' : 'Create New Task'}</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Task Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-2xl font-bold bg-transparent border-none outline-none placeholder:text-gray-400"
                autoFocus
              />
              <textarea
                placeholder="Add a description (Markdown supported)..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full min-h-[120px] bg-transparent border-none outline-none resize-none placeholder:text-gray-400 text-gray-600 dark:text-gray-300"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Flag size={14} /> Priority
                </label>
                <div className="flex gap-2">
                  {(['low', 'medium', 'high'] as Priority[]).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={cn(
                        "flex-1 py-2 rounded-xl text-sm font-bold capitalize transition-all border",
                        priority === p 
                          ? "bg-blue-600 text-white border-blue-600" 
                          : "bg-transparent border-gray-200 dark:border-gray-800 text-gray-500 hover:border-blue-500"
                      )}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Calendar size={14} /> Due Date
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full py-2 px-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 outline-none focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Plus size={14} /> Subtasks
              </label>
              <div className="space-y-2">
                {subtasks.map((s) => (
                  <div key={s.id} className="flex items-center gap-3 group">
                    <button 
                      type="button"
                      onClick={() => toggleSubtask(s.id)}
                      className={cn("transition-colors", s.completed ? "text-green-500" : "text-gray-400")}
                    >
                      {s.completed ? <CheckCircle2 size={18} /> : <div className="w-[18px] h-[18px] rounded-full border-2 border-gray-300" />}
                    </button>
                    <span className={cn("flex-1 text-sm", s.completed && "line-through text-gray-500")}>{s.title}</span>
                    <button 
                      type="button"
                      onClick={() => removeSubtask(s.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add a subtask..."
                    value={newSubtask}
                    onChange={(e) => setNewSubtask(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSubtask())}
                    className="flex-1 bg-transparent border-b border-gray-200 dark:border-gray-800 outline-none text-sm py-1 focus:border-blue-500 transition-all"
                  />
                  <button 
                    type="button"
                    onClick={addSubtask}
                    className="p-1 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-all"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t dark:border-gray-800">
              <div className="flex items-center gap-2">
                <Palette size={18} className="text-gray-400" />
                <div className="flex gap-1">
                  {colors.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={cn(
                        "w-6 h-6 rounded-full border transition-all",
                        color === c ? "scale-125 border-blue-500" : "border-gray-200 dark:border-gray-700"
                      )}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Tag size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="pl-9 pr-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 outline-none text-sm focus:border-blue-500 transition-all"
                  />
                </div>
              </div>
            </div>
          </form>

          <div className="p-6 bg-gray-50 dark:bg-gray-900/50 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl font-bold text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-8 py-2.5 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all active:scale-95"
            >
              {task ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
