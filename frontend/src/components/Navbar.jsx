import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutGrid, LogOut, Settings, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Avatar from './Avatar';
import ProfileModal from './ProfileModal';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const dropRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropdownOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-surface-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-extrabold text-base text-surface-900">
            <span className="h-7 w-7 rounded-lg bg-brand-600 flex items-center justify-center text-white shrink-0">
              <LayoutGrid size={15} />
            </span>
            <span className="hidden sm:inline">TaskFlow</span>
          </Link>

          {/* Profile dropdown */}
          <div className="relative" ref={dropRef}>
            <button
              onClick={() => setDropdownOpen(p => !p)}
              className="flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-surface-100 transition-colors">
              <Avatar user={user} size="sm" />
              <span className="hidden sm:block text-sm font-semibold text-surface-800 max-w-[120px] truncate">{user?.name}</span>
              <ChevronDown size={14} className={`text-surface-400 transition-transform hidden sm:block ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 card shadow-lg py-1 z-50 animate-fade-in">
                {/* User info */}
                <div className="px-4 py-3 border-b border-surface-100">
                  <div className="flex items-center gap-3">
                    <Avatar user={user} size="md" />
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-surface-900 truncate">{user?.name}</p>
                      <p className="text-xs text-surface-400 truncate">{user?.email}</p>
                    </div>
                  </div>
                </div>

                <button onClick={() => { setDropdownOpen(false); setProfileOpen(true); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-surface-700 hover:bg-surface-50 transition-colors">
                  <Settings size={15} className="text-surface-400" /> Account settings
                </button>

                <div className="border-t border-surface-100 mt-1 pt-1">
                  <button onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                    <LogOut size={15} /> Log out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {profileOpen && <ProfileModal onClose={() => setProfileOpen(false)} />}
    </>
  );
};

export default Navbar;
