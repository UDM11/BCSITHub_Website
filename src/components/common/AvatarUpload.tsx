import React from 'react';

interface AvatarProps {
  role?: string; // 'student', 'teacher', 'admin' or undefined
  size?: number; // optional, default is 120px
}

const getInitialAndColor = (role: string = '') => {
  switch (role.toLowerCase()) {
    case 'student':
      return { initial: 'S', bg: 'black', color: 'green' }; // green
    case 'teacher':
      return { initial: 'T', bg: '#FEF3C7', color: '#92400E' }; // yellow
    case 'admin':
      return { initial: 'A', bg: '#FECACA', color: '#991B1B' }; // red
    default:
      return { initial: 'S', bg: '#E5E7EB', color: '#374151' }; // gray
  }
};

const AvatarInitials: React.FC<AvatarProps> = ({ role, size = 200 }) => {
  const { initial, bg, color } = getInitialAndColor(role);

  return (
    <div
      role="img"
      aria-label={`${role} avatar initial`}
      style={{
        width: size,
        height: size,
        backgroundColor: bg,
        color: color,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        fontSize: size / 1.5,
        userSelect: 'none',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      {initial}
    </div>
  );
};

export default AvatarInitials;
