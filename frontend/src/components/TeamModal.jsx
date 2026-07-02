import { useState, useEffect, useRef } from 'react';
import { X, Crown, Shield, User, UserMinus, UserPlus, Search, AlertCircle } from 'lucide-react';
import api from '../utils/api';
import Avatar from './Avatar';

const roleInfo = {
  owner: { label: 'Owner', icon: Crown, color: 'text-amber-600 bg-amber-50', desc: 'Full control' },
  admin: { label: 'Admin', icon: Shield, color: 'text-brand-600 bg-brand-50', desc: 'Can manage members & tasks' },
  member: { label: 'Member', icon: User, color: 'text-surface-600 bg-surface-100', desc: 'Can create & edit tasks' },
};

const TeamModal = ({ board, myRole, onClose, onBoardUpdate }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [members, setMembers] = useState(board.members || []);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const timer = useRef(null);

  const currentMemberIds = members.map(m => m.user._id);

  useEffect(() => {
    if (!query.trim()) return setResults([]);
    clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      try {
        const exclude = [board.owner._id, ...currentMemberIds].join(',');
        const { data } = await api.get(`/auth/search?q=${encodeURIComponent(query)}&exclude=${exclude}`);
        setResults(data);
      } catch { }
    }, 300);
    return () => clearTimeout(timer.current);
  }, [query, members]);

  const addMember = async (userId, role = 'member') => {
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post(`/boards/${board._id}/members`, { userId, role });
      setMembers(data);
      setQuery('');
      setResults([]);
      onBoardUpdate({ ...board, members: data });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add member');
    } finally { setLoading(false); }
  };

  const changeRole = async (userId, role) => {
    setError('');
    try {
      const { data } = await api.put(`/boards/${board._id}/members/${userId}`, { role });
      setMembers(data);
      onBoardUpdate({ ...board, members: data });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change role');
    }
  };

  const removeMember = async (userId) => {
    if (!window.confirm('Remove this member from the board?')) return;
    setError('');
    try {
      await api.delete(`/boards/${board._id}/members/${userId}`);
      const updated = members.filter(m => m.user._id !== userId);
      setMembers(updated);
      onBoardUpdate({ ...board, members: updated });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove member');
    }
  };

  const canManage = myRole === 'owner' || myRole === 'admin';

  return (
    <div className="fixed inset-0 bg-surface-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="card w-full max-w-md max-h-[90vh] flex flex-col animate-slide-up" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-surface-100 shrink-0">
          <div>
            <h2 className="font-bold text-lg text-surface-900">Team members</h2>
            <p className="text-xs text-surface-500 mt-0.5">{1 + members.length} member{members.length !== 0 ? 's' : ''} · {board.title}</p>
          </div>
          <button onClick={onClose} className="btn-ghost btn-icon"><X size={18} /></button>
        </div>

        <div className="overflow-y-auto flex-1 p-5 space-y-5">
          {error && (
            <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
              <AlertCircle size={15} className="shrink-0 mt-0.5" />{error}
            </div>
          )}

          {/* Member list */}
          <div className="space-y-2">
            {/* Owner row */}
            <MemberRow user={board.owner} role="owner" myRole={myRole} isOwner />

            {members.map(m => (
              <MemberRow
                key={m.user._id}
                user={m.user}
                role={m.role}
                myRole={myRole}
                canManage={canManage}
                onChangeRole={(r) => changeRole(m.user._id, r)}
                onRemove={() => removeMember(m.user._id)}
              />
            ))}

            {members.length === 0 && (
              <p className="text-sm text-surface-400 text-center py-3">No other members yet</p>
            )}
          </div>

          {/* Add member */}
          {canManage && (
            <div>
              <label className="block text-xs font-semibold text-surface-500 mb-2">Add teammate</label>
              <div className="relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
                <input
                  className="input pl-9"
                  placeholder="Search by name or email…"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                />
              </div>
              {results.length > 0 && (
                <div className="card mt-1 p-1 max-h-48 overflow-y-auto">
                  {results.map(u => (
                    <div key={u._id} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-surface-50">
                      <Avatar user={u} size="sm" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-surface-800 truncate">{u.name}</p>
                        <p className="text-xs text-surface-400 truncate">{u.email}</p>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <button onClick={() => addMember(u._id, 'member')} disabled={loading}
                          className="text-xs btn-secondary !py-1 !px-2">
                          <UserPlus size={12} /> Member
                        </button>
                        {myRole === 'owner' && (
                          <button onClick={() => addMember(u._id, 'admin')} disabled={loading}
                            className="text-xs btn-secondary !py-1 !px-2 text-brand-600">
                            <Shield size={12} /> Admin
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Role legend */}
          <div className="bg-surface-50 rounded-xl p-4 space-y-2">
            <p className="text-xs font-semibold text-surface-500 mb-2">Role permissions</p>
            {Object.entries(roleInfo).map(([key, info]) => (
              <div key={key} className="flex items-center gap-2 text-xs text-surface-600">
                <span className={`badge ${info.color}`}><info.icon size={10} className="mr-1" />{info.label}</span>
                <span>{info.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const MemberRow = ({ user, role, myRole, isOwner, canManage, onChangeRole, onRemove }) => {
  const info = roleInfo[role] || roleInfo.member;
  return (
    <div className="flex items-center gap-3 py-2">
      <Avatar user={user} size="sm" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-surface-800 truncate">{user.name}</p>
        <p className="text-xs text-surface-400 truncate">{user.email}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {canManage && !isOwner && myRole === 'owner' ? (
          <select
            value={role}
            onChange={e => onChangeRole(e.target.value)}
            className="text-xs border border-surface-200 rounded-lg px-2 py-1 bg-white text-surface-700 focus:outline-none focus:border-brand-500">
            <option value="admin">Admin</option>
            <option value="member">Member</option>
          </select>
        ) : (
          <span className={`badge ${info.color} gap-1`}>
            <info.icon size={10} />{info.label}
          </span>
        )}
        {canManage && !isOwner && (
          <button onClick={onRemove} className="btn-ghost btn-icon !h-7 !w-7 text-red-400 hover:text-red-600 hover:bg-red-50">
            <UserMinus size={14} />
          </button>
        )}
      </div>
    </div>
  );
};

export default TeamModal;
