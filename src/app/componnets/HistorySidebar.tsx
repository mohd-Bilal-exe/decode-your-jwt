import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function HistorySidebar({
  history,
}: {
  history: { token: string; status: 'valid' | 'invalid'; payload?: any; decodedAt?: number }[];
}) {
  const [showHistory, setShowHistory] = useState(false);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [filter, setFilter] = useState<'all' | 'valid' | 'invalid'>('all');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState(''); // debounced value

  // debounce searchInput → search
  useEffect(() => {
    const handler = setTimeout(() => setSearch(searchInput), 300);
    return () => clearTimeout(handler);
  }, [searchInput]);

  // filter
  let filtered = history.filter(h => (filter === 'all' ? true : h.status === filter));

  // search
  if (search.trim()) {
    const term = search.toLowerCase();
    filtered = filtered.filter(
      h =>
        h.token.toLowerCase().includes(term) ||
        (h.payload && JSON.stringify(h.payload).toLowerCase().includes(term))
    );
  }

  // sort by decodedAt
  const sorted = [...filtered].sort((a, b) => {
    const tA = a.decodedAt ?? 0;
    const tB = b.decodedAt ?? 0;
    return sortOrder === 'newest' ? tB - tA : tA - tB;
  });

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setShowHistory(true)}
        className="right-4 bottom-4 z-20 fixed bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded text-sm hover:scale-105 focus:scale-100 transition-all duration-300 ease-in-out"
      >
        Show History
      </button>

      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut', type: 'spring' }}
            className="top-0 right-0 z-30 fixed flex flex-col bg-zinc-900 shadow-lg border-zinc-700 border-l w-80 h-full"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-zinc-700 border-b">
              <h2 className="font-bold">History</h2>
              <button
                onClick={() => setShowHistory(false)}
                className="text-zinc-400 hover:text-zinc-200"
              >
                ✕
              </button>
            </div>

            {/* Controls */}
            <div className="flex flex-col gap-2 p-2 border-zinc-700 border-b text-xs">
              <input
                type="text"
                placeholder="Search..."
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                className="bg-zinc-800 px-2 py-1 rounded text-xs"
              />

              <div className="flex justify-between gap-2">
                <select
                  value={sortOrder}
                  onChange={e => setSortOrder(e.target.value as any)}
                  className="flex-1 bg-zinc-800 px-2 py-1 rounded"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>

                <select
                  value={filter}
                  onChange={e => setFilter(e.target.value as any)}
                  className="flex-1 bg-zinc-800 px-2 py-1 rounded"
                >
                  <option value="all">All</option>
                  <option value="valid">Valid</option>
                  <option value="invalid">Invalid</option>
                </select>
              </div>
            </div>

            {/* History List */}
            <div className="flex-1 space-y-3 p-3 overflow-y-auto">
              {sorted.length === 0 && <p className="text-zinc-500 text-xs">No entries yet.</p>}

              {sorted.map((h, i) => (
                <div
                  key={i}
                  className={`rounded-lg p-3 border ${
                    h.status === 'valid'
                      ? 'border-green-600/40 bg-green-600/10'
                      : 'border-red-600/40 bg-red-600/10'
                  }`}
                >
                  <p className="font-mono text-xs break-all">
                    <span className={h.status === 'valid' ? 'text-green-400' : 'text-red-400'}>
                      {h.status.toUpperCase()}
                    </span>{' '}
                    → <div className="max-h-8 overflow-hidden truncate">{h.token}</div>
                  </p>
                  {h.payload && (
                    <pre className="mt-1 max-h-[30svh] overflow-y-auto text-[11px] text-zinc-300 whitespace-pre-wrap">
                      {JSON.stringify(h.payload, null, 2)}
                    </pre>
                  )}
                  {h.decodedAt && (
                    <p className="mt-1 text-[10px] text-zinc-200">
                      {new Date(h.decodedAt).toLocaleString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
