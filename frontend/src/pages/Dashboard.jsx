import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, LayoutGrid, Trash2, Users, Calendar, Crown } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import Avatar from '../components/Avatar';
import { format } from 'date-fns';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => { fetchBoards(); }, []);

  const fetchBoards = async () => {
    try {
      const { data } = await api.get('/boards');
      setBoards(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setCreating(true);
    try {
      const { data } = await api.post('/boards', { title: newTitle.trim(), description: newDesc.trim() });
      setShowModal(false); setNewTitle(''); setNewDesc('');
      navigate(`/board/${data._id}`);
    } catch (err) { console.error(err); }
    finally { setCreating(false); }
  };

  const handleDelete = async (e, id) => {
    e.preventDefault(); e.stopPropagation();
    if (!window.confirm('Delete this board and all its tasks?')) return;
    try {
      await api.delete(`/boards/${id}`);
      setBoards(prev => prev.filter(b => b._id !== id));
    } catch (err) { console.error(err); }
  };

  const cardColors = ['from-brand-500 to-brand-700', 'from-violet-500 to-purple-700', 'from-sky-500 to-blue-700', 'from-emerald-500 to-teal-700', 'from-amber-500 to-orange-600', 'from-rose-500 to-pink-700'];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-surface-900">My boards</h1>
          <p className="text-sm text-surface-500 mt-0.5">Welcome back, {user?.name?.split(' ')[0]} 👋</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus size={16} />
          <span className="hidden sm:inline">New board</span>
          <span className="sm:hidden">New</span>
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => <div key={i} className="h-40 rounded-xl bg-surface-100 animate-pulse" />)}
        </div>
      ) : boards.length === 0 ? (
        <div className="card text-center py-16 px-6">
          <span className="h-14 w-14 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-600 mx-auto mb-4">
            <LayoutGrid size={28} />
          </span>
          <h2 className="text-lg font-bold text-surface-900">No boards yet</h2>
          <p className="text-sm text-surface-500 mt-1 max-w-sm mx-auto">Create your first board to start organising tasks with your team.</p>
          <button onClick={() => setShowModal(true)} className="btn-primary mt-5 mx-auto">
            <Plus size={16} /> Create a board
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {boards.map((board, i) => {
            const isOwner = board.owner._id === user?._id || board.owner === user?._id;
            const color = cardColors[i % cardColors.length];
            return (
              <Link key={board._id} to={`/board/${board._id}`}
                className="card group overflow-hidden hover:shadow-card-hover transition-all duration-200 animate-fade-in flex flex-col">
                {/* Color bar */}
                <div className={`h-2 bg-gradient-to-r ${color} w-full`} />
                <div className="p-4 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-surface-900 truncate">{board.title}</h3>
                      {board.description && (
                        <p className="text-xs text-surface-500 mt-0.5 line-clamp-2">{board.description}</p>
                      )}
                    </div>
                    {isOwner && (
                      <button onClick={e => handleDelete(e, board._id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity btn-ghost btn-icon !h-7 !w-7 text-surface-400 hover:text-red-500">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex -space-x-1.5">
                      <Avatar user={board.owner} size="sm" showRing />
                      {(board.members || []).slice(0, 3).map(m => (
                        <Avatar key={m.user?._id || m._id} user={m.user || m} size="sm" showRing />
                      ))}
                      {board.members?.length > 3 && (
                        <span className="h-7 w-7 rounded-full ring-2 ring-white bg-surface-200 flex items-center justify-center text-[10px] font-bold text-surface-600">
                          +{board.members.length - 3}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {isOwner && (
                        <span className="badge bg-amber-50 text-amber-700 gap-1">
                          <Crown size={9} /> owner
                        </span>
                      )}
                      <span className="text-xs text-surface-400">
                        {format(new Date(board.updatedAt), 'MMM d')}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Create board modal */}
      {showModal && (
        <div className="fixed inset-0 bg-surface-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="card w-full max-w-sm p-5 animate-slide-up" onClick={e => e.stopPropagation()}>
            <h2 className="font-bold text-lg text-surface-900 mb-4">Create a board</h2>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-surface-500 mb-1">Board name *</label>
                <input autoFocus className="input" placeholder="e.g. Product Launch Q3"
                  value={newTitle} onChange={e => setNewTitle(e.target.value)} maxLength={60} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-surface-500 mb-1">Description <span className="font-normal">(optional)</span></label>
                <textarea className="input resize-none" rows={2} placeholder="What's this board for?"
                  value={newDesc} onChange={e => setNewDesc(e.target.value)} maxLength={300} />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" disabled={creating || !newTitle.trim()} className="btn-primary">
                  {creating ? 'Creating…' : 'Create board'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default Dashboard;
