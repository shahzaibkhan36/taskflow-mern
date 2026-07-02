import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { DragDropContext } from '@hello-pangea/dnd';
import { ArrowLeft, Users, Plus, Settings2 } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import Column from '../components/Column';
import TaskModal from '../components/TaskModal';
import TeamModal from '../components/TeamModal';
import Avatar from '../components/Avatar';

const BoardView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [board, setBoard] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [myRole, setMyRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modal, setModal] = useState({ open: false, task: null, columnId: null });
  const [teamOpen, setTeamOpen] = useState(false);

  useEffect(() => { fetchBoard(); }, [id]);

  const fetchBoard = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/boards/${id}`);
      setBoard(data.board);
      setTasks(data.tasks);
      setMyRole(data.myRole);
    } catch (err) {
      setError(err.response?.status === 403 || err.response?.status === 404
        ? 'Board not found or you do not have access.'
        : 'Failed to load board. Please refresh.');
    } finally { setLoading(false); }
  };

  const getColumnTasks = useCallback(
    (columnId) => tasks.filter(t => t.columnId === columnId).sort((a, b) => a.order - b.order),
    [tasks]
  );

  const onDragEnd = async ({ source, destination, draggableId }) => {
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    setTasks(prev => prev.map(t => {
      if (t._id === draggableId) return { ...t, columnId: destination.droppableId, order: destination.index };
      if (t.columnId === source.droppableId && t.order > source.index && t._id !== draggableId)
        return { ...t, order: t.order - 1 };
      if (t.columnId === destination.droppableId && t.order >= destination.index && t._id !== draggableId)
        return { ...t, order: t.order + 1 };
      return t;
    }));

    try {
      await api.patch(`/tasks/${draggableId}/move`, { columnId: destination.droppableId, order: destination.index });
    } catch (err) { console.error('Move failed:', err); fetchBoard(); }
  };

  const openAdd = (columnId) => setModal({ open: true, task: null, columnId });
  const openEdit = (task) => setModal({ open: true, task, columnId: task.columnId });
  const closeModal = () => setModal({ open: false, task: null, columnId: null });

  const handleSave = (saved, isEdit) => {
    setTasks(prev => isEdit ? prev.map(t => t._id === saved._id ? saved : t) : [...prev, saved]);
    closeModal();
  };

  const handleDelete = (taskId) => {
    setTasks(prev => prev.filter(t => t._id !== taskId));
    closeModal();
  };

  const allBoardPeople = board ? [board.owner, ...(board.members || []).map(m => m.user || m)] : [];

  if (loading) return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center">
      <div className="h-8 w-8 rounded-full border-2 border-brand-200 border-t-brand-600 animate-spin" />
    </div>
  );

  if (error) return (
    <div className="min-h-[calc(100vh-56px)] flex flex-col items-center justify-center gap-3 px-4">
      <p className="text-surface-600 text-center">{error}</p>
      <button onClick={() => navigate('/')} className="btn-primary">Back to boards</button>
    </div>
  );

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 56px)' }}>
      {/* Board header */}
      <div className="flex items-center gap-3 px-4 py-2.5 border-b border-surface-200 bg-white shrink-0">
        <Link to="/" className="btn-ghost btn-icon text-surface-400">
          <ArrowLeft size={18} />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="font-extrabold text-base sm:text-lg text-surface-900 truncate">{board?.title}</h1>
          {board?.description && (
            <p className="text-xs text-surface-500 truncate hidden sm:block">{board.description}</p>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Member avatars */}
          <button onClick={() => setTeamOpen(true)} className="flex items-center -space-x-2 hover:opacity-80 transition-opacity">
            {allBoardPeople.slice(0, 4).map(u => u && (
              <Avatar key={u._id} user={u} size="sm" showRing />
            ))}
            {allBoardPeople.length > 4 && (
              <span className="h-7 w-7 rounded-full ring-2 ring-white bg-surface-200 flex items-center justify-center text-[10px] font-bold text-surface-600">
                +{allBoardPeople.length - 4}
              </span>
            )}
          </button>

          {(myRole === 'owner' || myRole === 'admin') && (
            <button onClick={() => setTeamOpen(true)} className="btn-secondary !py-1.5 !px-3 hidden sm:flex">
              <Users size={14} /> Team
            </button>
          )}

          <button onClick={() => openAdd(board?.columns?.[0]?.id || 'todo')} className="btn-primary !py-1.5 !px-3">
            <Plus size={15} />
            <span className="hidden sm:inline">Add task</span>
          </button>
        </div>
      </div>

      {/* Role badge */}
      {myRole && (
        <div className="bg-surface-50 border-b border-surface-100 px-4 py-1 flex items-center gap-2">
          <span className="text-[11px] text-surface-400">Your role:</span>
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
            myRole === 'owner' ? 'bg-amber-50 text-amber-700' :
            myRole === 'admin' ? 'bg-brand-50 text-brand-700' :
            'bg-surface-100 text-surface-600'
          }`}>{myRole}</span>
        </div>
      )}

      {/* Kanban board */}
      <div className="flex-1 overflow-hidden">
        <div className="kanban-board">
          <DragDropContext onDragEnd={onDragEnd}>
            {(board?.columns || []).sort((a, b) => a.order - b.order).map(col => (
              <Column key={col.id} column={col} tasks={getColumnTasks(col.id)}
                onAddTask={openAdd} onTaskClick={openEdit} />
            ))}
          </DragDropContext>
        </div>
      </div>

      {modal.open && (
        <TaskModal
          task={modal.task}
          boardId={id}
          columnId={modal.columnId}
          boardMembers={board?.members || []}
          boardOwner={board?.owner}
          onClose={closeModal}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}

      {teamOpen && (
        <TeamModal
          board={board}
          myRole={myRole}
          onClose={() => setTeamOpen(false)}
          onBoardUpdate={setBoard}
        />
      )}
    </div>
  );
};

export default BoardView;
