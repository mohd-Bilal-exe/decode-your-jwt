'use client';

import { useEffect, useState } from 'react';
import Header from './componnets/Header';
import Terminal from './componnets/Terminal';
import { DecodedJWT } from './types';
import { motion, AnimatePresence } from 'framer-motion';
import HistorySidebar from './componnets/HistorySidebar';

export default function Home() {
  const [decoded, setDecoded] = useState<DecodedJWT | null>(null);
  const [showDecoder, setShowDecoder] = useState(false);
  const [history, setHistory] = useState<
    { token: string; status: 'valid' | 'invalid'; payload?: DecodedJWT }[]
  >([]);
  const [showHistory, setShowHistory] = useState(false);
  useEffect(() => {
    const saved = localStorage.getItem('decodeHistory');
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);
  return (
    <main className="flex flex-col bg-neutral-950 min-h-screen overflow-hidden font-mono text-green-400">
      <Header />
      <div className="relative flex flex-1 justify-center items-center p-6 w-full">
        <AnimatePresence mode="wait">
          {!showDecoder ? (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.3, ease: 'easeInOut', type: 'spring' }}
              className="flex flex-col items-center space-y-6 text-center"
            >
              <h1 className="font-bold text-green-400 text-4xl md:text-5xl">Decode your JWT</h1>
              <p className="max-w-md text-zinc-400">
                Paste, inspect, and validate your JSON Web Tokens with ease.
              </p>
              <button
                onClick={() => setShowDecoder(true)}
                className="bg-green-600 hover:bg-green-500 px-6 py-3 rounded-lg font-semibold text-black transition-colors"
              >
                Launch Decoder
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="terminal"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.3, ease: 'easeInOut', type: 'spring' }}
              className="flex justify-center items-center w-full h-full"
            >
              <Terminal
                jwtState={decoded}
                setJwtState={setDecoded}
                setShowDecoder={setShowDecoder}
                addToHistory={entry => {
                  setHistory(prev => [...prev, { ...entry, decodedAt: Date.now() }]);
                  localStorage.setItem(
                    'decodeHistory',
                    JSON.stringify([...history, { ...entry, decodedAt: Date.now() }])
                  );
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>{' '}
      {history.length > 0 && !showDecoder && <HistorySidebar history={history} />}
    </main>
  );
}
