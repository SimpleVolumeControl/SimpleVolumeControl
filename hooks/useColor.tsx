import { useEffect, useState } from 'react';

function useColor(rawColor: string) {
  const [color, setColor] = useState({
    bgFaint: 'bg-base-300/20',
    border: 'border-base-300',
    bg: 'bg-base-500',
  });
  useEffect(() => {
    switch (rawColor) {
      case 'green':
        setColor({
          bgFaint: 'bg-lime-500/20',
          border: 'border-lime-500',
          bg: 'bg-lime-700',
        });
        break;
      case 'lightblue':
        setColor({
          bgFaint: 'bg-cyan-400/20',
          border: 'border-cyan-400',
          bg: 'bg-cyan-600',
        });
        break;
      case 'blue':
        setColor({
          bgFaint: 'bg-blue-500/20',
          border: 'border-blue-500',
          bg: 'bg-blue-700',
        });
        break;
      case 'pink':
        setColor({
          bgFaint: 'bg-pink-500/20',
          border: 'border-pink-500',
          bg: 'bg-pink-700',
        });
        break;
      case 'red':
        setColor({
          bgFaint: 'bg-red-500/20',
          border: 'border-red-500',
          bg: 'bg-red-700',
        });
        break;
      case 'yellow':
        setColor({
          bgFaint: 'bg-yellow-400/20',
          border: 'border-yellow-400',
          bg: 'bg-yellow-600',
        });
        break;
    }
  }, [rawColor]);
  return color;
}

export default useColor;
