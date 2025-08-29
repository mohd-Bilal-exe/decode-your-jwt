'use client';
import { useEffect, useState } from 'react';

export default function TerminalLine({
  text,
  instant = false,
  onStep,
}: {
  text: string;
  instant?: boolean;
  onStep?: () => void;
}) {
  const [displayed, setDisplayed] = useState(instant ? text : '');
  console.log(text);
  useEffect(() => {
    if (instant) return;

    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(prev => prev + text[i]);
      setTimeout(() => {
        i++;
      }, 10);

      onStep?.();

      // ✅ stop when we've printed ALL characters
      if (i >= text.length - 1) {
        clearInterval(interval);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [text, instant]);

  return (
    <pre className="w-full overflow-clip font-normal text-green-500 leading-snug whitespace-pre-wrap">
      {displayed}
    </pre>
  );
}
