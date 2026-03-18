import { useEffect, useState } from 'react';

export const useReservationTimer = (initialSeconds: number) => {
  const [remainingSeconds, setRemainingSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (initialSeconds <= 0) return;

    setRemainingSeconds(initialSeconds);

    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [initialSeconds]);

  const isExpired = remainingSeconds <= 0;

  const minutes = Math.floor(remainingSeconds / 60)
    .toString()
    .padStart(1, '0');
  const seconds = (remainingSeconds % 60).toString().padStart(2, '0');
  const formatted = `${minutes}:${seconds}`;

  return { remainingSeconds, isExpired, formatted };
};

