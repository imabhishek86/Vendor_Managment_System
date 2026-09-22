import { useState, useEffect } from 'react';

export default function Ripple({ color = 'rgba(255, 255, 255, 0.3)', duration = 600 }) {
  const [ripples, setRipples] = useState([]);

  useEffect(() => {
    // Cleanup old ripples
    const timeoutIds = ripples.map((ripple) =>
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== ripple.id));
      }, duration)
    );
    return () => timeoutIds.forEach((id) => clearTimeout(id));
  }, [ripples, duration]);

  const addRipple = (e) => {
    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const newRipple = {
      id: Date.now(),
      x,
      y,
      size
    };
    setRipples((prev) => [...prev, newRipple]);
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-inherit" onMouseDown={addRipple}>
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute rounded-full animate-ripple"
          style={{
            top: ripple.y,
            left: ripple.x,
            width: ripple.size,
            height: ripple.size,
            backgroundColor: color,
            animationDuration: `${duration}ms`
          }}
        />
      ))}
    </div>
  );
}
