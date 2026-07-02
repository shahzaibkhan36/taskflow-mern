import { useState, useEffect, useRef } from 'react';
import { X, Trash2, Calendar, Tag, Users, ChevronDown } from 'lucide-react';
import api from '../utils/api';
import Avatar from './Avatar';

const priorities = ['low', 'medium', 'high'];
const priorityColors = { low: 'border-emerald-500 bg-emerald-500', medium: 'border-amber-400 bg-amber-400', high: 'border-red-500 bg-red-500' };

const TaskModal = ({ task, boardId, columnId, boardMembers, boardOwner, onClose, onSave, onDelete }) => {
  const isEditing = Boolean(task);
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [priority, setPriority] = useState(task?.priority || 'medium');
  const [deadline, setDeadline] = useState(task?.deadline ? task.deadline.slice(0, 10) : '');
  const [labels, setLabels] = useState(task?.labels || []);
  const [labelInput, setLabelInput] = useState('');
  const [assignees, setAssignees] = useState(task?.assignees || []);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // All people on this board (owner + members)
  const allMembers = [
    boardOwner,
    ...(boardMembers || []).map(m => m.user || m),
  ].filter(Boolean).filter((u, i, arr) => arr.findIndex(x => x._id === u._id) === i);

  const addLabel = () => {
    const val = labelInput.trim();
    if (val && !labels.includes(val) && labels.length < 6) setLabels([...labels, val]);
    setLabelInput('');
  };

  const toggleAssignee = (member) => {
    const exists = assignees.some(a => (a._id || a) === member._id);
    if (exists) setAssignees(assignees.filter(a => (a._id || a) !== member._id));
    else setAssignees([...assignees, member]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true); setError('');
    const payload = {
      title: title.trim(), description: description.trim(), priority,
      deadline: deadline || null, labels,
      assignees: assignees.map(a => a._id || a),
    };
    try {
      let result;
      if (isEditing) {
        const { data } = await api.put(`/tasks/${task._id}`, payload);
        result = data;
      } else {
        const { data } = await api.post('/tasks', { ...payload, board: boardId, columnId });
        result = data;
      }
      onSave(result, isEditing);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong saving the task.');
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this task permanently?')) return;
    try {
      await api.delete(`/tasks/${task._id}`);
      onDelete(task._id);
    } catch (err) { console.error(err); }
  };

  return (
    <div className="fixed inset-0 bg-surface-900/50 backdrop-blur-sm z-50 flex items-start sm:items-center justify-center p-2 sm:p-4 overflow-y-auto" onClick={onClose}>
      <div className="card w-full max-w-lg my-2 sm:my-0 animate-slide-up" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-surface-100">
          <h2 className="font-bold text-base sm:text-lg text-surface-900">{isEditing ? 'Edit task' : 'New task'}</h2>
          <button onClick={onClose} className="btn-ghost btn-icon"><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4">
          {error && <div className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</div>}

          {/* Title */}
          <input autoFocus className="input font-semibold text-base" placeholder="Task title" value={title}
            onChange={e => setTitle(e.target.value)} maxLength={120} required />

          {/* Description */}
          <textarea className="input resize-none text-sm" rows={3} placeholder="Add a description…"
            value={description} onChange={e => setDescription(e.target.value)} maxLength={2000} />

          {/* Priority + Deadline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-surface-500 mb-2 uppercase tracking-wide">Priority</label>
              <div className="flex gap-2">
                {priorities.map(p => (
                  <button key={p} type="button" onClick={() => setPriority(p)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold rounded-lg border-2 capitalize transition-all ${
                      priority === p
                        ? `${priorityColors[p]} text-white`
                        : 'border-surface-200 bg-white text-surface-500 hover:bg-surface-50'
                    }`}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-surface-500 mb-2 uppercase tracking-wide">Deadline</label>
              <input type="date" className="input" value={deadline} onChange={e => setDeadline(e.target.value)} />
            </div>
          </div>

          {/* Labels */}
          <div>
            <label className="block text-xs font-bold text-surface-500 mb-2 uppercase tracking-wide">Labels</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {labels.map(l => (
                <span key={l} className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-50 text-brand-700">
                  {l}
                  <button type="button" onClick={() => setLabels(labels.filter(x => x !== l))} className="hover:text-brand-900">
                    <X size={11} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input className="input flex-1" placeholder="Type a label…" value={labelInput}
                onChange={e => setLabelInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addLabel(); } }} />
              <button type="button" onClick={addLabel} className="btn-secondary !px-3 shrink-0">Add</button>
            </div>
          </div>

          {/* Assignees — grid of board members */}
          {allMembers.length > 0 && (
            <div>
              <label className="block text-xs font-bold text-surface-500 mb-2 uppercase tracking-wide">Assign to</label>
              <div className="flex flex-wrap gap-2">
                {allMembers.map(member => {
                  const assigned = assignees.some(a => (a._id || a) === member._id);
                  return (
                    <button key={member._id} type="button" onClick={() => toggleAssignee(member)}
                      title={member.name}
                      className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-semibold border-2 transition-all ${
                        assigned
                          ? 'border-brand-500 bg-brand-50 text-brand-700'
                          : 'border-surface-200 bg-white text-surface-600 hover:border-surface-300'
                      }`}>
                      <Avatar user={member} size="xs" />
                      <span className="hidden sm:inline max-w-[80px] truncate">{member.name.split(' ')[0]}</span>
                      {assigned && <X size={11} />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-1 border-t border-surface-100">
            {isEditing ? (
              <button type="button" onClick={handleDelete} className="btn-danger !py-2">
                <Trash2 size={15} /> Delete
              </button>
            ) : <span />}
            <div className="flex gap-2">
              <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
              <button type="submit" disabled={saving || !title.trim()} className="btn-primary">
                {saving ? 'Saving…' : isEditing ? 'Save changes' : 'Create task'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
