'use client';

import { useEffect, useState } from 'react';

export default function AdminLhcConfig() {
  const [rows, setRows] = useState([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/lhc-config')
      .then(res => res.json())
      .then(data => {
        setRows(data);
        setLoading(false);
      });
  }, []);

  function updateRow(idx, field, value) {
    setRows(prev => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: value };
      return copy;
    });
  }

  async function saveRow(row) {
    setSaving(true);
    try {
      await fetch('/api/admin/lhc-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classroom: row.classroom,
          geo_lat: parseFloat(row.geo_lat),
          geo_lon: parseFloat(row.geo_lon),
          geo_radius_m: parseInt(row.geo_radius_m, 10),
          ble_threshold: parseInt(row.ble_threshold, 10),
        }),
      });
      alert('Saved ✅');
    } catch (err) {
      alert('Error ❌');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-white p-6">Loading...</p>;

  return (
    <div className="min-h-screen bg-black text-white p-8">

      {/* HEADER */}
      <h1 className="text-3xl font-bold mb-6 tracking-wide">
        Classroom Settings
      </h1>

      {/* TABLE */}
      <div className="overflow-x-auto rounded-xl border border-gray-700">
        <table className="w-full text-lg">

          <thead className="bg-gray-900 text-gray-300 uppercase text-sm">
            <tr>
              <th className="p-4 text-left">Classroom</th>
              <th className="p-4">Latitude</th>
              <th className="p-4">Longitude</th>
              <th className="p-4">Radius (m)</th>
              <th className="p-4">BLE (dBm)</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row, idx) => (
              <tr
                key={row.classroom}
                className="border-t border-gray-800 hover:bg-gray-900 transition"
              >

                <td className="p-4 font-semibold">{row.classroom}</td>

                <td className="p-4">
                  <input
                    className="bg-gray-800 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={row.geo_lat ?? ''}
                    onChange={e => updateRow(idx, 'geo_lat', e.target.value)}
                  />
                </td>

                <td className="p-4">
                  <input
                    className="bg-gray-800 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={row.geo_lon ?? ''}
                    onChange={e => updateRow(idx, 'geo_lon', e.target.value)}
                  />
                </td>

                <td className="p-4">
                  <input
                    className="bg-gray-800 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={row.geo_radius_m ?? ''}
                    onChange={e => updateRow(idx, 'geo_radius_m', e.target.value)}
                  />
                </td>

                <td className="p-4">
                  <input
                    className="bg-gray-800 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={row.ble_threshold ?? ''}
                    onChange={e => updateRow(idx, 'ble_threshold', e.target.value)}
                  />
                </td>

                <td className="p-4">
                  <button
                    className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition font-semibold"
                    onClick={() => saveRow(row)}
                    disabled={saving}
                  >
                    Save
                  </button>
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </div>
  );
}
