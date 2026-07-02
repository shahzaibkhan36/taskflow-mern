import { Draggable } from '@hello-pangea/dnd';
import { Calendar, AlertTriangle, Clock } from 'lucide-react';
import { format, isPast, isToday, isTomorrow } from 'date-fns';
import Avatar from './Avatar';

const priorityConfig = {
  low: { cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  medium: { cls: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-400' },
  high: { cls: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-500' },
};

const TaskCard = ({ task, index, onClick }) => {
  const deadline = task.deadline ? new Date(task.deadline) : null;
  const overdue = deadline && isPast(deadline) && !isToday(deadline);
  const dueToday = deadline && isToday(deadline);
  const dueTomorrow = deadline && isTomorrow(deadline);

  const deadlineColor = overdue ? 'text-red-600' : dueToday ? 'text-amber-600' : dueTomorrow ? 'text-amber-500' : 'text-surface-400';
  const { cls, dot } = priorityConfig[task.priority] || priorityConfig.medium;

  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={onClick}
          className={`card p-3 mb-2 cursor-pointer transition-all hover:shadow-card-hover group ${
            snapshot.isDragging ? 'shadow-card-hover rotate-1 ring-2 ring-brand-300 opacity-90' : ''
          }`}>
          {task.labels?.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {task.labels.map(l => (
                <span key={l} className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-brand-50 text-brand-700">
                  {l}
                </span>
              ))}
            </div>
          )}

          <p className="text-sm font-semibold text-surface-900 leading-snug mb-2.5 group-hover:text-brand-700 transition-colors">
            {task.title}
          </p>

          {task.description && (
            <p className="text-xs text-surface-500 mb-2.5 line-clamp-2 leading-relaxed">{task.description}</p>
          )}

          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${cls}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
                {task.priority}
              </span>

              {deadline && (
                <span className={`flex items-center gap-1 text-[10px] font-semibold ${deadlineColor}`}>
                  {overdue ? <AlertTriangle size={10} /> : dueToday ? <Clock size={10} /> : <Calendar size={10} />}
                  {overdue ? 'Overdue' : dueToday ? 'Today' : dueTomorrow ? 'Tomorrow' : format(deadline, 'MMM d')}
                </span>
              )}
            </div>

            {task.assignees?.length > 0 && (
              <div className="flex -space-x-1.5 shrink-0">
                {task.assignees.slice(0, 3).map(a => (
                  <Avatar key={a._id} user={a} size="xs" showRing />
                ))}
                {task.assignees.length > 3 && (
                  <span className="h-5 w-5 rounded-full ring-2 ring-white bg-surface-200 flex items-center justify-center text-[9px] font-bold text-surface-600">
                    +{task.assignees.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;
