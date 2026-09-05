import { useDroppable } from '@dnd-kit/core';

interface KanbanColumnProps {
  id: 'TODO' | 'DOING' | 'DONE';
  title: string;
  color: string;
  borderColor: string;
  taskCount: number;
  children: React.ReactNode;
}

export default function KanbanColumn({ id, title, color, borderColor, taskCount, children }: KanbanColumnProps) {

    const { isOver, setNodeRef } = useDroppable({
    id: id,
  });

  return (
    <div 
      ref={setNodeRef}
      className={`flex flex-col rounded-xl p-4 border transition-colors min-h-[500px] ${color} ${borderColor} ${
        isOver ? 'ring-2 ring-blue-400 ring-offset-2' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <span className="bg-white text-gray-600 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm border border-gray-200">
          {taskCount}
        </span>
      </div>

      <div className="flex flex-col gap-3 flex-1">
        {children}
        
        {taskCount === 0 && (
          <div className="flex-1 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 text-sm mt-2">
            Drop tasks here
          </div>
        )}
      </div>
    </div>
  );
}