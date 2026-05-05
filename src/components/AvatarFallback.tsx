import React from 'react';

interface AvatarFallbackProps {
  name?: string | null;
  photoURL?: string | null;
  size?: number;
  className?: string;
}

const initialsOf = (name?: string | null): string => {
  if (!name) return 'JH';
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);
  if (parts.length === 0) return 'JH';
  return parts.map((p) => p[0]?.toUpperCase() ?? '').join('');
};

export const AvatarFallback: React.FC<AvatarFallbackProps> = ({
  name,
  photoURL,
  size = 40,
  className = '',
}) => {
  const [errored, setErrored] = React.useState(false);

  if (photoURL && !errored) {
    return (
      <img
        src={photoURL}
        alt={name ?? 'Foto profil'}
        width={size}
        height={size}
        onError={() => setErrored(true)}
        className={`rounded-full object-cover ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  const initials = initialsOf(name);
  return (
    <div
      role="img"
      aria-label={name ? `Inisial ${name}` : 'Avatar pengguna'}
      className={`rounded-full bg-forest-700 text-cream-50 font-display font-bold flex items-center justify-center select-none ${className}`}
      style={{
        width: size,
        height: size,
        fontSize: Math.max(12, size * 0.4),
      }}
    >
      {initials}
    </div>
  );
};
