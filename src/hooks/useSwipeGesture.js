import { useEffect, useRef, useState } from 'react';

export function useSwipeGesture({ onSwipeRight, threshold = 50 }) {
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isHorizontalSwipe, setIsHorizontalSwipe] = useState(false);

  useEffect(() => {
    const handleTouchStart = (e) => {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
      setIsScrolling(false);
      setIsHorizontalSwipe(false);
    };

    const handleTouchMove = (e) => {
      if (!touchStartX.current || !touchStartY.current) return;

      const deltaX = e.touches[0].clientX - touchStartX.current;
      const deltaY = e.touches[0].clientY - touchStartY.current;

      // 如果还没有确定滑动方向
      if (!isScrolling && !isHorizontalSwipe) {
        // 判断滑动方向
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          setIsHorizontalSwipe(true);
          e.preventDefault(); // 阻止垂直滚动
        } else {
          setIsScrolling(true);
        }
      }

      // 如果是水平滑动，阻止默认行为
      if (isHorizontalSwipe) {
        e.preventDefault();
      }
    };

    const handleTouchEnd = (e) => {
      if (!touchStartX.current) return;

      const deltaX = e.changedTouches[0].clientX - touchStartX.current;

      if (isHorizontalSwipe && deltaX > threshold) {
        onSwipeRight?.();
      }

      // 重置状态
      touchStartX.current = 0;
      touchStartY.current = 0;
      setIsScrolling(false);
      setIsHorizontalSwipe(false);
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onSwipeRight, threshold, isScrolling, isHorizontalSwipe]);
} 