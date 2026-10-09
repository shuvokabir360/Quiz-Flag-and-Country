import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { virtualHandController } from '../utils/virtualHandController';

export const GirlHandCursor: React.FC = () => {
  const [pos, setPos] = useState({ x: -300, y: -300 });
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);
  const hotspotOffsetRef = useRef({ x: 36, y: 2 });

  // Process the real female hand photo to remove green screen and create transparent PNG
  useEffect(() => {
    const img = new Image();
    img.src = '/girl_hand.jpg';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;

        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const d = imgData.data;

        let minY = canvas.height;
        let maxY = 0;
        let minX = canvas.width;
        let maxX = 0;
        let topFingertipX = canvas.width / 2;

        for (let y = 0; y < canvas.height; y++) {
          for (let x = 0; x < canvas.width; x++) {
            const idx = (y * canvas.width + x) * 4;
            const r = d[idx];
            const g = d[idx + 1];
            const b = d[idx + 2];

            // Green chroma key detection
            const greenDominance = g - Math.max(r, b);
            if (g > 115 && greenDominance > 30) {
              d[idx + 3] = 0; // Pure transparent
            } else if (g > 95 && greenDominance > 12) {
              // Edge antialiasing and green tint suppression
              const alphaFactor = 1 - (greenDominance - 12) / 18;
              d[idx + 3] = Math.round(Math.max(0, Math.min(255, alphaFactor * 255)));
              d[idx + 1] = Math.round((r + b) / 2);
            } else {
              // Hand skin pixel
              if (y < minY) {
                minY = y;
                topFingertipX = x;
              }
              if (y > maxY) maxY = y;
              if (x < minX) minX = x;
              if (x > maxX) maxX = x;
            }
          }
        }

        ctx.putImageData(imgData, 0, 0);

        // Crop tightly around hand bounding box
        const cropW = Math.max(1, maxX - minX + 1);
        const cropH = Math.max(1, maxY - minY + 1);
        const cropCanvas = document.createElement('canvas');
        cropCanvas.width = cropW;
        cropCanvas.height = cropH;
        const cropCtx = cropCanvas.getContext('2d');
        if (!cropCtx) return;

        cropCtx.drawImage(canvas, minX, minY, cropW, cropH, 0, 0, cropW, cropH);

        // Calculate fingertip hotspot
        const tipRatioX = (topFingertipX - minX) / cropW;
        const targetWidth = 72; // large, clearly visible size
        hotspotOffsetRef.current = {
          x: Math.round(targetWidth * tipRatioX),
          y: 2,
        };

        setProcessedImageUrl(cropCanvas.toDataURL('image/png'));
      } catch (err) {
        console.error('Error processing girl hand cursor:', err);
      }
    };
  }, []);

  useEffect(() => {
    // Subscribe to virtual hand controller for programmatic gliding in Auto Play
    const unsubscribe = virtualHandController.subscribe((state) => {
      if (state.isVirtual) {
        setPos({ x: state.x, y: state.y });
        setIsVisible(state.isVisible);
        setIsClicking(state.isClicking);
      }
    });

    const handleMouseMove = (e: MouseEvent) => {
      // If virtual hand is currently animating a tap, don't interrupt mid-glide
      const currentVirtualState = virtualHandController.getState();
      if (currentVirtualState.isVirtual && currentVirtualState.isClicking) {
        return;
      }

      const gameViewport = document.getElementById('game-viewport');
      if (!gameViewport) {
        setPos({ x: e.clientX, y: e.clientY });
        setIsVisible(true);
        return;
      }

      const rect = gameViewport.getBoundingClientRect();
      const inside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      if (inside) {
        setPos({ x: e.clientX, y: e.clientY });
        setIsVisible(true);
      } else {
        if (!currentVirtualState.isVirtual) {
          setIsVisible(false);
        }
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => {
      if (!virtualHandController.getState().isVirtual) {
        setIsVisible(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true, capture: true });
    window.addEventListener('mousedown', handleMouseDown, { capture: true });
    window.addEventListener('mouseup', handleMouseUp, { capture: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      unsubscribe();
      window.removeEventListener('mousemove', handleMouseMove, { capture: true });
      window.removeEventListener('mousedown', handleMouseDown, { capture: true });
      window.removeEventListener('mouseup', handleMouseUp, { capture: true });
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  if (!isVisible || typeof document === 'undefined') return null;

  return createPortal(
    <div
      style={{
        position: 'fixed',
        left: pos.x,
        top: pos.y,
        transform: `translate(-${hotspotOffsetRef.current.x}px, -${hotspotOffsetRef.current.y}px) scale(${isClicking ? 0.92 : 1}) rotate(${isClicking ? '-6deg' : '-3deg'})`,
        transformOrigin: `${hotspotOffsetRef.current.x}px ${hotspotOffsetRef.current.y}px`,
        transition: 'transform 0.05s ease-out',
        pointerEvents: 'none',
        zIndex: 2147483647, // Maximum z-index: floats on top of everything
        userSelect: 'none',
        WebkitUserSelect: 'none',
        filter: 'drop-shadow(0 8px 18px rgba(0, 0, 0, 0.75)) drop-shadow(0 0 6px rgba(244, 114, 182, 0.45))',
      }}
      aria-hidden="true"
    >
      {/* Click Sparkle Ring at the Fingertip */}
      {isClicking && (
        <div
          style={{
            position: 'absolute',
            left: `${hotspotOffsetRef.current.x - 10}px`,
            top: `${hotspotOffsetRef.current.y - 10}px`,
            width: '20px',
            height: '20px',
            borderRadius: '9999px',
            border: '2px solid #f472b6',
            boxShadow: '0 0 12px #ec4899',
            animation: 'ping 0.4s cubic-bezier(0, 0, 0.2, 1) infinite',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Photorealistic Real Girl Hand Image with immediate fallback */}
      {processedImageUrl ? (
        <img
          src={processedImageUrl}
          alt="Realistic Girl Hand Cursor"
          style={{
            width: '74px',
            height: 'auto',
            display: 'block',
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        />
      ) : (
        <div
          style={{
            fontSize: '44px',
            lineHeight: 1,
            userSelect: 'none',
            pointerEvents: 'none',
            filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.7))',
          }}
        >
          👆
        </div>
      )}
    </div>,
    document.body
  );
};
