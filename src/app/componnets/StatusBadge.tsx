"use client";
import { CheckCircle, XCircle } from "lucide-react";

export default function StatusBadge({ status }: { status: "valid" | "invalid" }) {
  const isValid = status === "valid";
  return (
    <span
      className={`inline-flex mt-5 items-center gap-1 px-2 py-1 text-xs font-medium rounded 
        ${isValid ? "bg-green-600/20 text-green-400" : "bg-red-600/20 text-red-400"}`}
    >
      {isValid ? <CheckCircle size={14} /> : <XCircle size={14} />}
      {isValid ? "Token is valid" : "Token is invalid"}
    </span>
  );
}
