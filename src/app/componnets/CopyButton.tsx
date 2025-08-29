"use client";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      onClick={handleCopy}
      className="p-4 text-green-300 hover:text-green-400 transition"
    >
      {copied ? <Check size={16} /> : <Copy size={16} />}
    </button>
  );
}
