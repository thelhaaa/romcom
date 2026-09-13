import React, { useState } from 'react';

interface AppleEmojiProps {
  emoji: string;
  className?: string;
  size?: number;
}

export const AppleEmoji: React.FC<AppleEmojiProps> = ({
  emoji,
  className = 'w-6 h-6 inline-block align-middle mx-1',
  size = 64,
}) => {
  const [hasError, setHasError] = useState(false);

  // Use Apple iOS style emoji from reliable CDN
  const encoded = encodeURIComponent(emoji);
  const src = `https://emojicdn.elk.sh/${encoded}?style=apple`;

  if (hasError) {
    return <span className={`inline-block select-none ${className}`}>{emoji}</span>;
  }

  return (
    <img
      src={src}
      alt={emoji}
      draggable={false}
      onError={() => setHasError(true)}
      className={`select-none pointer-events-none inline-block drop-shadow-[0_2px_4px_rgba(0,0,0,0.25)] transition-transform hover:scale-110 ${className}`}
      loading="eager"
    />
  );
};
