import React, { useState } from 'react';

const INITIAL_MANDI_DATA = [
  { id: 1, district: 'Chittoor', mandi: 'Madanapalle APMC', crop: 'Tomato', minPrice: 2100, modalPrice: 2450, maxPrice: 2700, updated: 'Today, 08:30 AM' },
  { id: 2, district: 'Chittoor', mandi: 'Palamaner APMC', crop: 'Tomato', minPrice: 1950, modalPrice: 2280, maxPrice: 2500, updated: 'Today, 08:45 AM' },
  { id: 3, district: 'Kurnool', mandi: 'Adoni APMC', crop: 'Groundnut', minPrice: 5800, modalPrice: 6350, maxPrice: 6600, updated: 'Today, 09:00 AM' },
  { id: 4, district: 'Chittoor', mandi: 'Chittoor APMC', crop: 'Groundnut', minPrice: 5650, modalPrice: 6120, maxPrice: 6400, updated: 'Today, 09:10 AM' },
  { id: 5, district: 'Guntur', mandi: 'Guntur Mirchi Yard', crop: 'Red Chilli', minPrice: 14500, modalPrice: 16200, maxPrice: 17500, updated: 'Today, 08:15 AM' },
  { id: 6, district: 'Kurnool', mandi: 'Kurnool APMC', crop: 'Red Chilli', minPrice: 13900, modalPrice: 15400, maxPrice: 16800, updated: 'Today, 09:20 AM' },
];

export default function App() {
  const [records, setRecords] = useState(INITIAL_MANDI_DATA);
  const [districtFilter, setDistrictFilter] = useState('All');
  const [cropFilter, setCropFilter] = useState('All');
  const [showAdmin, setShowAdmin] = useState(false);

  // Admin Tariff Entry Form
  const [form, setForm] = useState({
    district: 'Chittoor',
    mandi: '',
    crop: 'Tomato',
    minPrice: '',
    modalPrice: '',
    maxPrice: '',
  });

  const filteredRecords = records.filter((item) => {
    const matchDistrict = districtFilter === 'All' || item.district === districtFilter;
    const matchCrop = cropFilter === 'All' || item.crop === cropFilter;
    return matchDistrict && matchCrop;
  });

  // Find highest modal price among currently filtered results for cross-market comparison
  const bestMarket =
    filteredRecords.length > 0
      ? filteredRecords.reduce((best, curr) => (curr.modalPrice > best.modalPrice ? curr : best), filteredRecords[0])
      : null;

  const handleAddTariff = (e) => {
    e.preventDefault();
    if (!form.mandi || !form.modalPrice) return;
    setRecords([
      {
        id: Date.now(),
        district: form.district,
        mandi: form.mandi,
        crop: form.crop,
        minPrice: Number(form.minPrice || form.modalPrice),
        modalPrice: Number(form.modalPrice),
        maxPrice: Number(form.maxPrice || form.modalPrice),
        updated: 'Just now',
      },
      ...records,
    ]);
    setForm({ ...form, mandi: '', minPrice: '', modalPrice: '', maxPrice: '' });
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 font-sans">
      <header className="bg-emerald-950/70 border-b border-emerald-500/20 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-emerald-400">Raita Mitra – Farmer Market Price Portal</h1>
          <p className="text-xs text-stone-300">Transparent APMC Mandi Tariffs &amp; Cross-Market Price Comparison</p>
        </div>
        <button
          onClick={() => setShowAdmin(!showAdmin)}
          className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs cursor-pointer"
        >
          {showAdmin ? '← Back to Farmer Portal' : 'Admin Tariff Update'}
        </button>
      </header>

      <main className="max-w-6xl mx-auto p-6 space-y-6">
        {showAdmin ? (
          <div className="max-w-xl mx-auto bg-stone-900 border border-stone-800 rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-emerald-400">Ingest Daily APMC Mandi Tariff</h2>
            <form onSubmit={handleAddTariff} className="grid grid-cols-2 gap-3 text-xs">
              <select
                value={form.district}
                onChange={(e) => setForm({ ...form, district: e.target.value })}
                className="px-3 py-2.5 rounded bg-stone-950 border border-stone-800"
              >
                <option>Chittoor</option>
                <option>Kurnool</option>
                <option>Guntur</option>
              </select>
              <select
                value={form.crop}
                onChange={(e) => setForm({ ...form, crop: e.target.value })}
                className="px-3 py-2.5 rounded bg-stone-950 border border-stone-800"
              >
                <option>Tomato</option>
                <option>Groundnut</option>
                <option>Red Chilli</option>
              </select>
              <input
                type="text"
                placeholder="APMC Mandi Name (e.g., Tirupati APMC)"
                value={form.mandi}
                onChange={(e) => setForm({ ...form, mandi: e.target.value })}
                className="col-span-2 px-3 py-2.5 rounded bg-stone-950 border border-stone-800"
              />
              <input
                type="number"
                placeholder="Min Price (₹/Quintal)"
                value={form.minPrice}
                onChange={(e) => setForm({ ...form, minPrice: e.target.value })}
                className="px-3 py-2.5 rounded bg-stone-950 border border-stone-800"
              />
              <input
                type="number"
                placeholder="Modal Price (₹/Quintal)"
                value={form.modalPrice}
                onChange={(e) => setForm({ ...form, modalPrice: e.target.value })}
                className="px-3 py-2.5 rounded bg-stone-950 border border-stone-800"
              />
              <button type="submit" className="col-span-2 py-2.5 rounded bg-emerald-500 text-stone-950 font-bold cursor-pointer">
                Publish Daily Mandi Price
              </button>
            </form>
          </div>
        ) : (
          <>
            {/* Multi-Tier Filtering */}
            <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap gap-3">
                <div>
                  <label className="block text-[11px] text-stone-400 mb-1">Filter by District</label>
                  <select
                    value={districtFilter}
                    onChange={(e) => setDistrictFilter(e.target.value)}
                    className="px-3.5 py-2 rounded-lg bg-stone-950 border border-stone-700 text-xs"
                  >
                    <option value="All">All Districts</option>
                    <option value="Chittoor">Chittoor</option>
                    <option value="Kurnool">Kurnool</option>
                    <option value="Guntur">Guntur</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-stone-400 mb-1">Filter by Commodity</label>
                  <select
                    value={cropFilter}
                    onChange={(e) => setCropFilter(e.target.value)}
                    className="px-3.5 py-2 rounded-lg bg-stone-950 border border-stone-700 text-xs"
                  >
                    <option value="All">All Crops</option>
                    <option value="Tomato">Tomato</option>
                    <option value="Groundnut">Groundnut</option>
                    <option value="Red Chilli">Red Chilli</option>
                  </select>
                </div>
              </div>

              {/* Optimal Sales Channel Recommendation */}
              {bestMarket && (
                <div className="px-4 py-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-xs">
                  <span className="text-emerald-300 font-semibold">Best Market Price: </span>
                  <span className="font-bold text-white">
                    {bestMarket.mandi} ({bestMarket.crop}) — ₹{bestMarket.modalPrice} / Quintal
                  </span>
                </div>
              )}
            </div>

            {/* Cross-Market Comparison Table */}
            <div className="bg-stone-900 border border-stone-800 rounded-xl overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-950 text-stone-400 border-b border-stone-800">
                  <tr>
                    <th className="p-4">District</th>
                    <th className="p-4">APMC Mandi Hub</th>
                    <th className="p-4">Crop</th>
                    <th className="p-4">Min Price</th>
                    <th className="p-4">Modal Price (₹/Quintal)</th>
                    <th className="p-4">Max Price</th>
                    <th className="p-4">Updated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800">
                  {filteredRecords.map((row) => {
                    const isBest = bestMarket && row.id === bestMarket.id;
                    return (
                      <tr key={row.id} className={isBest ? 'bg-emerald-950/30' : ''}>
                        <td className="p-4 font-medium">{row.district}</td>
                        <td className="p-4 font-semibold text-white">{row.mandi}</td>
                        <td className="p-4">{row.crop}</td>
                        <td className="p-4 text-stone-400">₹{row.minPrice}</td>
                        <td className="p-4 font-bold text-emerald-400">
                          ₹{row.modalPrice}{' '}
                          {isBest && (
                            <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                              Highest
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-stone-400">₹{row.maxPrice}</td>
                        <td className="p-4 text-stone-400">{row.updated}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>
    </div>
  );
}