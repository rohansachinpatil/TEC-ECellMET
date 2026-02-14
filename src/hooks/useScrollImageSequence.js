import { useState, useEffect } from 'react';

const useScrollImageSequence = (frameCount, framePrefix = 'ezgif-frame-') => {
  const [images, setImages] = useState([]);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Preload all images
  useEffect(() => {
    const loadedImages = [];
    let loadedCount = 0;

    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      const frameNumber = String(i).padStart(3, '0');
      img.src = `/frames/${framePrefix}${frameNumber}.jpg`;

      img.onload = () => {
        loadedCount++;
        if (loadedCount === frameCount) {
          setIsLoaded(true);
        }
      };

      loadedImages.push(img);
    }

    setImages(loadedImages);
  }, [frameCount, framePrefix]);

  // Handle scroll
  useEffect(() => {
    if (!isLoaded) return;

    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const scrollFraction = Math.min(scrollTop / maxScroll, 1);

      // Map scroll to frame index
      const frameIndex = Math.min(Math.floor(scrollFraction * frameCount), frameCount - 1);

      setCurrentFrame(frameIndex);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoaded, frameCount]);

  return { images, currentFrame, isLoaded };
};

export default useScrollImageSequence;
