import { useState, useRef } from 'react';
import { X, Camera, Eye, EyeOff, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Avatar from './Avatar';

const ProfileModal = ({ onClose }) => {
  const { user, updateProfile } = useAuth();
  const [tab, setTab] = useState('profile');
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatar, setAvatar] = useState(user?.avatar || null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1.5 * 1024 * 1024) {
      setError('Image must be under 1.5MB. Try compressing it first.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setAvatarPreview(ev.target.result);
      setAvatar(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const removeAvatar = () => {
    setAvatar(null);
    setAvatarPreview(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const saveProfile = async () => {
    setError(''); setSuccess('');
    if (!name.trim()) return setError('Name cannot be empty');
    setSaving(true);
    try {
      await updateProfile({ name, email, bio, avatar });
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally { setSaving(false); }
  };

  const savePassword = async () => {
    setError(''); setSuccess('');
    if (!currentPassword) return setError('Enter your current password');
    if (!newPassword) return setError('Enter a new password');
    if (newPassword.length < 6) return setError('New password must be at least 6 characters');
    if (newPassword !== confirmPassword) return setError('New passwords do not match');
    setSaving(true);
    try {
      await updateProfile({ currentPassword, newPassword });
      setSuccess('Password changed successfully!');
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 bg-surface-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="card w-full max-w-md animate-slide-up" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-surface-100">
          <h2 className="font-bold text-lg text-surface-900">Account settings</h2>
          <button onClick={onClose} className="btn-ghost btn-icon"><X size={18} /></button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-surface-100 px-5">
          {['profile', 'password'].map(t => (
            <button key={t} onClick={() => { setTab(t); setError(''); setSuccess(''); }}
              className={`py-3 px-4 text-sm font-semibold border-b-2 transition-colors capitalize ${
                tab === t ? 'border-brand-600 text-brand-600' : 'border-transparent text-surface-500 hover:text-surface-800'
              }`}>
              {t === 'profile' ? 'Profile' : 'Password'}
            </button>
          ))}
        </div>

        <div className="p-5 space-y-4">
          {error && (
            <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
              <AlertCircle size={15} className="mt-0.5 shrink-0" />{error}
            </div>
          )}
          {success && (
            <div className="flex items-start gap-2 text-sm text-emerald-700 bg-emerald-50 rounded-lg px-3 py-2">
              <Check size={15} className="mt-0.5 shrink-0" />{success}
            </div>
          )}

          {tab === 'profile' && (
            <>
              {/* Avatar section */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar user={{ ...user, avatar: avatarPreview }} size="xl" />
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="absolute -bottom-1 -right-1 h-7 w-7 bg-brand-600 text-white rounded-full flex items-center justify-center shadow-md hover:bg-brand-700 transition-colors">
                    <Camera size={13} />
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </div>
                <div>
                  <p className="font-semibold text-surface-900">{user?.name}</p>
                  <p className="text-xs text-surface-500 mt-0.5">{user?.email}</p>
                  {avatarPreview && (
                    <button onClick={removeAvatar} className="text-xs text-red-500 hover:text-red-700 mt-1">
                      Remove photo
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-surface-500 mb-1">Full name</label>
                <input className="input" value={name} onChange={e => setName(e.target.value)} maxLength={50} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-surface-500 mb-1">Email address</label>
                <input type="email" className="input" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-surface-500 mb-1">Bio <span className="font-normal text-surface-400">({bio.length}/200)</span></label>
                <textarea className="input resize-none" rows={2} value={bio} onChange={e => setBio(e.target.value)} maxLength={200} placeholder="Tell your team a bit about yourself…" />
              </div>
              <button onClick={saveProfile} disabled={saving} className="btn-primary w-full">
                {saving ? 'Saving…' : 'Save profile'}
              </button>
            </>
          )}

          {tab === 'password' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-surface-500 mb-1">Current password</label>
                <div className="relative">
                  <input type={showCurrent ? 'text' : 'password'} className="input pr-10" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
                  <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400">
                    {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-surface-500 mb-1">New password</label>
                <div className="relative">
                  <input type={showNew ? 'text' : 'password'} className="input pr-10" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                  <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400">
                    {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-surface-500 mb-1">Confirm new password</label>
                <input type="password" className="input" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
              </div>
              <button onClick={savePassword} disabled={saving} className="btn-primary w-full">
                {saving ? 'Saving…' : 'Change password'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
