import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

interface AvatarCanvasProps {
  hairStyle: string;
}

const AvatarCanvas = forwardRef(({ hairStyle }: AvatarCanvasProps, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useImperativeHandle(ref, () => ({
    takeScreenshot: async () => {
      if (canvasRef.current) {
        const canvasElement = canvasRef.current;
        const dataUrl = canvasElement.toDataURL("image/png");
        return dataUrl;
      }
      return null;
    }
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw face
    ctx.fillStyle = '#FFDAB9';
    ctx.beginPath();
    ctx.arc(150, 150, 100, 0, Math.PI * 2, true);
    ctx.fill();

    // Draw eyes
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(110, 130, 10, 0, Math.PI * 2, true);
    ctx.arc(190, 130, 10, 0, Math.PI * 2, true);
    ctx.fill();

    // Draw mouth
    ctx.fillStyle = '#FF0000';
    ctx.beginPath();
    ctx.arc(150, 180, 50, 0, Math.PI, false);
    ctx.fill();

    // Draw hair based on the selected style
    if (hairStyle === 'short') {
      ctx.fillStyle = '#000';
      ctx.fillRect(75, 50, 150, 60);
    } else if (hairStyle === 'long') {
      ctx.fillStyle = '#000';
      ctx.fillRect(50, 50, 200, 100);
    } else if (hairStyle === 'bald') {
      // No hair to draw
    }
  }, [hairStyle]);

  return <canvas ref={canvasRef} width={300} height={300} style={{ border: '1px solid #000' }} />;
});

AvatarCanvas.displayName = 'AvatarCanvas';

export default AvatarCanvas;
