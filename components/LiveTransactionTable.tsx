"use client";

import { useCallback, useEffect, useState } from "react";

type LiveTransaction = {
  id: number;
  customer_id: string;
  game_name: string;
  nominal_name: string;
  status: "pending" | "processing" | "success" | "failed" | "refunded";
  created_at: string;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
const statusLabel: Record<LiveTransaction["status"], string> = {
  pending: "Menunggu", processing: "Diproses", success: "Berhasil", failed: "Gagal", refunded: "Dikembalikan",
};
const statusClass: Record<LiveTransaction["status"], string> = {
  pending: "bg-amber-400/10 text-amber-300 ring-amber-400/20",
  processing: "bg-sky-400/10 text-sky-300 ring-sky-400/20",
  success: "bg-emerald-400/10 text-emerald-300 ring-emerald-400/20",
  failed: "bg-rose-400/10 text-rose-300 ring-rose-400/20",
  refunded: "bg-violet-400/10 text-violet-300 ring-violet-400/20",
};

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Jakarta",
  }).format(date);
}

export default function LiveTransactionTable() {
  const [transactions, setTransactions] = useState<LiveTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const loadTransactions = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/recent?limit=25`, { cache: "no-store" });
      const payload = await response.json();
      if (!response.ok || !payload.success || !Array.isArray(payload.data)) throw new Error("Invalid live-feed response");
      setTransactions(payload.data);
      setError(false);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTransactions();
    const interval = window.setInterval(loadTransactions, 10_000);
    return () => window.clearInterval(interval);
  }, [loadTransactions]);

  if (loading) return <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-10 text-center text-sm text-slate-400">Memuat transaksi terbaru...</div>;
  if (error) return <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-10 text-center text-sm text-rose-200">Live Feed belum dapat dimuat. Coba lagi beberapa saat lagi.</div>;
  if (transactions.length === 0) return <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-10 text-center text-sm text-slate-400">Belum ada transaksi untuk ditampilkan.</div>;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 shadow-2xl shadow-black/20">
      <div className="flex items-center gap-2 border-b border-slate-800 px-5 py-4 text-xs text-slate-400"><span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />Diperbarui otomatis setiap 10 detik. ID pelanggan telah disensor.</div>
      <div className="overflow-x-auto"><table className="w-full min-w-[680px] text-left text-sm">
        <thead className="bg-slate-950/50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-3 font-semibold">Pelanggan</th><th className="px-5 py-3 font-semibold">Game</th><th className="px-5 py-3 font-semibold">Produk</th><th className="px-5 py-3 font-semibold">Status</th><th className="px-5 py-3 font-semibold">Waktu</th></tr></thead>
        <tbody className="divide-y divide-slate-800/80">{transactions.map((transaction) => <tr key={transaction.id} className="transition-colors hover:bg-slate-800/40"><td className="px-5 py-4 font-mono text-xs text-slate-300">{transaction.customer_id}</td><td className="px-5 py-4 font-medium text-slate-100">{transaction.game_name}</td><td className="px-5 py-4 text-slate-300">{transaction.nominal_name}</td><td className="px-5 py-4"><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${statusClass[transaction.status] || statusClass.pending}`}>{statusLabel[transaction.status] || transaction.status}</span></td><td className="px-5 py-4 text-xs text-slate-400">{formatDate(transaction.created_at)}</td></tr>)}</tbody>
      </table></div>
    </div>
  );
}
