import LiveTransactionTable from "@/components/LiveTransactionTable";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100 sm:py-16">
      <section className="mx-auto w-full max-w-5xl">
        <div className="mb-8 text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-cyan-400">Live Feed</p>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Transaksi Terakhir</h1>
          <p className="mt-2 text-sm text-slate-400">Pembaruan transaksi terbaru secara otomatis.</p>
        </div>
        <LiveTransactionTable />
      </section>
    </main>
  );
}
