export default function BrandPage() {
  return (
    <div className="min-h-screen pt-24 px-8 max-w-5xl mx-auto pb-20">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-white">Brand & Identity</h1>
        <p className="text-gray-400 text-lg max-w-2xl">
          The official design language, logos, and brand guidelines for the Electronics & Computer Students Association.
        </p>
      </div>

      <div className="space-y-12">
        {/* Colors */}
        <section className="glass p-8 rounded-3xl border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-6">Color Palette</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col gap-2">
              <div className="h-24 rounded-xl bg-[#00f0ff] border border-white/10 shadow-[0_0_20px_rgba(0,240,255,0.3)]"></div>
              <span className="font-mono text-sm text-gray-300">#00f0ff</span>
              <span className="text-xs text-gray-500 font-bold uppercase">Electric Blue</span>
            </div>
            <div className="flex flex-col gap-2">
              <div className="h-24 rounded-xl bg-[#00ffcc] border border-white/10 shadow-[0_0_20px_rgba(0,255,204,0.3)]"></div>
              <span className="font-mono text-sm text-gray-300">#00ffcc</span>
              <span className="text-xs text-gray-500 font-bold uppercase">Electric Cyan</span>
            </div>
            <div className="flex flex-col gap-2">
              <div className="h-24 rounded-xl bg-[#0f172a] border border-white/20"></div>
              <span className="font-mono text-sm text-gray-300">#0f172a</span>
              <span className="text-xs text-gray-500 font-bold uppercase">Navy 900</span>
            </div>
            <div className="flex flex-col gap-2">
              <div className="h-24 rounded-xl bg-[#111827] border border-white/20"></div>
              <span className="font-mono text-sm text-gray-300">#111827</span>
              <span className="text-xs text-gray-500 font-bold uppercase">Gray 900</span>
            </div>
          </div>
        </section>

        {/* Typography */}
        <section className="glass p-8 rounded-3xl border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-6">Typography</h2>
          <div className="space-y-6">
            <div className="pb-6 border-b border-white/10">
              <h3 className="text-sm text-gray-500 uppercase tracking-widest mb-2">Primary / Headings</h3>
              <p className="text-4xl font-heading font-bold text-white mb-2">Space Grotesk</p>
              <p className="text-gray-400 font-heading">ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-500 uppercase tracking-widest mb-2">Secondary / Body</h3>
              <p className="text-2xl font-sans text-white mb-2">Inter</p>
              <p className="text-gray-400 font-sans">ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789</p>
            </div>
          </div>
        </section>

        {/* Logos */}
        <section className="glass p-8 rounded-3xl border border-white/10 text-center">
          <h2 className="text-2xl font-bold text-white mb-6 text-left">Official Logo</h2>
          <div className="w-full h-64 bg-black/50 border border-white/5 rounded-2xl flex items-center justify-center mb-6">
             <span className="text-gray-600 font-heading">ECSA Logo Vector (TBA)</span>
          </div>
          <p className="text-sm text-gray-400">Logos and brand assets will be available for download soon.</p>
        </section>
      </div>
    </div>
  );
}
