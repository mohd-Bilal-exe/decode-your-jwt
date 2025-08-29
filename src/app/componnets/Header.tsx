'use client';

import { motion } from 'framer-motion';

export default function Header() {
  return (
    <header className="bg-black px-6 py-4 border-green-500 border-b w-full">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="font-bold text-green-400 text-2xl tracking-widest"
      >
        {'> '} JWT Decoder
      </motion.h1>
    </header>
  );
}
