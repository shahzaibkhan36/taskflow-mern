import { Droppable } from '@hello-pangea/dnd';
import { Plus, MoreHorizontal } from 'lucide-react';
import TaskCard from './TaskCard';

const columnAccent = {
  todo: { dot: 'bg-surface-400', bg: 'bg-surface-100' },
  inprogress: { dot: 'bg-blue-500', bg: 'bg-blue-50/60' },
  review: { dot: 'bg-amber-500', bg: 'bg-amber-50/60' },
  done: { dot: 'bg-emerald-500', bg: 'bg-emerald-50/60' },
};

const Column = ({ column, tasks, onAddTask, onTaskClick }) => {
  const accent = columnAccent[column.id] || columnAccent.todo;

  return (
    <div className={`flex flex-col w-[280px] sm:w-[300px] shrink-0 rounded-xl ${accent.bg}`}>
      {/* Column header */}
      <div className="flex items-center justify-between px-3 pt-3 pb-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className={`h-2 w-2 rounded-full shrink-0 ${accent.dot}`} />
          <h3 className="font-bold text-sm text-surface-700 truncate">{column.title}</h3>
          <span className="text-[11px] font-bold text-surface-400 bg-white/80 rounded-full px-2 py-0.5 shrink-0">
            {tasks.length}
          </span>
        </div>
        <button
          onClick={() => onAddTask(column.id)}
          title="Add task"
          className="btn-ghost btn-icon !h-7 !w-7 text-surface-400 hover:text-brand-600">
          <Plus size={15} />
        </button>
      </div>

      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 px-2 pb-2 min-h-[60px] rounded-lg transition-colors ${
              snapshot.isDraggingOver ? 'bg-brand-100/50' : ''
            }`}>
            {tasks.map((task, index) => (
              <TaskCard key={task._id} task={task} index={index} onClick={() => onTaskClick(task)} />
            ))}
            {provided.placeholder}

            {tasks.length === 0 && !snapshot.isDraggingOver && (
              <button
                onClick={() => onAddTask(column.id)}
                className="w-full text-xs text-surface-400 hover:text-brand-600 border-2 border-dashed border-surface-200 hover:border-brand-300 rounded-lg py-5 mt-1 transition-colors">
                + Add a task
              </button>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default Column;
