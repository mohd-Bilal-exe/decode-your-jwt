'use client';
import { useState, useRef, useEffect } from 'react';
import TerminalLine from './TerminalLine';
import StatusBadge from './StatusBadge';
import { DecodedJWT } from '../types';
import { decodeJWT } from '../utils/jwt';
import AnimatedJSON from './AnimateJSON';
import CopyButton from './CopyButton';

type Props = {
  jwtState: DecodedJWT | null;
  setJwtState: (data: DecodedJWT | null) => void;
  setShowDecoder: (show: boolean) => void;
  addToHistory: (entry: {
    token: string;
    status: 'valid' | 'invalid';
    payload?: DecodedJWT;
  }) => void;
};

export default function Terminal({ jwtState, setJwtState, setShowDecoder, addToHistory }: Props) {
  const [lines, setLines] = useState<
    {
      text: string;
      instant?: boolean;
      isDecoded?: boolean;
      status?: 'valid' | 'invalid';
      payload?: DecodedJWT;
    }[]
  >([
    { text: 'Welcome to JWT Decoder Terminal', instant: true },
    { text: "Type 'jwt <your_token>' to decode", instant: true },
    { text: "Type 'clear' to reset", instant: true },
    { text: "Type 'back' to close the terminal.", instant: true },
  ]);

  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // smooth scroll helper
  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };
  // Load history on mount
  useEffect(() => {
    const saved = localStorage.getItem('terminalHistory');
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  // Save history whenever it changes
  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem('terminalHistory', JSON.stringify(history));
    }
  }, [history]);

  // always scroll bottom on new line
  useEffect(() => {
    scrollToBottom();
  }, [lines]);

  const handleCommand = (cmd: string) => {
    const parts = cmd.trim().split(' ');
    if (parts[0] === 'jwt' && parts[1]) {
      try {
        const decoded = decodeJWT(parts[1]);
        if (!decoded || typeof decoded !== 'object' || !decoded.payload) {
          throw new Error('Invalid token');
        }
        setJwtState(decoded);
        setLines(prev => [
          ...prev,
          { text: `> ${cmd}`, instant: true },
          { text: '', instant: false, status: 'valid' },
          { text: 'Decoded token:', instant: false },
          { text: 'decoded-json', instant: false, isDecoded: true, payload: decoded },
        ]);
        addToHistory({ token: parts[1], status: 'valid', payload: decoded });
      } catch {
        setJwtState(null);
        setLines(prev => [
          ...prev,
          { text: `> ${cmd}`, instant: true },
          { text: '', instant: false, status: 'invalid' },
          { text: 'Failed to decode token', instant: false },
        ]);
        addToHistory({ token: parts[1], status: 'invalid' });
      }
    } else if (cmd === 'clear' || cmd === 'cls' || cmd === 'clr') {
      setLines([
        { text: '> Welcome to JWT Decoder Terminal', instant: true },
        { text: "> Type 'jwt <your_token>' to decode", instant: true },
        { text: "> Type 'clear' to reset", instant: true },
        { text: "> Type 'back' to close the terminal.", instant: true },
      ]);
      setJwtState(null);
    } else if (cmd === 'help' || cmd === 'h') {
      setLines(prev => [
        ...prev,
        { text: `> ${cmd}`, instant: true },
        { text: 'Available commands:', instant: true },
        { text: '  • jwt <your_token>   → Decode a JWT', instant: true },
        { text: '  • clear              → Reset terminal', instant: true },
        { text: '  • back               → Close terminal', instant: true },
        { text: '  • help               → Show this help menu', instant: true },
        { text: '  • ↑ / ↓              → Cycle through command history', instant: true },
        { text: '  • click inside       → Focus the terminal input', instant: true },
      ]);
    } else if (cmd === 'back' || cmd === 'bck') {
      setLines(prev => [
        ...prev,
        { text: `> ${cmd}`, instant: true },
        { text: 'Exiting decoder...', instant: false },
      ]);
      setTimeout(() => {
        setShowDecoder(false);
      }, 1000);
    } else {
      setLines(prev => [
        ...prev,
        { text: `> ${cmd}`, instant: true },
        { text: 'Unknown command', instant: false },
      ]);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input.trim() !== '') {
      handleCommand(input);
      setHistory(prev => [...prev, input]);
      setHistoryIndex(-1);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      if (history.length > 0) {
        const newIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(history[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      if (historyIndex !== -1) {
        const newIndex = historyIndex === history.length - 1 ? -1 : historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(newIndex === -1 ? '' : history[newIndex]);
      }
    }
  };

  // click anywhere focuses input
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current?.contains(e.target as Node)) {
        inputRef.current?.focus();
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="bg-zinc-900/80 shadow-lg backdrop-blur-sm p-4 pr-0 border border-zinc-700 rounded-lg w-full max-w-3xl">
      <div
        ref={containerRef}
        onClick={() => {
          inputRef.current?.focus();
          scrollToBottom();
        }}
        className="space-y-2 min-h-[75svh] max-h-[75svh] overflow-y-auto font-mono text-sm cursor-text scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent"
      >
        {lines.map((line, i) => {
          if (line.status) {
            return <StatusBadge key={i} status={line.status} />;
          }
          if (line.isDecoded && line.payload) {
            return (
              <div key={i} className="group flex items-start gap-2">
                <AnimatedJSON data={line.payload} onStep={scrollToBottom} />
                <CopyButton text={JSON.stringify(line.payload, null, 2)} />
              </div>
            );
          }
          return (
            <div key={i} className="flex items-start gap-2">
              <TerminalLine
                key={i}
                text={line.text}
                instant={line.instant}
                onStep={scrollToBottom}
              />
            </div>
          );
        })}
        <div className="flex items-center">
          <span className="mr-2 text-green-400">&gt;</span>
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            className="flex-1 bg-transparent outline-none text-green-400 caret-green"
            autoFocus
          />
        </div>
      </div>
    </div>
  );
}
