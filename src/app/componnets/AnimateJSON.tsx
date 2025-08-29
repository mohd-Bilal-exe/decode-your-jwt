"use client";
import { useEffect, useState } from "react";
import TerminalLine from "./TerminalLine";

type Props = {
  data: Record<string, any>;
  onStep?: () => void;
};

export default function AnimatedJSON({ data,onStep }: Props) {
  const [lines, setLines] = useState<string[]>([]);
  const jsonLines = JSON.stringify(data, null, 2).split("\n");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < jsonLines.length) {
        setLines(prev => [...prev, jsonLines[i]]);
        onStep?.();
        i++;
      } else {
        onStep?.();
        clearInterval(interval);
      }
    }, 120); // speed per line
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex-col flex-1 gap-1">
      {lines.map((line, idx) => (
        <TerminalLine key={idx} text={line} instant={false} />
      ))}
    </div>
  );
}
