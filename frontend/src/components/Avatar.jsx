const Avatar = ({ user, size = 'md', className = '', showRing = false }) => {
  const sizes = {
    xs: 'h-5 w-5 text-[9px]',
    sm: 'h-7 w-7 text-[11px]',
    md: 'h-9 w-9 text-sm',
    lg: 'h-12 w-12 text-base',
    xl: 'h-20 w-20 text-2xl',
  };

  const ring = showRing ? 'ring-2 ring-white' : '';
  const base = `${sizes[size]} ${ring} ${className} rounded-full flex items-center justify-center font-bold text-white shrink-0 overflow-hidden`;

  if (user?.avatar) {
    return <img src={user.avatar} alt={user.name} className={`${base} object-cover`} style={{ backgroundColor: user.avatarColor }} />;
  }

  return (
    <span className={base} style={{ backgroundColor: user?.avatarColor || '#6366f1' }}>
      {user?.name?.[0]?.toUpperCase() || '?'}
    </span>
  );
};

export default Avatar;
