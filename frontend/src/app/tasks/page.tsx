'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DndContext, DragEndEvent, closestCorners, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { getTasks, updateTaskStatus, Task } from '@/services/task.service';
import TaskCard from '@/components/tasks/TaskCard';
import KanbanColumn from '@/components/tasks/KanbanColumn';
import TaskModal from '@/components/tasks/TaskModal';
import TaskDetailsModal from '@/components/tasks/TaskDetailsModal';
import { Loader2, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// Updated column colors to match the dark glass UI theme
const COLUMNS = [
  { id: 'TODO', title: 'To Do', color: 'bg-slate-500/5', borderColor: 'border-slate-500/20' },
  { id: 'DOING', title: 'In Progress', color: 'bg-indigo-500/5', borderColor: 'border-indigo-500/20' },
  { id: 'DONE', title: 'Completed', color: 'bg-cyan-500/5', borderColor: 'border-cyan-500/20' }
] as const;

export default function TasksPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, 
      },
    })
  );

  const { data: tasks = [], isLoading, isError } = useQuery({
    queryKey: ['tasks'],
    queryFn: getTasks,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'TODO' | 'DOING' | 'DONE' }) => 
      updateTaskStatus(id, status),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previousTasks = queryClient.getQueryData(['tasks']);
      queryClient.setQueryData(['tasks'], (old: Task[]) =>
        old.map((task) => (task._id === id ? { ...task, status } : task))
      );
      return { previousTasks };
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(['tasks'], context?.previousTasks);
      alert('Failed to update task status. You may not have permission.');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as 'TODO' | 'DOING' | 'DONE';
    const taskData = active.data.current?.task as Task;

    if (taskData && taskData.status !== newStatus) {
      updateStatusMutation.mutate({ id: taskId, status: newStatus });
    }
  };

  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Tasks Board</h1>
          <p className="text-slate-400 mt-1">Manage your workflow and track progress.</p>
        </div>
        
        {/* Velora Glowing Action Button */}
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-gradient-to-br from-indigo-500 to-purple-500 text-white px-5 py-2.5 rounded-xl font-semibold hover:-translate-y-1 shadow-[0_10px_30px_rgba(99,102,241,0.3)] transition-all duration-300 border border-white/10"
        >
          <Plus className="w-4 h-4" />
          New Task
        </button>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
        </div>
      )}

      {isError && (
        // Velora Glass Error Panel
        <div className="bg-red-500/10 border border-red-500/20 backdrop-blur-sm text-red-400 p-4 rounded-xl text-sm">
          Failed to load tasks. Please try refreshing the page.
        </div>
      )}

      {!isLoading && !isError && (
        <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start h-full min-h-[600px]">
            {COLUMNS.map((col) => {
              const columnTasks = tasks.filter((t) => t.status === col.id);
              return (
                <KanbanColumn 
                  key={col.id} 
                  id={col.id}
                  title={col.title}
                  color={col.color}
                  borderColor={col.borderColor}
                  taskCount={columnTasks.length}
                >
                  {columnTasks.map((task) => (
                    <TaskCard 
                      key={task._id} 
                      task={task} 
                      onClick={() => setSelectedTask(task)} 
                    />
                  ))}
                </KanbanColumn>
              );
            })}
          </div>
        </DndContext>
      )}

      <TaskModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />
      
      <TaskDetailsModal 
        task={selectedTask}
        isOpen={selectedTask !== null}
        onClose={() => setSelectedTask(null)}
      />
    </DashboardLayout>
  );
}