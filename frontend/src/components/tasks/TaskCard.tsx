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
      className={`bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing touch-none ${
        isDragging ? 'shadow-xl z-50 ring-2 ring-blue-500' : ''
      }`}
    >
      <h4 className="font-semibold text-gray-900 leading-snug">{task.title}</h4>
      
      {task.description && (
        <p className="text-gray-600 text-sm mt-1.5 line-clamp-2">
          {task.description}
        </p>
      )}
      
      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-1.5 font-medium">
          <UserIcon className="w-3.5 h-3.5 text-gray-400" />
          <span className="truncate max-w-[100px]">
            {task.assignedUser ? task.assignedUser.name : 'Unassigned'}
          </span>
        </div>
        
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-gray-400" />
          <span>{new Date(task.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}