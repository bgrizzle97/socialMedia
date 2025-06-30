import React, { useEffect, useRef } from 'react';

const SpiralTransition = ({ isActive, onComplete }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (!isActive) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let frame = 0;
    const totalFrames = 120; // 2 seconds at 60fps

    const animate = () => {
      frame++;
      const progress = frame / totalFrames;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Set background
      ctx.fillStyle = '#4f46e5'; // Indigo background
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Create spiral effect
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const maxRadius = Math.max(canvas.width, canvas.height) * 0.8;
      
      ctx.strokeStyle = '#fbbf24'; // Yellow spiral
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      
      // Draw spiral
      ctx.beginPath();
      for (let i = 0; i < 360 * 3; i++) {
        const angle = (i * Math.PI) / 180;
        const radius = (maxRadius * progress * i) / (360 * 3);
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
      
      // Add particle effects
      for (let i = 0; i < 20; i++) {
        const angle = (Math.random() * Math.PI * 2) + (progress * Math.PI * 4);
        const radius = Math.random() * maxRadius * progress;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        
        ctx.fillStyle = `rgba(251, 191, 36, ${1 - progress})`;
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Add pulsing center
      const pulseSize = 20 + Math.sin(progress * Math.PI * 8) * 10;
      ctx.fillStyle = `rgba(251, 191, 36, ${0.8 - progress * 0.5})`;
      ctx.beginPath();
      ctx.arc(centerX, centerY, pulseSize, 0, Math.PI * 2);
      ctx.fill();
      
      if (frame < totalFrames) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        onComplete();
      }
    };
    
    animate();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, onComplete]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-indigo-600">
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        className="block"
      />
    </div>
  );
};

export default SpiralTransition; 