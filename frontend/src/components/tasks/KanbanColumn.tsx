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
      // Added backdrop blur and updated the drop-hover ring effect for the dark theme
      className={`flex flex-col rounded-[20px] p-5 border transition-all duration-300 min-h-[500px] backdrop-blur-md ${color} ${borderColor} ${
        isOver ? 'ring-2 ring-indigo-500/50 ring-offset-4 ring-offset-[#070b16] bg-white/[0.08]' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-semibold text-white tracking-wide">{title}</h3>
        {/* Velora Glass Badge */}
        <span className="bg-white/10 text-slate-300 text-xs font-bold px-3 py-1 rounded-full shadow-sm border border-white/10 backdrop-blur-sm">
          {taskCount}
        </span>
      </div>

      <div className="flex flex-col gap-3 flex-1">
        {children}
        
        {taskCount === 0 && (
          // Dark theme dashed drop zone
          <div className="flex-1 border-2 border-dashed border-white/10 bg-white/[0.02] rounded-xl flex items-center justify-center text-slate-500 text-sm mt-2 transition-colors">
            Drop tasks here
          </div>
        )}
      </div>
    </div>
  );
}