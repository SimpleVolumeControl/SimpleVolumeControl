import { useEffect, useState } from 'react';

/**
 * This hook helps to translate the color names sent by the API to class names that can be used with TailwindCSS.
 * For every color, a faint background, a normal background and a border color class are returned.
 * Because of the optimization features of TailwindCSS, the classnames have to be spelt out and cannot be assembled.
 * The following colors are supported currently (subject to change):
 *  - green
 *  - lightblue
 *  - blue
 *  - pink
 *  - red
 *  - yellow
 *
 * For all other colors, a neutral base color is used.
 */
function useColor(rawColor: string) {
  // Neutral base color as fallback/default.
  const [color, setColor] = useState({
    bgFaint: 'bg-base-300/20',
    border: 'border-base-300',
    bg: 'bg-stone-700',
  });

  // If possible, switch to the appropriate class names for the given color name.
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

  // Returns the object containing the class names.
  return color;
}

export default useColor;
