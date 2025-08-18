'use client';

import { useEffect, useState } from 'react';

export default function MatrixRain() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="matrix-rain absolute inset-0 overflow-hidden pointer-events-none opacity-10" />;
  }

  const matrixChars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789';
  const columns = Math.floor(window.innerWidth / 20);
  
  return (
    <div className="matrix-rain absolute inset-0 overflow-hidden pointer-events-none opacity-10">
      {Array.from({ length: columns }).map((_, i) => (
        <div
          key={i}
          className="absolute top-0"
          style={{
            left: `${i * 20}px`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${5 + Math.random() * 10}s`
          }}
        >
          {Array.from({ length: Math.floor(Math.random() * 20) + 5 }).map((_, j) => (
            <div
              key={j}
              className="matrix-char"
              style={{
                animationDelay: `${j * 0.1}s`,
                top: `${j * 20}px`
              }}
            >
              {matrixChars[Math.floor(Math.random() * matrixChars.length)]}
            </div>
          ))}
        </div>
      ))}
      <div className="scan-line" style={{ animationDelay: '1s' }} />
      <div className="scan-line" style={{ animationDelay: '3s' }} />
    </div>
  );
}