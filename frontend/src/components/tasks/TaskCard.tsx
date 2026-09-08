import { Task } from '@/services/task.service';
import { Calendar, User as UserIcon } from 'lucide-react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

interface TaskCardProps {
  task: Task;
  onClick: () => void; 
}

export default function TaskCard({ task, onClick }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task._id,
    data: { task },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={onClick} 
      // Velora Glass Card UI with hover elevation and drag focus
      className={`bg-white/[0.04] p-5 rounded-xl border border-white/[0.08] backdrop-blur-sm transition-all duration-200 cursor-grab active:cursor-grabbing touch-none hover:-translate-y-1 hover:bg-white/[0.06] hover:border-white/[0.12] hover:shadow-[0_8px_20px_rgba(0,0,0,0.25)] ${
        isDragging ? 'shadow-2xl z-50 ring-2 ring-indigo-500/50 bg-white/[0.08] border-indigo-500/30 scale-105' : ''
      }`}
    >
      <h4 className="font-semibold text-white leading-snug">{task.title}</h4>
      
      {task.description && (
        <p className="text-slate-400 text-sm mt-1.5 line-clamp-2">
          {task.description}
        </p>
      )}
      
      <div className="mt-4 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-1.5 font-medium bg-white/[0.03] px-2.5 py-1 rounded-md border border-white/[0.05]">
          <UserIcon className="w-3.5 h-3.5 text-indigo-400" />
          <span className="truncate max-w-[100px] text-slate-300">
            {task.assignedUser ? task.assignedUser.name : 'Unassigned'}
          </span>
        </div>
        
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          <span>{new Date(task.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}